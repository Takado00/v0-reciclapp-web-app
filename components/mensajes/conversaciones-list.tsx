"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Building, Recycle, User, Clock, MessageSquare, Plus, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Conversacion {
  id: string
  ultimo_mensaje: string | null
  ultima_actualizacion: string
  mensajes_no_leidos: number
  otroUsuario: {
    id: string
    nombre: string
    rol_id: number
    tipo_usuario?: string
  }
}

interface ConversacionesListProps {
  conversaciones: Conversacion[]
  userId: string
  filtroTipo?: string
}

export function ConversacionesList({ conversaciones, userId, filtroTipo }: ConversacionesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // Filtrar conversaciones por término de búsqueda y tipo de usuario
  const filteredConversaciones = conversaciones.filter((conv) => {
    const nombreCompleto = conv.otroUsuario.nombre?.toLowerCase() || ""
    const tipoUsuario = conv.otroUsuario.tipo_usuario?.toLowerCase() || ""

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

  // Renderizar una conversación individual
  const renderConversacion = (conv: Conversacion) => {
    const tipoUsuario = conv.otroUsuario.tipo_usuario || "usuario"

    // Determinar el icono según el tipo de usuario
    let UserIcon = User
    if (tipoUsuario === "empresa") UserIcon = Building
    if (tipoUsuario === "reciclador") UserIcon = Recycle

    // Obtener las iniciales del nombre para el avatar
    const iniciales = conv.otroUsuario.nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    return (
      <motion.div
        key={conv.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Link href={`/mensajes/${conv.id}`}>
          <div
            className={`p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer ${
              conv.mensajes_no_leidos > 0 ? "bg-green-50 dark:bg-green-900/10" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-muted">{iniciales || <UserIcon className="h-6 w-6" />}</AvatarFallback>
                </Avatar>
                {conv.mensajes_no_leidos > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium bg-green-600 text-white rounded-full">
                    {conv.mensajes_no_leidos}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{conv.otroUsuario.nombre}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(conv.ultima_actualizacion), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center">
                    <UserIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground capitalize">{tipoUsuario}</p>
                  </div>
                  {conv.ultimo_mensaje && (
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{conv.ultimo_mensaje}</p>
                  )}
                </div>
              </div>
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
              ? `Conversaciones con ${
                  filtroTipo === "reciclador" ? "recicladores" : filtroTipo === "empresa" ? "empresas" : "usuarios"
                }`
              : "Todas las conversaciones"}
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar conversaciones..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversaciones.length === 0 ? (
          <div className="p-8 text-center h-full flex flex-col items-center justify-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No hay conversaciones</h3>
            <p className="text-muted-foreground">
              {filtroTipo
                ? `Aún no has iniciado ninguna conversación con ${
                    filtroTipo === "reciclador" ? "recicladores" : filtroTipo === "empresa" ? "empresas" : "usuarios"
                  }.`
                : "Aún no has iniciado ninguna conversación."}
            </p>
            <Link href="/mensajes/contactos" className="mt-4">
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Iniciar nueva conversación
              </Button>
            </Link>
          </div>
        ) : (
          <div>{filteredConversaciones.map(renderConversacion)}</div>
        )}
      </div>
    </div>
  )
}
