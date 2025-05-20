"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function HowItWorksSection() {
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

  const steps = [
    {
      number: "01",
      title: "Regístrate",
      description: "Crea tu cuenta como usuario, reciclador o empresa y completa tu perfil.",
      image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=300&auto=format&fit=crop",
    },
    {
      number: "02",
      title: "Conecta",
      description: "Encuentra puntos de reciclaje, recicladores o empresas según tus necesidades.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=300&auto=format&fit=crop",
    },
    {
      number: "03",
      title: "Recicla",
      description: "Coordina la entrega o recogida de materiales reciclables de forma eficiente.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=300&auto=format&fit=crop",
    },
    {
      number: "04",
      title: "Impacta",
      description: "Visualiza tu contribución al medio ambiente y recibe incentivos por tus acciones.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=300&auto=format&fit=crop",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm dark:bg-green-800">
              Cómo funciona
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Reciclar nunca fue tan fácil</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Sigue estos simples pasos para comenzar a reciclar de manera eficiente y contribuir a un futuro más
              sostenible.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
                <span className="text-xl font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <div className="relative h-40 w-full rounded-lg overflow-hidden mb-2 group shadow-sm hover:shadow-md transition-shadow duration-300">
                <img
                  src={step.image || "/placeholder.svg"}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                  <div className="bg-green-100 text-green-800 font-bold rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                    {step.number}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          {!isLoading && !user && (
            <Link href="/registro">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Comienza ahora
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
