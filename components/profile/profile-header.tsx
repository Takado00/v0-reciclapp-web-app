import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Mail, Phone, Briefcase, Clock } from "lucide-react"

interface ProfileHeaderProps {
  profile: any
  stats: any
}

export function ProfileHeader({ profile, stats }: ProfileHeaderProps) {
  // Determinar el tipo de usuario
  const userType = profile.roles?.nombre || "usuario"

  // Obtener el color del badge según el tipo de usuario
  const getBadgeColor = () => {
    switch (userType) {
      case "reciclador":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "empresa":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
    }
  }

  // Obtener el nombre legible del tipo de usuario
  const getUserTypeName = () => {
    switch (userType) {
      case "reciclador":
        return "Reciclador"
      case "empresa":
        return "Empresa"
      default:
        return "Usuario"
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-background">
        {profile.foto_perfil ? (
          <Image
            src={
              profile.foto_perfil ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt={profile.nombre}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <span className="text-3xl font-bold text-muted-foreground">
              {profile.nombre?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">{profile.nombre}</h1>
          <Badge className={`${getBadgeColor()} md:ml-2`}>{getUserTypeName()}</Badge>
          {profile.nivel_experiencia && (
            <Badge variant="outline" className="ml-0 md:ml-2">
              {profile.nivel_experiencia}
            </Badge>
          )}
        </div>

        <div className="mt-2 text-muted-foreground">
          {profile.descripcion ? <p>{profile.descripcion}</p> : <p className="italic">Sin descripción</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          {profile.correo && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.correo}</span>
            </div>
          )}

          {profile.telefono && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile.telefono}</span>
            </div>
          )}

          {profile.ciudad && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.ciudad}</span>
            </div>
          )}

          {profile.fecha_registro && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>Miembro desde {new Date(profile.fecha_registro).toLocaleDateString()}</span>
            </div>
          )}

          {profile.especialidad && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{profile.especialidad}</span>
            </div>
          )}

          {profile.horario_atencion && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{profile.horario_atencion}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-4 md:gap-2 mt-4 md:mt-0">
        <div className="text-center">
          <p className="text-2xl font-bold">{stats.materiales || 0}</p>
          <p className="text-xs text-muted-foreground">Materiales Publicados</p>
        </div>
        {userType !== "usuario" && (
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.valoracion || "0.0"}</p>
            <p className="text-xs text-muted-foreground">Valoración</p>
          </div>
        )}
      </div>
    </div>
  )
}
