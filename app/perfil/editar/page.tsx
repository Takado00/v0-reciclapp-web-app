import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function EditarPerfilPage() {
  const supabase = createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/perfil/editar")
  }

  // Obtener el perfil del usuario
  const { data: profile, error } = await supabase
    .from("usuarios")
    .select(`
      *,
      roles(nombre)
    `)
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    console.error("Error al obtener el perfil:", error)
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
        <p className="text-red-500">Error al cargar la información del perfil. Por favor, inténtalo de nuevo.</p>
      </div>
    )
  }

  // Determinar el tipo de usuario
  const userType =
    profile.roles?.nombre === "reciclador"
      ? "reciclador"
      : profile.roles?.nombre === "empresa"
        ? "empresa"
        : "persona-natural"

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <ProfileEditForm profile={profile} userType={userType} onCancel={() => {}} redirectUrl="/mi-perfil" />
    </div>
  )
}
