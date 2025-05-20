import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function MaterialNotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <Link href="/materiales" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a materiales
        </Link>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-6 mb-6">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Material no encontrado</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Lo sentimos, el material que estás buscando no existe o ha sido eliminado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/materiales">
              <Button className="bg-green-600 hover:bg-green-700">Ver todos los materiales</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
