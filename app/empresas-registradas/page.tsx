import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function EmpresasRegistradasPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/mensajes">
          <Button variant="ghost" size="icon" className="mr-1" aria-label="Volver atrás">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Empresas Registradas</h1>
      </div>

      <Suspense fallback={<div className="text-center py-10">Cargando empresas...</div>}>
        <EmpresasList />
      </Suspense>
    </div>
  )
}

async function EmpresasList() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  try {
    // Enfoque 1: Intentar obtener todos los usuarios y filtrar por tipo
    const { data: allUsers, error: usersError } = await supabase.from("usuarios").select("*").limit(100)

    if (usersError) {
      console.error("Error al obtener usuarios:", usersError)

      // Enfoque 2: Intentar con una consulta más específica
      try {
        const { data: empresas, error: empresasError } = await supabase
          .from("usuarios")
          .select("id, nombre")
          .eq("tipo_usuario", "empresa")
          .limit(100)

        if (empresasError) {
          console.error("Error al obtener empresas con tipo_usuario:", empresasError)

          // Enfoque 3: Intentar con otra posible columna
          try {
            const { data: empresasAlt, error: empresasAltError } = await supabase
              .from("usuarios")
              .select("id, nombre")
              .eq("role", "empresa")
              .limit(100)

            if (empresasAltError) {
              console.error("Error al obtener empresas con role:", empresasAltError)
              return (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-600 mb-4">
                    No se pudieron cargar las empresas. Por favor, intenta de nuevo más tarde.
                  </p>
                </div>
              )
            }

            return renderEmpresas(empresasAlt || [])
          } catch (error) {
            console.error("Error en enfoque 3:", error)
            return (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600 mb-4">
                  Error al cargar las empresas. Por favor, intenta de nuevo más tarde.
                </p>
              </div>
            )
          }
        }

        return renderEmpresas(empresas || [])
      } catch (error) {
        console.error("Error en enfoque 2:", error)
        return (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600 mb-4">
              Error al cargar las empresas. Por favor, intenta de nuevo más tarde.
            </p>
          </div>
        )
      }
    }

    // Si tenemos usuarios, intentemos identificar empresas basándonos en patrones en los datos
    if (allUsers && allUsers.length > 0) {
      // Veamos qué columnas tenemos disponibles
      const sampleUser = allUsers[0]
      const availableColumns = Object.keys(sampleUser)
      console.log("Columnas disponibles:", availableColumns)

      // Determinar qué columna podría indicar el tipo de usuario
      let empresas = []

      if (availableColumns.includes("tipo_usuario")) {
        empresas = allUsers.filter((user) => user.tipo_usuario === "empresa")
      } else if (availableColumns.includes("role")) {
        empresas = allUsers.filter((user) => user.role === "empresa")
      } else if (availableColumns.includes("roles")) {
        empresas = allUsers.filter((user) => user.roles === "empresa")
      } else if (availableColumns.includes("tipo")) {
        empresas = allUsers.filter((user) => user.tipo === "empresa")
      } else {
        // Si no encontramos una columna específica, usemos heurísticas basadas en el nombre
        empresas = allUsers.filter((user) => {
          return (
            user.nombre &&
            (user.nombre.toLowerCase().includes("s.a.") ||
              user.nombre.toLowerCase().includes("ltda") ||
              user.nombre.toLowerCase().includes("s.a.s") ||
              user.nombre.toLowerCase().includes("inc") ||
              user.nombre.toLowerCase().includes("company") ||
              user.nombre.toLowerCase().includes("empresa"))
          )
        })
      }

      return renderEmpresas(empresas)
    }

    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600 mb-4">No se pudieron identificar empresas en el sistema.</p>
      </div>
    )
  } catch (error) {
    console.error("Error general:", error)
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600 mb-4">
          Error al cargar las empresas. Por favor, intenta de nuevo más tarde.
        </p>
      </div>
    )
  }
}

function renderEmpresas(empresas: any[]) {
  if (!empresas || empresas.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600 mb-4">No hay empresas registradas en este momento.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {empresas.map((empresa) => (
        <Card key={empresa.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 bg-blue-100">
                <AvatarFallback>
                  <Building className="h-6 w-6 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{empresa.nombre || "Empresa"}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mt-2">
              <Link href={`/perfil/${empresa.id}`}>
                <Button variant="outline" size="sm">
                  Ver perfil
                </Button>
              </Link>
              <Link href={`/mensajes/contactar?destinatario=${empresa.id}`}>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Contactar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
