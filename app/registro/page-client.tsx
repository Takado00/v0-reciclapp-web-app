"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Building2, Recycle, ArrowLeft, CheckCircle } from "lucide-react"
import { registrarUsuario } from "@/lib/actions/registro-actions"

export default function RegistroClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [direccion, setDireccion] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [userType, setUserType] = useState("usuario")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Campos específicos para empresa
  const [sitioWeb, setSitioWeb] = useState("")
  const [horarioAtencion, setHorarioAtencion] = useState("")
  const [materialesAceptados, setMaterialesAceptados] = useState("")

  // Campos específicos para reciclador
  const [especialidad, setEspecialidad] = useState("")
  const [experiencia, setExperiencia] = useState("")
  const [areasServicio, setAreasServicio] = useState("")

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const result = await registrarUsuario({
        email,
        password,
        nombre,
        userType,
        telefono,
        ciudad,
        direccion,
        descripcion,
        // Campos específicos
        especialidad,
        experiencia,
        areasServicio,
        sitioWeb,
        horarioAtencion,
        materialesAceptados,
      })

      if (result.success) {
        setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(result.error || "Error durante el registro")
      }
    } catch (error: any) {
      console.error("Error durante el registro:", error)
      setError(error.message || "Error durante el registro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Registro</CardTitle>
          <CardDescription className="text-center">Crea una cuenta para comenzar a usar la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="usuario" onValueChange={setUserType}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="usuario" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Usuario</span>
                </TabsTrigger>
                <TabsTrigger value="reciclador" className="flex items-center gap-2">
                  <Recycle className="h-4 w-4" />
                  <span className="hidden sm:inline">Reciclador</span>
                </TabsTrigger>
                <TabsTrigger value="empresa" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Empresa</span>
                </TabsTrigger>
              </TabsList>

              {/* Campos comunes para todos los tipos de usuario */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder={
                      userType === "empresa"
                        ? "Nombre de la empresa"
                        : userType === "reciclador"
                          ? "Nombre completo del reciclador"
                          : "Nombre completo"
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repite tu contraseña"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono (opcional)</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej: +57 300 123 4567"
                  />
                </div>

                <div>
                  <Label htmlFor="ciudad">Ciudad (opcional)</Label>
                  <Input
                    id="ciudad"
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Ej: Bogotá"
                  />
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección (opcional)</Label>
                  <Input
                    id="direccion"
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ej: Calle 123 #45-67"
                  />
                </div>

                {/* Campos específicos según el tipo de usuario */}
                <TabsContent value="usuario">
                  {/* No necesitamos campos adicionales para usuarios regulares */}
                </TabsContent>

                <TabsContent value="reciclador">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="especialidad">Especialidad (opcional)</Label>
                      <Input
                        id="especialidad"
                        type="text"
                        value={especialidad}
                        onChange={(e) => setEspecialidad(e.target.value)}
                        placeholder="Ej: Plásticos y metales"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experiencia">Nivel de experiencia (opcional)</Label>
                      <Select value={experiencia} onValueChange={setExperiencia}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu nivel de experiencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Principiante">Principiante</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                          <SelectItem value="Experto">Experto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="areasServicio">Áreas de servicio (opcional, separadas por comas)</Label>
                      <Input
                        id="areasServicio"
                        type="text"
                        value={areasServicio}
                        onChange={(e) => setAreasServicio(e.target.value)}
                        placeholder="Ej: Norte, Centro, Sur"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descripcionReciclador">Descripción (opcional)</Label>
                      <Input
                        id="descripcionReciclador"
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Breve descripción de tus servicios"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="empresa">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="sitioWeb">Sitio web (opcional)</Label>
                      <Input
                        id="sitioWeb"
                        type="url"
                        value={sitioWeb}
                        onChange={(e) => setSitioWeb(e.target.value)}
                        placeholder="Ej: https://miempresa.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="horarioAtencion">Horario de atención (opcional)</Label>
                      <Input
                        id="horarioAtencion"
                        type="text"
                        value={horarioAtencion}
                        onChange={(e) => setHorarioAtencion(e.target.value)}
                        placeholder="Ej: Lunes a Viernes 8am-5pm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="materialesAceptados">Materiales aceptados (opcional, separados por comas)</Label>
                      <Input
                        id="materialesAceptados"
                        type="text"
                        value={materialesAceptados}
                        onChange={(e) => setMaterialesAceptados(e.target.value)}
                        placeholder="Ej: Papel, Plástico, Vidrio"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descripcionEmpresa">Descripción (opcional)</Label>
                      <Input
                        id="descripcionEmpresa"
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Breve descripción de su empresa"
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>

              <Button type="submit" className="w-full mt-6 bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </Tabs>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-green-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
