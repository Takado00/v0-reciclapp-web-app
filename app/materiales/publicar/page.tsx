import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Camera, Info, Plus, Upload } from "lucide-react"
import { getMateriales, crearPublicacion } from "@/lib/actions/material-actions"
import { getUbicaciones } from "@/lib/actions/ubicacion-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default async function PublicarMaterialPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirigir si no hay usuario autenticado
  if (!user) {
    redirect("/login?redirect=/materiales/publicar")
  }

  // Obtener lista de materiales y ubicaciones para los selectores
  const materiales = await getMateriales()
  const ubicaciones = await getUbicaciones()

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/materiales">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Publicar Material</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Información del Material</CardTitle>
          <CardDescription>
            Completa el formulario para publicar un material reciclable que quieras ofrecer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="detalles" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="detalles">Detalles Básicos</TabsTrigger>
              <TabsTrigger value="fotos">Fotos</TabsTrigger>
              <TabsTrigger value="adicional">Información Adicional</TabsTrigger>
            </TabsList>

            <form action={crearPublicacion} className="space-y-6">
              <TabsContent value="detalles" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título de la publicación</Label>
                      <Input id="titulo" name="titulo" placeholder="Ej: Botellas PET limpias" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        name="descripcion"
                        placeholder="Describe el material, su estado, cantidad aproximada, etc."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="material_id">Tipo de Material</Label>
                      <Select name="material_id" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materiales.map((material) => (
                            <SelectItem key={material.id} value={material.id.toString()}>
                              {material.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ubicacion_id">Ubicación</Label>
                      <Select name="ubicacion_id">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          {ubicaciones.map((ubicacion) => (
                            <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                              {ubicacion.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cantidad">Cantidad</Label>
                      <Input
                        id="cantidad"
                        name="cantidad"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ej: 10"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unidad_medida">Unidad de Medida</Label>
                      <Select name="unidad_medida" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                          <SelectItem value="g">Gramos (g)</SelectItem>
                          <SelectItem value="unidad">Unidades</SelectItem>
                          <SelectItem value="litro">Litros</SelectItem>
                          <SelectItem value="m2">Metros cuadrados</SelectItem>
                          <SelectItem value="m3">Metros cúbicos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="precio">Precio (opcional)</Label>
                      <Input id="precio" name="precio" type="number" min="0" step="0.01" placeholder="Ej: 5.00" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fotos" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Foto Principal</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        name="foto_principal"
                        id="foto_principal"
                        className="hidden"
                        accept="image/*"
                      />
                      <label htmlFor="foto_principal" className="cursor-pointer">
                        <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Haz clic para subir una foto principal</p>
                        <p className="text-xs text-gray-400">PNG, JPG o WEBP (máx. 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Fotos Adicionales (máximo 4)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors cursor-pointer aspect-square flex flex-col items-center justify-center"
                        >
                          <input
                            type="file"
                            name={`foto_adicional_${index}`}
                            id={`foto_adicional_${index}`}
                            className="hidden"
                            accept="image/*"
                          />
                          <label
                            htmlFor={`foto_adicional_${index}`}
                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                          >
                            <Plus className="h-8 w-8 text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500">Foto {index}</p>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      <Info className="h-3 w-3 inline mr-1" />
                      Las fotos ayudan a los interesados a evaluar mejor el material
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imagen_url">URL de Imagen (alternativa)</Label>
                    <Input id="imagen_url" name="imagen_url" placeholder="https://ejemplo.com/imagen.jpg" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Si no puedes subir fotos, proporciona una URL de imagen que muestre el material.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adicional" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="condicion">Condición del Material</Label>
                    <RadioGroup defaultValue="bueno" name="condicion">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excelente" id="condicion-excelente" />
                          <Label htmlFor="condicion-excelente">Excelente - Como nuevo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bueno" id="condicion-bueno" />
                          <Label htmlFor="condicion-bueno">Bueno - Limpio y en buen estado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="regular" id="condicion-regular" />
                          <Label htmlFor="condicion-regular">Regular - Necesita algo de limpieza</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="por_clasificar" id="condicion-clasificar" />
                          <Label htmlFor="condicion-clasificar">Por clasificar - Mezclado con otros materiales</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="origen">Origen del Material</Label>
                    <Select name="origen">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el origen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="domestico">Doméstico - Hogar</SelectItem>
                        <SelectItem value="comercial">Comercial - Negocio</SelectItem>
                        <SelectItem value="industrial">Industrial - Fábrica</SelectItem>
                        <SelectItem value="construccion">Construcción - Obra</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comentarios_adicionales">Comentarios Adicionales</Label>
                    <Textarea
                      id="comentarios_adicionales"
                      name="comentarios_adicionales"
                      placeholder="Información adicional que pueda ser relevante para los interesados..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disponibilidad">Disponibilidad para Entrega/Recogida</Label>
                    <Textarea
                      id="disponibilidad"
                      name="disponibilidad"
                      placeholder="Ej: Disponible para entrega de lunes a viernes de 9am a 5pm..."
                      rows={2}
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <Info className="h-4 w-4 inline mr-1" />
                    Los campos marcados son obligatorios
                  </div>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Publicar Material
                  </Button>
                </div>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consejos para una buena publicación</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <div className="bg-green-100 rounded-full p-1 h-6 w-6 flex items-center justify-center text-green-800 flex-shrink-0">
                  1
                </div>
                <span>Incluye fotos claras y bien iluminadas del material para aumentar el interés.</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-green-100 rounded-full p-1 h-6 w-6 flex items-center justify-center text-green-800 flex-shrink-0">
                  2
                </div>
                <span>Proporciona detalles precisos sobre la cantidad, condición y origen del material.</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-green-100 rounded-full p-1 h-6 w-6 flex items-center justify-center text-green-800 flex-shrink-0">
                  3
                </div>
                <span>Menciona si el material está limpio, clasificado o necesita algún procesamiento adicional.</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-green-100 rounded-full p-1 h-6 w-6 flex items-center justify-center text-green-800 flex-shrink-0">
                  4
                </div>
                <span>Especifica tu disponibilidad para la entrega o recogida del material.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
