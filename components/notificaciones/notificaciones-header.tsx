"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Bell } from "lucide-react"
import { marcarTodasLeidas } from "@/lib/actions/notificaciones-actions"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NotificacionesHeader() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleMarcarTodasLeidas = async () => {
    try {
      setIsLoading(true)
      await marcarTodasLeidas()
      router.refresh()
    } catch (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <Bell className="h-6 w-6 mr-2 text-green-600" />
          Notificaciones
        </h1>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleMarcarTodasLeidas}
        disabled={isLoading}
      >
        <CheckCircle className="h-4 w-4" />
        <span>{isLoading ? "Procesando..." : "Marcar todas como leídas"}</span>
      </Button>
    </div>
  )
}
