import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { getMateriales, crearPublicacion } from "@/lib/actions/material-actions"
import { getUbicaciones } from "@/lib/actions/ubicacion-actions"

export default async function PublicarMaterialPage() {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Obtener lista de materiales y ubicaciones para los selectores
    // Usamos Promise.all para ejecutar ambas consultas en paralelo
    const [materiales, ubicaciones] = await Promise.all([
      getMateriales().catch(() => []),
      getUbicaciones().catch(() => []),
    ])

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

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Información del Material</CardTitle>
            <CardDescription>
              Completa el formulario para publicar un material reciclable que quieras ofrecer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={crearPublicacion} className="space-y-6">
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
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select name="categoria" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="papel">Papel y Cartón</SelectItem>
                        <SelectItem value="plastico">Plástico</SelectItem>
                        <SelectItem value="vidrio">Vidrio</SelectItem>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="organico">Orgánico</SelectItem>
                        <SelectItem value="electronico">Electrónico</SelectItem>
                        <SelectItem value="textil">Textil</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <Input id="ubicacion" name="ubicacion" placeholder="Ej: Ciudad, Barrio" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imagen_url">URL de Imagen (opcional)</Label>
                  <Input id="imagen_url" name="imagen_url" placeholder="https://ejemplo.com/imagen.jpg" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Proporciona una URL de imagen que muestre el material que estás publicando.
                  </p>
                </div>
              </div>

              <input type="hidden" name="usuario_id" value={user?.id || ""} />

              <CardFooter className="px-0 pt-4">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Publicar Material
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error en la página de publicación:", error)
    // En lugar de redirigir, mostramos un mensaje de error
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

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error al cargar la página</CardTitle>
            <CardDescription>
              No se pudo cargar la página de publicación. Por favor, inicia sesión para publicar materiales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              <Link href="/login?redirect=/materiales/publicar">
                <Button>Iniciar sesión</Button>
              </Link>
              <Link href="/materiales">
                <Button variant="outline">Volver a materiales</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}
