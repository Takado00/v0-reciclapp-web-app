"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Phone, Mail, Send, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MaterialContactProps {
  materialId: number
  material: any
  currentUser: any
  propietario: {
    id: string
    nombre: string
    email: string
    telefono: string
  }
}

export function MaterialContact({ materialId, material, currentUser, propietario }: MaterialContactProps) {
  const [nombre, setNombre] = useState(currentUser?.user_metadata?.nombre || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [telefono, setTelefono] = useState(currentUser?.user_metadata?.telefono || "")
  const [mensaje, setMensaje] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar campos
      if (!nombre || !email || !mensaje) {
        throw new Error("Por favor, completa todos los campos obligatorios.")
      }

      if (currentUser) {
        // Si el usuario está autenticado, crear una conversación y enviar un mensaje
        // Primero verificamos si ya existe una conversación entre estos usuarios
        const { data: existingConversation, error: convCheckError } = await supabase
          .from("conversaciones")
          .select("id")
          .or(
            `and(usuario1_id.eq.${currentUser.id},usuario2_id.eq.${propietario.id}),and(usuario1_id.eq.${propietario.id},usuario2_id.eq.${currentUser.id})`,
          )
          .maybeSingle()

        if (convCheckError) {
          console.error("Error al verificar conversación:", convCheckError)
          throw new Error("Error al verificar si ya existe una conversación.")
        }

        let conversacionId = existingConversation?.id

        if (!conversacionId) {
          // Crear nueva conversación
          const { data: newConversation, error: convError } = await supabase
            .from("conversaciones")
            .insert({
              usuario1_id: currentUser.id,
              usuario2_id: propietario.id,
              ultima_actualizacion: new Date().toISOString(),
            })
            .select("id")
            .single()

          if (convError) {
            console.error("Error al crear conversación:", convError)
            throw new Error("No se pudo crear la conversación.")
          }

          conversacionId = newConversation.id
        }

        // Enviar mensaje
        const { error: msgError } = await supabase.from("mensajes").insert({
          conversacion_id: conversacionId,
          emisor_id: currentUser.id,
          receptor_id: propietario.id,
          contenido: `[Material: ${material.nombre}] ${mensaje}`,
          leido: false,
          fecha: new Date().toISOString(),
        })

        if (msgError) {
          console.error("Error al enviar mensaje:", msgError)
          throw new Error("No se pudo enviar el mensaje.")
        }

        toast({
          title: "Mensaje enviado",
          description:
            "Tu mensaje ha sido enviado correctamente. Puedes ver la conversación en tu bandeja de mensajes.",
        })

        // Redirigir a la conversación
        router.push(`/mensajes/${conversacionId}`)
      } else {
        // Si el usuario no está autenticado, enviar un mensaje de contacto tradicional
        const { error } = await supabase.from("contactos").insert({
          material_id: materialId,
          nombre,
          email,
          telefono,
          mensaje,
          fecha: new Date().toISOString(),
        })

        if (error) {
          console.error("Error al enviar contacto:", error)
          throw new Error("No se pudo enviar el mensaje de contacto.")
        }

        toast({
          title: "Mensaje enviado",
          description: "Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.",
        })

        // Limpiar formulario
        setNombre("")
        setEmail("")
        setTelefono("")
        setMensaje("")
        setShowForm(false)
      }
    } catch (error: any) {
      console.error("Error al enviar mensaje:", error)
      toast({
        variant: "destructive",
        title: "Error al enviar mensaje",
        description: error.message || "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactClick = (type: "email" | "phone") => {
    if (!currentUser) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para contactar con el propietario del material.",
        variant: "destructive",
      })
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }

    if (type === "email" && propietario.email) {
      window.location.href = `mailto:${propietario.email}`
    } else if (type === "phone" && propietario.telefono) {
      window.location.href = `tel:${propietario.telefono}`
    } else {
      // Si no hay información de contacto, mostrar el formulario
      setShowForm(true)
      toast({
        description: "Por favor, completa el formulario para contactar con el propietario del material.",
      })
    }
  }

  const handleMessageClick = () => {
    if (!currentUser) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para enviar mensajes.",
        variant: "destructive",
      })
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }

    setShowForm(!showForm)
  }

  const handleChatClick = () => {
    if (!currentUser) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para chatear.",
        variant: "destructive",
      })
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }
  }

  // Si el usuario actual es el propietario del material, mostrar un mensaje diferente
  if (currentUser && currentUser.id === propietario.id) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <h3 className="text-lg font-medium mb-2">Este es tu material</h3>
            <p className="text-muted-foreground mb-4">Puedes editar este material desde tu panel de control.</p>
            <Link href="/dashboard/materiales">
              <Button className="bg-green-600 hover:bg-green-700">Ir a mis materiales</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {propietario.telefono && (
          <Button
            onClick={() => handleContactClick("phone")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Phone className="h-4 w-4" />
            Llamar
          </Button>
        )}

        {propietario.email && (
          <Button
            onClick={() => handleContactClick("email")}
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
          >
            <Mail className="h-4 w-4" />
            Correo
          </Button>
        )}

        <Button
          onClick={handleMessageClick}
          variant={showForm ? "secondary" : "default"}
          className={`flex items-center gap-2 ${!showForm ? "bg-green-600 hover:bg-green-700" : ""}`}
        >
          <Send className="h-4 w-4" />
          {showForm ? "Cancelar" : "Mensaje"}
        </Button>

        {currentUser && propietario.id && (
          <Link
            href={`/mensajes/nuevo?destinatario=${propietario.id}&material=${materialId}`}
            onClick={handleChatClick}
          >
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
          </Link>
        )}
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  disabled={!!currentUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@ejemplo.com"
                  required
                  disabled={!!currentUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Tu número de teléfono"
                  disabled={!!currentUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensaje">Mensaje *</Label>
                <Textarea
                  id="mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
