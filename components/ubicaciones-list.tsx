"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Clock, ExternalLink, Search } from "lucide-react"

// Datos de ejemplo para ubicaciones
const ubicacionesData = [
  {
    id: 1,
    name: "Centro de Reciclaje Chapinero",
    address: "Calle 53 #13-40, Chapinero",
    type: "Centro de acopio",
    materials: ["Papel", "Plástico", "Vidrio", "Metal"],
    phone: "+57 300 123 4567",
    hours: "Lun-Vie: 8am-5pm, Sáb: 9am-1pm",
  },
  {
    id: 2,
    name: "Punto Ecológico Kennedy",
    address: "Carrera 78B #38-30 Sur, Kennedy",
    type: "Punto de reciclaje",
    materials: ["Papel", "Plástico", "Vidrio"],
    phone: "+57 300 765 4321",
    hours: "Lun-Sáb: 7am-7pm",
  },
  {
    id: 3,
    name: "EcoRecicladores Suba",
    address: "Calle 145 #91-19, Suba",
    type: "Recicladores",
    materials: ["Papel", "Cartón", "Plástico", "Metal"],
    phone: "+57 300 987 6543",
    hours: "Lun-Vie: 8am-6pm",
  },
  {
    id: 4,
    name: "Reciclajes Industriales Fontibón",
    address: "Carrera 97 #23-80, Fontibón",
    type: "Empresa",
    materials: ["Metal", "Electrónicos", "Plástico industrial"],
    phone: "+57 300 456 7890",
    hours: "Lun-Vie: 7am-4pm",
  },
  {
    id: 5,
    name: "Punto Verde Usaquén",
    address: "Calle 116 #7-15, Usaquén",
    type: "Punto de reciclaje",
    materials: ["Papel", "Plástico", "Vidrio", "Orgánicos"],
    phone: "+57 300 234 5678",
    hours: "Todos los días: 8am-8pm",
  },
]

export function UbicacionesList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUbicaciones = ubicacionesData.filter(
    (ubicacion) =>
      ubicacion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ubicacion.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ubicacion.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ubicacion.materials.some((material) => material.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Centro de acopio":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "Punto de reciclaje":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "Recicladores":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
      case "Empresa":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar ubicaciones..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {filteredUbicaciones.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron ubicaciones que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          filteredUbicaciones.map((ubicacion) => (
            <Card key={ubicacion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{ubicacion.name}</h3>
                  <Badge variant="outline" className={getTypeColor(ubicacion.type)}>
                    {ubicacion.type}
                  </Badge>
                </div>

                <div className="flex items-start gap-2 mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{ubicacion.address}</p>
                </div>

                <div className="flex items-start gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{ubicacion.phone}</p>
                </div>

                <div className="flex items-start gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{ubicacion.hours}</p>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Materiales aceptados:</p>
                  <div className="flex flex-wrap gap-1">
                    {ubicacion.materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <Link href={`/ubicaciones/${ubicacion.id}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
