"use server"

import { createActionClient } from "@/lib/supabase/server"

// Función para crear chats de ejemplo para un usuario
export async function crearChatsEjemplo(userId: string) {
  try {
    const supabase = createActionClient()

    // Verificar si el usuario ya tiene conversaciones
    const { data: conversaciones, error: errorConsulta } = await supabase
      .from("conversaciones")
      .select("id")
      .eq("usuario_id", userId)

    // Si ya tiene conversaciones o hay un error, no hacer nada
    if (errorConsulta || (conversaciones && conversaciones.length > 0)) {
      return { success: true }
    }

    // Obtener algunos recicladores y empresas para crear conversaciones de ejemplo
    const { data: recicladores } = await supabase
      .from("usuarios")
      .select("id, nombre")
      .eq("rol_id", 2) // Asumiendo que rol_id 2 es para recicladores
      .limit(3)

    const { data: empresas } = await supabase
      .from("usuarios")
      .select("id, nombre")
      .eq("rol_id", 3) // Asumiendo que rol_id 3 es para empresas
      .limit(2)

    // Crear conversaciones de ejemplo
    const conversacionesEjemplo = []

    // Añadir conversaciones con recicladores
    if (recicladores && recicladores.length > 0) {
      for (const reciclador of recicladores) {
        conversacionesEjemplo.push({
          usuario_id: userId,
          otro_usuario_id: reciclador.id,
          ultimo_mensaje: "Hola, ¿cómo puedo reciclar correctamente?",
          fecha_ultimo_mensaje: new Date().toISOString(),
          no_leidos: 0,
        })
      }
    } else {
      // Si no hay recicladores, crear uno ficticio
      const { data: nuevoReciclador } = await supabase
        .from("usuarios")
        .insert({
          nombre: "Reciclador Ejemplo",
          correo: `reciclador.ejemplo.${Date.now()}@reciclapp.com`,
          rol_id: 2,
          fecha_registro: new Date().toISOString(),
        })
        .select()

      if (nuevoReciclador && nuevoReciclador.length > 0) {
        conversacionesEjemplo.push({
          usuario_id: userId,
          otro_usuario_id: nuevoReciclador[0].id,
          ultimo_mensaje: "Hola, ¿cómo puedo reciclar correctamente?",
          fecha_ultimo_mensaje: new Date().toISOString(),
          no_leidos: 0,
        })
      }
    }

    // Añadir conversaciones con empresas
    if (empresas && empresas.length > 0) {
      for (const empresa of empresas) {
        conversacionesEjemplo.push({
          usuario_id: userId,
          otro_usuario_id: empresa.id,
          ultimo_mensaje: "Me gustaría saber más sobre sus servicios de reciclaje",
          fecha_ultimo_mensaje: new Date().toISOString(),
          no_leidos: 0,
        })
      }
    } else {
      // Si no hay empresas, crear una ficticia
      const { data: nuevaEmpresa } = await supabase
        .from("usuarios")
        .insert({
          nombre: "Empresa Ejemplo",
          correo: `empresa.ejemplo.${Date.now()}@reciclapp.com`,
          rol_id: 3,
          fecha_registro: new Date().toISOString(),
        })
        .select()

      if (nuevaEmpresa && nuevaEmpresa.length > 0) {
        conversacionesEjemplo.push({
          usuario_id: userId,
          otro_usuario_id: nuevaEmpresa[0].id,
          ultimo_mensaje: "Me gustaría saber más sobre sus servicios de reciclaje",
          fecha_ultimo_mensaje: new Date().toISOString(),
          no_leidos: 0,
        })
      }
    }

    // Insertar las conversaciones de ejemplo
    if (conversacionesEjemplo.length > 0) {
      const { error: errorInsercion } = await supabase.from("conversaciones").insert(conversacionesEjemplo)

      if (errorInsercion) {
        console.error("Error al crear conversaciones de ejemplo:", errorInsercion)
        return { success: false, error: "Error al crear conversaciones de ejemplo" }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error al crear chats de ejemplo:", error)
    return { success: false, error: "Error al crear chats de ejemplo" }
  }
}

// Función para obtener todas las conversaciones de un usuario
export async function obtenerConversaciones(userId: string) {
  try {
    const supabase = createActionClient()

    // Obtener todas las conversaciones del usuario
    const { data, error } = await supabase
      .from("conversaciones")
      .select(
        `
        id,
        ultimo_mensaje,
        fecha_ultimo_mensaje,
        no_leidos,
        otro_usuario_id,
        usuarios!conversaciones_otro_usuario_id_fkey (
          id,
          nombre,
          foto_perfil,
          roles (
            id,
            nombre
          )
        )
      `,
      )
      .eq("usuario_id", userId)
      .order("fecha_ultimo_mensaje", { ascending: false })

    if (error) {
      console.error("Error al obtener conversaciones:", error)
      return { success: false, error: "Error al obtener conversaciones" }
    }

    // Transformar los datos para facilitar su uso en el frontend
    const conversaciones = data.map((conv) => {
      const otroUsuario = conv.usuarios
      const tipoUsuario = otroUsuario.roles?.nombre || "desconocido"

      return {
        id: conv.id,
        ultimoMensaje: conv.ultimo_mensaje,
        fechaUltimoMensaje: conv.fecha_ultimo_mensaje,
        mensajesNoLeidos: conv.no_leidos,
        otroUsuario: {
          id: otroUsuario.id,
          nombre: otroUsuario.nombre,
          fotoPerfil: otroUsuario.foto_perfil,
          tipo_usuario: tipoUsuario,
        },
      }
    })

    return { success: true, data: conversaciones }
  } catch (error) {
    console.error("Error al obtener conversaciones:", error)
    return { success: false, error: "Error al obtener conversaciones" }
  }
}

// Función para obtener los mensajes de una conversación
export async function obtenerMensajes(conversacionId: string, userId: string) {
  try {
    const supabase = createActionClient()

    // Verificar que la conversación pertenece al usuario
    const { data: conversacion, error: errorConversacion } = await supabase
      .from("conversaciones")
      .select("id, otro_usuario_id")
      .eq("id", conversacionId)
      .eq("usuario_id", userId)
      .single()

    if (errorConversacion || !conversacion) {
      // Verificar si el usuario es el "otro_usuario" en la conversación
      const { data: conversacionInversa, error: errorInverso } = await supabase
        .from("conversaciones")
        .select("id, usuario_id")
        .eq("id", conversacionId)
        .eq("otro_usuario_id", userId)
        .single()

      if (errorInverso || !conversacionInversa) {
        return { success: false, error: "Conversación no encontrada o no tienes permiso para acceder" }
      }
    }

    // Obtener los mensajes de la conversación
    const { data: mensajes, error: errorMensajes } = await supabase
      .from("mensajes")
      .select(
        `
        id,
        contenido,
        fecha_envio,
        leido,
        emisor_id,
        usuarios (
          id,
          nombre,
          foto_perfil
        )
      `,
      )
      .eq("conversacion_id", conversacionId)
      .order("fecha_envio", { ascending: true })

    if (errorMensajes) {
      console.error("Error al obtener mensajes:", errorMensajes)
      return { success: false, error: "Error al obtener mensajes" }
    }

    // Marcar mensajes como leídos si el usuario es el receptor
    const mensajesNoLeidos = mensajes.filter((msg) => !msg.leido && msg.emisor_id !== userId)
    if (mensajesNoLeidos.length > 0) {
      const mensajesIds = mensajesNoLeidos.map((msg) => msg.id)
      await supabase.from("mensajes").update({ leido: true }).in("id", mensajesIds)

      // Actualizar contador de no leídos en la conversación
      await supabase.from("conversaciones").update({ no_leidos: 0 }).eq("id", conversacionId).eq("usuario_id", userId)
    }

    // Transformar los datos para facilitar su uso en el frontend
    const mensajesFormateados = mensajes.map((msg) => {
      return {
        id: msg.id,
        contenido: msg.contenido,
        fechaEnvio: msg.fecha_envio,
        leido: msg.leido,
        esPropio: msg.emisor_id === userId,
        emisor: {
          id: msg.usuarios.id,
          nombre: msg.usuarios.nombre,
          fotoPerfil: msg.usuarios.foto_perfil,
        },
      }
    })

    return { success: true, data: mensajesFormateados }
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return { success: false, error: "Error al obtener mensajes" }
  }
}

// Función para enviar un mensaje
export async function enviarMensaje(conversacionId: string, contenido: string, userId: string) {
  try {
    const supabase = createActionClient()

    // Verificar que la conversación existe y que el usuario es parte de ella
    const { data: conversacion, error: errorConversacion } = await supabase
      .from("conversaciones")
      .select("id, usuario_id, otro_usuario_id")
      .or(`usuario_id.eq.${userId},otro_usuario_id.eq.${userId}`)
      .eq("id", conversacionId)
      .single()

    if (errorConversacion || !conversacion) {
      return { success: false, error: "Conversación no encontrada o no tienes permiso para enviar mensajes" }
    }

    // Determinar el receptor del mensaje
    const receptorId = conversacion.usuario_id === userId ? conversacion.otro_usuario_id : conversacion.usuario_id

    // Insertar el mensaje
    const { data: mensaje, error: errorMensaje } = await supabase
      .from("mensajes")
      .insert({
        conversacion_id: conversacionId,
        emisor_id: userId,
        receptor_id: receptorId,
        contenido,
        fecha_envio: new Date().toISOString(),
        leido: false,
      })
      .select()

    if (errorMensaje) {
      console.error("Error al enviar mensaje:", errorMensaje)
      return { success: false, error: "Error al enviar mensaje" }
    }

    // Actualizar la conversación con el último mensaje
    const { error: errorActualizacion } = await supabase
      .from("conversaciones")
      .update({
        ultimo_mensaje: contenido,
        fecha_ultimo_mensaje: new Date().toISOString(),
      })
      .eq("id", conversacionId)

    if (errorActualizacion) {
      console.error("Error al actualizar conversación:", errorActualizacion)
    }

    // Incrementar contador de mensajes no leídos para el receptor
    const { error: errorNoLeidos } = await supabase
      .from("conversaciones")
      .update({
        no_leidos: supabase.rpc("increment", { x: 1 }),
      })
      .eq("id", conversacionId)
      .eq("usuario_id", receptorId)

    if (errorNoLeidos) {
      console.error("Error al actualizar contador de no leídos:", errorNoLeidos)
    }

    return { success: true, data: mensaje }
  } catch (error) {
    console.error("Error al enviar mensaje:", error)
    return { success: false, error: "Error al enviar mensaje" }
  }
}

// Función para crear una nueva conversación
export async function crearConversacion(otroUsuarioId: string, mensajeInicial: string, userId: string) {
  try {
    const supabase = createActionClient()

    // Verificar si ya existe una conversación entre estos usuarios
    const { data: conversacionExistente, error: errorConsulta } = await supabase
      .from("conversaciones")
      .select("id")
      .or(
        `and(usuario_id.eq.${userId},otro_usuario_id.eq.${otroUsuarioId}),and(usuario_id.eq.${otroUsuarioId},otro_usuario_id.eq.${userId})`,
      )
      .maybeSingle()

    if (errorConsulta) {
      console.error("Error al verificar conversación existente:", errorConsulta)
      return { success: false, error: "Error al verificar conversación existente" }
    }

    let conversacionId

    if (conversacionExistente) {
      // Si ya existe una conversación, usarla
      conversacionId = conversacionExistente.id
    } else {
      // Crear una nueva conversación
      const { data: nuevaConversacion, error: errorCreacion } = await supabase
        .from("conversaciones")
        .insert({
          usuario_id: userId,
          otro_usuario_id: otroUsuarioId,
          ultimo_mensaje: mensajeInicial,
          fecha_ultimo_mensaje: new Date().toISOString(),
          no_leidos: 0,
        })
        .select()

      if (errorCreacion || !nuevaConversacion) {
        console.error("Error al crear conversación:", errorCreacion)
        return { success: false, error: "Error al crear conversación" }
      }

      conversacionId = nuevaConversacion[0].id

      // Crear la conversación inversa para el otro usuario
      await supabase.from("conversaciones").insert({
        usuario_id: otroUsuarioId,
        otro_usuario_id: userId,
        ultimo_mensaje: mensajeInicial,
        fecha_ultimo_mensaje: new Date().toISOString(),
        no_leidos: 1, // El otro usuario tiene un mensaje no leído
      })
    }

    // Enviar el mensaje inicial
    const resultadoMensaje = await enviarMensaje(conversacionId, mensajeInicial, userId)

    if (!resultadoMensaje.success) {
      return resultadoMensaje
    }

    return { success: true, data: { conversacionId } }
  } catch (error) {
    console.error("Error al crear conversación:", error)
    return { success: false, error: "Error al crear conversación" }
  }
}
