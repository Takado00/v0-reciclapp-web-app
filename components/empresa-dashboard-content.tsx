"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Package, Recycle, TrendingUp, Users } from "lucide-react"

// Datos de ejemplo para el dashboard de empresa
const dashboardData = {
  stats: {
    materialesComprados: 1250,
    materialesReciclados: 980,
    proveedores: 45,
  },
  principalesProveedores: [
    {
      id: 1,
      nombre: "Juan Pérez",
      avatar: "/placeholder.svg?height=40&width=40",
      tipo: "Reciclador",
      calificacion: 4.8,
      transacciones: 24,
    },
    {
      id: 2,
      nombre: "María López",
      avatar: "/placeholder.svg?height=40&width=40",
      tipo: "Reciclador",
      calificacion: 4.5,
      transacciones: 18,
    },
    {
      id: 3,
      nombre: "Carlos Rodríguez",
      avatar: "/placeholder.svg?height=40&width=40",
      tipo: "Reciclador",
      calificacion: 4.9,
      transacciones: 15,
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      avatar: "/placeholder.svg?height=40&width=40",
      tipo: "Reciclador",
      calificacion: 4.7,
      transacciones: 12,
    },
  ],
  materialesRecientes: [
    {
      id: 1,
      nombre: "Papel y Cartón",
      imagen: "/placeholder.svg?height=100&width=100",
      cantidad: "500 kg",
      fecha: "2023-05-10",
    },
    {
      id: 2,
      nombre: "Plástico PET",
      imagen: "/placeholder.svg?height=100&width=100",
      cantidad: "300 kg",
      fecha: "2023-05-09",
    },
    {
      id: 3,
      nombre: "Vidrio",
      imagen: "/placeholder.svg?height=100&width=100",
      cantidad: "200 kg",
      fecha: "2023-05-08",
    },
    {
      id: 4,
      nombre: "Aluminio",
      imagen: "/placeholder.svg?height=100&width=100",
      cantidad: "100 kg",
      fecha: "2023-05-07",
    },
  ],
}

export function EmpresaDashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard de Empresa</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span>Mayo 2023</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="providers">Proveedores</TabsTrigger>
          <TabsTrigger value="materials">Materiales</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Materiales Recibidos</p>
                    <h3 className="text-2xl font-bold">{dashboardData.stats.materialesComprados} kg</h3>
                  </div>
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span>12% más que el mes pasado</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Materiales Reciclados</p>
                    <h3 className="text-2xl font-bold">{dashboardData.stats.materialesReciclados} kg</h3>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Recycle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span>8% más que el mes pasado</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Proveedores Activos</p>
                    <h3 className="text-2xl font-bold">{dashboardData.stats.proveedores}</h3>
                  </div>
                  <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                    <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span>5 nuevos este mes</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas actividades realizadas por tu empresa</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Papel y Cartón</TableCell>
                      <TableCell>Juan Pérez</TableCell>
                      <TableCell>500 kg</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          Completado
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Plástico PET</TableCell>
                      <TableCell>María López</TableCell>
                      <TableCell>300 kg</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        >
                          En proceso
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Vidrio</TableCell>
                      <TableCell>Carlos Rodríguez</TableCell>
                      <TableCell>200 kg</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          Completado
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Aluminio</TableCell>
                      <TableCell>Ana Martínez</TableCell>
                      <TableCell>100 kg</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          Completado
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto gap-1">
                  <span>Ver todas las actividades</span>
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Principales Proveedores</CardTitle>
                <CardDescription>Proveedores con más colaboraciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.principalesProveedores.map((proveedor) => (
                    <div key={proveedor.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={proveedor.avatar || "/placeholder.svg"} alt={proveedor.nombre} />
                        <AvatarFallback>{proveedor.nombre.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{proveedor.nombre}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {proveedor.tipo}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{proveedor.transacciones}</p>
                        <p className="text-xs text-muted-foreground">colaboraciones</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto gap-1">
                  <Users className="h-4 w-4" />
                  <span>Ver todos los proveedores</span>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Materiales Recibidos Recientemente</CardTitle>
              <CardDescription>Últimos materiales recibidos por tu empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {dashboardData.materialesRecientes.map((material) => (
                  <Card key={material.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src={material.imagen || "/placeholder.svg"}
                        alt={material.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm">{material.nombre}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">{material.cantidad}</p>
                        <p className="text-xs text-muted-foreground">{material.fecha}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto gap-1">
                <Package className="h-4 w-4" />
                <span>Ver todos los materiales</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proveedores</CardTitle>
              <CardDescription>Lista de todos los proveedores con los que has trabajado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dashboardData.principalesProveedores.map((proveedor) => (
                  <Card key={proveedor.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={proveedor.avatar || "/placeholder.svg"} alt={proveedor.nombre} />
                          <AvatarFallback>{proveedor.nombre.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{proveedor.nombre}</p>
                          <Badge variant="secondary" className="mt-1">
                            {proveedor.tipo}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Colaboraciones</p>
                          <p className="font-medium mt-1">{proveedor.transacciones}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          Ver Perfil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Materiales</CardTitle>
              <CardDescription>Todos los materiales recibidos por tu empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {dashboardData.materialesRecientes.map((material) => (
                  <Card key={material.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={material.imagen || "/placeholder.svg"}
                        alt={material.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{material.nombre}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-muted-foreground">Cantidad:</p>
                        <p className="text-sm font-medium">{material.cantidad}</p>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-muted-foreground">Fecha:</p>
                        <p className="text-sm">{material.fecha}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
