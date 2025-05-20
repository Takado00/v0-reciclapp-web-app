"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { NotificacionesList } from "./notificaciones-list"
import { EmptyState } from "./empty-state"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificacionesContent() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.getUser()

        if (error) {
          console.error("Error al obtener usuario:", error)
          setError("Debes iniciar sesión para ver tus notificaciones")
          return
        }

        if (data.user) {
          setUserId(data.user.id)
        } else {
          setError("Debes iniciar sesión para ver tus notificaciones")
        }
      } catch (err) {
        console.error("Error al obtener usuario:", err)
        setError("Ocurrió un error al cargar tus notificaciones")
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg animate-pulse">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/login?redirect=/notificaciones">Iniciar sesión</a>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (!userId) {
    return <EmptyState />
  }

  return <NotificacionesList userId={userId} />
}
