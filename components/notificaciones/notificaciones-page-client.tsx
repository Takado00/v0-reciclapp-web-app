"use client"

import { useState } from "react"
import { NotificacionesList } from "@/components/notificaciones/notificaciones-list"
import { NotificacionesHeader } from "@/components/notificaciones/notificaciones-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "@/components/session-provider"

export function NotificacionesPageClient() {
  const { status, user } = useSession()
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Utilizamos el hook useSession en lugar de hacer la llamada directamente
  // Esto evita el error "Auth session missing!"

  if (status === "loading") {
    return (
      <div className="container py-6 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !user) {
    return (
      <div className="container py-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso restringido</h1>
          <p className="mb-6 text-muted-foreground">Debes iniciar sesión para ver tus notificaciones.</p>
          <Link href="/login?redirect=/notificaciones">
            <Button className="bg-green-600 hover:bg-green-700">Iniciar sesión</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="container py-6 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Error al cargar las notificaciones. Por favor, intenta de nuevo más tarde.
        </div>
      </div>
    )
  }

  // Si llegamos aquí, el usuario está autenticado
  return (
    <div className="container py-6 max-w-4xl">
      <NotificacionesHeader />
      <NotificacionesList userId={user.id} />
    </div>
  )
}
