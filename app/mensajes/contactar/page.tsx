import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { crearConversacion } from "@/lib/actions/mensajes-actions"

export default async function ContactarPage({
  searchParams,
}: {
  searchParams: { id: string; nombre: string }
}) {
  // Obtener el ID y nombre del destinatario de los parámetros de búsqueda
  const destinatarioId = searchParams.id
  const destinatarioNombre = searchParams.nombre || "Usuario"

  if (!destinatarioId) {
    redirect("/mensajes?error=No se especificó un destinatario")
  }

  // Obtener el usuario actual
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(
      "/login?redirect=/mensajes/contactar?id=" + destinatarioId + "&nombre=" + encodeURIComponent(destinatarioNombre),
    )
  }

  const usuarioId = session.user.id

  // Verificar que el destinatario existe en la base de datos
  const { data: destinatario, error: errorDestinatario } = await supabase
    .from("usuarios")
    .select("id, nombre, rol_id")
    .eq("id", destinatarioId)
    .maybeSingle()

  if (errorDestinatario || !destinatario) {
    console.error("Error al verificar destinatario:", errorDestinatario)
    redirect("/mensajes?error=El destinatario no existe o ha sido eliminado")
  }

  // Verificar que el usuario actual existe en la base de datos
  const { data: usuarioActual, error: errorUsuarioActual } = await supabase
    .from("usuarios")
    .select("id, nombre, rol_id")
    .eq("id", usuarioId)
    .maybeSingle()

  if (errorUsuarioActual || !usuarioActual) {
    console.error("Error al verificar usuario actual:", errorUsuarioActual)

    // Intentar crear el registro de usuario si no existe
    const { data: userInfo } = await supabase.auth.getUser()

    if (userInfo?.user) {
      const { error: createError } = await supabase.from("usuarios").insert({
        id: usuarioId,
        nombre: userInfo.user.user_metadata?.name || "Usuario",
        correo: userInfo.user.email,
        rol_id: 1, // Usuario normal por defecto
      })

      if (createError) {
        console.error("Error al crear usuario:", createError)
        redirect("/login?error=No se pudo crear tu perfil. Por favor, contacta con soporte.")
      }
    } else {
      redirect("/login?error=Tu sesión ha expirado o tu cuenta no existe")
    }
  }

  // Determinar el tipo de usuario del destinatario
  let tipoUsuario = "usuario"
  if (destinatario.rol_id === 2) tipoUsuario = "reciclador"
  if (destinatario.rol_id === 3) tipoUsuario = "empresa"

  // Mensaje inicial predeterminado según el tipo de usuario
  let mensajeInicial = "Hola, me gustaría contactarte para hablar sobre reciclaje."

  if (tipoUsuario === "reciclador") {
    mensajeInicial = "Hola, tengo materiales para reciclar. ¿Estás disponible para recogerlos?"
  } else if (tipoUsuario === "empresa") {
    mensajeInicial = "Hola, me interesa conocer más sobre sus servicios de reciclaje."
  }

  try {
    // Crear una nueva conversación o usar una existente
    const { success, data, error } = await crearConversacion(usuarioId, destinatario.id, mensajeInicial)

    if (!success || !data) {
      throw new Error(error || "Error al crear conversación")
    }

    // Redirigir a la conversación
    redirect(`/mensajes/${data.conversacionId}`)
  } catch (error) {
    console.error("Error al contactar:", error)
    // En caso de error, redirigir a la página de mensajes con un mensaje de error
    redirect(
      `/mensajes?error=${encodeURIComponent("No se pudo iniciar la conversación. Por favor, inténtalo de nuevo más tarde.")}`,
    )
  }
}
