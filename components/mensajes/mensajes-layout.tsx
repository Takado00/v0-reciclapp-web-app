"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MessageSquare, Building, Recycle, Users, Plus, ArrowLeft } from "lucide-react"

interface MensajesLayoutProps {
  children: React.ReactNode
}

export function MensajesLayout({ children }: MensajesLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("todas")
  const [isMobile, setIsMobile] = useState(false)

  // Determinar la pestaña activa según la ruta
  useEffect(() => {
    if (pathname.includes("/mensajes/recicladores")) {
      setActiveTab("recicladores")
    } else if (pathname.includes("/mensajes/empresas")) {
      setActiveTab("empresas")
    } else if (pathname.includes("/mensajes/todas")) {
      setActiveTab("todas")
    } else if (pathname === "/mensajes") {
      setActiveTab("inicio")
    } else if (pathname.includes("/mensajes/contactos")) {
      setActiveTab("contactos")
    } else {
      setActiveTab("todas")
    }
  }, [pathname])

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Función para volver atrás
  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-1" aria-label="Volver atrás">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <MessageSquare className="h-6 w-6 text-green-600" />
          <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
        </div>
        <Link href="/mensajes/contactos">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo mensaje
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-6">
        <div className={`${isMobile && pathname !== "/mensajes" && !pathname.includes("/contactos") ? "hidden" : ""}`}>
          <Tabs value={activeTab} className="w-full mb-6">
            <TabsList className="w-full">
              <Link href="/mensajes" className="w-full">
                <TabsTrigger value="inicio" className="w-full">
                  Inicio
                </TabsTrigger>
              </Link>
              <Link href="/mensajes/todas" className="w-full">
                <TabsTrigger value="todas" className="w-full">
                  Todas
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>

          <div className="space-y-2 mb-6">
            <Link href="/recicladores">
              <Button
                variant={activeTab === "recicladores" ? "default" : "outline"}
                className={`w-full justify-start ${
                  activeTab === "recicladores" ? "bg-green-600 hover:bg-green-700" : ""
                }`}
              >
                <Recycle className="h-4 w-4 mr-2" />
                Recicladores
              </Button>
            </Link>
            <Link href="/mensajes/empresas">
              <Button
                variant={activeTab === "empresas" ? "default" : "outline"}
                className={`w-full justify-start ${activeTab === "empresas" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              >
                <Building className="h-4 w-4 mr-2" />
                Empresas
              </Button>
            </Link>
            <Link href="/mensajes/contactos">
              <Button
                variant={activeTab === "contactos" ? "default" : "outline"}
                className={`w-full justify-start ${activeTab === "contactos" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
              >
                <Users className="h-4 w-4 mr-2" />
                Contactos
              </Button>
            </Link>
          </div>
        </div>

        <div className={`${isMobile && pathname === "/mensajes" ? "col-span-2" : ""}`}>
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">{children}</div>
        </div>
      </div>
    </div>
  )
}
