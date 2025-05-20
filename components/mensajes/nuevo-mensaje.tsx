"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Send, ArrowLeft, Paperclip, Smile, ImageIcon, User, Building, Recycle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { MensajesPredeterminados } from "./mensajes-predeterminados"

interface NuevoMensajeProps {
  currentUser: any
  destinatario: any
  material?: any
}

export function NuevoMensaje({ currentUser, destinatario, material }: NuevoMensajeProps) {
  const [mensaje, setMensaje] = useState(material ? `Hola, estoy interesado en tu material "${material.nombre}". ` : "")
  const [isLoading, setIsLoading] = useState(false)
  const [contactando, setContactando] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Determinar el tipo de destinatario
  const tipoDestinatario =
    destinatario.tipo_usuario === "reciclador"
      ? "reciclador"
      : destinatario.tipo_usuario === "empresa"
        ? "empresa"
        : "usuario"

  // Determinar el icono según el tipo de usuario
  let UserIcon = User
  if (tipoDestinatario === "empresa") UserIcon = Building
  if (tipoDestinatario === "reciclador") UserIcon = Recycle

  const handleSelectMensajePredeterminado = (mensajePredeterminado: string) => {
    setMensaje(mensajePredeterminado)
  }

  const handleEnviarMensaje = async () => {
    if (!mensaje.trim()) return

    setIsLoading(true)
    setContactando(true)

    try {
      // Verificar que ambos usuarios existen
      const { data: usuariosExistentes, error: errorUsuarios } = await supabase
        .from("usuarios")
        .select("id")
        .in("id", [currentUser.id, destinatario.id])

      if (errorUsuarios) throw errorUsuarios

      if (!usuariosExistentes || usuariosExistentes.length !== 2) {
        throw new Error("Uno o ambos usuarios no existen en la base de datos")
      }

      // Crear nueva conversación
      const { data: newConversation, error: convError } = await supabase
        .from("conversaciones")
        .insert({
          usuario1_id: currentUser.id,
          usuario2_id: destinatario.id,
          ultimo_mensaje: mensaje,
          ultima_actualizacion: new Date().toISOString(),
        })
        .select("id")
        .single()

      if (convError) throw convError

      // Enviar mensaje
      const { error: msgError } = await supabase.from("mensajes").insert({
        conversacion_id: newConversation.id,
        emisor_id: currentUser.id,
        receptor_id: destinatario.id,
        contenido: mensaje,
        leido: false,
      })

      if (msgError) throw msgError

      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado correctamente.",
      })

      // Redirigir a la conversación
      router.push(`/mensajes/${newConversation.id}`)
    } catch (error: any) {
      console.error("Error al enviar mensaje:", error)
      toast({
        variant: "destructive",
        title: "Error al enviar mensaje",
        description: error.message || "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.",
      })
      setContactando(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Asegurarse de que tenemos un nombre para mostrar
  const nombreCompleto = destinatario.nombre
    ? `${destinatario.nombre || ""} ${destinatario.apellido || ""}`.trim()
    : "Usuario"

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Link href="/mensajes" className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/perfil/${destinatario.id}`}>
            <div className="w-10 h-10 rounded-full bg-muted relative overflow-hidden">
              <Image
                src={destinatario.foto_perfil || "/placeholder.svg?height=100&width=100&query=profile"}
                alt={nombreCompleto}
                fill
                className="object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center bg-muted">
                <UserIcon
                  className={`h-2.5 w-2.5 ${
                    tipoDestinatario === "reciclador"
                      ? "text-green-600"
                      : tipoDestinatario === "empresa"
                        ? "text-blue-600"
                        : "text-gray-600"
                  }`}
                />
              </div>
            </div>
          </Link>
          <Link href={`/perfil/${destinatario.id}`} className="flex-1">
            <div>
              <h3 className="font-medium">Nuevo mensaje para {nombreCompleto}</h3>
              <p className="text-xs text-muted-foreground">
                {tipoDestinatario === "reciclador"
                  ? "Reciclador"
                  : tipoDestinatario === "empresa"
                    ? "Empresa"
                    : "Usuario"}
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {material && (
          <motion.div
            className="mb-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-sm font-medium mb-1">Material relacionado:</h4>
            <div className="flex items-center gap-3">
              {material.imagen_url ? (
                <div className="w-12 h-12 rounded bg-muted relative overflow-hidden">
                  <Image
                    src={material.imagen_url || "/placeholder.svg?height=100&width=100&query=recycling"}
                    alt={material.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                  <Paperclip className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{material.nombre}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{material.descripcion}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-4">
          <MensajesPredeterminados
            tipoDestinatario={tipoDestinatario}
            onSelectMensaje={handleSelectMensajePredeterminado}
          />
        </div>

        <div className="flex-1">
          <Textarea
            placeholder={`Escribe tu mensaje para ${nombreCompleto}...`}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="resize-none h-full min-h-[200px] p-4"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Smile className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <Button
            onClick={handleEnviarMensaje}
            disabled={isLoading || !mensaje.trim()}
            className={`${
              tipoDestinatario === "reciclador" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {contactando ? (
              <>Contactando...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar mensaje
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
