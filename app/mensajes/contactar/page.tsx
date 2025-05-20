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
    redirect("/login?redirect=/mensajes")
  }

  const usuarioId = session.user.id

  // Verificar que el destinatario existe en la base de datos
  const { data: destinatario, error: errorDestinatario } = await supabase
    .from("usuarios")
    .select("id, nombre")
    .eq("id", destinatarioId)
    .maybeSingle()

  if (errorDestinatario || !destinatario) {
    console.error("Error al verificar destinatario:", errorDestinatario)
    redirect("/mensajes?error=El destinatario no existe")
  }

  // Mensaje inicial predeterminado
  const mensajeInicial = "Hola, me gustaría contactarte para hablar sobre reciclaje."

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
    redirect(`/mensajes?error=${encodeURIComponent("No se pudo iniciar la conversación: " + error)}`)
  }
}
