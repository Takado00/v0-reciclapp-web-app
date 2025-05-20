import { createServerClient } from "@/lib/supabase/server"
import { obtenerConversacion } from "@/lib/actions/mensajes-actions"
import { ConversacionDetail } from "@/components/mensajes/conversacion-detail"
import { MensajesLayout } from "@/components/mensajes/mensajes-layout"
import { EmptyState } from "@/components/mensajes/empty-state"
import { validate as validateUUID } from "uuid"

export default async function ConversacionPage({ params }: { params: { id: string } }) {
  // Validar que el ID sea un UUID válido
  if (!validateUUID(params.id)) {
    return (
      <MensajesLayout>
        <EmptyState
          title="Conversación no válida"
          description="El identificador de la conversación no es válido."
          buttonText="Volver a mensajes"
          buttonHref="/mensajes"
        />
      </MensajesLayout>
    )
  }

  // Obtener el usuario autenticado
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no hay sesión, mostrar un estado para iniciar sesión
  if (!session) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Inicia sesión para ver esta conversación</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Necesitas iniciar sesión para acceder a tus conversaciones.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={`/login?redirect=/mensajes/${params.id}`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Iniciar sesión
            </a>
            <a
              href="/registro"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Registrarse
            </a>
          </div>
        </div>
      </div>
    )
  }

  const userId = session.user.id

  // Obtener la conversación
  const { success, data: conversacion, error } = await obtenerConversacion(params.id, userId)

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
