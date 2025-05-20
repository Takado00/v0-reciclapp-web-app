"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Users, History, TrendingUp, ArrowRight, Star, MapPin, Plus } from "lucide-react"

export function RecicladorDashboardContent({ user }: { user: any }) {
  // Datos de ejemplo para el dashboard
  const stats = [
    {
      title: "Materiales Publicados",
      value: "18",
      icon: <Package className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Clientes",
      value: "32",
      icon: <Users className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Transacciones",
      value: "45",
      icon: <History className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Valoración",
      value: "4.8",
      icon: <Star className="h-5 w-5 text-green-600" />,
    },
  ]

  const activeMaterials = [
    {
      id: 1,
      name: "Papel y Cartón",
      category: "Papel",
      image: "/placeholder.svg?height=100&width=100",
      quantity: "50 kg",
      views: 120,
      date: "2023-04-15",
    },
    {
      id: 2,
      name: "Botellas PET",
      category: "Plástico",
      image: "/placeholder.svg?height=100&width=100",
      quantity: "30 kg",
      views: 85,
      date: "2023-04-10",
    },
    {
      id: 3,
      name: "Vidrio Transparente",
      category: "Vidrio",
      image: "/placeholder.svg?height=100&width=100",
      quantity: "40 kg",
      views: 65,
      date: "2023-04-05",
    },
  ]

  const topClients = [
    {
      id: 1,
      name: "Papeles Bogotá S.A.",
      image: "/placeholder.svg?height=40&width=40",
      transactions: 12,
      rating: 5,
    },
    {
      id: 2,
      name: "EcoPlásticos",
      image: "/placeholder.svg?height=40&width=40",
      transactions: 8,
      rating: 4.5,
    },
    {
      id: 3,
      name: "Vidrios del Sur",
      image: "/placeholder.svg?height=40&width=40",
      transactions: 6,
      rating: 4.8,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard de Reciclador</h2>
          <p className="text-muted-foreground">Bienvenido de nuevo, {user?.email?.split("@")[0] || "Reciclador"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/reciclador/materiales/nuevo">
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Publicar Material
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="materials">
        <TabsList>
          <TabsTrigger value="materials">Materiales Activos</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {activeMaterials.map((material) => (
              <Card key={material.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={material.image || "/placeholder.svg"}
                        alt={material.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{material.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {material.category}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {material.quantity} • {material.views} vistas
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/reciclador/materiales/${material.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Link href="/reciclador/materiales">
              <Button variant="outline" size="sm" className="gap-1">
                Ver Todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Principales Clientes</CardTitle>
              <CardDescription>Clientes con los que has realizado más transacciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={client.image || "/placeholder.svg"}
                          alt={client.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.transactions} transacciones</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{client.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento</CardTitle>
            <CardDescription>Estadísticas de tus materiales y transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Aumento en transacciones</h4>
                  <p className="text-sm text-muted-foreground">
                    Tus transacciones han aumentado un 15% en el último mes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Materiales más solicitados</h4>
                  <p className="text-sm text-muted-foreground">
                    El papel y el plástico son tus materiales más demandados.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Valoración positiva</h4>
                  <p className="text-sm text-muted-foreground">Has recibido 12 valoraciones de 5 estrellas este mes.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubicaciones de Entrega</CardTitle>
            <CardDescription>Puntos donde realizas entregas frecuentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Centro de Reciclaje Chapinero</h4>
                  <p className="text-sm text-muted-foreground">Calle 53 #13-40, Chapinero</p>
                  <p className="mt-1 text-xs text-muted-foreground">15 entregas realizadas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">EcoPlásticos Fontibón</h4>
                  <p className="text-sm text-muted-foreground">Carrera 97 #23-80, Fontibón</p>
                  <p className="mt-1 text-xs text-muted-foreground">8 entregas realizadas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Papeles Bogotá S.A.</h4>
                  <p className="text-sm text-muted-foreground">Calle 13 #65-10, Puente Aranda</p>
                  <p className="mt-1 text-xs text-muted-foreground">12 entregas realizadas</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/ubicaciones">
                <Button variant="outline" size="sm" className="w-full gap-1">
                  Ver Mapa Completo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
