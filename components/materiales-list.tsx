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
        return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgwQZgGwRo8YJFY0LZrxqLBcIO8OKZ5HJh-Yd9Hl9y4XZV9LFYfXwwKbMvhBL_MPYtPLfEYDgMXQfL5aBYQP-_OwXfmGRXwdcBwZ_xQEZqP9Hl5jJJZEYmhbA/s16000/periodicos-reciclaje.jpg"
      }
      return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgPdZBXMYwkrHRhCt9Vd5LnFKgHU9H-Iy9PLXGkWQNmGBMg9Xk8zWX_SiJzVpJLYFLO-cD-_qYfpQXtD_cNWNlNvyJHjA5Ry8wqrXtXdlMcRGwqJbmXQJnXdA/s16000/carton-reciclaje.jpg"
    }

    // Categoría Plástico
    else if (categoriaLower.includes("plástico") || categoriaLower.includes("plastico")) {
      if (nombreLower.includes("pet") || nombreLower.includes("botella")) {
        return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjMQTQDQu_QEQhK7h6jYqLKzGxYLJSAlPHGXmhkf9Jk8ZQwQWsF-8jlGGnzA_ELKgcv9fHQIJ9RlYKSuB9vLYQnYRwvdcCZA9VjLmQnpQXtD_cNWNlNvyJHjA/s16000/botellas-pet.jpg"
      }
      return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgXJQXtD_cNWNlNvyJHjA5Ry8wqrXtXdlMcRGwqJbmXQJnXdAZBXMYwkrHRhCt9Vd5LnFKgHU9H-Iy9PLXGkWQNmGBMg9Xk8zWX_SiJzVpJLYFLO/s16000/plasticos-reciclaje.jpg"
    }

    // Categoría Vidrio
    else if (categoriaLower.includes("vidrio")) {
      return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvw8Hqjr-5v_N-pH6LXOHDiHSPzETQtgI74M0T5vNzB1lsfbJYN4kXCzo-WIbhoXUB_A9DUrcUH6N7UmPXC433xlZA-YXF2MaYRtR8RfT/s16000/vidrio-reciclaje.jpg"
    }

    // Categoría Metal/Aluminio
    else if (categoriaLower.includes("metal") || categoriaLower.includes("aluminio")) {
      if (nombreLower.includes("lata") || nombreLower.includes("aluminio") || nombreLower.includes("latas")) {
        return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPC-WIbhoXUB_A9DUrcUH6N7UmPXC433xlZA-YXF2MaYRtR8RfT-UUQbBP_52OTVHezB4pavp2ocZe6to9eAHvw8Hqjr-5v_N-pH6LXOHDiHSPzETQtgI74M0T5vNzB1lsfbJYN4kXCzo/s16000-rw/lata.jpg"
      }
      return "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Orgánico
    else if (categoriaLower.includes("orgánico") || categoriaLower.includes("organico")) {
      return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQEZqP9Hl5jJJZEYmhbAGwRo8YJFY0LZrxqLBcIO8OKZ5HJh-Yd9Hl9y4XZV9LFYfXwwKbMvhBL_MPYtPLfEYDgMXQfL5aBYQP-_O/s16000/organico-reciclaje.jpg"
    }

    // Categoría Electrónico
    else if (categoriaLower.includes("electrónico") || categoriaLower.includes("electronico")) {
      return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjdcCZA9VjLmQnpQXtD_cNWNlNvyJHjA5Ry8wqrXtXdlMcRGwqJbmXQJnXdAZBXMYwkrHRhCt9Vd5LnFKgHU9H-Iy9PLXGkWQNmGBMg9Xk8zWX_SiJzVpJLYFLO/s16000/electronicos-reciclaje.jpg"
    }

    // Categoría Textil
    else if (categoriaLower.includes("textil") || nombreLower.includes("ropa") || nombreLower.includes("tela")) {
      return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMQTQDQu_QEQhK7h6jYqLKzGxYLJSAlPHGXmhkf9Jk8ZQwQWsF-8jlGGnzA_ELKgcv9fHQIJ9RlYKSuB9vLYQnYRwv/s16000/textil-reciclaje.jpg"
    }

    // Categoría por defecto
    else {
      return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_OwXfmGRXwdcBwZ_xQEZqP9Hl5jJJZEYmhbAGwRo8YJFY0LZrxqLBcIO8OKZ5HJh-Yd9Hl9y4XZV9LFYfXwwKbMvhBL_MPYtPLfEYDgMXQfL5aBYQP/s16000/reciclaje-general.jpg"
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
