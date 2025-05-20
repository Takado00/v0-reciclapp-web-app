"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Recycle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  // Crear cliente de Supabase directamente
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, ingresa un correo electrónico válido.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Enviar correo de recuperación de contraseña
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/restablecer-contrasena`,
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)
      toast({
        title: "Correo enviado",
        description: "Hemos enviado un enlace de recuperación a tu correo electrónico.",
      })
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el correo de recuperación. Inténtalo de nuevo más tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <Recycle className="h-6 w-6 text-green-600" />
        <span className="font-bold">ReciclApp</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Recuperar Contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <Card>
          {isSuccess ? (
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>¡Correo enviado!</CardTitle>
                <CardDescription>
                  Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor, revisa tu bandeja de
                  entrada y sigue las instrucciones.
                </CardDescription>
                <Button asChild className="mt-4 w-full bg-green-600 hover:bg-green-700">
                  <Link href="/login">Volver al inicio de sesión</Link>
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Recuperar contraseña</CardTitle>
                <CardDescription>Ingresa tu correo electrónico registrado para recibir instrucciones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar instrucciones"}
                </Button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  <Link href="/login" className="text-green-600 underline-offset-4 hover:underline">
                    Volver al inicio de sesión
                  </Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
