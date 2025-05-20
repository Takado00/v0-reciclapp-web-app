"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function HeroSection() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Crear cliente de Supabase
  const supabase = createClientComponentClient()

  // Verificar si el usuario está autenticado al cargar el componente
  useEffect(() => {
    async function getUser() {
      try {
        setIsLoading(true)
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error("Error al verificar la autenticación:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    // Limpiar el listener al desmontar el componente
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Recicla, conecta y transforma el futuro
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Conectamos a personas, recicladores y empresas para crear un ecosistema de reciclaje eficiente y
                sostenible.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {!isLoading && !user && (
                <Link href="/registro">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Únete ahora
                  </Button>
                </Link>
              )}
              <Link href="/como-reciclar">
                <Button size="lg" variant="outline">
                  Aprende a reciclar
                </Button>
              </Link>
            </div>
          </div>
          <img
            alt="Reciclaje colaborativo"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            height="550"
            src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800&auto=format&fit=crop"
            width="800"
          />
        </div>
      </div>
    </section>
  )
}
