"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, User, LogOut, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Función para obtener el usuario actual
  const getUser = async () => {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error("Error al obtener el usuario:", error)
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar notificaciones no leídas
  const cargarNotificacionesNoLeidas = async () => {
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

  useEffect(() => {
    // Obtener el usuario al cargar el componente
    getUser()

    // Configurar el listener para cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      setUser(session?.user || null)

      // Si el usuario inicia sesión, actualizar inmediatamente
      if (event === "SIGNED_IN") {
        getUser()
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    if (user) {
      cargarNotificacionesNoLeidas()

      // Configurar un intervalo para actualizar periódicamente en lugar de usar WebSockets
      const intervalId = setInterval(() => {
        cargarNotificacionesNoLeidas()
      }, 30000) // Actualizar cada 30 segundos

      return () => {
        clearInterval(intervalId) // Limpiar el intervalo al desmontar
      }
    }
  }, [user, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // Función para ir a la página de notificaciones
  const goToNotificaciones = () => {
    router.push("/notificaciones")
    closeMenu() // Cerrar el menú si está abierto
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
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
            <span className="text-xl font-bold text-green-600">ReciclApp</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive("/") ? "text-green-600" : "text-foreground"
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/materiales"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive("/materiales") ? "text-green-600" : "text-foreground"
              }`}
            >
              Materiales
            </Link>
            <Link
              href="/como-reciclar"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive("/como-reciclar") ? "text-green-600" : "text-foreground"
              }`}
            >
              Cómo Reciclar
            </Link>
            <Link
              href="/mensajes"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive("/mensajes") ? "text-green-600" : "text-foreground"
              }`}
            >
              Mensajes
            </Link>
            <Link
              href="/notificaciones"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive("/notificaciones") ? "text-green-600" : "text-foreground"
              }`}
            >
              Notificaciones
              {notificacionesNoLeidas > 0 && <Badge className="ml-1 bg-red-500">{notificacionesNoLeidas}</Badge>}
            </Link>
          </nav>
        </div>

        {/* Barra de búsqueda en dispositivos grandes */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Buscar materiales, recicladores..."
              className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Iconos para dispositivos grandes */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 relative"
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
          </div>

          <div className="hidden md:flex md:items-center md:gap-2">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
                      <Link href="/mi-perfil">
                        <User className="h-4 w-4" />
                        <span>Mi Perfil</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                    <Button variant="default" size="sm" asChild>
                      <Link href="/registro">Registrarse</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container pb-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive("/") ? "text-green-600" : "text-foreground"
              }`}
              onClick={closeMenu}
            >
              Inicio
            </Link>
            <Link
              href="/materiales"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive("/materiales") ? "text-green-600" : "text-foreground"
              }`}
              onClick={closeMenu}
            >
              Materiales
            </Link>
            <Link
              href="/como-reciclar"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive("/como-reciclar") ? "text-green-600" : "text-foreground"
              }`}
              onClick={closeMenu}
            >
              Cómo Reciclar
            </Link>
            <Link
              href="/mensajes"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive("/mensajes") ? "text-green-600" : "text-foreground"
              }`}
              onClick={closeMenu}
            >
              Mensajes
            </Link>
            <Link
              href="/notificaciones"
              className={`text-sm font-medium transition-colors hover:text-green-600 flex items-center ${
                isActive("/notificaciones") ? "text-green-600" : "text-foreground"
              }`}
              onClick={closeMenu}
            >
              <Bell className="h-4 w-4 mr-2" />
              <span>Notificaciones</span>
              {notificacionesNoLeidas > 0 && <Badge className="ml-2 bg-red-500">{notificacionesNoLeidas}</Badge>}
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/mi-perfil"
                      className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-green-600"
                      onClick={closeMenu}
                    >
                      <User className="h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        closeMenu()
                      }}
                      className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-green-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-medium transition-colors hover:text-green-600"
                      onClick={closeMenu}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/registro"
                      className="text-sm font-medium transition-colors hover:text-green-600"
                      onClick={closeMenu}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
