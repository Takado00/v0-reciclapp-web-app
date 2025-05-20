"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Building2, Recycle, ArrowLeft } from "lucide-react"

export default function RegistroPage() {
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
  const supabase = createClient()

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
      // 1. Registrar usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      // Mapeo de tipos de usuario a roles
      const rolMapping: Record<string, number> = {
        usuario: 1,
        reciclador: 2,
        empresa: 3,
        admin: 4,
      }

      // Obtener el ID del rol según el tipo de usuario
      const rolId = rolMapping[userType]

      if (!rolId) {
        throw new Error(`Tipo de usuario no válido: ${userType}`)
      }

      // Preparar datos básicos para todos los tipos de usuario
      const userData: any = {
        id: authData.user?.id,
        nombre,
        correo: email,
        contrasena: password, // Nota: en producción, no almacenar contraseñas en texto plano
        rol_id: rolId,
        telefono: telefono || null,
        ciudad: ciudad || null,
        direccion: direccion || null,
        fecha_registro: new Date().toISOString(),
        activo: true,
        tipo_usuario: userType, // Añadimos un campo adicional para mayor claridad
      }

      // Añadir campos específicos según el tipo de usuario
      if (userType === "empresa") {
        userData.sitio_web = sitioWeb || null
        userData.horario_atencion = horarioAtencion || null
        userData.materiales_aceptados = materialesAceptados
          ? materialesAceptados.split(",").map((item) => item.trim())
          : null
        userData.descripcion = descripcion || null
      } else if (userType === "reciclador") {
        userData.especialidad = especialidad || null
        userData.nivel_experiencia = experiencia || null
        userData.areas_servicio = areasServicio ? areasServicio.split(",").map((item) => item.trim()) : null
        userData.descripcion = descripcion || null
      }

      console.log("Datos a insertar:", userData)

      // 2. Insertar datos en la tabla usuarios
      const { error: profileError } = await supabase.from("usuarios").insert([userData])

      if (profileError) {
        console.error("Error al insertar usuario:", profileError)
        throw new Error(`Error al crear el perfil: ${profileError.message}`)
      }

      // 3. Crear registro en la tabla de roles_usuarios si existe
      try {
        const { error: rolError } = await supabase.from("roles_usuarios").insert([
          {
            usuario_id: authData.user?.id,
            rol_id: rolId,
            fecha_asignacion: new Date().toISOString(),
          },
        ])

        if (rolError && !rolError.message.includes("does not exist")) {
          console.warn("Error al asignar rol:", rolError)
        }
      } catch (err) {
        // Si la tabla no existe, ignoramos este error
        console.log("La tabla roles_usuarios no existe, continuando...")
      }

      setSuccess("Registro exitoso. Por favor inicia sesión.")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
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
