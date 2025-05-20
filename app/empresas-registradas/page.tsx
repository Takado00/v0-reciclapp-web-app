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
    // Primero, intentemos obtener la estructura de la tabla para entender qué columnas existen
    const { data: tableInfo, error: tableError } = await supabase.rpc("get_table_columns", { table_name: "usuarios" })

    if (tableError) {
      console.error("Error al obtener estructura de tabla:", tableError)

      // Si no podemos obtener la estructura, intentemos una consulta básica sin filtros
      const { data: allUsers, error: usersError } = await supabase.from("usuarios").select("*").limit(50)

      if (usersError) {
        console.error("Error al obtener usuarios:", usersError)
        return (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600 mb-4">
              Error al cargar las empresas. Por favor, intenta de nuevo más tarde.
            </p>
          </div>
        )
      }

      // Si tenemos usuarios, intentemos identificar empresas basándonos en patrones en los datos
      if (allUsers && allUsers.length > 0) {
        // Veamos qué columnas tenemos disponibles
        const sampleUser = allUsers[0]
        console.log("Columnas disponibles:", Object.keys(sampleUser))

        // Intentemos identificar empresas basándonos en patrones en los datos
        // Por ejemplo, si hay una columna que podría indicar el tipo de usuario
        const possibleEmpresas = allUsers.filter((user) => {
          // Buscar en varias columnas posibles que podrían indicar que es una empresa
          return (
            (user.tipo_usuario && user.tipo_usuario.toLowerCase().includes("empresa")) ||
            (user.tipo && user.tipo.toLowerCase().includes("empresa")) ||
            (user.role && user.role.toLowerCase().includes("empresa")) ||
            (user.roles && user.roles.toLowerCase().includes("empresa")) ||
            (user.nombre &&
              (user.nombre.toLowerCase().includes("s.a.") ||
                user.nombre.toLowerCase().includes("ltda") ||
                user.nombre.toLowerCase().includes("s.a.s") ||
                user.nombre.toLowerCase().includes("inc") ||
                user.nombre.toLowerCase().includes("company") ||
                user.nombre.toLowerCase().includes("empresa")))
          )
        })

        return renderEmpresas(possibleEmpresas)
      }

      return (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-4">No se pudieron identificar empresas en el sistema.</p>
        </div>
      )
    }

    // Si tenemos la estructura de la tabla, usémosla para construir una consulta adecuada
    console.log("Columnas en la tabla usuarios:", tableInfo)

    // Determinar qué columnas existen y construir la consulta
    const columns = Array.isArray(tableInfo) ? tableInfo.map((col) => col.column_name) : []

    // Columnas básicas que queremos seleccionar si existen
    const selectColumns = ["id", "nombre"]
    const validSelectColumns = selectColumns.filter((col) => columns.includes(col))

    if (validSelectColumns.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-4">Error: No se encontraron columnas válidas en la tabla usuarios.</p>
        </div>
      )
    }

    // Determinar qué columna podría indicar el tipo de usuario
    let typeColumn = null
    let typeValue = null

    if (columns.includes("tipo_usuario")) {
      typeColumn = "tipo_usuario"
      typeValue = "empresa"
    } else if (columns.includes("role")) {
      typeColumn = "role"
      typeValue = "empresa"
    } else if (columns.includes("roles")) {
      typeColumn = "roles"
      typeValue = "empresa"
    } else if (columns.includes("tipo")) {
      typeColumn = "tipo"
      typeValue = "empresa"
    }

    let query = supabase.from("usuarios").select(validSelectColumns.join(", "))

    // Si encontramos una columna de tipo, filtrar por ella
    if (typeColumn && typeValue) {
      query = query.eq(typeColumn, typeValue)
    }

    const { data: empresas, error } = await query.order("nombre")

    if (error) {
      console.error("Error al cargar empresas:", error)
      return (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-4">
            Error al cargar las empresas. Por favor, intenta de nuevo más tarde.
          </p>
        </div>
      )
    }

    return renderEmpresas(empresas || [])
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
