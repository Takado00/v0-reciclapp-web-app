"use server"

import { createActionClient } from "@/lib/supabase/server"

// Tipo para las ubicaciones
type Ubicacion = {
  id: string
  nombre: string
  direccion: string
  ciudad: string
  estado: string
  pais: string
  codigo_postal: string
  latitud: number | null
  longitud: number | null
  tipo: string
  descripcion: string
  usuario_id: string
  created_at: string
}

// Tipo para los datos de nueva ubicación
type NuevaUbicacion = Omit<Ubicacion, "id" | "created_at">

// Función para obtener todas las ubicaciones
export async function getUbicaciones(): Promise<Ubicacion[]> {
  try {
    const supabase = createActionClient()
    const { data, error } = await supabase.from("ubicaciones").select("*").order("nombre")

    if (error) {
      console.error("Error al obtener ubicaciones:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error inesperado al obtener ubicaciones:", error)
    return []
  }
}

// Función para añadir una nueva ubicación
export async function addUbicacion(ubicacionData: NuevaUbicacion): Promise<Ubicacion> {
  try {
    const supabase = createActionClient()
    const { data, error } = await supabase.from("ubicaciones").insert(ubicacionData).select().single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error al añadir ubicación:", error)
    throw new Error("No se pudo añadir la ubicación")
  }
}

// Función para obtener ubicaciones por tipo
export async function fetchUbicacionesByTipo(tipo: string): Promise<Ubicacion[]> {
  try {
    const supabase = createActionClient()
    const { data, error } = await supabase.from("ubicaciones").select("*").eq("tipo", tipo)

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error(`Error al obtener ubicaciones de tipo ${tipo}:`, error)
    throw new Error(`No se pudieron cargar las ubicaciones de tipo ${tipo}`)
  }
}

// Función para obtener ubicaciones por usuario
export async function fetchUbicacionesByUsuario(usuarioId: string): Promise<Ubicacion[]> {
  try {
    const supabase = createActionClient()
    const { data, error } = await supabase.from("ubicaciones").select("*").eq("usuario_id", usuarioId)

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error(`Error al obtener ubicaciones del usuario ${usuarioId}:`, error)
    throw new Error("No se pudieron cargar tus ubicaciones")
  }
}

// Función para eliminar una ubicación
export async function deleteUbicacion(ubicacionId: string): Promise<boolean> {
  try {
    const supabase = createActionClient()
    const { error } = await supabase.from("ubicaciones").delete().eq("id", ubicacionId)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error(`Error al eliminar ubicación ${ubicacionId}:`, error)
    throw new Error("No se pudo eliminar la ubicación")
  }
}

// Función para actualizar una ubicación
export async function updateUbicacion(ubicacionId: string, ubicacionData: Partial<NuevaUbicacion>): Promise<Ubicacion> {
  try {
    const supabase = createActionClient()
    const { data, error } = await supabase
      .from("ubicaciones")
      .update(ubicacionData)
      .eq("id", ubicacionId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error(`Error al actualizar ubicación ${ubicacionId}:`, error)
    throw new Error("No se pudo actualizar la ubicación")
  }
}

// Función para obtener una ubicación por ID
export async function getUbicacionById(id: string): Promise<Ubicacion | null> {
  try {
    const supabase = createActionClient()
    const { data, error } = await supabase.from("ubicaciones").select("*").eq("id", id).single()

    if (error) {
      console.error("Error al obtener ubicación:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error inesperado al obtener ubicación:", error)
    return null
  }
}

// Función para crear una nueva ubicación
export async function crearUbicacion(formData: FormData) {
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
    const nombre = formData.get("nombre") as string
    const direccion = formData.get("direccion") as string
    const ciudad = formData.get("ciudad") as string
    const estado = formData.get("estado") as string
    const pais = formData.get("pais") as string
    const codigo_postal = formData.get("codigo_postal") as string
    const latitud = formData.get("latitud") ? Number.parseFloat(formData.get("latitud") as string) : null
    const longitud = formData.get("longitud") ? Number.parseFloat(formData.get("longitud") as string) : null

    // Validar datos obligatorios
    if (!nombre || !ciudad) {
      return { error: "Faltan campos obligatorios" }
    }

    // Insertar en la tabla de ubicaciones
    const { data: ubicacion, error: ubicacionError } = await supabase
      .from("ubicaciones")
      .insert({
        nombre,
        direccion,
        ciudad,
        estado,
        pais,
        codigo_postal,
        latitud,
        longitud,
        usuario_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (ubicacionError) {
      console.error("Error al crear ubicación:", ubicacionError)
      return { error: "Error al crear la ubicación" }
    }

    return { success: true, ubicacion }
  } catch (error) {
    console.error("Error al crear ubicación:", error)
    return { error: "Error al procesar la solicitud" }
  }
}
