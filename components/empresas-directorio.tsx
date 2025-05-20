"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Phone, Mail, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Definir tipos para las empresas y ubicaciones
interface Empresa {
  id: string
  nombre: string
  descripcion: string
  direccion: string
  telefono: string
  email: string
  sitio_web?: string
  tipo: string
  materiales_aceptados: string[]
  horario?: string
  ciudad: string
  usuario_id: string
}

export function EmpresasDirectorio() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [filterCiudad, setFilterCiudad] = useState("todas")
  const [ciudades, setCiudades] = useState<string[]>([])
  const { toast } = useToast()

  // Crear cliente de Supabase directamente
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  // Cargar empresas desde Supabase
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        // Obtener perfiles de tipo empresa y reciclador
        const { data: perfilesData, error: perfilesError } = await supabase
          .from("perfiles")
          .select("*")
          .in("tipo", ["empresa", "reciclador"])

        if (perfilesError) throw perfilesError

        // Transformar los datos para el formato que necesitamos
        const empresasData: Empresa[] = perfilesData.map((perfil) => ({
          id: perfil.id,
          nombre: perfil.nombre || perfil.nombre_empresa || "Sin nombre",
          descripcion: perfil.descripcion || "Sin descripción",
          direccion: perfil.direccion || "Sin dirección",
          telefono: perfil.telefono || "Sin teléfono",
          email: perfil.email || "Sin email",
          sitio_web: perfil.sitio_web,
          tipo: perfil.tipo,
          materiales_aceptados: perfil.materiales_aceptados || [],
          horario: perfil.horario_atencion,
          ciudad: perfil.ciudad || "Sin especificar",
          usuario_id: perfil.usuario_id,
        }))

        // Extraer ciudades únicas para el filtro
        const uniqueCiudades = Array.from(new Set(empresasData.map((e) => e.ciudad))).filter(Boolean)

        setEmpresas(empresasData)
        setFilteredEmpresas(empresasData)
        setCiudades(uniqueCiudades as string[])
      } catch (error) {
        console.error("Error al cargar empresas:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las empresas recicladoras.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmpresas()
  }, [supabase, toast])

  // Filtrar empresas cuando cambian los filtros
  useEffect(() => {
    let filtered = [...empresas]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (empresa) =>
          empresa.nombre.toLowerCase().includes(term) ||
          empresa.descripcion.toLowerCase().includes(term) ||
          empresa.materiales_aceptados.some((material) => material.toLowerCase().includes(term)),
      )
    }

    // Filtrar por tipo
    if (filterTipo !== "todos") {
      filtered = filtered.filter((empresa) => empresa.tipo === filterTipo)
    }

    // Filtrar por ciudad
    if (filterCiudad !== "todas") {
      filtered = filtered.filter((empresa) => empresa.ciudad === filterCiudad)
    }

    setFilteredEmpresas(filtered)
  }, [searchTerm, filterTipo, filterCiudad, empresas])

  // Función para obtener el nombre legible del tipo
  function getTipoNombre(tipo: string): string {
    const tipos: Record<string, string> = {
      empresa: "Empresa Recicladora",
      reciclador: "Reciclador Independiente",
    }

    return tipos[tipo] || tipo
  }

  // Función para obtener el color del badge según el tipo
  function getTipoColor(tipo: string): string {
    return tipo === "empresa" ? "bg-amber-600" : "bg-green-600"
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtrar Empresas</CardTitle>
          <CardDescription>
            Encuentra empresas recicladoras y recicladores independientes según tus necesidades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre, descripción o materiales..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="tipo" className="text-sm font-medium">
                Tipo
              </label>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="empresa">Empresas Recicladoras</SelectItem>
                  <SelectItem value="reciclador">Recicladores Independientes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="ciudad" className="text-sm font-medium">
                Ciudad
              </label>
              <Select value={filterCiudad} onValueChange={setFilterCiudad}>
                <SelectTrigger id="ciudad">
                  <SelectValue placeholder="Todas las ciudades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las ciudades</SelectItem>
                  {ciudades.map((ciudad) => (
                    <SelectItem key={ciudad} value={ciudad}>
                      {ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Resultados ({filteredEmpresas.length})</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : filteredEmpresas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center">
                No se encontraron empresas o recicladores que coincidan con tus criterios de búsqueda.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setFilterTipo("todos")
                  setFilterCiudad("todas")
                }}
              >
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmpresas.map((empresa) => (
              <Card key={empresa.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{empresa.nombre}</CardTitle>
                    <Badge className={getTipoColor(empresa.tipo)}>{getTipoNombre(empresa.tipo)}</Badge>
                  </div>
                  <CardDescription>{empresa.ciudad}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <p className="text-sm">{empresa.descripcion}</p>

                    {empresa.materiales_aceptados && empresa.materiales_aceptados.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Materiales aceptados:</p>
                        <div className="flex flex-wrap gap-1">
                          {empresa.materiales_aceptados.map((material, index) => (
                            <Badge key={index} variant="outline" className="bg-green-50">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{empresa.direccion}</span>
                      </div>

                      {empresa.telefono && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{empresa.telefono}</span>
                        </div>
                      )}

                      {empresa.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{empresa.email}</span>
                        </div>
                      )}

                      {empresa.horario && (
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{empresa.horario}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/perfil/${empresa.usuario_id}`} passHref>
                    <Button variant="outline" size="sm">
                      Ver perfil completo
                    </Button>
                  </Link>
                  <Link href={`/mensajes/nuevo?destinatario=${empresa.usuario_id}`} passHref>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Contactar
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Componente Clock para el horario
function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
