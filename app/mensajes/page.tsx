import { createServerClient } from "@/lib/supabase/server"
import { obtenerConversaciones } from "@/lib/actions/mensajes-actions"
import { ConversacionesList } from "@/components/mensajes/conversaciones-list"
import { EmptyState } from "@/components/mensajes/empty-state"
import { MensajesLayout } from "@/components/mensajes/mensajes-layout"

export default async function MensajesPage() {
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
          <h2 className="text-2xl font-bold mb-4">Inicia sesión para ver tus mensajes</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Necesitas iniciar sesión para acceder a tus conversaciones y conectar con otros usuarios.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/login?redirect=/mensajes"
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

  // Obtener las conversaciones del usuario
  const { success, data: conversaciones, error } = await obtenerConversaciones(userId)

  return (
    <MensajesLayout>
      {success && conversaciones && conversaciones.length > 0 ? (
        <ConversacionesList conversaciones={conversaciones} userId={userId} />
      ) : (
        <EmptyState
          title="No tienes conversaciones"
          description="Comienza a chatear con otros usuarios de la plataforma."
          buttonText="Iniciar una conversación"
          buttonHref="/mensajes/contactos"
          error={error}
        />
      )}
    </MensajesLayout>
  )
}
