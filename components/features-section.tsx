"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Recycle, Users, Building, Award } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function FeaturesSection() {
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

  const features = [
    {
      icon: Recycle,
      title: "Para Usuarios",
      description:
        "Encuentra puntos de reciclaje cercanos, aprende a clasificar correctamente y gana recompensas por tus esfuerzos.",
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=300&auto=format&fit=crop",
    },
    {
      icon: Users,
      title: "Para Recicladores",
      description:
        "Conecta con personas y empresas que tienen materiales reciclables, optimiza tus rutas y aumenta tus ingresos.",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=300&auto=format&fit=crop",
    },
    {
      icon: Building,
      title: "Para Empresas",
      description:
        "Gestiona tus residuos de manera eficiente, cumple con normativas ambientales y mejora tu imagen corporativa.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=300&auto=format&fit=crop",
    },
    {
      icon: Award,
      title: "Impacto Ambiental",
      description:
        "Cada acción cuenta. Visualiza el impacto positivo de tus acciones en el medio ambiente y la comunidad.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=300&auto=format&fit=crop",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm dark:bg-green-800">
              Características
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Una plataforma para todos</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              ReciclApp conecta a todos los actores del ecosistema de reciclaje, facilitando la colaboración y
              maximizando el impacto positivo.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="grid gap-1">
              <div className="flex items-center gap-2">
                <feature.icon className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <div className="relative h-40 w-full rounded-lg overflow-hidden mb-2 group">
                <img
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-green-600/0 transition-colors duration-300 group-hover:bg-green-600/10"></div>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          {!isLoading && !user && (
            <Link href="/registro">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Únete a ReciclApp
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
