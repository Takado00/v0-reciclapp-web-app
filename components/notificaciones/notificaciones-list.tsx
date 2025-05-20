"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, CheckCircle, Calendar, MessageSquare, Package, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { marcarNotificacionLeida } from "@/lib/actions/notificaciones-actions"
import { EmptyState } from "./empty-state"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Notificacion {
  id: number
  titulo: string
  mensaje: string
  tipo: string
  leida: boolean
  fecha_creacion: string
  referencia_id?: number
  referencia_tipo?: string
}

export function NotificacionesList({ userId }: { userId: string }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function cargarNotificaciones() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("notificaciones")
          .select("*")
          .eq("usuario_id", userId)
          .order("fecha_creacion", { ascending: false })

        if (error) {
          console.error("Error al cargar notificaciones:", error)
          setError("No se pudieron cargar las notificaciones")
          return
        }

        setNotificaciones(data || [])
      } catch (error) {
        console.error("Error al cargar notificaciones:", error)
        setError("Ocurrió un error al cargar las notificaciones")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      cargarNotificaciones()

      // Suscribirse a cambios en la tabla de notificaciones
      const channel = supabase
        .channel("notificaciones_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notificaciones",
            filter: `usuario_id=eq.${userId}`,
          },
          () => {
            cargarNotificaciones()
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, supabase])

  const handleMarcarLeida = async (id: number) => {
    try {
      await marcarNotificacionLeida(id)
      setNotificaciones(notificaciones.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif)))
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error)
    }
  }

  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case "sistema":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "material_nuevo":
        return <Package className="h-5 w-5 text-green-500" />
      case "mensaje_nuevo":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      case "evento":
        return <Calendar className="h-5 w-5 text-orange-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        {error}. Por favor, intenta de nuevo más tarde.
      </div>
    )
  }

  if (notificaciones.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4">
      {notificaciones.map((notificacion) => (
        <Card
          key={notificacion.id}
          className={`transition-colors ${
            notificacion.leida ? "bg-white" : "bg-green-50 border-l-4 border-l-green-500"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                {getIconForType(notificacion.tipo)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{notificacion.titulo}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notificacion.fecha_creacion), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{notificacion.mensaje}</p>
                {!notificacion.leida && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-green-600"
                      onClick={() => handleMarcarLeida(notificacion.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Marcar como leída</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
