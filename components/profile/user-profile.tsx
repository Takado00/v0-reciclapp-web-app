"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileEditForm } from "./profile-edit-form"
import { MaterialsList } from "./materials-list"
import { getUserMaterials } from "@/lib/actions/profile-actions"
import { ProfilePictureUpload } from "./profile-picture-upload"
import { CalendarDays, MapPin, Mail, Phone } from "lucide-react"

interface PersonaNaturalProfileProps {
  profile: any
  stats: any
  isOwnProfile: boolean
  userId: string
}

export function PersonaNaturalProfile({ profile, stats, isOwnProfile, userId }: PersonaNaturalProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [materials, setMaterials] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("info")
  const [isLoading, setIsLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState(profile.foto_perfil || "")

  const handleTabChange = async (value: string) => {
    setActiveTab(value)
    setIsLoading(true)

    try {
      if (value === "materials" && materials.length === 0) {
        const materialsData = await getUserMaterials(userId)
        setMaterials(materialsData)
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePictureUpload = (url: string) => {
    setProfilePicture(url)
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <ProfileEditForm
          profile={{ ...profile, foto_perfil: profilePicture }}
          onCancel={() => setIsEditing(false)}
          userType="persona-natural"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Perfil Header para Móvil */}
      <Card className="overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-green-600 to-green-400">
          {isOwnProfile && (
            <div className="absolute top-2 right-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-white/80 hover:bg-white"
              >
                Editar Perfil
              </Button>
            </div>
          )}
        </div>

        <div className="px-4 pb-4 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 mb-4 gap-4">
            <div className="relative">
              <div className="h-24 w-24 sm:h-20 sm:w-20 rounded-full overflow-hidden border-4 border-background bg-muted">
                {profilePicture ? (
                  <Image
                    src={profilePicture || "/placeholder.svg"}
                    alt={profile.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-green-100">
                    <span className="text-2xl font-bold text-green-600">
                      {profile.nombre?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <div className="absolute bottom-0 right-0">
                  <ProfilePictureUpload
                    userId={userId}
                    currentImageUrl={profilePicture}
                    onUploadComplete={handlePictureUpload}
                  />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-bold">{profile.nombre}</h2>
              <p className="text-muted-foreground text-sm">Usuario</p>
            </div>

            <div className="flex flex-row sm:flex-col gap-3 sm:gap-1 mt-2 sm:mt-0">
              <div className="text-center">
                <p className="text-lg font-bold">{stats.materiales || 0}</p>
                <p className="text-xs text-muted-foreground">Materiales</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{stats.transacciones || 0}</p>
                <p className="text-xs text-muted-foreground">Transacciones</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
          </div>
        </div>
      </Card>

      <Tabs defaultValue="info" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="materials">Materiales</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sobre {isOwnProfile ? "mí" : profile.nombre}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Descripción */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Acerca de</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {profile.descripcion || profile.bio || profile.biografia || "Sin descripción disponible"}
                </p>
              </div>

              {profile.biografia && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Biografía</h3>
                  <p className="text-sm text-muted-foreground">{profile.biografia}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Intereses de Reciclaje</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.intereses_reciclaje && profile.intereses_reciclaje.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.intereses_reciclaje.map((interes: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {interes}
                    </Badge>
                  ))}
                </div>
              ) : isOwnProfile ? (
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Añade tus intereses de reciclaje para recibir recomendaciones personalizadas
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Añadir intereses
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Esta persona no ha compartido sus intereses de reciclaje.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          {isLoading ? (
            <div className="space-y-4 mt-4">
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
            </div>
          ) : (
            <MaterialsList
              materials={materials}
              isLoading={false}
              emptyMessage={
                isOwnProfile
                  ? "Aún no has guardado materiales. Explora la sección de materiales para encontrar opciones interesantes."
                  : "Esta persona no tiene materiales guardados."
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
