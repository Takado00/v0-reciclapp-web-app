"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

type SessionContextType = {
  status: "loading" | "authenticated" | "unauthenticated" | "error"
  user: any | null
  update: () => Promise<void>
  error: string | null
}

const SessionContext = createContext<SessionContextType>({
  status: "loading",
  user: null,
  update: async () => {},
  error: null,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated" | "error">("loading")
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [supabase, setSupabase] = useState<any>(null)

  // Inicializar el cliente de Supabase de manera segura
  useEffect(() => {
    try {
      const client = createClient()
      setSupabase(client)
      console.log("Supabase client initialized successfully")
    } catch (err) {
      console.error("Error initializing Supabase client:", err)
      setStatus("error")
      setError("Error al inicializar el cliente de Supabase. Por favor, recarga la página.")
    }
  }, [])

  const update = async () => {
    if (!supabase) return

    try {
      setStatus("loading")
      setError(null)

      console.log("Updating session...")

      // Usar getSession en lugar de getUser para evitar el error "Auth session missing!"
      const { data, error: authError } = await supabase.auth.getSession()

      if (authError) {
        console.error("Error al obtener sesión:", authError)
        setUser(null)
        setStatus("unauthenticated")
        return
      }

      if (data?.session?.user) {
        console.log("User found in session:", data.session.user.email)
        setUser(data.session.user)
        setStatus("authenticated")
      } else {
        console.log("No user found in session")
        setUser(null)
        setStatus("unauthenticated")
      }
    } catch (error) {
      console.error("Error al actualizar la sesión:", error)
      setUser(null)
      setStatus("error")
      setError("Error al actualizar la sesión. Por favor, intenta de nuevo.")
    }
  }

  useEffect(() => {
    if (!supabase) return

    const checkSession = async () => {
      try {
        console.log("Checking session...")

        // Usar getSession en lugar de getUser para evitar el error "Auth session missing!"
        const { data, error: authError } = await supabase.auth.getSession()

        if (authError) {
          console.error("Error al verificar sesión:", authError)

          // Si es un error de red, intentamos de nuevo hasta 3 veces
          if (authError.message.includes("fetch") && retryCount < 3) {
            console.log(`Retry attempt ${retryCount + 1}/3...`)
            setRetryCount((prev) => prev + 1)
            setTimeout(checkSession, 1000 * (retryCount + 1)) // Reintento con backoff exponencial
            return
          }

          // Si el error es "Auth session missing!", simplemente establecemos el estado como no autenticado
          if (authError.message.includes("Auth session missing")) {
            console.log("No session found, setting status to unauthenticated")
            setStatus("unauthenticated")
            return
          }

          setStatus("error")
          setError("Error al verificar la sesión. Por favor, recarga la página.")
          return
        }

        if (data?.session?.user) {
          console.log("User found in session:", data.session.user.email)
          setUser(data.session.user)
          setStatus("authenticated")
        } else {
          console.log("No user found in session")
          setStatus("unauthenticated")
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error)

        // Si es un error de red, intentamos de nuevo hasta 3 veces
        if (error instanceof Error && error.message.includes("fetch") && retryCount < 3) {
          console.log(`Retry attempt ${retryCount + 1}/3...`)
          setRetryCount((prev) => prev + 1)
          setTimeout(checkSession, 1000 * (retryCount + 1)) // Reintento con backoff exponencial
          return
        }

        // Si el error es "Auth session missing!", simplemente establecemos el estado como no autenticado
        if (error instanceof Error && error.message.includes("Auth session missing")) {
          console.log("No session found, setting status to unauthenticated")
          setStatus("unauthenticated")
          return
        }

        setStatus("error")
        setError("Error al verificar la sesión. Por favor, recarga la página.")
      }
    }

    checkSession()

    // Suscribirse a cambios en la autenticación
    let authListener: any = null
    try {
      authListener = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event)

        if (session?.user) {
          setUser(session.user)
          setStatus("authenticated")
        } else {
          setUser(null)
          setStatus("unauthenticated")
        }
      })
    } catch (error) {
      console.error("Error setting up auth listener:", error)
    }

    return () => {
      if (authListener?.subscription?.unsubscribe) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase, retryCount])

  // Renderizar un mensaje de error si hay problemas de conexión
  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <h2 className="mb-2 text-lg font-semibold text-red-700">Error de conexión</h2>
          <p className="mb-4 text-red-600">
            {error || "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet."}
          </p>
          <button
            onClick={() => {
              setRetryCount(0)
              setStatus("loading")
              update()
            }}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  // Mostrar un indicador de carga mientras se inicializa el cliente de Supabase
  if (!supabase) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="mt-4 text-gray-600">Inicializando aplicación...</p>
      </div>
    )
  }

  return <SessionContext.Provider value={{ status, user, update, error }}>{children}</SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext)
