"use client"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Material {
  id: number
  nombre: string
  descripcion: string | null
  categoria: string
  imagen_url: string | null
  precio_estimado: number | null
  unidad_medida: string | null
  cantidad: number | null
  condicion: string | null
  created_at: string | null
}

interface MaterialesListProps {
  materiales: Material[]
}

export function MaterialesList({ materiales }: MaterialesListProps) {
  const getDefaultImage = (categoria: string, nombre: string) => {
    const categoriaLower = categoria.toLowerCase()
    const nombreLower = nombre.toLowerCase()

    // Categoría Papel/Cartón
    if (categoriaLower.includes("papel") || categoriaLower.includes("cartón") || categoriaLower.includes("carton")) {
      if (nombreLower.includes("periódico") || nombreLower.includes("periodico") || nombreLower.includes("diario")) {
        return "https://images.unsplash.com/photo-1598618443855-232ee0f819f6?q=80&w=800&auto=format&fit=crop"
      }
      return "https://images.unsplash.com/photo-1607583444909-8cc42d46f7b2?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Plástico
    else if (categoriaLower.includes("plástico") || categoriaLower.includes("plastico")) {
      if (nombreLower.includes("pet") || nombreLower.includes("botella")) {
        return "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg"
      }
      return "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg"
    }

    // Categoría Vidrio
    else if (categoriaLower.includes("vidrio")) {
      return "https://sjc.microlink.io/EYGEMpkCnAldyf9_z_SqQ15uHSZA5wRzhQk5M4j_NLgvesoQJBqmquWn924vj_7MG-2OJj7g9O3M--vecOe0bg.jpeg"
    }

    // Categoría Metal/Aluminio
    else if (categoriaLower.includes("metal") || categoriaLower.includes("aluminio")) {
      if (nombreLower.includes("lata") || nombreLower.includes("aluminio") || nombreLower.includes("latas")) {
        return "https://logisticamuialpcsupv.wordpress.com/wp-content/uploads/2017/05/aluminum-can.jpg?w=432"
      }
      return "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Orgánico
    else if (categoriaLower.includes("orgánico") || categoriaLower.includes("organico")) {
      return "https://images.unsplash.com/photo-1591954746678-a253972b2177?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Electrónico
    else if (categoriaLower.includes("electrónico") || categoriaLower.includes("electronico")) {
      return "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Textil
    else if (categoriaLower.includes("textil") || nombreLower.includes("ropa") || nombreLower.includes("tela")) {
      return "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría por defecto
    else {
      return "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop"
    }
  }

  if (materiales.length === 0) {
    return (
      <div className="text-center py-12">
        <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No hay materiales disponibles</h3>
        <p className="text-muted-foreground mb-6">No se encontraron materiales reciclables en la base de datos.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {materiales.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron materiales que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materiales.map((material) => (
            <Card
              key={material.id}
              className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-green-200"
            >
              <div className="aspect-video relative overflow-hidden group">
                <Image
                  src={material.imagen_url || getDefaultImage(material.categoria, material.nombre)}
                  alt={material.nombre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white text-sm p-3 font-medium">{material.nombre}</p>
                </div>
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{material.nombre}</CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {material.categoria}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {material.descripcion || "Sin descripción"}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {material.cantidad && (
                    <div className="flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                      <span className="text-sm">
                        {material.cantidad} {material.unidad_medida}
                      </span>
                    </div>
                  )}
                </div>

                {material.condicion && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Estado: {material.condicion}
                    </Badge>
                  </div>
                )}

                {material.created_at && (
                  <div className="flex items-center mt-3">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">
                      Publicado: {new Date(material.created_at).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 mt-auto">
                <Link href={`/materiales/${material.id}`} className="w-full">
                  <Button
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 hover:translate-y-[-2px]"
                  >
                    Ver Detalles
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
