"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Datos de ejemplo para las valoraciones
const reviewsData = [
  {
    id: 1,
    user: "Carlos Rodríguez",
    userImage: "/placeholder.svg?height=50&width=50",
    rating: 5,
    comment:
      "Excelente material, muy bien clasificado y en perfecto estado. La entrega fue puntual y el vendedor muy profesional.",
    date: "2023-04-20",
  },
  {
    id: 2,
    user: "María López",
    userImage: "/placeholder.svg?height=50&width=50",
    rating: 4,
    comment: "Buen material, aunque algunas cajas estaban un poco dañadas. En general, satisfecha con la compra.",
    date: "2023-04-18",
  },
  {
    id: 3,
    user: "Juan Pérez",
    userImage: "/placeholder.svg?height=50&width=50",
    rating: 5,
    comment: "Material de primera calidad. Muy recomendable para proyectos de reciclaje.",
    date: "2023-04-15",
  },
]

export function MaterialRating({ materialId }: { materialId: string }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)
  const { toast } = useToast()

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, selecciona una valoración antes de enviar.",
      })
      return
    }

    // Aquí se enviaría la valoración a la base de datos
    toast({
      title: "Valoración enviada",
      description: "Gracias por compartir tu opinión sobre este material.",
    })

    // Resetear el formulario
    setRating(0)
    setComment("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Deja tu valoración</h2>
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1"
              >
                <Star
                  className={`h-8 w-8 ${
                    (hoveredRating ? star <= hoveredRating : star <= rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0
                ? `Has seleccionado ${rating} ${rating === 1 ? "estrella" : "estrellas"}`
                : "Selecciona una valoración"}
            </span>
          </div>
          <Textarea
            placeholder="Comparte tu experiencia con este material..."
            className="min-h-[100px] mb-4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={handleRatingSubmit} className="bg-green-600 hover:bg-green-700">
            Enviar Valoración
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Valoraciones ({reviewsData.length})</h2>

        {reviewsData.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted relative overflow-hidden flex-shrink-0">
                  <Image src={review.userImage || "/placeholder.svg"} alt={review.user} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{review.user}</h3>
                    <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
