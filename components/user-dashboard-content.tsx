"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, MapPin, Star, TrendingUp, ArrowRight, Calendar, Clock } from "lucide-react"

export function UserDashboardContent({ user }: { user: any }) {
  // Datos de ejemplo para el dashboard
  const stats = [
    {
      title: "Materiales Guardados",
      value: "24",
      icon: <Package className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Ubicaciones Favoritas",
      value: "8",
      icon: <MapPin className="h-5 w-5 text-green-600" />,
    },
    {
      title: "Valoraciones",
      value: "15",
      icon: <Star className="h-5 w-5 text-green-600" />,
    },
  ]

  const recentMaterials = [
    {
      id: 1,
      name: "Papel y Cartón",
      category: "Papel",
      image: "/placeholder.svg?height=100&width=100",
      user: "Recicladora Bogotá",
      date: "2023-04-15",
    },
    {
      id: 2,
      name: "Botellas PET",
      category: "Plástico",
      image: "/placeholder.svg?height=100&width=100",
      user: "EcoPlásticos S.A.",
      date: "2023-04-10",
    },
    {
      id: 3,
      name: "Vidrio Transparente",
      category: "Vidrio",
      image: "/placeholder.svg?height=100&width=100",
      user: "Vidrios del Sur",
      date: "2023-04-05",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Jornada de Reciclaje",
      location: "Parque Simón Bolívar",
      date: "2023-05-15",
      time: "9:00 AM - 2:00 PM",
    },
    {
      id: 2,
      title: "Taller de Compostaje",
      location: "Jardín Botánico",
      date: "2023-05-20",
      time: "10:00 AM - 12:00 PM",
    },
    {
      id: 3,
      title: "Feria de Reciclaje Creativo",
      location: "Plaza de Bolívar",
      date: "2023-05-25",
      time: "11:00 AM - 6:00 PM",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Bienvenido de nuevo, {user?.email?.split("@")[0] || "Usuario"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/materiales">
            <Button>Ver Materiales</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <TabsTrigger value="materials">Materiales Recientes</TabsTrigger>
          <TabsTrigger value="events">Eventos Próximos</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {recentMaterials.map((material) => (
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
                        {material.user} • {new Date(material.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Link href="/materiales">
              <Button variant="outline" size="sm" className="gap-1">
                Ver Todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Link href="/eventos">
              <Button variant="outline" size="sm" className="gap-1">
                Ver Todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consejos de Reciclaje</CardTitle>
            <CardDescription>Aprende a reciclar de manera más efectiva</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Separa correctamente</h4>
                  <p className="text-sm text-muted-foreground">
                    Clasifica los residuos según su tipo: papel, plástico, vidrio, metal y orgánicos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Limpia los envases</h4>
                  <p className="text-sm text-muted-foreground">
                    Enjuaga los envases antes de reciclarlos para evitar la contaminación.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Reduce el consumo</h4>
                  <p className="text-sm text-muted-foreground">
                    Lleva tus propias bolsas al supermercado y evita productos con exceso de embalaje.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/como-reciclar">
                <Button variant="outline" size="sm" className="w-full gap-1">
                  Ver Más Consejos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubicaciones Cercanas</CardTitle>
            <CardDescription>Puntos de reciclaje cerca de ti</CardDescription>
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
                  <p className="mt-1 text-xs text-muted-foreground">A 1.2 km de distancia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Punto Ecológico Teusaquillo</h4>
                  <p className="text-sm text-muted-foreground">Carrera 15 #39-58, Teusaquillo</p>
                  <p className="mt-1 text-xs text-muted-foreground">A 2.5 km de distancia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">EcoRecicladores Centro</h4>
                  <p className="text-sm text-muted-foreground">Calle 19 #4-71, La Candelaria</p>
                  <p className="mt-1 text-xs text-muted-foreground">A 3.8 km de distancia</p>
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
