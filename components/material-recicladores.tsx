"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, MessageSquare, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface Reciclador {
  id: string
  nombre: string
  apellido: string
  foto_perfil: string | null
  calificacion_promedio?: number
  ubicacion?: string
}

interface MaterialRecicladoresProps {
  categoria: string
  recicladores: Reciclador[]
  currentUser: any
}

export function MaterialRecicladores({ categoria, recicladores, currentUser }: MaterialRecicladoresProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRecicladores, setFilteredRecicladores] = useState(recicladores)

  // Filtrar recicladores por término de búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (!term.trim()) {
      setFilteredRecicladores(recicladores)
      return
    }

    const filtered = recicladores.filter((reciclador) => {
      const nombreCompleto = `${reciclador.nombre} ${reciclador.apellido}`.toLowerCase()
      const ubicacion = reciclador.ubicacion?.toLowerCase() || ""
      return nombreCompleto.includes(term.toLowerCase()) || ubicacion.includes(term.toLowerCase())
    })

    setFilteredRecicladores(filtered)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recicladores que aceptan {categoria}</h2>
        <p className="text-muted-foreground mb-6">
          Estos recicladores están registrados en nuestra plataforma y aceptan materiales de la categoría{" "}
          {categoria.toLowerCase()}. Contacta con ellos para coordinar la entrega o recogida del material.
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o ubicación..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {filteredRecicladores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron recicladores que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecicladores.map((reciclador) => (
              <Card key={reciclador.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted relative overflow-hidden flex-shrink-0">
                      <Image
                        src={reciclador.foto_perfil || "/placeholder.svg?height=100&width=100&query=person"}
                        alt={`${reciclador.nombre} ${reciclador.apellido}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">
                            {reciclador.nombre} {reciclador.apellido}
                          </h3>
                          <Badge variant="outline" className="mt-1">
                            Reciclador
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{reciclador.calificacion_promedio || "N/A"}</span>
                        </div>
                      </div>

                      {reciclador.ubicacion && (
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{reciclador.ubicacion}</span>
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <Link href={`/perfil/${reciclador.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            Ver perfil
                          </Button>
                        </Link>

                        {currentUser && (
                          <Link href={`/mensajes/nuevo?destinatario=${reciclador.id}`} className="flex-1">
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Contactar
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/recicladores">
            <Button variant="outline">Ver todos los recicladores</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
