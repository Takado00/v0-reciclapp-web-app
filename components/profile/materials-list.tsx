"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface MaterialsListProps {
  userId: string
}

export function MaterialsList({ userId }: MaterialsListProps) {
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMaterials() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("materiales")
          .select("*")
          .eq("usuario_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        setMaterials(data || [])
      } catch (error) {
        console.error("Error al cargar materiales:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [userId, supabase])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (materials.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No hay materiales publicados</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {materials.map((material) => (
        <Card key={material.id}>
          <CardHeader>
            <CardTitle>{material.nombre}</CardTitle>
            <CardDescription>{new Date(material.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Tipo: </span>
                <span>{material.tipo}</span>
              </div>
              <div>
                <span className="font-medium">Cantidad: </span>
                <span>
                  {material.cantidad} {material.unidad}
                </span>
              </div>
              <div>
                <span className="font-medium">Precio: </span>
                <span>${material.precio}</span>
              </div>
              <div>
                <span className="font-medium">Descripción: </span>
                <span>{material.descripcion}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
