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
import { MapPin, Phone, Clock, Award, Briefcase } from "lucide-react"

interface RecicladorProfileProps {
  profile: any
  stats: any
  isOwnProfile: boolean
  userId: string
}

export function RecicladorProfile({ profile, stats, isOwnProfile, userId }: RecicladorProfileProps) {
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
          userType="reciclador"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Perfil Header para Móvil */}
      <Card className="overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-green-700 to-green-500">
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
                      {profile.nombre?.charAt(0).toUpperCase() || "R"}
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
              <div className="flex items-center justify-center sm:justify-start gap-1">
                <Badge variant="outline" className="bg-green-100 text-green-800 font-normal">
                  Reciclador
                </Badge>
                {profile.nivel_experiencia && (
                  <Badge variant="outline" className="font-normal">
                    {profile.nivel_experiencia}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-row sm:flex-col gap-3 sm:gap-1 mt-2 sm:mt-0">
              <div className="text-center">
                <p className="text-lg font-bold">{stats.materiales || 0}</p>
                <p className="text-xs text-muted-foreground">Materiales Publicados</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{stats.valoracion || "0.0"}</p>
                <p className="text-xs text-muted-foreground">Valoración</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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

            {profile.ciudad && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.ciudad}</span>
              </div>
            )}

            {profile.telefono && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.telefono}</span>
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
                <h3 className="font-medium text-sm mb-1">Acerca de</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.descripcion || profile.bio || profile.biografia || "Sin descripción disponible"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {profile.anos_experiencia && (
                  <div>
                    <h3 className="font-medium text-sm mb-1">Años de experiencia</h3>
                    <p className="text-sm text-muted-foreground">{profile.anos_experiencia}</p>
                  </div>
                )}

                {profile.educacion && (
                  <div>
                    <h3 className="font-medium text-sm mb-1">Formación</h3>
                    <p className="text-sm text-muted-foreground">{profile.educacion}</p>
                  </div>
                )}
              </div>

              {profile.certificaciones && profile.certificaciones.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Certificaciones</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.certificaciones.map((cert: string, index: number) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.areas_servicio && profile.areas_servicio.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Áreas de servicio</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.areas_servicio.map((area: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Materiales que acepta</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.materiales_aceptados && profile.materiales_aceptados.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.materiales_aceptados.map((material: string, index: number) => (
                    <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                      {material}
                    </Badge>
                  ))}
                </div>
              ) : isOwnProfile ? (
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Indica qué materiales aceptas para que los usuarios puedan encontrarte más fácilmente
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Añadir materiales
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Este reciclador no ha especificado qué materiales acepta.
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
                  ? "Aún no has publicado materiales. Publica tus primeros materiales para comenzar a recibir contactos."
                  : "Este reciclador no tiene materiales publicados actualmente."
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
