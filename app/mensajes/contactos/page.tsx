import { createServerClient } from "@/lib/supabase/server"
import { obtenerContactos } from "@/lib/actions/mensajes-actions"
import { ContactosList } from "@/components/mensajes/contactos-list"
import { MensajesLayout } from "@/components/mensajes/mensajes-layout"
import { EmptyState } from "@/components/mensajes/empty-state"

export default async function ContactosPage() {
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
          <h2 className="text-2xl font-bold mb-4">Inicia sesión para ver tus contactos</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Necesitas iniciar sesión para acceder a tus contactos y enviar mensajes.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/login?redirect=/mensajes/contactos"
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

  // Obtener contactos
  const { success, data: contactos, error } = await obtenerContactos(userId)

  return (
    <MensajesLayout>
      {success && contactos && contactos.length > 0 ? (
        <ContactosList contactos={contactos} usuarioActualId={userId} />
      ) : (
        <EmptyState
          title="No hay contactos disponibles"
          description="No se encontraron usuarios para iniciar una conversación."
          buttonText="Volver a mensajes"
          buttonHref="/mensajes"
          error={error}
        />
      )}
    </MensajesLayout>
  )
}
