"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { NotificacionesHeader } from "./notificaciones-header"
import { NotificacionesList } from "./notificaciones-list"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function NotificacionesPublic() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true)
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
      } catch (error) {
        console.error("Error al obtener usuario:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="container py-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Si el usuario está autenticado, mostrar sus notificaciones
  if (user) {
    return (
      <div className="container py-6 max-w-4xl">
        <NotificacionesHeader />
        <NotificacionesList userId={user.id} />
      </div>
    )
  }

  // Si el usuario no está autenticado, mostrar un mensaje amigable
  return (
    <div className="container py-6 max-w-4xl">
      <div className="text-center py-12 px-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Bell className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Centro de Notificaciones</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Aquí podrás ver todas tus notificaciones sobre materiales, mensajes y actividades de reciclaje.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/login?redirect=/notificaciones">Iniciar Sesión</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/registro">Crear Cuenta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
