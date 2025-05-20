"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function MaterialDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error en la página de detalle de material:", error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al cargar el material</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Lo sentimos, ha ocurrido un error al cargar la información del material. Por favor, inténtalo de nuevo más
            tarde.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="bg-green-600 hover:bg-green-700">
              Intentar de nuevo
            </Button>
            <Link href="/materiales">
              <Button variant="outline">Volver a materiales</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
