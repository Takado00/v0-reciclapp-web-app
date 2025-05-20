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
import { MapPin, Phone, Clock, Globe } from "lucide-react"

interface EmpresaProfileProps {
  profile: any
  stats: any
  isOwnProfile: boolean
  userId: string
}

export function EmpresaProfile({ profile, stats, isOwnProfile, userId }: EmpresaProfileProps) {
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
          userType="empresa"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Perfil Header para Móvil */}
      <Card className="overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-purple-700 to-purple-500">
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
                  <div className="h-full w-full flex items-center justify-center bg-purple-100">
                    <span className="text-2xl font-bold text-purple-600">
                      {profile.nombre?.charAt(0).toUpperCase() || "E"}
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
              <Badge variant="outline" className="bg-purple-100 text-purple-800 font-normal">
                Empresa
              </Badge>
            </div>

            <div className="flex flex-row sm:flex-col gap-3 sm:gap-1 mt-2 sm:mt-0">
              <div className="text-center">
                <p className="text-lg font-bold">{stats.materiales || 0}</p>
                <p className="text-xs text-muted-foreground">Solicitudes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{stats.transacciones || 0}</p>
                <p className="text-xs text-muted-foreground">Compras</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{stats.proveedores || 0}</p>
                <p className="text-xs text-muted-foreground">Proveedores</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {profile.sitio_web && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={profile.sitio_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.sitio_web.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            {profile.horario_atencion && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{profile.horario_atencion}</span>
              </div>
            )}

            {profile.direccion && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.direccion}</span>
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
          <TabsTrigger value="materials">Solicitudes</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sobre {isOwnProfile ? "nosotros" : profile.nombre}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Descripción */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Acerca de</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {profile.descripcion || profile.bio || profile.biografia || "Sin descripción disponible"}
                </p>
              </div>

              {profile.certificaciones && profile.certificaciones.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Certificaciones</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.certificaciones.map((cert: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.redes_sociales && Object.keys(profile.redes_sociales).length > 0 && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Redes Sociales</h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.redes_sociales.facebook && (
                      <a
                        href={profile.redes_sociales.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                        Facebook
                      </a>
                    )}

                    {profile.redes_sociales.instagram && (
                      <a
                        href={profile.redes_sociales.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:underline flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                        Instagram
                      </a>
                    )}

                    {profile.redes_sociales.linkedin && (
                      <a
                        href={profile.redes_sociales.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-800 hover:underline flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Materiales que compra</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.materiales_aceptados && profile.materiales_aceptados.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.materiales_aceptados.map((material: string, index: number) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {material}
                    </Badge>
                  ))}
                </div>
              ) : isOwnProfile ? (
                <div className="bg-muted p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Indica qué materiales compra tu empresa para que los recicladores puedan encontrarte
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Añadir materiales
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Esta empresa no ha especificado qué materiales compra.</p>
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
                  ? "Aún no has publicado solicitudes de materiales. Publica tus primeras solicitudes para comenzar a recibir ofertas."
                  : "Esta empresa no tiene solicitudes de materiales publicadas actualmente."
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
