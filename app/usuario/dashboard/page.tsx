import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Package, MessageSquare, User, Map, BookOpen, Settings, Home } from "lucide-react"

export default async function UsuarioDashboardPage() {
  const supabase = createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/usuario/dashboard")
  }

  // Verificar si el usuario tiene el rol correcto
  const { data: profile } = await supabase.from("usuarios").select("roles(nombre)").eq("id", user.id).single()

  if (!profile || (profile.roles?.nombre !== "usuario" && profile.roles?.nombre !== "persona-natural")) {
    redirect("/")
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Panel de Usuario</h1>
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
              <CardDescription>Explora materiales reciclables disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Encuentra materiales reciclables cerca de ti, filtra por categoría y contacta con recicladores.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-green-600">
                Ver materiales
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/mensajes" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Mensajes</span>
              </CardTitle>
              <CardDescription>Comunícate con recicladores y empresas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Chatea con recicladores y empresas para coordinar la entrega de materiales o resolver dudas.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-blue-600">
                Ver mensajes
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/mi-perfil" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                <span>Mi Perfil</span>
              </CardTitle>
              <CardDescription>Gestiona tu información personal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Actualiza tu información personal, foto de perfil y preferencias de reciclaje.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-purple-600">
                Ver perfil
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/ubicaciones" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-red-600" />
                <span>Ubicaciones</span>
              </CardTitle>
              <CardDescription>Encuentra puntos de reciclaje</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Localiza puntos de reciclaje, centros de acopio y empresas recicladoras cerca de ti.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-red-600">
                Ver ubicaciones
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/como-reciclar" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                <span>Cómo Reciclar</span>
              </CardTitle>
              <CardDescription>Aprende sobre reciclaje</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Guías, consejos y mejores prácticas para reciclar correctamente diferentes materiales.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-amber-600">
                Ver guías
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/perfil/editar" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Configuración</span>
              </CardTitle>
              <CardDescription>Ajusta tus preferencias</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Configura notificaciones, privacidad y otras preferencias de tu cuenta.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-start text-gray-600">
                Configurar
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </DashboardLayout>
  )
}
