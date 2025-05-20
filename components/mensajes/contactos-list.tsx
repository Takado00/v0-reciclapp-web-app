"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Building, Recycle, User, MessageSquare, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Contacto {
  id: string
  nombre: string
  rol_id: number
  tipo_usuario: string
}

interface ContactosListProps {
  contactos: Contacto[]
  usuarioActualId: string
  filtroTipo?: string
}

export function ContactosList({ contactos, usuarioActualId, filtroTipo }: ContactosListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // Filtrar contactos por término de búsqueda y tipo de usuario
  const filteredContactos = contactos.filter((contacto) => {
    const nombreCompleto = contacto.nombre?.toLowerCase() || ""
    const tipoUsuario = contacto.tipo_usuario?.toLowerCase() || ""

    // Filtrar por término de búsqueda
    const matchesSearch = nombreCompleto.includes(searchTerm.toLowerCase())

    // Filtrar por tipo de usuario si se especifica
    const matchesTipo = filtroTipo ? tipoUsuario === filtroTipo.toLowerCase() : true

    return matchesSearch && matchesTipo
  })

  // Función para volver atrás
  const handleGoBack = () => {
    router.push("/mensajes")
  }

  // Renderizar un contacto individual
  const renderContacto = (contacto: Contacto) => {
    const tipoUsuario = contacto.tipo_usuario || "usuario"

    // Determinar el icono según el tipo de usuario
    let UserIcon = User
    if (tipoUsuario === "empresa") UserIcon = Building
    if (tipoUsuario === "reciclador") UserIcon = Recycle

    // Obtener las iniciales del nombre para el avatar
    const iniciales = contacto.nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    return (
      <motion.div
        key={contacto.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Link href={`/mensajes/nuevo?destinatario=${contacto.id}`}>
          <div className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-muted">{iniciales || <UserIcon className="h-6 w-6" />}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{contacto.nombre}</h3>
                <div className="flex items-center mt-1">
                  <UserIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground capitalize">{tipoUsuario}</p>
                </div>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <MessageSquare className="h-4 w-4 mr-1" />
                Mensaje
              </Button>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={handleGoBack} className="md:hidden" aria-label="Volver atrás">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">
            {filtroTipo
              ? `Contactos ${
                  filtroTipo === "reciclador" ? "recicladores" : filtroTipo === "empresa" ? "empresas" : "usuarios"
                }`
              : "Todos los contactos"}
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar contactos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContactos.length === 0 ? (
          <div className="p-8 text-center h-full flex flex-col items-center justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No hay contactos</h3>
            <p className="text-muted-foreground">
              {filtroTipo
                ? `No se encontraron ${
                    filtroTipo === "reciclador" ? "recicladores" : filtroTipo === "empresa" ? "empresas" : "usuarios"
                  } disponibles.`
                : "No se encontraron contactos disponibles."}
            </p>
          </div>
        ) : (
          <div>{filteredContactos.map(renderContacto)}</div>
        )}
      </div>
    </div>
  )
}
