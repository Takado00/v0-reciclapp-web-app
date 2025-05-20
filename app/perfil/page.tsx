"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      try {
        setLoading(true)
        const supabase = createClient()

        // Verificar si hay un usuario autenticado
        const { data } = await supabase.auth.getUser()

        if (data.user) {
          // Si hay un usuario, redirigimos a su perfil
          router.push(`/perfil/${data.user.id}`)
        } else {
          // Si no hay usuario, mostramos un perfil de ejemplo
          router.push(`/perfil/ejemplo`)
        }
      } catch (error) {
        console.error("Error al verificar usuario:", error)
        // En caso de error, mostramos un perfil de ejemplo
        router.push(`/perfil/ejemplo`)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return null
}
