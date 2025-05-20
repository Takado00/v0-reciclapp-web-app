"use server"
import { createActionClient } from "@/lib/supabase/server"
import { validate as validateUUID } from "uuid"
import { v4 as uuidv4 } from "uuid"

// Función auxiliar para obtener el tipo de usuario según el rol_id
function obtenerTipoUsuarioPorRol(rolId: number | null): string {
  switch (rolId) {
    case 1:
      return "usuario"
    case 2:
      return "reciclador"
    case 3:
      return "empresa"
    case 4:
      return "sistema"
    default:
      return "usuario"
  }
}

// Función auxiliar para obtener el rol_id según el tipo de usuario
function obtenerRolPorTipoUsuario(tipoUsuario: string): number | null {
  switch (tipoUsuario.toLowerCase()) {
    case "usuario":
      return 1
    case "reciclador":
      return 2
    case "empresa":
      return 3
    case "sistema":
      return 4
    default:
      return null
  }
}

// Función para obtener todas las conversaciones de un usuario
export async function obtenerConversaciones(userId: string) {
  try {
    // Validar que el ID de usuario sea un UUID válido
    if (!validateUUID(userId)) {
      return { success: false, error: "ID de usuario no válido" }
    }

    const supabase = createActionClient()

    // Obtener todas las conversaciones donde el usuario es participante
    const { data: conversaciones, error: errorConversaciones } = await supabase
      .from("conversaciones")
      .select("id, ultimo_mensaje, ultima_actualizacion, usuario1_id, usuario2_id")
      .or(`usuario1_id.eq.${userId},usuario2_id.eq.${userId}`)
      .order("ultima_actualizacion", { ascending: false })

    if (errorConversaciones) {
      console.error("Error al obtener conversaciones:", errorConversaciones)
      return { success: false, error: "Error al obtener conversaciones" }
    }

    if (!conversaciones || conversaciones.length === 0) {
      return { success: true, data: [] }
    }

    // Para cada conversación, obtener los datos del otro usuario
    const conversacionesConUsuarios = await Promise.all(
      conversaciones.map(async (conv) => {
        // Determinar quién es el otro usuario en la conversación
        const otroUsuarioId = conv.usuario1_id === userId ? conv.usuario2_id : conv.usuario1_id

        // Obtener los datos del otro usuario
        const { data: otroUsuario, error: errorUsuario } = await supabase
          .from("usuarios")
          .select("id, nombre, rol_id")
          .eq("id", otroUsuarioId)
          .maybeSingle()

        // Si no se encuentra el usuario o hay un error, usar valores predeterminados
        const usuarioInfo = {
          id: otroUsuarioId,
          nombre: otroUsuario?.nombre || "Usuario desconocido",
          rol_id: otroUsuario?.rol_id || 1,
          tipo_usuario: otroUsuario ? obtenerTipoUsuarioPorRol(otroUsuario.rol_id) : "usuario",
        }

        // Obtener el número de mensajes no leídos
        const { data: mensajesNoLeidos, error: errorMensajes } = await supabase
          .from("mensajes")
          .select("id")
          .eq("conversacion_id", conv.id)
          .eq("emisor_id", otroUsuarioId) // Mensajes enviados por el otro usuario
          .eq("leido", false)

        const numMensajesNoLeidos = mensajesNoLeidos ? mensajesNoLeidos.length : 0

        return {
          id: conv.id,
          ultimo_mensaje: conv.ultimo_mensaje,
          ultima_actualizacion: conv.ultima_actualizacion,
          mensajes_no_leidos: numMensajesNoLeidos,
          otroUsuario: usuarioInfo,
        }
      }),
    )

    return { success: true, data: conversacionesConUsuarios }
  } catch (error) {
    console.error("Error al obtener conversaciones:", error)
    return { success: false, error: "Error al obtener conversaciones" }
  }
}

// Función para obtener una conversación específica
export async function obtenerConversacion(conversacionId: string, userId: string) {
  try {
    // Validar que los IDs sean UUIDs válidos
    if (!validateUUID(conversacionId) || !validateUUID(userId)) {
      return { success: false, error: "ID no válido" }
    }

    const supabase = createActionClient()

    // Verificar que la conversación existe y que el usuario es participante
    const { data: conversacion, error: errorConversacion } = await supabase
      .from("conversaciones")
      .select("id, ultimo_mensaje, ultima_actualizacion, usuario1_id, usuario2_id")
      .eq("id", conversacionId)
      .or(`usuario1_id.eq.${userId},usuario2_id.eq.${userId}`)
      .maybeSingle()

    if (errorConversacion || !conversacion) {
      console.error("Error al obtener conversación:", errorConversacion)
      return { success: false, error: "Conversación no encontrada" }
    }

    // Determinar quién es el otro usuario en la conversación
    const otroUsuarioId = conversacion.usuario1_id === userId ? conversacion.usuario2_id : conversacion.usuario1_id

    // Obtener los datos del otro usuario
    const { data: otroUsuario, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("id, nombre, rol_id")
      .eq("id", otroUsuarioId)
      .maybeSingle()

    // Si no se encuentra el usuario o hay un error, usar valores predeterminados
    const usuarioInfo = {
      id: otroUsuarioId,
      nombre: otroUsuario?.nombre || "Usuario desconocido",
      rol_id: otroUsuario?.rol_id || 1,
      tipo_usuario: otroUsuario ? obtenerTipoUsuarioPorRol(otroUsuario.rol_id) : "usuario",
    }

    // Obtener los mensajes de la conversación
    const { data: mensajes, error: errorMensajes } = await supabase
      .from("mensajes")
      .select("id, conversacion_id, emisor_id, contenido, enviado_en, leido")
      .eq("conversacion_id", conversacionId)
      .order("enviado_en", { ascending: true })

    if (errorMensajes) {
      console.error("Error al obtener mensajes:", errorMensajes)
      return { success: false, error: "Error al obtener mensajes" }
    }

    // Marcar mensajes como leídos si el usuario es el receptor (inferido por no ser el emisor)
    const mensajesNoLeidos = mensajes.filter((msg) => !msg.leido && msg.emisor_id !== userId)
    if (mensajesNoLeidos.length > 0) {
      const mensajesIds = mensajesNoLeidos.map((msg) => msg.id)
      await supabase.from("mensajes").update({ leido: true }).in("id", mensajesIds)
    }

    // Obtener información de los emisores de los mensajes
    const emisoresIds = [...new Set(mensajes.map((msg) => msg.emisor_id))]
    const { data: emisores, error: errorEmisores } = await supabase
      .from("usuarios")
      .select("id, nombre")
      .in("id", emisoresIds)

    if (errorEmisores) {
      console.error("Error al obtener emisores:", errorEmisores)
      // Continuamos sin la información de los emisores
    }

    const emisoresMap = (emisores || []).reduce((map, emisor) => {
      map[emisor.id] = emisor
      return map
    }, {})

    return {
      success: true,
      data: {
        id: conversacion.id,
        ultimo_mensaje: conversacion.ultimo_mensaje,
        ultima_actualizacion: conversacion.ultima_actualizacion,
        mensajes_no_leidos: mensajesNoLeidos.length,
        otroUsuario: usuarioInfo,
        mensajes: mensajes.map((msg) => {
          const emisor = emisoresMap[msg.emisor_id] || { id: msg.emisor_id, nombre: "Usuario desconocido" }
          return {
            id: msg.id,
            conversacion_id: msg.conversacion_id,
            emisor_id: msg.emisor_id,
            contenido: msg.contenido,
            enviado_en: msg.enviado_en,
            leido: msg.leido,
            emisor: {
              id: emisor.id,
              nombre: emisor.nombre || "Usuario",
            },
            es_propio: msg.emisor_id === userId,
          }
        }),
      },
    }
  } catch (error) {
    console.error("Error al obtener conversación:", error)
    return { success: false, error: "Error al obtener conversación" }
  }
}

// Función para enviar un mensaje
export async function enviarMensaje(conversacionId: string, emisorId: string, contenido: string) {
  try {
    // Validar que los IDs sean UUIDs válidos
    if (!validateUUID(conversacionId) || !validateUUID(emisorId)) {
      return { success: false, error: "ID no válido" }
    }

    const supabase = createActionClient()

    // Verificar que la conversación existe y que el usuario es participante
    const { data: conversacion, error: errorConversacion } = await supabase
      .from("conversaciones")
      .select("id, usuario1_id, usuario2_id")
      .eq("id", conversacionId)
      .or(`usuario1_id.eq.${emisorId},usuario2_id.eq.${emisorId}`)
      .maybeSingle()

    if (errorConversacion || !conversacion) {
      console.error("Error al verificar conversación:", errorConversacion)
      return { success: false, error: "Conversación no encontrada" }
    }

    // Determinar quién es el receptor del mensaje
    const receptorId = conversacion.usuario1_id === emisorId ? conversacion.usuario2_id : conversacion.usuario1_id

    // Generar un UUID para el mensaje
    const mensajeId = uuidv4()

    // Insertar el mensaje con un ID explícito
    const { data: mensaje, error: errorMensaje } = await supabase
      .from("mensajes")
      .insert({
        id: mensajeId,
        conversacion_id: conversacionId,
        emisor_id: emisorId,
        contenido,
        enviado_en: new Date().toISOString(),
        leido: false,
      })
      .select()

    if (errorMensaje) {
      console.error("Error al enviar mensaje:", errorMensaje)
      return { success: false, error: "Error al enviar mensaje" }
    }

    // Actualizar la conversación con el último mensaje
    await supabase
      .from("conversaciones")
      .update({
        ultimo_mensaje: contenido,
        ultima_actualizacion: new Date().toISOString(),
      })
      .eq("id", conversacionId)

    return { success: true, data: mensaje }
  } catch (error) {
    console.error("Error al enviar mensaje:", error)
    return { success: false, error: "Error al enviar mensaje" }
  }
}

// Función para crear una nueva conversación
export async function crearConversacion(usuario1Id: string, usuario2Id: string, mensajeInicial: string) {
  try {
    // Validar que los IDs sean UUIDs válidos
    if (!validateUUID(usuario1Id) || !validateUUID(usuario2Id)) {
      console.error("ID no válido:", { usuario1Id, usuario2Id })
      return { success: false, error: "ID no válido" }
    }

    const supabase = createActionClient()

    // Verificar si ya existe una conversación entre estos usuarios
    const { data: conversacionExistente, error: errorConsulta } = await supabase
      .from("conversaciones")
      .select("id")
      .or(
        `and(usuario1_id.eq.${usuario1Id},usuario2_id.eq.${usuario2Id}),` +
          `and(usuario1_id.eq.${usuario2Id},usuario2_id.eq.${usuario1Id})`,
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

      // Actualizar la conversación con el nuevo mensaje
      await supabase
        .from("conversaciones")
        .update({
          ultimo_mensaje: mensajeInicial,
          ultima_actualizacion: new Date().toISOString(),
        })
        .eq("id", conversacionId)
    } else {
      // Generar un UUID para la nueva conversación
      const nuevoConversacionId = uuidv4()

      // Crear una nueva conversación con un ID explícito
      const { data: nuevaConversacion, error: errorCreacion } = await supabase
        .from("conversaciones")
        .insert({
          id: nuevoConversacionId,
          usuario1_id: usuario1Id,
          usuario2_id: usuario2Id,
          ultimo_mensaje: mensajeInicial,
          ultima_actualizacion: new Date().toISOString(),
        })
        .select()

      if (errorCreacion || !nuevaConversacion) {
        console.error("Error al crear conversación:", errorCreacion)
        return { success: false, error: "Error al crear conversación" }
      }

      conversacionId = nuevaConversacion[0].id
    }

    // Enviar el mensaje inicial
    const { success, error } = await enviarMensaje(conversacionId, usuario1Id, mensajeInicial)

    if (!success) {
      return { success: false, error }
    }

    return { success: true, data: { conversacionId } }
  } catch (error) {
    console.error("Error al crear conversación:", error)
    return { success: false, error: "Error al crear conversación" }
  }
}

// Función para obtener contactos (usuarios con los que se puede iniciar una conversación)
export async function obtenerContactos(userId: string, filtroTipo?: string) {
  try {
    // Validar que el ID sea un UUID válido
    if (!validateUUID(userId)) {
      return { success: false, error: "ID no válido" }
    }

    const supabase = createActionClient()

    let query = supabase.from("usuarios").select("id, nombre, rol_id").neq("id", userId)

    if (filtroTipo) {
      // Convertir el filtroTipo a rol_id
      const rolId = obtenerRolPorTipoUsuario(filtroTipo)
      if (rolId) {
        query = query.eq("rol_id", rolId)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Error al obtener contactos:", error)
      return { success: false, error: "Error al obtener contactos" }
    }

    const contactos = data.map((usuario) => ({
      id: usuario.id,
      nombre: usuario.nombre || "Usuario",
      rol_id: usuario.rol_id || 1,
      tipo_usuario: obtenerTipoUsuarioPorRol(usuario.rol_id),
    }))

    return { success: true, data: contactos }
  } catch (error) {
    console.error("Error al obtener contactos:", error)
    return { success: false, error: "Error al obtener contactos" }
  }
}

// Función para generar mensajes predeterminados según el tipo de usuario
export async function obtenerMensajesPredeterminados(tipoUsuarioReceptor: string) {
  const mensajesReciclador = [
    "Hola, tengo materiales para reciclar. ¿Estás disponible para recogerlos?",
    "¿Cuáles son los materiales que aceptas actualmente?",
    "¿En qué zonas de la ciudad ofreces servicio de recolección?",
    "¿Cuál es tu tarifa por kilo de material reciclable?",
    "¿Tienes disponibilidad para recoger materiales este fin de semana?",
  ]

  const mensajesEmpresa = [
    "Hola, me interesa conocer más sobre sus servicios de reciclaje.",
    "¿Qué tipo de materiales procesan en su empresa?",
    "¿Ofrecen algún programa de certificación para recicladores?",
    "¿Tienen algún programa de responsabilidad social empresarial?",
    "¿Compran materiales reciclables? Me gustaría conocer sus precios.",
  ]

  const mensajesUsuario = [
    "Hola, me gustaría coordinar la entrega de materiales reciclables.",
    "¿Tienes experiencia reciclando este tipo de materiales?",
    "¿Podrías recomendarme cómo separar correctamente los materiales?",
    "¿Conoces algún punto de reciclaje cercano a mi ubicación?",
    "Me gustaría aprender más sobre reciclaje, ¿tienes algún consejo?",
  ]

  switch (tipoUsuarioReceptor.toLowerCase()) {
    case "reciclador":
      return { success: true, data: mensajesReciclador }
    case "empresa":
      return { success: true, data: mensajesEmpresa }
    case "usuario":
    default:
      return { success: true, data: mensajesUsuario }
  }
}
