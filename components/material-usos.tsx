"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface MaterialUsosProps {
  categoria: string
}

export function MaterialUsos({ categoria }: MaterialUsosProps) {
  // Definir usos según la categoría del material
  const getUsosPorCategoria = (categoria: string) => {
    switch (categoria) {
      case "Plástico":
        return {
          industriales: [
            {
              nombre: "Fabricación de nuevos envases",
              descripcion: "El plástico reciclado puede ser procesado para crear nuevos envases y contenedores.",
              imagen: "/placeholder.svg?key=ydg2w",
            },
            {
              nombre: "Textiles sintéticos",
              descripcion: "El PET reciclado se utiliza para fabricar fibras textiles para ropa y otros productos.",
              imagen: "/placeholder.svg?key=c19ly",
            },
            {
              nombre: "Materiales de construcción",
              descripcion: "Se utiliza para fabricar tuberías, aislantes y otros materiales de construcción.",
              imagen: "/placeholder.svg?key=rzod4",
            },
          ],
          artesanales: [
            {
              nombre: "Macetas y jardineras",
              descripcion: "Botellas y recipientes de plástico pueden convertirse en macetas decorativas.",
              imagen: "/placeholder.svg?key=dm9q7",
            },
            {
              nombre: "Lámparas y decoración",
              descripcion: "Creación de lámparas y elementos decorativos a partir de plásticos reciclados.",
              imagen: "/placeholder.svg?key=ejlqu",
            },
            {
              nombre: "Juguetes y accesorios",
              descripcion: "Fabricación de juguetes, accesorios y objetos de uso diario.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled plastic toys",
            },
          ],
          innovadores: [
            {
              nombre: "Filamento para impresión 3D",
              descripcion: "El plástico reciclado puede convertirse en filamento para impresoras 3D.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled plastic 3d printing",
            },
            {
              nombre: "Combustible alternativo",
              descripcion: "Algunos plásticos pueden convertirse en combustible mediante pirólisis.",
              imagen: "/placeholder.svg?height=200&width=300&query=plastic to fuel",
            },
            {
              nombre: "Materiales compuestos",
              descripcion: "Creación de materiales compuestos con propiedades mejoradas.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled plastic composites",
            },
          ],
        }
      case "Papel" || "Cartón":
        return {
          industriales: [
            {
              nombre: "Nuevo papel y cartón",
              descripcion: "Fabricación de nuevo papel y productos de cartón a partir de fibras recicladas.",
              imagen: "/placeholder.svg?height=200&width=300&query=paper recycling factory",
            },
            {
              nombre: "Embalajes y cajas",
              descripcion: "Producción de embalajes, cajas y material de empaque.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled cardboard boxes",
            },
            {
              nombre: "Aislamiento térmico",
              descripcion: "Fabricación de aislamiento térmico para construcción a partir de celulosa reciclada.",
              imagen: "/placeholder.svg?height=200&width=300&query=cellulose insulation",
            },
          ],
          artesanales: [
            {
              nombre: "Papel artesanal",
              descripcion: "Creación de papel artesanal para tarjetas, invitaciones y arte.",
              imagen: "/placeholder.svg?height=200&width=300&query=handmade recycled paper",
            },
            {
              nombre: "Muebles de cartón",
              descripcion: "Diseño y fabricación de muebles ligeros y resistentes con cartón reciclado.",
              imagen: "/placeholder.svg?height=200&width=300&query=cardboard furniture",
            },
            {
              nombre: "Artesanías y decoración",
              descripcion: "Creación de esculturas, marcos y elementos decorativos.",
              imagen: "/placeholder.svg?height=200&width=300&query=paper mache art",
            },
          ],
          innovadores: [
            {
              nombre: "Biocombustibles",
              descripcion: "Conversión de residuos de papel en biocombustibles mediante procesos químicos.",
              imagen: "/placeholder.svg?height=200&width=300&query=paper to biofuel",
            },
            {
              nombre: "Materiales compuestos",
              descripcion: "Desarrollo de materiales compuestos con fibras de papel reciclado.",
              imagen: "/placeholder.svg?height=200&width=300&query=paper composite materials",
            },
            {
              nombre: "Textiles de celulosa",
              descripcion: "Fabricación de textiles a partir de celulosa recuperada del papel.",
              imagen: "/placeholder.svg?height=200&width=300&query=cellulose textile",
            },
          ],
        }
      case "Vidrio":
        return {
          industriales: [
            {
              nombre: "Nuevos envases de vidrio",
              descripcion: "Fabricación de botellas y frascos a partir de vidrio reciclado.",
              imagen: "/placeholder.svg?height=200&width=300&query=glass bottle manufacturing",
            },
            {
              nombre: "Materiales de construcción",
              descripcion: "Producción de materiales como fibra de vidrio, aislantes y agregados.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled glass construction",
            },
            {
              nombre: "Abrasivos",
              descripcion: "Fabricación de abrasivos y materiales para pulido industrial.",
              imagen: "/placeholder.svg?height=200&width=300&query=glass abrasives",
            },
          ],
          artesanales: [
            {
              nombre: "Joyería y bisutería",
              descripcion: "Creación de joyas, colgantes y accesorios con vidrio reciclado fundido.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled glass jewelry",
            },
            {
              nombre: "Mosaicos y decoración",
              descripcion: "Elaboración de mosaicos, murales y elementos decorativos.",
              imagen: "/placeholder.svg?height=200&width=300&query=glass mosaic art",
            },
            {
              nombre: "Vasos y objetos de uso diario",
              descripcion: "Fabricación artesanal de vasos, platos y otros objetos a partir de botellas.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled glass cups",
            },
          ],
          innovadores: [
            {
              nombre: "Filtros para tratamiento de agua",
              descripcion: "Uso de vidrio triturado como medio filtrante para purificación de agua.",
              imagen: "/placeholder.svg?height=200&width=300&query=glass water filtration",
            },
            {
              nombre: "Pavimentos reflectantes",
              descripcion: "Incorporación en pavimentos para aumentar la reflectividad y reducir el calor urbano.",
              imagen: "/placeholder.svg?height=200&width=300&query=glass in pavement",
            },
            {
              nombre: "Espumas de vidrio",
              descripcion: "Desarrollo de espumas aislantes de vidrio para construcción sostenible.",
              imagen: "/placeholder.svg?height=200&width=300&query=glass foam insulation",
            },
          ],
        }
      case "Metal":
        return {
          industriales: [
            {
              nombre: "Nuevos productos metálicos",
              descripcion: "Fundición para crear nuevos productos y componentes metálicos.",
              imagen: "/placeholder.svg?height=200&width=300&query=metal recycling foundry",
            },
            {
              nombre: "Aleaciones especiales",
              descripcion: "Creación de aleaciones con propiedades específicas para diversas industrias.",
              imagen: "/placeholder.svg?height=200&width=300&query=metal alloy production",
            },
            {
              nombre: "Componentes automotrices",
              descripcion: "Fabricación de piezas y componentes para la industria automotriz.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled metal auto parts",
            },
          ],
          artesanales: [
            {
              nombre: "Esculturas y arte",
              descripcion: "Creación de esculturas y obras de arte con metales reciclados.",
              imagen: "/placeholder.svg?height=200&width=300&query=metal sculpture recycled",
            },
            {
              nombre: "Joyería y accesorios",
              descripcion: "Elaboración de joyas, relojes y accesorios personales.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled metal jewelry",
            },
            {
              nombre: "Mobiliario y decoración",
              descripcion: "Diseño de muebles, lámparas y elementos decorativos.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled metal furniture",
            },
          ],
          innovadores: [
            {
              nombre: "Catalizadores",
              descripcion: "Recuperación de metales preciosos para uso en catalizadores industriales.",
              imagen: "/placeholder.svg?height=200&width=300&query=metal catalysts",
            },
            {
              nombre: "Almacenamiento de energía",
              descripcion: "Uso en baterías y sistemas de almacenamiento de energía renovable.",
              imagen: "/placeholder.svg?height=200&width=300&query=metal energy storage",
            },
            {
              nombre: "Impresión 3D metálica",
              descripcion: "Polvo metálico reciclado para fabricación aditiva y prototipado rápido.",
              imagen: "/placeholder.svg?height=200&width=300&query=metal 3d printing",
            },
          ],
        }
      default:
        return {
          industriales: [
            {
              nombre: "Productos reciclados",
              descripcion: "Transformación en nuevos productos según el tipo de material.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled products",
            },
            {
              nombre: "Materiales compuestos",
              descripcion: "Creación de materiales compuestos con propiedades mejoradas.",
              imagen: "/placeholder.svg?height=200&width=300&query=composite materials",
            },
            {
              nombre: "Materias primas secundarias",
              descripcion: "Procesamiento para obtener materias primas para diversas industrias.",
              imagen: "/placeholder.svg?height=200&width=300&query=secondary raw materials",
            },
          ],
          artesanales: [
            {
              nombre: "Artesanías y manualidades",
              descripcion: "Creación de objetos decorativos y funcionales mediante técnicas artesanales.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled crafts",
            },
            {
              nombre: "Objetos de diseño",
              descripcion: "Diseño y fabricación de objetos únicos con materiales reciclados.",
              imagen: "/placeholder.svg?height=200&width=300&query=upcycled design objects",
            },
            {
              nombre: "Arte y expresión creativa",
              descripcion: "Uso en proyectos artísticos y expresiones creativas diversas.",
              imagen: "/placeholder.svg?height=200&width=300&query=recycled art",
            },
          ],
          innovadores: [
            {
              nombre: "Nuevas aplicaciones",
              descripcion: "Investigación y desarrollo de aplicaciones innovadoras.",
              imagen: "/placeholder.svg?height=200&width=300&query=innovative recycling",
            },
            {
              nombre: "Tecnologías emergentes",
              descripcion: "Integración en tecnologías emergentes y soluciones sostenibles.",
              imagen: "/placeholder.svg?height=200&width=300&query=sustainable technology",
            },
            {
              nombre: "Economía circular",
              descripcion: "Contribución a modelos de economía circular y desarrollo sostenible.",
              imagen: "/placeholder.svg?height=200&width=300&query=circular economy",
            },
          ],
        }
    }
  }

  const usos = getUsosPorCategoria(categoria)

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Usos del Material</h2>
        <p className="text-muted-foreground mb-6">
          Descubre las diferentes aplicaciones y usos que se pueden dar a este tipo de material después de ser
          reciclado.
        </p>

        <Tabs defaultValue="industriales">
          <TabsList className="mb-4">
            <TabsTrigger value="industriales">Usos Industriales</TabsTrigger>
            <TabsTrigger value="artesanales">Usos Artesanales</TabsTrigger>
            <TabsTrigger value="innovadores">Usos Innovadores</TabsTrigger>
          </TabsList>

          <TabsContent value="industriales">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {usos.industriales.map((uso, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video relative">
                    <Image src={uso.imagen || "/placeholder.svg"} alt={uso.nombre} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{uso.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{uso.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artesanales">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {usos.artesanales.map((uso, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video relative">
                    <Image src={uso.imagen || "/placeholder.svg"} alt={uso.nombre} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{uso.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{uso.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="innovadores">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {usos.innovadores.map((uso, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video relative">
                    <Image src={uso.imagen || "/placeholder.svg"} alt={uso.nombre} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{uso.nombre}</h3>
                    <p className="text-sm text-muted-foreground">{uso.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
