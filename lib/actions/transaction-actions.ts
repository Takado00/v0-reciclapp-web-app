"use server"

import { createActionClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/actions/auth-actions"
import { revalidatePath } from "next/cache"

// Tipos para las funciones de transacciones
type TransactionData = {
  publicacion_id: number
  cantidad: number
  precio_total: number
}

type TransactionResult = {
  success: boolean
  error?: string
  transactionId?: number
}

// Función para crear una nueva transacción
export async function crearTransaccion(data: TransactionData): Promise<TransactionResult> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: "Debes iniciar sesión para realizar transacciones.",
      }
    }

    const supabase = createActionClient()

    // Obtener información de la publicación
    const { data: publicacion, error: pubError } = await supabase
      .from("publicaciones")
      .select("id, usuario_id, cantidad, estado")
      .eq("id", data.publicacion_id)
      .single()

    if (pubError || !publicacion) {
      return {
        success: false,
        error: "La publicación no existe o no está disponible.",
      }
    }

    // Verificar que el comprador no sea el mismo que el vendedor
    if (publicacion.usuario_id === user.userId) {
      return {
        success: false,
        error: "No puedes comprar tu propio material.",
      }
    }

    // Verificar que la publicación esté disponible
    if (publicacion.estado !== "disponible") {
      return {
        success: false,
        error: "Este material ya no está disponible.",
      }
    }

    // Verificar que la cantidad solicitada esté disponible
    if (data.cantidad > publicacion.cantidad) {
      return {
        success: false,
        error: "La cantidad solicitada no está disponible.",
      }
    }

    // Crear la transacción
    const { data: nuevaTransaccion, error } = await supabase
      .from("transacciones")
      .insert({
        publicacion_id: data.publicacion_id,
        comprador_id: user.userId,
        vendedor_id: publicacion.usuario_id,
        cantidad: data.cantidad,
        precio_total: data.precio_total,
        estado: "pendiente",
        fecha_transaccion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error al crear transacción:", error)
      return {
        success: false,
        error: "Error al crear la transacción. Por favor, inténtalo de nuevo.",
      }
    }

    // Actualizar la cantidad disponible en la publicación
    const nuevaCantidad = publicacion.cantidad - data.cantidad
    const nuevoEstado = nuevaCantidad <= 0 ? "agotado" : "disponible"

    await supabase
      .from("publicaciones")
      .update({
        cantidad: nuevaCantidad,
        estado: nuevoEstado,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", data.publicacion_id)

    // Crear notificación para el vendedor
    await supabase.from("notificaciones").insert({
      usuario_id: publicacion.usuario_id,
      titulo: "Nueva transacción",
      mensaje: `Has recibido una solicitud de compra para tu publicación.`,
      tipo: "transaccion",
      referencia_id: nuevaTransaccion[0].id,
      fecha_creacion: new Date().toISOString(),
    })

    // Registrar en el historial
    await supabase.from("historial").insert({
      usuario_id: user.userId,
      accion: "crear_transaccion",
      descripcion: `Transacción para publicación ID: ${data.publicacion_id}`,
      entidad: "transacciones",
      entidad_id: nuevaTransaccion[0].id,
      fecha_accion: new Date().toISOString(),
    })

    revalidatePath("/materiales")
    revalidatePath(`/materiales/${data.publicacion_id}`)

    return {
      success: true,
      transactionId: nuevaTransaccion[0].id,
    }
  } catch (error) {
    console.error("Error al crear transacción:", error)
    return {
      success: false,
      error: "Ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo más tarde.",
    }
  }
}

// Función para actualizar el estado de una transacción
export async function actualizarEstadoTransaccion(id: number, estado: string): Promise<TransactionResult> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: "Debes iniciar sesión para actualizar transacciones.",
      }
    }

    const supabase = createActionClient()

    // Verificar que la transacción pertenezca al usuario (como vendedor)
    const { data: transaccion, error: transError } = await supabase
      .from("transacciones")
      .select("vendedor_id, comprador_id, publicacion_id")
      .eq("id", id)
      .single()

    if (transError || !transaccion) {
      return {
        success: false,
        error: "La transacción no existe.",
      }
    }

    // Verificar que el usuario sea el vendedor o el comprador
    if (transaccion.vendedor_id !== user.userId && transaccion.comprador_id !== user.userId) {
      return {
        success: false,
        error: "No tienes permiso para actualizar esta transacción.",
      }
    }

    // Actualizar el estado de la transacción
    const { error } = await supabase
      .from("transacciones")
      .update({
        estado: estado,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Error al actualizar transacción:", error)
      return {
        success: false,
        error: "Error al actualizar la transacción. Por favor, inténtalo de nuevo.",
      }
    }

    // Crear notificación para la otra parte
    const destinatarioId = user.userId === transaccion.vendedor_id ? transaccion.comprador_id : transaccion.vendedor_id

    let mensaje = ""
    if (estado === "completada") {
      mensaje = "La transacción ha sido completada con éxito."
    } else if (estado === "cancelada") {
      mensaje = "La transacción ha sido cancelada."
    } else {
      mensaje = `El estado de la transacción ha cambiado a: ${estado}.`
    }

    await supabase.from("notificaciones").insert({
      usuario_id: destinatarioId,
      titulo: "Actualización de transacción",
      mensaje: mensaje,
      tipo: "transaccion",
      referencia_id: id,
      fecha_creacion: new Date().toISOString(),
    })

    // Registrar en el historial
    await supabase.from("historial").insert({
      usuario_id: user.userId,
      accion: "actualizar_transaccion",
      descripcion: `Actualización de estado de transacción ID: ${id} a ${estado}`,
      entidad: "transacciones",
      entidad_id: id,
      fecha_accion: new Date().toISOString(),
    })

    revalidatePath("/transacciones")

    return {
      success: true,
      transactionId: id,
    }
  } catch (error) {
    console.error("Error al actualizar transacción:", error)
    return {
      success: false,
      error: "Ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo más tarde.",
    }
  }
}

// Función para obtener transacciones del usuario
export async function getTransaccionesUsuario() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return []
    }

    const supabase = createActionClient()

    const { data, error } = await supabase
      .from("transacciones")
      .select(`
        *,
        publicacion:publicaciones(id, titulo, imagen_url),
        comprador:usuarios!transacciones_comprador_id_fkey(id, nombre),
        vendedor:usuarios!transacciones_vendedor_id_fkey(id, nombre)
      `)
      .or(`comprador_id.eq.${user.userId},vendedor_id.eq.${user.userId}`)
      .order("fecha_transaccion", { ascending: false })

    if (error) {
      console.error("Error al obtener transacciones:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error al obtener transacciones:", error)
    return []
  }
}
