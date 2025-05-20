import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Pencil, Home, Menu, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Forzar que la página se regenere en cada solicitud
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function MiPerfilPage() {
  const supabase = createClient()

  // Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/mi-perfil")
  }

  // Obtener el perfil del usuario
  const { data: profile, error } = await supabase
    .from("usuarios")
    .select(`
      *,
      roles(nombre)
    `)
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    console.error("Error al obtener el perfil:", error)
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
        <p className="text-red-500">Error al cargar la información del perfil. Por favor, inténtalo de nuevo.</p>
      </div>
    )
  }

  // Obtener estadísticas del usuario según su rol
  const stats = await getUserStats(user.id, profile.roles?.nombre)

  return (
    <div className="container py-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
        </div>

        {/* Botones de navegación */}
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Button>
          </Link>

          <Link
            href={`/${profile.roles?.nombre === "reciclador" ? "reciclador" : profile.roles?.nombre === "empresa" ? "empresa" : "usuario"}/dashboard`}
          >
            <Button variant="default" size="sm" className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
              <Menu className="h-4 w-4" />
              <span>Menú Principal</span>
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profile.foto_perfil || ""} alt={profile.nombre} />
                <AvatarFallback className="text-2xl bg-green-100 text-green-800">
                  {profile.nombre?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Link href="/perfil/editar" className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
                <Pencil className="h-4 w-4" />
              </Link>
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold">{profile.nombre}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`
                  ${
                    profile.roles?.nombre === "reciclador"
                      ? "bg-green-100 text-green-800"
                      : profile.roles?.nombre === "empresa"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                  }
                `}
                >
                  {profile.roles?.nombre === "reciclador"
                    ? "Reciclador"
                    : profile.roles?.nombre === "empresa"
                      ? "Empresa"
                      : "Usuario"}
                </Badge>
                {profile.nivel_experiencia && <Badge variant="outline">{profile.nivel_experiencia}</Badge>}
              </div>
              <p className="text-muted-foreground mt-2">{profile.bio || profile.descripcion || "Sin descripción"}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                {profile.correo && (
                  <div className="text-sm">
                    <span className="block text-muted-foreground">Email</span>
                    <span>{profile.correo}</span>
                  </div>
                )}
                {profile.telefono && (
                  <div className="text-sm">
                    <span className="block text-muted-foreground">Teléfono</span>
                    <span>{profile.telefono}</span>
                  </div>
                )}
                {profile.ciudad && (
                  <div className="text-sm">
                    <span className="block text-muted-foreground">Ciudad</span>
                    <span>{profile.ciudad}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="info">{renderProfileContent(profile, stats)}</TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Aquí se mostrará tu actividad reciente en la plataforma.</p>
              {/* Aquí iría el componente de actividad reciente */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.materiales || 0}</p>
                  <p className="text-sm text-green-800">Materiales</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">{stats.valoracion || "0.0"}</p>
                  <p className="text-sm text-purple-800">Valoración</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Función para obtener estadísticas del usuario
async function getUserStats(userId: string, userRole?: string) {
  const supabase = createClient()

  // Estadísticas básicas
  const stats: any = {
    materiales: 0,
    transacciones: 0,
    valoracion: 0,
  }

  // Contar materiales publicados
  const { count: materialesCount } = await supabase
    .from("publicaciones")
    .select("*", { count: "exact", head: true })
    .eq("usuario_id", userId)

  stats.materiales = materialesCount || 0

  // Obtener valoración promedio
  if (userRole === "reciclador" || userRole === "empresa") {
    const { data: valoraciones } = await supabase.from("valoraciones").select("calificacion").eq("usuario_id", userId)

    if (valoraciones && valoraciones.length > 0) {
      const total = valoraciones.reduce((sum, val) => sum + val.calificacion, 0)
      stats.valoracion = (total / valoraciones.length).toFixed(1)
    }
  }

  // Estadísticas específicas por rol
  if (userRole === "reciclador") {
    // Contar clientes únicos
    const { data: clientes } = await supabase.from("transacciones").select("comprador_id").eq("vendedor_id", userId)

    if (clientes) {
      const clientesUnicos = new Set(clientes.map((c) => c.comprador_id))
      stats.clientes = clientesUnicos.size
    }
  } else if (userRole === "empresa") {
    // Contar proveedores únicos
    const { data: proveedores } = await supabase.from("transacciones").select("vendedor_id").eq("comprador_id", userId)

    if (proveedores) {
      const proveedoresUnicos = new Set(proveedores.map((p) => p.vendedor_id))
      stats.proveedores = proveedoresUnicos.size
    }
  }

  return stats
}

// Función para renderizar el contenido específico del perfil según el rol
function renderProfileContent(profile: any, stats: any) {
  const rolNombre = profile.roles?.nombre

  return (
    <div className="space-y-6">
      {rolNombre === "reciclador" && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Especialidad</h3>
          <p>{profile.especialidad || "No especificada"}</p>

          {profile.materiales_aceptados && profile.materiales_aceptados.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Materiales que acepta</h3>
              <div className="flex flex-wrap gap-2">
                {profile.materiales_aceptados.map((material: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {rolNombre === "empresa" && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Información de la empresa</h3>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <span className="text-sm text-gray-500">Sitio web:</span>
              <p>{profile.sitio_web || "No especificado"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Dirección:</span>
              <p>{profile.direccion || "No especificada"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Ciudad:</span>
              <p>{profile.ciudad || "No especificada"}</p>
            </div>
          </div>

          {profile.materiales_aceptados && profile.materiales_aceptados.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Materiales que compra</h3>
              <div className="flex flex-wrap gap-2">
                {profile.materiales_aceptados.map((material: string, index: number) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(rolNombre === "persona-natural" || rolNombre === "usuario") && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Información personal</h3>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <span className="text-sm text-gray-500">Ciudad:</span>
              <p>{profile.ciudad || "No especificada"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Miembro desde:</span>
              <p>{new Date(profile.fecha_registro).toLocaleDateString()}</p>
            </div>
          </div>

          {profile.intereses_reciclaje && profile.intereses_reciclaje.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Intereses de reciclaje</h3>
              <div className="flex flex-wrap gap-2">
                {profile.intereses_reciclaje.map((interes: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {interes}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.biografia && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Biografía</h3>
              <p className="text-sm">{profile.biografia}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
