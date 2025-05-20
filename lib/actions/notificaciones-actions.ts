"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function marcarNotificacionLeida(id: number) {
  try {
    const supabase = createClient()

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      throw new Error("No hay sesión activa")
    }

    const { error } = await supabase
      .from("notificaciones")
      .update({ leida: true })
      .eq("id", id)
      .eq("usuario_id", sessionData.session.user.id)

    if (error) {
      console.error("Error al marcar notificación como leída:", error)
      throw new Error("No se pudo marcar la notificación como leída")
    }

    revalidatePath("/notificaciones")
    return { success: true }
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error)
    throw error
  }
}

export async function marcarTodasLeidas() {
  try {
    const supabase = createClient()

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      throw new Error("No hay sesión activa")
    }

    const { error } = await supabase
      .from("notificaciones")
      .update({ leida: true })
      .eq("usuario_id", sessionData.session.user.id)
      .eq("leida", false)

    if (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error)
      throw new Error("No se pudieron marcar todas las notificaciones como leídas")
    }

    revalidatePath("/notificaciones")
    return { success: true }
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error)
    throw error
  }
}

// Alias para compatibilidad
export const markNotificationAsRead = marcarNotificacionLeida
