"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Bell, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Cargar el número de notificaciones no leídas
    async function cargarNotificacionesNoLeidas() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) return

        const { count, error } = await supabase
          .from("notificaciones")
          .select("*", { count: "exact", head: true })
          .eq("usuario_id", session.user.id)
          .eq("leida", false)

        if (!error && count !== null) {
          setNotificacionesNoLeidas(count)
        }
      } catch (error) {
        console.error("Error al cargar notificaciones no leídas:", error)
      }
    }

    cargarNotificacionesNoLeidas()

    // Configurar un intervalo para actualizar periódicamente en lugar de usar WebSockets
    const intervalId = setInterval(() => {
      cargarNotificacionesNoLeidas()
    }, 30000) // Actualizar cada 30 segundos

    return () => {
      clearInterval(intervalId) // Limpiar el intervalo al desmontar
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Función para ir a la página de notificaciones
  const goToNotificaciones = () => {
    router.push("/notificaciones")
    if (searchOpen) setSearchOpen(false) // Cerrar la búsqueda si está abierta
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container px-4 h-14 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu size={22} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="py-4">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                      <path d="m14 16-3 3 3 3" />
                      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
                      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
                      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold">ReciclApp</span>
                </div>
                <nav className="space-y-4">
                  <Link href="/" className="block py-2 hover:text-green-600">
                    Inicio
                  </Link>
                  <Link href="/materiales" className="block py-2 hover:text-green-600">
                    Materiales
                  </Link>
                  <Link href="/como-reciclar" className="block py-2 hover:text-green-600">
                    Cómo Reciclar
                  </Link>
                  <Link href="/mensajes" className="block py-2 hover:text-green-600">
                    Mensajes
                  </Link>
                  <Link href="/mi-perfil" className="block py-2 hover:text-green-600">
                    Mi Perfil
                  </Link>
                  <Link href="/notificaciones" className="flex items-center py-2 hover:text-green-600">
                    Notificaciones
                    {notificacionesNoLeidas > 0 && <Badge className="ml-2 bg-red-500">{notificacionesNoLeidas}</Badge>}
                  </Link>
                  <button onClick={handleLogout} className="block py-2 hover:text-green-600 w-full text-left">
                    Cerrar Sesión
                  </button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center">
            <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                <path d="m14 16-3 3 3 3" />
                <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
                <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
                <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
              </svg>
            </div>
            <span className="text-base font-bold">ReciclApp</span>
          </Link>
        </div>

        <div className="flex items-center space-x-1">
          {searchOpen ? (
            <div className="absolute inset-0 bg-white dark:bg-gray-900 z-50 px-4 flex items-center h-14">
              <Input type="search" placeholder="Buscar materiales, recicladores..." className="h-9 flex-1" autoFocus />
              <Button variant="ghost" size="icon" className="ml-2 h-9 w-9" onClick={() => setSearchOpen(false)}>
                <span className="sr-only">Cerrar</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
                <Search size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative"
                onClick={goToNotificaciones}
                aria-label="Ver notificaciones"
              >
                <Bell size={20} />
                {notificacionesNoLeidas > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {notificacionesNoLeidas > 9 ? "9+" : notificacionesNoLeidas}
                  </Badge>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
