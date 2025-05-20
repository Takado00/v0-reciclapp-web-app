import { ProfileView } from "@/components/profile/profile-view"
import { MobileProfileHeader } from "@/components/profile/mobile-profile-header"
import { PersonaNaturalProfile } from "@/components/profile/user-profile"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function PerfilEjemploPage() {
  // Crear un perfil de ejemplo
  const perfilEjemplo = {
    id: "ejemplo",
    nombre: "Usuario de Ejemplo",
    correo: "usuario@ejemplo.com",
    telefono: "123-456-7890",
    direccion: "Calle Principal 123",
    ciudad: "Ciudad Ejemplo",
    fecha_registro: new Date().toISOString(),
    ultima_conexion: new Date().toISOString(),
    descripcion: "Este es un perfil de ejemplo para que puedas ver cómo funciona la aplicación.",
    sitio_web: "www.ejemplo.com",
    foto_perfil: null,
    roles: { nombre: "persona-natural", id: 1 },
  }

  // Estadísticas de ejemplo
  const statsEjemplo = {
    materiales: 5,
    transacciones: 3,
    valoraciones: 2,
  }

  return (
    <div className="container py-4 md:py-8">
      <div className="mb-4">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver al inicio
        </Link>
      </div>

      {/* Mensaje informativo */}
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

      {/* Versión móvil */}
      <div className="md:hidden">
        <MobileProfileHeader profile={perfilEjemplo} isOwnProfile={false} />
        <PersonaNaturalProfile profile={perfilEjemplo} stats={statsEjemplo} isOwnProfile={false} userId="ejemplo" />
      </div>

      {/* Versión escritorio */}
      <div className="hidden md:block">
        <ProfileView profile={perfilEjemplo} stats={statsEjemplo} isOwnProfile={false} userId="ejemplo" />
      </div>
    </div>
  )
}
