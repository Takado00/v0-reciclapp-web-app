"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Tipos para las funciones de materiales
type MaterialData = {
  nombre: string
  descripcion: string
  categoria: string
  cantidad: number
  unidad_medida: string
  precio_estimado?: number
  imagen_url?: string
}

type MaterialResult = {
  success: boolean
  error?: string
  publicacionId?: number
}

// Función para obtener todos los materiales
export async function getMateriales() {
  try {
    const supabase = createActionClient()
    const { data, error } = await supabase.from("materiales").select("*").order("nombre")

    if (error) {
      console.error("Error al obtener materiales:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error inesperado al obtener materiales:", error)
    return []
  }
}

// Función para obtener un material por ID
export async function getMaterialById(id: string) {
  try {
    const supabase = createActionClient()
    const { data, error } = await supabase.from("materiales").select("*").eq("id", id).single()

    if (error) {
      console.error("Error al obtener material:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error inesperado al obtener material:", error)
    return null
  }
}

// Función para obtener publicaciones de materiales
export async function getPublicaciones(filtros?: {
  categoria?: string
  ubicacion?: string
  busqueda?: string
  limite?: number
}) {
  const supabase = createActionClient()

  let query = supabase
    .from("publicaciones")
    .select(`
      *,
      material:materiales(*),
      usuario:usuarios(id, nombre),
      ubicacion:ubicaciones(id, nombre, direccion)
    `)
    .eq("estado", "disponible")

  // Aplicar filtros si existen
  if (filtros?.categoria) {
    query = query.eq("material.categoria", filtros.categoria)
  }

  if (filtros?.ubicacion) {
    query = query.ilike("ubicacion.direccion", `%${filtros.ubicacion}%`)
  }

  if (filtros?.busqueda) {
    query = query.or(`titulo.ilike.%${filtros.busqueda}%,descripcion.ilike.%${filtros.busqueda}%`)
  }

  if (filtros?.limite) {
    query = query.limit(filtros.limite)
  }

  const { data, error } = await query.order("fecha_publicacion", { ascending: false })

  if (error) {
    console.error("Error al obtener publicaciones:", error)
    return []
  }

  return data || []
}

// Función para obtener una publicación por ID
export async function getPublicacionById(id: number) {
  const supabase = createActionClient()

  const { data, error } = await supabase
    .from("publicaciones")
    .select(`
      *,
      material:materiales(*),
      usuario:usuarios(id, nombre, correo, telefono),
      ubicacion:ubicaciones(id, nombre, direccion, latitud, longitud)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error al obtener publicación con ID ${id}:`, error)
    return null
  }

  return data
}

// Función para crear una nueva publicación de material
export async function crearPublicacion(formData: FormData) {
  try {
    const supabase = createActionClient()

    // Obtener el usuario actual
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Usuario no autenticado" }
    }

    // Extraer datos del formulario
    const titulo = formData.get("titulo") as string
    const descripcion = formData.get("descripcion") as string
    const categoria = formData.get("categoria") as string
    const ubicacion = formData.get("ubicacion") as string
    const cantidad = Number.parseFloat(formData.get("cantidad") as string)
    const unidad_medida = formData.get("unidad_medida") as string
    const precio = formData.get("precio") ? Number.parseFloat(formData.get("precio") as string) : null
    const imagen_url = (formData.get("imagen_url") as string) || null

    // Validar datos obligatorios
    if (!titulo || !categoria || !cantidad || !unidad_medida) {
      return { error: "Faltan campos obligatorios" }
    }

    // Insertar en la tabla de materiales
    const { data: material, error: materialError } = await supabase
      .from("materiales")
      .insert({
        nombre: titulo,
        descripcion,
        categoria,
        cantidad,
        unidad_medida,
        precio_estimado: precio,
        imagen_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (materialError) {
      console.error("Error al crear material:", materialError)
      return { error: "Error al crear el material" }
    }

    // Registrar en el historial
    await supabase.from("historial").insert({
      usuario_id: user.id,
      entidad: "materiales",
      entidad_id: material.id,
      accion: "crear",
      descripcion: `Publicación de material: ${titulo}`,
      fecha_accion: new Date().toISOString(),
    })

    // Revalidar la ruta de materiales para actualizar la lista
    revalidatePath("/materiales")

    // Redirigir a la página del material creado
    redirect(`/materiales/${material.id}`)
  } catch (error) {
    console.error("Error al crear publicación:", error)
    return { error: "Error al procesar la solicitud" }
  }
}

// Función para actualizar una publicación
export async function actualizarPublicacion(id: number, data: Partial<MaterialData>): Promise<MaterialResult> {
  try {
    const supabase = createActionClient()

    // Verificar que la publicación pertenezca al usuario
    const { data: publicacion } = await supabase.from("publicaciones").select("usuario_id").eq("id", id).single()

    if (!publicacion) {
      return {
        success: false,
        error: "No tienes permiso para editar esta publicación.",
      }
    }

    // Actualizar la publicación
    const { error } = await supabase
      .from("publicaciones")
      .update({
        ...data,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error al actualizar publicación:", error)
      return {
        success: false,
        error: "Error al actualizar la publicación. Por favor, inténtalo de nuevo.",
      }
    }

    // Registrar en el historial
    await supabase.from("historial").insert({
      usuario_id: publicacion.usuario_id,
      accion: "actualizar_publicacion",
      descripcion: `Actualización de publicación ID: ${id}`,
      entidad: "publicaciones",
      entidad_id: id,
      fecha_accion: new Date().toISOString(),
    })

    revalidatePath(`/materiales/${id}`)
    revalidatePath("/materiales")

    return {
      success: true,
      publicacionId: id,
    }
  } catch (error) {
    console.error("Error al actualizar publicación:", error)
    return {
      success: false,
      error: "Ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo más tarde.",
    }
  }
}

// Función para eliminar una publicación
export async function eliminarPublicacion(id: number): Promise<MaterialResult> {
  try {
    const supabase = createActionClient()

    // Verificar que la publicación pertenezca al usuario
    const { data: publicacion } = await supabase.from("publicaciones").select("usuario_id").eq("id", id).single()

    if (!publicacion) {
      return {
        success: false,
        error: "No tienes permiso para eliminar esta publicación.",
      }
    }

    // Eliminar la publicación (cambiar estado a "eliminado")
    const { error } = await supabase
      .from("publicaciones")
      .update({
        estado: "eliminado",
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error al eliminar publicación:", error)
      return {
        success: false,
        error: "Error al eliminar la publicación. Por favor, inténtalo de nuevo.",
      }
    }

    // Registrar en el historial
    await supabase.from("historial").insert({
      usuario_id: publicacion.usuario_id,
      accion: "eliminar_publicacion",
      descripcion: `Eliminación de publicación ID: ${id}`,
      entidad: "publicaciones",
      entidad_id: id,
      fecha_accion: new Date().toISOString(),
    })

    revalidatePath("/materiales")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error al eliminar publicación:", error)
    return {
      success: false,
      error: "Ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo más tarde.",
    }
  }
}

// Función para calificar un material
export async function calificarMaterial(formData: FormData) {
  try {
    const supabase = createActionClient()

    // Obtener el usuario actual
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Usuario no autenticado" }
    }

    // Extraer datos del formulario
    const material_id = Number.parseInt(formData.get("material_id") as string)
    const puntuacion = Number.parseInt(formData.get("puntuacion") as string)
    const comentario = (formData.get("comentario") as string) || null

    // Validar datos
    if (!material_id || !puntuacion || puntuacion < 1 || puntuacion > 5) {
      return { error: "Datos de valoración inválidos" }
    }

    // Verificar si el usuario ya ha valorado este material
    const { data: valoracionExistente } = await supabase
      .from("valoraciones")
      .select("id")
      .eq("usuario_id", user.id)
      .eq("material_id", material_id)
      .single()

    if (valoracionExistente) {
      // Actualizar valoración existente
      const { error } = await supabase
        .from("valoraciones")
        .update({
          puntuacion,
          comentario,
          updated_at: new Date().toISOString(),
        })
        .eq("id", valoracionExistente.id)

      if (error) {
        console.error("Error al actualizar valoración:", error)
        return { error: "Error al actualizar la valoración" }
      }
    } else {
      // Crear nueva valoración
      const { error } = await supabase.from("valoraciones").insert({
        usuario_id: user.id,
        material_id,
        puntuacion,
        comentario,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error al crear valoración:", error)
        return { error: "Error al crear la valoración" }
      }
    }

    // Revalidar la ruta del material para actualizar las valoraciones
    revalidatePath(`/materiales/${material_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error al calificar material:", error)
    return { error: "Error al procesar la solicitud" }
  }
}
