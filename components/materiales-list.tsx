"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Clock, Tag, Info } from "lucide-react"
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
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMateriales = materiales.filter(
    (material) =>
      material.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.descripcion && material.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      material.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para obtener una imagen predeterminada según la categoría y el nombre
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
        return "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=800&auto=format&fit=crop"
      }
      return "https://images.unsplash.com/photo-1571727153934-b9e0a8a8b1b1?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Vidrio
    else if (categoriaLower.includes("vidrio")) {
      return "https://images.unsplash.com/photo-1604349841434-d6e7837fc372?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Metal/Aluminio
    else if (categoriaLower.includes("metal") || categoriaLower.includes("aluminio")) {
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar materiales..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMateriales.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron materiales que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMateriales.map((material) => (
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
                  {material.precio_estimado && (
                    <div className="flex items-center">
                      <Tag className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                      <span className="text-sm font-medium">
                        ${material.precio_estimado}/{material.unidad_medida || "unidad"}
                      </span>
                    </div>
                  )}

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
