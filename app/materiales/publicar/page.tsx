import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getMateriales } from "@/lib/actions/material-actions"
import { getUbicaciones } from "@/lib/actions/ubicacion-actions"
import { PublicarMaterialForm } from "@/components/publicar-material-form"

export default async function PublicarMaterialPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si no hay usuario autenticado, mostrar mensaje de inicio de sesión
  if (!user) {
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
            <CardTitle>Inicia sesión para publicar</CardTitle>
            <CardDescription>Necesitas iniciar sesión para poder publicar materiales reciclables.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-6">
              <Link href={`/login?redirect=/materiales/publicar`}>
                <Button className="bg-green-600 hover:bg-green-700">Iniciar sesión</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Obtener lista de materiales y ubicaciones para los selectores
  let materiales = []
  let ubicaciones = []

  try {
    materiales = await getMateriales()
    ubicaciones = await getUbicaciones()
  } catch (error) {
    console.error("Error al cargar datos:", error)
    // Continuar con arrays vacíos en caso de error
  }

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

      <PublicarMaterialForm materiales={materiales} ubicaciones={ubicaciones} />

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
