"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, X, ArrowLeft } from "lucide-react"
import { updateUserProfile } from "@/lib/actions/profile-actions"
import { ProfilePictureUpload } from "./profile-picture-upload"

interface ProfileEditFormProps {
  profile: any
  onCancel: () => void
  userType: "persona-natural" | "reciclador" | "empresa" | "admin"
  redirectUrl?: string
}

export function ProfileEditForm({ profile, onCancel, userType, redirectUrl }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    nombre: profile.nombre || "",
    telefono: profile.telefono || "",
    direccion: profile.direccion || "",
    ciudad: profile.ciudad || "",
    descripcion: profile.descripcion || "",
    sitio_web: profile.sitio_web || "",
    especialidad: profile.especialidad || "",
    horario_atencion: profile.horario_atencion || "",
    certificaciones: profile.certificaciones || [],
    materiales_aceptados: profile.materiales_aceptados || [],
    foto_perfil: profile.foto_perfil || "",
    redes_sociales: profile.redes_sociales || {},
    intereses_reciclaje: profile.intereses_reciclaje || [],
    nivel_experiencia: profile.nivel_experiencia || "",
    biografia: profile.biografia || "",
    educacion: profile.educacion || "",
    // Manejar ambas posibilidades: con y sin tilde
    anos_experiencia: profile.anos_experiencia || profile["años_experiencia"] || 0,
    areas_servicio: profile.areas_servicio || [],
  })

  const [newCertificacion, setNewCertificacion] = useState("")
  const [newMaterial, setNewMaterial] = useState("")
  const [newInteres, setNewInteres] = useState("")
  const [newArea, setNewArea] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("informacion")
  const router = useRouter()

  // Asegurarse de que los arrays estén inicializados
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      certificaciones: prev.certificaciones || [],
      materiales_aceptados: prev.materiales_aceptados || [],
      intereses_reciclaje: prev.intereses_reciclaje || [],
      areas_servicio: prev.areas_servicio || [],
      redes_sociales: prev.redes_sociales || {},
    }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCertificacion = () => {
    if (newCertificacion.trim()) {
      setFormData((prev) => ({
        ...prev,
        certificaciones: [...(prev.certificaciones || []), newCertificacion.trim()],
      }))
      setNewCertificacion("")
    }
  }

  const handleRemoveCertificacion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certificaciones: prev.certificaciones.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setFormData((prev) => ({
        ...prev,
        materiales_aceptados: [...(prev.materiales_aceptados || []), newMaterial.trim()],
      }))
      setNewMaterial("")
    }
  }

  const handleRemoveMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materiales_aceptados: prev.materiales_aceptados.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleAddInteres = () => {
    if (newInteres.trim()) {
      setFormData((prev) => ({
        ...prev,
        intereses_reciclaje: [...(prev.intereses_reciclaje || []), newInteres.trim()],
      }))
      setNewInteres("")
    }
  }

  const handleRemoveInteres = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      intereses_reciclaje: prev.intereses_reciclaje.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleAddArea = () => {
    if (newArea.trim()) {
      setFormData((prev) => ({
        ...prev,
        areas_servicio: [...(prev.areas_servicio || []), newArea.trim()],
      }))
      setNewArea("")
    }
  }

  const handleRemoveArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      areas_servicio: prev.areas_servicio.filter((_: any, i: number) => i !== index),
    }))
  }

  const handlePictureUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      foto_perfil: url,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSaving(true)

    try {
      console.log("Enviando datos:", formData)

      // Asegurarse de que los arrays estén inicializados
      const dataToSend = {
        ...formData,
        certificaciones: formData.certificaciones || [],
        materiales_aceptados: formData.materiales_aceptados || [],
        intereses_reciclaje: formData.intereses_reciclaje || [],
        areas_servicio: formData.areas_servicio || [],
        redes_sociales: formData.redes_sociales || {},
      }

      const { success, error, omittedFields } = await updateUserProfile(profile.id, dataToSend)

      if (!success) {
        throw new Error(error || "Error al actualizar el perfil")
      }

      // Mensaje de éxito personalizado si hay campos omitidos
      if (omittedFields && omittedFields.length > 0) {
        setSuccess(
          "Perfil actualizado correctamente. Algunos campos avanzados no pudieron guardarse debido a limitaciones de la base de datos.",
        )
      } else {
        setSuccess("Perfil actualizado correctamente")
      }

      // Esperar un momento antes de cerrar el formulario y recargar la página
      setTimeout(() => {
        // Redirigir a la URL especificada o a la página del perfil
        if (redirectUrl) {
          // Usar router.refresh() para asegurar que los datos se recargan
          router.refresh()
          router.push(redirectUrl)
        } else {
          // Forzar una recarga completa para evitar problemas de caché
          window.location.href = `/mi-perfil?t=${Date.now()}`
        }
      }, 1500)
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error)

      // Mensaje de error más amigable para el usuario
      let errorMessage = "Error al actualizar el perfil"

      if (error.message) {
        if (error.message.includes("column")) {
          errorMessage =
            "Se guardó la información básica, pero algunos campos avanzados no pudieron guardarse. Por favor, contacta al administrador."
        } else {
          errorMessage = error.message
        }
      }

      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Editar Perfil</CardTitle>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center mt-2">
            <div className="relative">
              <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-background bg-muted">
                {formData.foto_perfil ? (
                  <Image
                    src={formData.foto_perfil || "/placeholder.svg"}
                    alt={formData.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-green-100">
                    <span className="text-2xl font-bold text-green-600">
                      {formData.nombre?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 right-0">
                <ProfilePictureUpload
                  userId={profile.id}
                  currentImageUrl={formData.foto_perfil}
                  onUploadComplete={handlePictureUpload}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-600 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="informacion">Información</TabsTrigger>
              {userType === "reciclador" && <TabsTrigger value="reciclador">Reciclador</TabsTrigger>}
              {userType === "empresa" && <TabsTrigger value="empresa">Empresa</TabsTrigger>}
              {userType === "persona-natural" && <TabsTrigger value="intereses">Intereses</TabsTrigger>}
            </TabsList>

            <TabsContent value="informacion" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre completo"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder={
                    userType === "persona-natural"
                      ? "Cuéntanos sobre ti y tus intereses en reciclaje..."
                      : userType === "reciclador"
                        ? "Describe tu experiencia y servicios como reciclador..."
                        : "Describe tu empresa y los servicios que ofreces..."
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: +57 300 123 4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Ej: Bogotá"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Calle 123 #45-67, Barrio"
                />
              </div>
            </TabsContent>

            {userType === "reciclador" && (
              <TabsContent value="reciclador" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad</Label>
                    <Input
                      id="especialidad"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      placeholder="Ej: Plásticos y metales"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horario_atencion">Horario de atención</Label>
                    <Input
                      id="horario_atencion"
                      name="horario_atencion"
                      value={formData.horario_atencion}
                      onChange={handleChange}
                      placeholder="Ej: Lunes a Viernes de 8am a 5pm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nivel_experiencia">Nivel de experiencia</Label>
                    <select
                      id="nivel_experiencia"
                      name="nivel_experiencia"
                      value={formData.nivel_experiencia}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="">Selecciona un nivel</option>
                      <option value="Principiante">Principiante</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                      <option value="Experto">Experto</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anos_experiencia">Años de experiencia</Label>
                    <Input
                      id="anos_experiencia"
                      name="anos_experiencia"
                      type="number"
                      value={formData.anos_experiencia}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Áreas de servicio</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.areas_servicio &&
                      formData.areas_servicio.map((area: string, index: number) => (
                        <Badge key={index} className="bg-green-100 text-green-800">
                          {area}
                          <button
                            type="button"
                            onClick={() => handleRemoveArea(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      placeholder="Añadir área (Ej: Chapinero)"
                    />
                    <Button type="button" variant="outline" onClick={handleAddArea}>
                      Añadir
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educacion">Educación/Formación</Label>
                  <Textarea
                    id="educacion"
                    name="educacion"
                    value={formData.educacion}
                    onChange={handleChange}
                    placeholder="Comparte tu formación en temas de reciclaje y medio ambiente..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Certificaciones */}
                <div className="space-y-2">
                  <Label>Certificaciones</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.certificaciones &&
                      formData.certificaciones.map((cert: string, index: number) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {cert}
                          <button
                            type="button"
                            onClick={() => handleRemoveCertificacion(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newCertificacion}
                      onChange={(e) => setNewCertificacion(e.target.value)}
                      placeholder="Añadir certificación"
                    />
                    <Button type="button" variant="outline" onClick={handleAddCertificacion}>
                      Añadir
                    </Button>
                  </div>
                </div>

                {/* Materiales aceptados */}
                <div className="space-y-2">
                  <Label>Materiales que acepta</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.materiales_aceptados &&
                      formData.materiales_aceptados.map((material: string, index: number) => (
                        <Badge key={index} className="bg-green-100 text-green-800">
                          {material}
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      placeholder="Añadir material"
                    />
                    <Button type="button" variant="outline" onClick={handleAddMaterial}>
                      Añadir
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}

            {userType === "empresa" && (
              <TabsContent value="empresa" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="sitio_web">Sitio web</Label>
                  <Input
                    id="sitio_web"
                    name="sitio_web"
                    value={formData.sitio_web}
                    onChange={handleChange}
                    placeholder="Ej: https://miempresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horario_atencion">Horario de atención</Label>
                  <Input
                    id="horario_atencion"
                    name="horario_atencion"
                    value={formData.horario_atencion}
                    onChange={handleChange}
                    placeholder="Ej: Lunes a Viernes de 8am a 5pm"
                  />
                </div>

                {/* Certificaciones */}
                <div className="space-y-2">
                  <Label>Certificaciones</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.certificaciones &&
                      formData.certificaciones.map((cert: string, index: number) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {cert}
                          <button
                            type="button"
                            onClick={() => handleRemoveCertificacion(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newCertificacion}
                      onChange={(e) => setNewCertificacion(e.target.value)}
                      placeholder="Añadir certificación"
                    />
                    <Button type="button" variant="outline" onClick={handleAddCertificacion}>
                      Añadir
                    </Button>
                  </div>
                </div>

                {/* Materiales que compra */}
                <div className="space-y-2">
                  <Label>Materiales que compra</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.materiales_aceptados &&
                      formData.materiales_aceptados.map((material: string, index: number) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800">
                          {material}
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      placeholder="Añadir material"
                    />
                    <Button type="button" variant="outline" onClick={handleAddMaterial}>
                      Añadir
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Redes sociales</h3>
                  <div className="space-y-2">
                    <Label htmlFor="redes_sociales_facebook">Facebook</Label>
                    <Input
                      id="redes_sociales_facebook"
                      name="redes_sociales_facebook"
                      value={formData.redes_sociales?.facebook || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          redes_sociales: {
                            ...formData.redes_sociales,
                            facebook: e.target.value,
                          },
                        })
                      }}
                      placeholder="URL de Facebook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="redes_sociales_instagram">Instagram</Label>
                    <Input
                      id="redes_sociales_instagram"
                      name="redes_sociales_instagram"
                      value={formData.redes_sociales?.instagram || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          redes_sociales: {
                            ...formData.redes_sociales,
                            instagram: e.target.value,
                          },
                        })
                      }}
                      placeholder="URL de Instagram"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="redes_sociales_linkedin">LinkedIn</Label>
                    <Input
                      id="redes_sociales_linkedin"
                      name="redes_sociales_linkedin"
                      value={formData.redes_sociales?.linkedin || ""}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          redes_sociales: {
                            ...formData.redes_sociales,
                            linkedin: e.target.value,
                          },
                        })
                      }}
                      placeholder="URL de LinkedIn"
                    />
                  </div>
                </div>
              </TabsContent>
            )}

            {userType === "persona-natural" && (
              <TabsContent value="intereses" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Intereses de reciclaje</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.intereses_reciclaje &&
                      formData.intereses_reciclaje.map((interes: string, index: number) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800">
                          {interes}
                          <button
                            type="button"
                            onClick={() => handleRemoveInteres(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newInteres}
                      onChange={(e) => setNewInteres(e.target.value)}
                      placeholder="Añadir interés (Ej: Compostaje)"
                    />
                    <Button type="button" variant="outline" onClick={handleAddInteres}>
                      Añadir
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biografia">Biografía</Label>
                  <Textarea
                    id="biografia"
                    name="biografia"
                    value={formData.biografia}
                    onChange={handleChange}
                    placeholder="Comparte un poco sobre ti y tus motivaciones para reciclar..."
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
