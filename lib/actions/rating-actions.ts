"use server"

import { createActionClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { revalidatePath } from "next/cache"

// Tipos para las funciones de valoraciones
type RatingData = {
  publicacion_id: number
  calificacion: number
  comentario?: string
}

type RatingResult = {
  success: boolean
  error?: string
  ratingId?: number
}

// Función para crear una nueva valoración
export async function crearValoracion(data: RatingData): Promise<RatingResult> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: "Debes iniciar sesión para valorar materiales.",
      }
    }

    const supabase = createActionClient()

    // Verificar que la publicación exista
    const { data: publicacion, error: pubError } = await supabase
      .from("publicaciones")
      .select("id, usuario_id")
      .eq("id", data.publicacion_id)
      .single()

    if (pubError || !publicacion) {
      return {
        success: false,
        error: "La publicación no existe.",
      }
    }

    // Verificar que el usuario no esté valorando su propia publicación
    if (publicacion.usuario_id === user.userId) {
      return {
        success: false,
        error: "No puedes valorar tu propia publicación.",
      }
    }

    // Verificar si el usuario ya ha valorado esta publicación
    const { data: existingRating } = await supabase
      .from("valoraciones")
      .select("id")
      .eq("publicacion_id", data.publicacion_id)
      .eq("usuario_id", user.userId)
      .single()

    if (existingRating) {
      // Actualizar la valoración existente
      const { error } = await supabase
        .from("valoraciones")
        .update({
          calificacion: data.calificacion,
          comentario: data.comentario,
          fecha_valoracion: new Date().toISOString(),
        })
        .eq("id", existingRating.id)

      if (error) {
        console.error("Error al actualizar valoración:", error)
        return {
          success: false,
          error: "Error al actualizar la valoración. Por favor, inténtalo de nuevo.",
        }
      }

      revalidatePath(`/materiales/${data.publicacion_id}`)

      return {
        success: true,
        ratingId: existingRating.id,
      }
    }

    // Crear nueva valoración
    const { data: nuevaValoracion, error } = await supabase
      .from("valoraciones")
      .insert({
        usuario_id: user.userId,
        publicacion_id: data.publicacion_id,
        calificacion: data.calificacion,
        comentario: data.comentario,
        fecha_valoracion: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error al crear valoración:", error)
      return {
        success: false,
        error: "Error al crear la valoración. Por favor, inténtalo de nuevo.",
      }
    }

    // Crear notificación para el dueño de la publicación
    await supabase.from("notificaciones").insert({
      usuario_id: publicacion.usuario_id,
      titulo: "Nueva valoración",
      mensaje: `Tu publicación ha recibido una valoración de ${data.calificacion} estrellas.`,
      tipo: "valoracion",
      referencia_id: nuevaValoracion[0].id,
      fecha_creacion: new Date().toISOString(),
    })

    // Registrar en el historial
    await supabase.from("historial").insert({
      usuario_id: user.userId,
      accion: "crear_valoracion",
      descripcion: `Valoración para publicación ID: ${data.publicacion_id}`,
      entidad: "valoraciones",
      entidad_id: nuevaValoracion[0].id,
      fecha_accion: new Date().toISOString(),
    })

    revalidatePath(`/materiales/${data.publicacion_id}`)

    return {
      success: true,
      ratingId: nuevaValoracion[0].id,
    }
  } catch (error) {
    console.error("Error al crear valoración:", error)
    return {
      success: false,
      error: "Ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo más tarde.",
    }
  }
}

// Función para obtener valoraciones de una publicación
export async function getValoracionesPublicacion(publicacionId: number) {
  try {
    const supabase = createActionClient()

    const { data, error } = await supabase
      .from("valoraciones")
      .select(`
        *,
        usuario:usuarios(id, nombre)
      `)
      .eq("publicacion_id", publicacionId)
      .order("fecha_valoracion", { ascending: false })

    if (error) {
      console.error("Error al obtener valoraciones:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener valoraciones:", error)
    return []
  }
}

// Función para obtener la valoración promedio de una publicación
export async function getValoracionPromedio(publicacionId: number) {
  try {
    const supabase = createActionClient()

    const { data, error } = await supabase
      .from("valoraciones")
      .select("calificacion")
      .eq("publicacion_id", publicacionId)

    if (error || !data || data.length === 0) {
      return { promedio: 0, total: 0 }
    }

    const total = data.length
    const suma = data.reduce((acc, val) => acc + val.calificacion, 0)
    const promedio = suma / total

    return { promedio, total }
  } catch (error) {
    console.error("Error al obtener valoración promedio:", error)
    return { promedio: 0, total: 0 }
  }
}
