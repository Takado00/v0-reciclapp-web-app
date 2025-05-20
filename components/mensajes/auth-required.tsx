"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn } from "lucide-react"
import Link from "next/link"

export function AuthRequired() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Iniciar sesión requerido</CardTitle>
        <CardDescription>Necesitas iniciar sesión para acceder a tus mensajes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <LogIn className="h-16 w-16 text-muted-foreground" />
        </div>
        <p className="text-center text-muted-foreground">
          Para ver y enviar mensajes, por favor inicia sesión o regístrate en la plataforma.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Link href="/login?redirect=/mensajes">
          <Button>Iniciar sesión</Button>
        </Link>
        <Link href="/registro">
          <Button variant="outline">Registrarse</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
