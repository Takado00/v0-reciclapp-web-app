import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { MaterialesList } from "@/components/materiales-list"
import { MaterialesFilter } from "@/components/materiales-filter"

export default async function MaterialesPage({
  searchParams,
}: {
  searchParams: { categoria?: string; busqueda?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Materiales reciclables</h1>
        </div>

        {user && (
          <Link href="/materiales/publicar">
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Publicar Material</span>
              <span className="sm:hidden">Publicar</span>
            </Button>
          </Link>
        )}
      </div>

      <MaterialesFilter
        categoriaActual={searchParams.categoria || "todas"}
        busquedaActual={searchParams.busqueda || ""}
      />

      <Suspense fallback={<MaterialesListSkeleton />}>
        <MaterialesListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

function MaterialesListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div className="aspect-video bg-muted animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              <div className="h-10 bg-muted rounded animate-pulse mt-4" />
            </div>
          </div>
        ))}
    </div>
  )
}

async function MaterialesListWrapper({
  searchParams,
}: {
  searchParams: { categoria?: string; busqueda?: string }
}) {
  const supabase = createClient()

  try {
    // Construir la consulta base
    let query = supabase.from("materiales").select("*")

    // Aplicar filtro por categoría si existe
    if (searchParams.categoria && searchParams.categoria !== "todas") {
      query = query.eq("categoria", searchParams.categoria)
    }

    // Aplicar filtro por búsqueda si existe
    if (searchParams.busqueda) {
      query = query.or(`nombre.ilike.%${searchParams.busqueda}%,descripcion.ilike.%${searchParams.busqueda}%`)
    }

    // Ejecutar la consulta
    const { data: materiales, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error al cargar materiales:", error)
      return (
        <div className="py-12 text-center">
          <p className="text-red-500">Error al cargar los materiales. Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      )
    }

    return <MaterialesList materiales={materiales || []} />
  } catch (error) {
    console.error("Error inesperado:", error)
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Error al cargar los materiales. Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    )
  }
}
