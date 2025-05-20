"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Plus, Search, Building, Recycle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Conversacion {
  id: string
  ultimo_mensaje: string
  ultima_actualizacion: string
  mensajes_no_leidos: number
  otroUsuario: {
    id: string
    nombre: string
    foto_perfil: string | null
    tipo_usuario: string
  }
}

interface MensajesListProps {
  conversaciones: Conversacion[]
  userId: string
}

export function MensajesList({ conversaciones, userId }: MensajesListProps) {
  const [busqueda, setBusqueda] = useState("")

  // Filtrar conversaciones por búsqueda
  const conversacionesFiltradas = conversaciones.filter((conv) =>
    conv.otroUsuario.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  )

  // Función para obtener las iniciales del nombre
  const obtenerIniciales = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Función para obtener el color de fondo según el tipo de usuario
  const obtenerColorFondo = (tipoUsuario: string) => {
    switch (tipoUsuario.toLowerCase()) {
      case "reciclador":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "empresa":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Función para obtener el icono según el tipo de usuario
  const obtenerIcono = (tipoUsuario: string) => {
    switch (tipoUsuario.toLowerCase()) {
      case "reciclador":
        return <Recycle className="h-4 w-4" />
      case "empresa":
        return <Building className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 rounded-lg border">
      {/* Cabecera */}
      <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-950 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Mensajes</h1>
        </div>
        <Link href="/mensajes/contactos">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversación..."
            className="pl-9"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {conversacionesFiltradas.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {busqueda ? "No se encontraron conversaciones" : "No tienes conversaciones aún"}
          </div>
        ) : (
          <ul className="divide-y">
            {conversacionesFiltradas.map((conv) => (
              <li key={conv.id}>
                <Link href={`/mensajes/${conv.id}`}>
                  <div className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                    <Avatar className="h-12 w-12">
                      {conv.otroUsuario.foto_perfil ? (
                        <AvatarImage
                          src={conv.otroUsuario.foto_perfil || "/placeholder.svg"}
                          alt={conv.otroUsuario.nombre}
                        />
                      ) : (
                        <AvatarFallback>{obtenerIniciales(conv.otroUsuario.nombre)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{conv.otroUsuario.nombre}</h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${obtenerColorFondo(conv.otroUsuario.tipo_usuario)}`}
                          >
                            <span className="flex items-center gap-1">
                              {obtenerIcono(conv.otroUsuario.tipo_usuario)}
                              {conv.otroUsuario.tipo_usuario}
                            </span>
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(conv.ultima_actualizacion), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground truncate">{conv.ultimo_mensaje}</p>
                        {conv.mensajes_no_leidos > 0 && (
                          <Badge className="ml-2 bg-green-600">{conv.mensajes_no_leidos}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón flotante para nueva conversación (visible en móvil) */}
      <div className="fixed bottom-20 right-6 md:hidden">
        <Link href="/mensajes/contactos">
          <Button size="icon" className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
