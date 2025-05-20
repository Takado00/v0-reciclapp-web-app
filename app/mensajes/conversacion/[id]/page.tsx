import { createServerClient } from "@/lib/supabase/server"
import { MensajesLayout } from "@/components/mensajes/mensajes-layout"
import { ConversacionDetail } from "@/components/mensajes/conversacion-detail"
import { obtenerConversacion } from "@/lib/actions/mensajes-actions"
import { EmptyState } from "@/components/mensajes/empty-state"
import { AuthRequired } from "@/components/mensajes/auth-required"

export default async function ConversacionPage({ params }: { params: { id: string } }) {
  // Obtener el usuario autenticado
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no hay sesión, mostrar un estado vacío en lugar de redirigir
  if (!session) {
    return (
      <MensajesLayout>
        <AuthRequired />
      </MensajesLayout>
    )
  }

  const userId = session.user.id
  const conversacionId = params.id

  // Obtener la conversación
  const { success, data: conversacion, error } = await obtenerConversacion(conversacionId, userId)

  return (
    <MensajesLayout>
      {success && conversacion ? (
        <ConversacionDetail conversacion={conversacion} usuarioActualId={userId} />
      ) : (
        <EmptyState
          title="Conversación no encontrada"
          description="La conversación que buscas no existe o no tienes acceso a ella."
          buttonText="Volver a mensajes"
          buttonHref="/mensajes"
          error={error}
        />
      )}
    </MensajesLayout>
  )
}
