"use server"

import { createActionClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { revalidatePath } from "next/cache"

// Tipos para las funciones de materiales
type MaterialData = {
  titulo: string
  descripcion: string
  material_id: number
  cantidad: number
  unidad_medida: string
  precio: number
  ubicacion_id?: number
  imagen_url?: string
}

type MaterialResult = {
  success: boolean
  error?: string
  publicacionId?: number
}

// Función para obtener todos los materiales
export async function getMateriales() {
  const supabase = createActionClient()

  const { data, error } = await supabase.from("materiales").select("*").order("nombre")

  if (error) {
    console.error("Error al obtener materiales:", error)
    return []
  }

  return data || []
}

// Función para obtener un material por ID
export async function getMaterialById(id: number) {
  const supabase = createActionClient()

  const { data, error } = await supabase.from("materiales").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error al obtener material con ID ${id}:`, error)
    return null
  }

  return data
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
export async function crearPublicacion(data: MaterialData): Promise<MaterialResult> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: "Debes iniciar sesión para publicar materiales.",
      }
    }

    const supabase = createActionClient()

    // Validar datos
    if (!data.titulo || !data.material_id || !data.cantidad || !data.unidad_medida) {
      return {
        success: false,
        error: "Faltan campos obligatorios.",
      }
    }

    // Insertar la publicación
    const { data: nuevaPublicacion, error } = await supabase
      .from("publicaciones")
      .insert({
        usuario_id: user.userId,
        material_id: data.material_id,
        titulo: data.titulo,
        descripcion: data.descripcion,
        cantidad: data.cantidad,
        unidad_medida: data.unidad_medida,
        precio: data.precio,
        ubicacion_id: data.ubicacion_id,
        imagen_url: data.imagen_url,
        estado: "disponible",
        fecha_publicacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error al crear publicación:", error)
      return {
        success: false,
        error: "Error al crear la publicación. Por favor, inténtalo de nuevo.",
      }
    }

    // Registrar en el historial
    await supabase.from("historial").insert({
      usuario_id: user.userId,
      accion: "crear_publicacion",
      descripcion: `Publicación de material: ${data.titulo}`,
      entidad: "publicaciones",
      entidad_id: nuevaPublicacion[0].id,
      fecha_accion: new Date().toISOString(),
    })

    revalidatePath("/materiales")

    return {
      success: true,
      publicacionId: nuevaPublicacion[0].id,
    }
  } catch (error) {
    console.error("Error al crear publicación:", error)
    return {
      success: false,
      error: "Ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo más tarde.",
    }
  }
}

// Función para actualizar una publicación
export async function actualizarPublicacion(id: number, data: Partial<MaterialData>): Promise<MaterialResult> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: "Debes iniciar sesión para actualizar publicaciones.",
      }
    }

    const supabase = createActionClient()

    // Verificar que la publicación pertenezca al usuario
    const { data: publicacion } = await supabase.from("publicaciones").select("usuario_id").eq("id", id).single()

    if (!publicacion || publicacion.usuario_id !== user.userId) {
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
      usuario_id: user.userId,
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
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: "Debes iniciar sesión para eliminar publicaciones.",
      }
    }

    const supabase = createActionClient()

    // Verificar que la publicación pertenezca al usuario
    const { data: publicacion } = await supabase.from("publicaciones").select("usuario_id").eq("id", id).single()

    if (!publicacion || publicacion.usuario_id !== user.userId) {
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
      usuario_id: user.userId,
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
