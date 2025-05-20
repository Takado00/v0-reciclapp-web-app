import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MaterialDetailLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <Link href="/materiales" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a materiales
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Imágenes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-muted rounded-lg animate-pulse" />

            <div className="grid grid-cols-4 gap-2">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-md animate-pulse" />
                ))}
            </div>
          </div>

          {/* Columna derecha: Información */}
          <div className="space-y-6">
            <div>
              <div className="h-6 bg-muted rounded animate-pulse w-1/4 mb-2" />
              <div className="h-8 bg-muted rounded animate-pulse w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6 mt-1" />
            </div>

            {/* Detalles del material */}
            <div className="border rounded-lg p-6 space-y-4">
              <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2 mb-1" />
                  <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                </div>
                <div>
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2 mb-1" />
                  <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                </div>
                <div>
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2 mb-1" />
                  <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                </div>
                <div>
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2 mb-1" />
                  <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </div>
            </div>

            {/* Impacto ambiental */}
            <div className="border rounded-lg p-6">
              <div className="h-6 bg-muted rounded animate-pulse w-1/2 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-muted rounded-lg p-3 animate-pulse">
                      <div className="h-6 bg-muted/50 rounded animate-pulse w-1/2 mx-auto mb-1" />
                      <div className="h-3 bg-muted/50 rounded animate-pulse w-3/4 mx-auto" />
                    </div>
                  ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Información educativa */}
        <div className="mt-8">
          <div className="border rounded-lg p-6">
            <div className="h-6 bg-muted rounded animate-pulse w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse w-5/6 mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse w-4/5 mb-6" />

            <div className="h-1 bg-muted rounded animate-pulse my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="h-6 bg-muted rounded animate-pulse w-1/2 mb-3" />
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded animate-pulse w-11/12 mb-2" />
                  ))}
              </div>

              <div>
                <div className="h-6 bg-muted rounded animate-pulse w-1/2 mb-3" />
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded animate-pulse w-11/12 mb-2" />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
