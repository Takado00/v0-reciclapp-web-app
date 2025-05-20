"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

export function FloatingActionButton() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Controlar la visibilidad del botón al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleClick = async () => {
    // Verificar si el usuario está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      toast({
        title: "Inicia sesión primero",
        description: "Necesitas iniciar sesión para publicar materiales",
        variant: "destructive",
      })
      router.push("/login?redirect=/materiales/publicar")
      return
    }

    // Si está autenticado, redirigir a la página de publicación
    router.push("/materiales/publicar")
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={`fixed bottom-20 right-6 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-300 flex items-center justify-center z-50 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      aria-label="Publicar nuevo material"
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <Plus className="h-6 w-6" />
      )}
    </Button>
  )
}
