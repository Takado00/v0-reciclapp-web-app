import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Package, MessageSquare, User, BarChart, Plus, Home, Users } from "lucide-react"

export default async function EmpresaDashboardPage() {
  const supabase = createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/empresa/dashboard")
  }

  // Verificar si el usuario tiene el rol correcto
  const { data: profile } = await supabase.from("usuarios").select("roles(nombre)").eq("id", user.id).single()

  if (!profile || profile.roles?.nombre !== "empresa") {
    redirect("/")
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Panel de Empresa</h1>
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>Volver al Inicio</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/materiales" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <span>Materiales</span>
              </CardTitle>
              <CardDescription>Explora materiales disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Encuentra materiales reciclables disponibles para procesar.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-green-600">
                Ver materiales
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/materiales/solicitar" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                <span>Solicitar Material</span>
              </CardTitle>
              <CardDescription>Publica solicitudes de materiales</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Publica los materiales que necesitas para que recicladores y usuarios te contacten.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-blue-600">
                Solicitar
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/mensajes" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span>Mensajes</span>
              </CardTitle>
              <CardDescription>Comunícate con proveedores</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Gestiona tus conversaciones con recicladores y usuarios que ofrecen materiales.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-purple-600">
                Ver mensajes
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/mi-perfil" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-red-600" />
                <span>Mi Perfil</span>
              </CardTitle>
              <CardDescription>Gestiona tu información</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Actualiza la información de tu empresa, materiales que procesas y datos de contacto.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-red-600">
                Ver perfil
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/empresa/proveedores" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                <span>Proveedores</span>
              </CardTitle>
              <CardDescription>Gestiona tus proveedores</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Visualiza y gestiona tus proveedores de materiales reciclables.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-amber-600">
                Ver proveedores
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/empresa/estadisticas" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-green-600" />
                <span>Estadísticas</span>
              </CardTitle>
              <CardDescription>Analiza tu actividad</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Visualiza estadísticas de tus proveedores y materiales procesados.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-green-600">
                Ver estadísticas
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </DashboardLayout>
  )
}
