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

    // Imágenes específicas basadas en el título
    if (nombreLower.includes("botella") || nombreLower.includes("pet")) {
      return "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg"
    } else if (nombreLower.includes("lata") || nombreLower.includes("aluminio")) {
      return "https://limpiezademalaga.es/wp-content/uploads/2022/04/Post-reciclar-metales-abril22-1-1024x769.jpg"
    } else if (
      nombreLower.includes("vidrio") ||
      nombreLower.includes("cristal") ||
      nombreLower.includes("botella de vidrio")
    ) {
      return "https://www.unicorsa.com/wp-content/uploads/2019/01/unicor-producto-envases-de-vidrio-1-400x400_c.jpg"
    } else if (nombreLower.includes("cartón") || nombreLower.includes("carton") || nombreLower.includes("caja")) {
      return "https://lcc.eco/wp-content/uploads/2024/11/Beneficios-de-reciclar-carton.webp"
    } else if (nombreLower.includes("papel") || nombreLower.includes("periódico") || nombreLower.includes("revista")) {
      return "https://th.bing.com/th/id/R.fa63d61675d85afb70b3f30a69463d67?rik=q7bC8FXKq91XKA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-fTB4dW7UeGg%2fTfp7R8ipmRI%2fAAAAAAAAAC8%2fNviFFkuPLYM%2fs1600%2fpapel20fotografico.jpg&ehk=ixrA86CzjrkEF6M9oafk6ruJ4ZOAb6Zp8Ttjh9%2bgo6Y%3d&risl=&pid=ImgRaw&r=0"
    } else if (
      nombreLower.includes("electrónico") ||
      nombreLower.includes("electronico") ||
      nombreLower.includes("computadora") ||
      nombreLower.includes("celular") ||
      nombreLower.includes("teléfono")
    ) {
      return "https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2024/02/startup-gana-80000-euros-mes-extrayendo-oro-cobre-dispositivos-tiramos-basura-3270798.jpg?tf=1200x675"
    } else if (nombreLower.includes("ropa") || nombreLower.includes("textil") || nombreLower.includes("tela")) {
      return "https://www.canecas.com.co/images/NOTICIAS_2020/reciclar-retazos-de-tela-2.jpg"
    } else if (
      nombreLower.includes("orgánico") ||
      nombreLower.includes("organico") ||
      nombreLower.includes("compost") ||
      nombreLower.includes("comida")
    ) {
      return "https://cdn0.uncomo.com/es/posts/8/8/1/que_se_tira_en_el_contenedor_organico_33188_600.jpg"
    } else if (nombreLower.includes("madera") || nombreLower.includes("mueble")) {
      return "https://www.reciclajesdolaf.com/wp-content/uploads/2019/10/reciclaje-de-madera-1024x683.jpg"
    } else if (nombreLower.includes("batería") || nombreLower.includes("bateria") || nombreLower.includes("pila")) {
      return "https://www.ambientum.com/wp-content/uploads/2021/09/pilas-696x464.jpg"
    } else if (nombreLower.includes("aceite")) {
      return "https://www.ecologiaverde.com/wp-content/uploads/2019/01/aceite-usado.jpg"
    } else if (
      nombreLower.includes("neumático") ||
      nombreLower.includes("neumatico") ||
      nombreLower.includes("llanta")
    ) {
      return "https://www.signus.es/wp-content/uploads/2022/01/Neumaticos-fuera-de-uso.jpg"
    }

    // Si no hay coincidencia por título, usar categoría como respaldo
    if (categoriaLower.includes("papel") || categoriaLower.includes("cartón") || categoriaLower.includes("carton")) {
      return "https://lcc.eco/wp-content/uploads/2024/11/Beneficios-de-reciclar-carton.webp"
    } else if (categoriaLower.includes("plástico") || categoriaLower.includes("plastico")) {
      return "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg"
    } else if (categoriaLower.includes("vidrio")) {
      return "https://www.unicorsa.com/wp-content/uploads/2019/01/unicor-producto-envases-de-vidrio-1-400x400_c.jpg"
    } else if (categoriaLower.includes("metal") || categoriaLower.includes("aluminio")) {
      return "https://limpiezademalaga.es/wp-content/uploads/2022/04/Post-reciclar-metales-abril22-1-1024x769.jpg"
    } else if (categoriaLower.includes("orgánico") || categoriaLower.includes("organico")) {
      return "https://cdn0.uncomo.com/es/posts/8/8/1/que_se_tira_en_el_contenedor_organico_33188_600.jpg"
    } else if (categoriaLower.includes("electrónico") || categoriaLower.includes("electronico")) {
      return "https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2024/02/startup-gana-80000-euros-mes-extrayendo-oro-cobre-dispositivos-tiramos-basura-3270798.jpg?tf=1200x675"
    } else if (categoriaLower.includes("textil")) {
      return "https://www.canecas.com.co/images/NOTICIAS_2020/reciclar-retazos-de-tela-2.jpg"
    }

    // Imagen por defecto si no hay coincidencia
    return "https://www.renovablesverdes.com/wp-content/uploads/2021/04/materiales-reciclables-para-reutilizar.jpg"
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
