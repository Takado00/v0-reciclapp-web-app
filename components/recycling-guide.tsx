import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RecyclingGuide() {
  const materials = [
    {
      id: "papel",
      title: "Papel y Cartón",
      description: "Cómo reciclar papel y cartón correctamente",
      image: "/placeholder.svg?height=300&width=500",
      content: [
        {
          title: "¿Qué se puede reciclar?",
          items: [
            "Periódicos y revistas",
            "Cajas de cartón",
            "Papel de oficina",
            "Cuadernos y libros",
            "Folletos y catálogos",
          ],
        },
        {
          title: "¿Qué NO se puede reciclar?",
          items: [
            "Papel higiénico o servilletas usadas",
            "Papel encerado o parafinado",
            "Papel con residuos de alimentos",
            "Papel carbón",
            "Papel térmico de facturas",
          ],
        },
        {
          title: "Consejos para reciclar papel",
          items: [
            "Retira grapas, clips y espirales",
            "Asegúrate de que esté limpio y seco",
            "Aplana las cajas de cartón",
            "Separa el papel por tipos si es posible",
            "No mezcles con otros materiales",
          ],
        },
      ],
    },
    {
      id: "plastico",
      title: "Plástico",
      description: "Cómo reciclar plástico correctamente",
      image: "/placeholder.svg?height=300&width=500",
      content: [
        {
          title: "¿Qué se puede reciclar?",
          items: [
            "Botellas de PET (refrescos, agua)",
            "Envases de HDPE (detergentes, champús)",
            "Bolsas de plástico limpias",
            "Envases de alimentos",
            "Tapas de plástico",
          ],
        },
        {
          title: "¿Qué NO se puede reciclar?",
          items: [
            "Plásticos con residuos de alimentos",
            "Juguetes de plástico",
            "Utensilios de cocina",
            "Plásticos biodegradables",
            "Envases de productos peligrosos",
          ],
        },
        {
          title: "Consejos para reciclar plástico",
          items: [
            "Enjuaga los envases antes de reciclarlos",
            "Retira las etiquetas si es posible",
            "Aplasta las botellas para ahorrar espacio",
            "Identifica el tipo de plástico por su número",
            "Separa las tapas del envase",
          ],
        },
      ],
    },
    {
      id: "vidrio",
      title: "Vidrio",
      description: "Cómo reciclar vidrio correctamente",
      image: "/placeholder.svg?height=300&width=500",
      content: [
        {
          title: "¿Qué se puede reciclar?",
          items: [
            "Botellas de vidrio",
            "Frascos de conservas",
            "Tarros de vidrio",
            "Botellas de vino y licores",
            "Frascos de perfumes",
          ],
        },
        {
          title: "¿Qué NO se puede reciclar?",
          items: [
            "Vidrio de ventanas o espejos",
            "Bombillas o fluorescentes",
            "Cristalería (vasos, copas)",
            "Cerámica o porcelana",
            "Vidrio de laboratorio",
          ],
        },
        {
          title: "Consejos para reciclar vidrio",
          items: [
            "Retira tapas y corchos",
            "Enjuaga los envases",
            "No es necesario quitar las etiquetas",
            "Ten cuidado con los bordes cortantes",
            "Separa por colores si es posible",
          ],
        },
      ],
    },
    {
      id: "metal",
      title: "Metal",
      description: "Cómo reciclar metal correctamente",
      image: "/placeholder.svg?height=300&width=500",
      content: [
        {
          title: "¿Qué se puede reciclar?",
          items: [
            "Latas de bebidas",
            "Latas de conservas",
            "Papel aluminio limpio",
            "Tapas metálicas",
            "Envases de aerosol vacíos",
          ],
        },
        {
          title: "¿Qué NO se puede reciclar?",
          items: [
            "Electrodomésticos",
            "Baterías",
            "Cables eléctricos",
            "Herramientas",
            "Metales con residuos peligrosos",
          ],
        },
        {
          title: "Consejos para reciclar metal",
          items: [
            "Aplasta las latas para ahorrar espacio",
            "Asegúrate de que estén vacías y limpias",
            "Separa las partes que no son de metal",
            "No mezcles diferentes tipos de metales",
            "Retira las etiquetas si es posible",
          ],
        },
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guía de Reciclaje por Materiales</CardTitle>
        <CardDescription>
          Aprende a identificar y separar correctamente los diferentes tipos de materiales reciclables
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="papel">
          <TabsList className="grid grid-cols-4 mb-6">
            {materials.map((material) => (
              <TabsTrigger key={material.id} value={material.id}>
                {material.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {materials.map((material) => (
            <TabsContent key={material.id} value={material.id} className="space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image src={material.image || "/placeholder.svg"} alt={material.title} fill className="object-cover" />
              </div>

              {material.content.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                  <ul className="space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
