import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Droplets, Recycle, ShoppingBag, Trash2, Leaf } from "lucide-react"

export function RecyclingTips() {
  const tips = [
    {
      icon: <Recycle className="h-5 w-5 text-green-600" />,
      title: "Separa correctamente",
      description: "Clasifica los residuos según su tipo: papel, plástico, vidrio, metal y orgánicos.",
    },
    {
      icon: <Droplets className="h-5 w-5 text-green-600" />,
      title: "Limpia los envases",
      description: "Enjuaga los envases antes de reciclarlos para evitar la contaminación de otros materiales.",
    },
    {
      icon: <ShoppingBag className="h-5 w-5 text-green-600" />,
      title: "Reduce el consumo",
      description: "Lleva tus propias bolsas al supermercado y evita productos con exceso de embalaje.",
    },
    {
      icon: <Trash2 className="h-5 w-5 text-green-600" />,
      title: "Compactación",
      description: "Aplasta las botellas y cajas para optimizar el espacio en los contenedores.",
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-green-600" />,
      title: "Reutiliza",
      description: "Antes de reciclar, piensa si puedes darle un nuevo uso al objeto.",
    },
    {
      icon: <Leaf className="h-5 w-5 text-green-600" />,
      title: "Compostaje",
      description: "Aprovecha los residuos orgánicos para hacer compost y nutrir tus plantas.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consejos para Reciclar Mejor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-3">
              <div className="mt-0.5 flex-shrink-0">{tip.icon}</div>
              <div>
                <h3 className="font-medium">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
