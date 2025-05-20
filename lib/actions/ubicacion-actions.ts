"use server"

import { createActionClient } from "@/lib/supabase/server"

// Tipo para las ubicaciones
type Ubicacion = {
  id: string
  nombre: string
  direccion: string
  latitud: number
  longitud: number
  tipo: string
  descripcion: string
  usuario_id: string
}

// Tipo para los datos de nueva ubicación
type NuevaUbicacion = Omit<Ubicacion, "id">

// Función para obtener todas las ubicaciones
export async function fetchUbicaciones(): Promise<Ubicacion[]> {
  try {
    const supabase = createActionClient()
    const { data, error } = await supabase.from("ubicaciones").select("*")

    if (error) {
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener ubicaciones:", error)
    throw new Error("No se pudieron cargar las ubicaciones")
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

// Exportar fetchUbicaciones también como getUbicaciones para mantener compatibilidad
export const getUbicaciones = fetchUbicaciones
