"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowRight } from "lucide-react"
import { crearChatsEjemplo } from "@/lib/actions/chat-actions"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || ""
  const supabase = createClient()
  const { toast } = useToast()

  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsClient(true)

    // Verificar si el usuario ya está autenticado
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        // Si ya está autenticado, redirigir a su perfil
        router.push(`/perfil/${data.session.user.id}`)
      }
    }

    checkSession()
  }, [router, supabase, redirect])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Intentar crear chats de ejemplo para el usuario
      try {
        await crearChatsEjemplo(data.user.id)
      } catch (chatError) {
        console.error("Error al crear chats de ejemplo:", chatError)
        // No bloqueamos el inicio de sesión si falla la creación de chats
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente",
        variant: "default",
      })

      // MODIFICADO: Redirigir al perfil del usuario después de iniciar sesión
      if (redirect) {
        router.push(redirect)
      } else {
        router.push(`/perfil/${data.user.id}`)
      }

      router.refresh()
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error)
      setError(error.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  // Si estamos en el servidor, no renderizar nada
  if (!isClient) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Logo y nombre de la app */}
      <div className="flex flex-col items-center justify-center pt-10 pb-6">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
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
        <h1 className="text-3xl font-bold text-green-600">ReciclApp</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Conectando recicladores y empresas</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-base">
                    Contraseña
                  </Label>
                  <Link href="/recuperar-contrasena" className="text-sm text-green-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base mt-4 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-6">
            <div className="text-center text-base">
              ¿No tienes una cuenta?{" "}
              <Link href="/registro" className="text-green-600 hover:underline font-medium">
                Regístrate
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Barra de navegación inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2">
        <div className="grid grid-cols-4 gap-1">
          <Link href="/" className="flex flex-col items-center justify-center py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-xs mt-1">Inicio</span>
          </Link>
          <Link href="/materiales" className="flex flex-col items-center justify-center py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 7 12 2 3 7v10l9 5 9-5Z" />
              <path d="M12 12 3 7" />
              <path d="m12 12 9-5" />
              <path d="M12 12v10" />
            </svg>
            <span className="text-xs mt-1">Materiales</span>
          </Link>
          <Link href="/mensajes" className="flex flex-col items-center justify-center py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-xs mt-1">Mensajes</span>
          </Link>
          <Link href="/perfil" className="flex flex-col items-center justify-center py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
            <span className="text-xs mt-1">Mi Cuenta</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
