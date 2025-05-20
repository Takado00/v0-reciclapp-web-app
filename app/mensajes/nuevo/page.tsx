import { createServerClient } from "@/lib/supabase/server"
import { MensajesLayout } from "@/components/mensajes/mensajes-layout"
import { NuevoMensaje } from "@/components/mensajes/nuevo-mensaje"
import { obtenerContactos } from "@/lib/actions/mensajes-actions"
import { AuthRequired } from "@/components/mensajes/auth-required"

export default async function NuevoMensajePage() {
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

  // Obtener los contactos
  const { success, data: contactos } = await obtenerContactos(userId)

  return (
    <MensajesLayout>
      <NuevoMensaje contactos={success ? contactos || [] : []} usuarioActualId={userId} />
    </MensajesLayout>
  )
}
