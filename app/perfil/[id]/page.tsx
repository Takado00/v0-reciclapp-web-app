import type { Metadata } from "next"
import { ProfileView } from "@/components/profile/profile-view"
import { MobileProfileHeader } from "@/components/profile/mobile-profile-header"
import { PersonaNaturalProfile } from "@/components/profile/user-profile"
import { RecicladorProfile } from "@/components/profile/reciclador-profile"
import { EmpresaProfile } from "@/components/profile/empresa-profile"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { getUserProfile } from "@/lib/actions/profile-actions"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Perfil de Usuario | ReciclApp",
  description: "Visualiza y gestiona tu perfil en ReciclApp",
}

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  // Obtener datos reales del perfil desde la base de datos
  const profileData = await getUserProfile(params.id)

  // Si no hay datos y no es el perfil de ejemplo, mostrar 404
  if ((!profileData || !profileData.profile) && params.id !== "ejemplo") {
    console.log("Perfil no encontrado para ID:", params.id)
    notFound()
  }

  // Usar datos de ejemplo solo si es el perfil de ejemplo o no hay datos
  let profile
  let stats

  if (params.id === "ejemplo" || !profileData) {
    // Crear un perfil de ejemplo
    profile = {
      id: params.id,
      nombre: params.id === "ejemplo" ? "Usuario de Ejemplo" : `Usuario ${params.id.slice(0, 5)}`,
      correo: "usuario@ejemplo.com",
      telefono: "123-456-7890",
      direccion: "Calle Principal 123",
      ciudad: "Ciudad Ejemplo",
      fecha_registro: new Date().toISOString(),
      ultima_conexion: new Date().toISOString(),
      bio: "Usuario comprometido con el reciclaje y la sostenibilidad.", // Cambiado de descripcion a bio
      sitio_web: "www.ejemplo.com",
      foto_perfil: null,
      roles: { nombre: determinarRol(params.id), id: 1 },
    }

    // Estadísticas de ejemplo
    stats = {
      materiales: 5,
      transacciones: 3,
      valoraciones: 2,
      clientes: 8,
      proveedores: 12,
      valoracion: "4.5",
    }
  } else {
    // Usar datos reales
    profile = profileData.profile
    stats = profileData.stats
  }

  // Determinar si es el perfil propio (para simplificar, asumimos que sí si no es el de ejemplo)
  const isOwnProfile = params.id !== "ejemplo"

  // Determinar qué componente de perfil mostrar según el rol
  const renderProfileByRole = () => {
    switch (profile.roles.nombre) {
      case "reciclador":
        return <RecicladorProfile profile={profile} stats={stats} isOwnProfile={isOwnProfile} userId={params.id} />
      case "empresa":
        return <EmpresaProfile profile={profile} stats={stats} isOwnProfile={isOwnProfile} userId={params.id} />
      default:
        return <PersonaNaturalProfile profile={profile} stats={stats} isOwnProfile={isOwnProfile} userId={params.id} />
    }
  }

  return (
    <div className="container py-4 md:py-8">
      <div className="mb-4">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver al inicio
        </Link>
      </div>

      {/* Mensaje informativo para perfil de ejemplo */}
      {params.id === "ejemplo" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <h3 className="font-medium text-yellow-800 mb-2">Perfil de ejemplo</h3>
          <p className="text-yellow-700">
            Estás viendo un perfil de ejemplo. Para ver tu perfil real, por favor
            <Link href="/login" className="text-green-600 font-medium mx-1 hover:underline">
              inicia sesión
            </Link>
            o
            <Link href="/registro" className="text-green-600 font-medium mx-1 hover:underline">
              regístrate
            </Link>
            .
          </p>
        </div>
      )}

      {/* Versión móvil */}
      <div className="md:hidden">
        <MobileProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
        {renderProfileByRole()}
      </div>

      {/* Versión escritorio */}
      <div className="hidden md:block">
        <ProfileView profile={profile} stats={stats} isOwnProfile={isOwnProfile} userId={params.id} />
      </div>
    </div>
  )
}

// Función para determinar el rol basado en el ID
function determinarRol(id: string): string {
  // Usar el último carácter del ID para determinar el rol
  const lastChar = id.charAt(id.length - 1)
  const charCode = lastChar.charCodeAt(0)

  if (charCode % 3 === 0) {
    return "reciclador"
  } else if (charCode % 3 === 1) {
    return "empresa"
  } else {
    return "persona-natural"
  }
}
