"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface MobileProfileHeaderProps {
  profile: any
  isOwnProfile: boolean
}

export function MobileProfileHeader({ profile, isOwnProfile }: MobileProfileHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleBack = () => {
    router.back()
  }

  const handleEdit = () => {
    // Redirigir a la página de edición de perfil
    router.push(`/perfil/editar`)
    router.refresh()
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex items-center justify-between mb-4 sticky top-0 bg-background z-10 py-2">
      <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9">
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold truncate px-2">{isOwnProfile ? "Mi Perfil" : profile.nombre}</h1>
      </div>

      {isOwnProfile ? (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleEdit} className="h-9 w-9">
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="h-9 w-9 text-red-500"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="w-9"></div> // Espacio para mantener el centrado
      )}
    </div>
  )
}
