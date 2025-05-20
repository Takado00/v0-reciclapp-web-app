"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Building, Recycle, User, Send, ArrowLeft, Info } from "lucide-react"
import { enviarMensaje } from "@/lib/actions/mensajes-actions"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Mensaje {
  id: string
  conversacion_id: string
  emisor_id: string
  contenido: string
  enviado_en: string
  leido: boolean
  emisor: {
    id: string
    nombre: string
  }
  es_propio: boolean
}

interface ConversacionDetailProps {
  conversacion: {
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
    mensajes: Mensaje[]
  }
  usuarioActualId: string
}

export function ConversacionDetail({ conversacion, usuarioActualId }: ConversacionDetailProps) {
  const [mensaje, setMensaje] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mensajesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Determinar el tipo de usuario para mostrar el icono correspondiente
  const tipoUsuario = conversacion.otroUsuario.tipo_usuario || "usuario"
  let UserIcon = User
  if (tipoUsuario === "empresa") UserIcon = Building
  if (tipoUsuario === "reciclador") UserIcon = Recycle

  // Obtener las iniciales del nombre para el avatar
  const iniciales = conversacion.otroUsuario.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  // Función para volver atrás
  const handleGoBack = () => {
    router.push("/mensajes")
  }

  // Función para enviar un mensaje
  const handleEnviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mensaje.trim()) return

    setEnviando(true)
    setError(null)

    try {
      const { success, error } = await enviarMensaje(conversacion.id, usuarioActualId, mensaje)

      if (!success) {
        throw new Error(error || "Error al enviar el mensaje")
      }

      setMensaje("")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Error al enviar el mensaje")
      console.error("Error al enviar mensaje:", err)
    } finally {
      setEnviando(false)
    }
  }

  // Hacer scroll al último mensaje cuando se carga la conversación o llega un nuevo mensaje
  useEffect(() => {
    if (mensajesContainerRef.current) {
      mensajesContainerRef.current.scrollTop = mensajesContainerRef.current.scrollHeight
    }
  }, [conversacion.mensajes])

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
      {/* Cabecera de la conversación */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleGoBack} className="md:hidden" aria-label="Volver atrás">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted">{iniciales || <UserIcon className="h-5 w-5" />}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{conversacion.otroUsuario.nombre}</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <UserIcon className="h-3 w-3 mr-1" />
              <span className="capitalize">{tipoUsuario}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/perfil/${conversacion.otroUsuario.id}`}>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Info className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Contenedor de mensajes */}
      <div ref={mensajesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {conversacion.mensajes.map((msg) => {
            const esEmisor = msg.emisor_id === usuarioActualId
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${esEmisor ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${esEmisor ? "bg-green-600 text-white" : "bg-muted"}`}>
                  <p>{msg.contenido}</p>
                  <div className={`text-xs mt-1 ${esEmisor ? "text-green-100" : "text-muted-foreground"}`}>
                    {formatDistanceToNow(new Date(msg.enviado_en), {
                      addSuffix: true,
                      locale: es,
                    })}
                    {esEmisor && <span className="ml-2">{msg.leido ? "• Leído" : "• Enviado"}</span>}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Formulario para enviar mensajes */}
      <div className="p-4 border-t">
        {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
        <form onSubmit={handleEnviarMensaje} className="flex items-end gap-2">
          <Textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="min-h-[60px] resize-none"
          />
          <Button
            type="submit"
            disabled={enviando || !mensaje.trim()}
            className="bg-green-600 hover:bg-green-700 h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
