import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function MaterialsPreview() {
  const materials = [
    {
      id: 1,
      name: "Papel y Cartón",
      description: "Cajas, periódicos y revistas en buen estado",
      image: "/placeholder.svg?height=200&width=300",
      category: "Papel",
      rating: 4.5,
      location: "Chapinero, Bogotá",
    },
    {
      id: 2,
      name: "Botellas PET",
      description: "Botellas de plástico limpias y sin etiquetas",
      image: "/placeholder.svg?height=200&width=300",
      category: "Plástico",
      rating: 5,
      location: "Suba, Bogotá",
    },
    {
      id: 3,
      name: "Vidrio Transparente",
      description: "Botellas y frascos de vidrio sin tapas",
      image: "/placeholder.svg?height=200&width=300",
      category: "Vidrio",
      rating: 4,
      location: "Kennedy, Bogotá",
    },
    {
      id: 4,
      name: "Aluminio",
      description: "Latas de bebidas limpias y aplastadas",
      image: "/placeholder.svg?height=200&width=300",
      category: "Metal",
      rating: 4.8,
      location: "Usaquén, Bogotá",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Materiales Destacados</h2>
            <p className="text-muted-foreground mt-2">
              Explora algunos de los materiales reciclables disponibles en nuestra plataforma.
            </p>
          </div>
          <Link href="/materiales" className="mt-4 md:mt-0">
            <Button>Ver Todos los Materiales</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((material) => (
            <Card key={material.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image src={material.image || "/placeholder.svg"} alt={material.name} fill className="object-cover" />
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {material.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">{material.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{material.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{material.location}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/materiales/${material.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Ver Detalles
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
