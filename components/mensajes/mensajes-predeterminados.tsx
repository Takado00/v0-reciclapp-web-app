"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { obtenerMensajesPredeterminados } from "@/lib/actions/mensajes-actions"

interface MensajesPredeterminadosProps {
  tipoDestinatario: string
  onSelectMensaje: (mensaje: string) => void
}

export function MensajesPredeterminados({ tipoDestinatario, onSelectMensaje }: MensajesPredeterminadosProps) {
  const [mensajes, setMensajes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function cargarMensajes() {
      setIsLoading(true)
      try {
        const { success, data } = await obtenerMensajesPredeterminados(tipoDestinatario)
        if (success && data) {
          setMensajes(data)
        } else {
          setMensajes([])
        }
      } catch (error) {
        console.error("Error al cargar mensajes predeterminados:", error)
        setMensajes([])
      } finally {
        setIsLoading(false)
      }
    }

    cargarMensajes()
  }, [tipoDestinatario])

  if (isLoading) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground">Cargando mensajes sugeridos...</p>
      </div>
    )
  }

  if (mensajes.length === 0) {
    return null
  }

  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-medium">Mensajes sugeridos</h4>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {mensajes.map((mensaje, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start h-auto py-2 px-3 text-left text-sm font-normal"
            onClick={() => onSelectMensaje(mensaje)}
          >
            {mensaje}
          </Button>
        ))}
      </div>
    </div>
  )
}
