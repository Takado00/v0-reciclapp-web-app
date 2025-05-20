"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MaterialsList } from "./materials-list"
import { TransactionsList } from "./transactions-list"
import { getUserMaterials, getUserTransactions } from "@/lib/actions/profile-actions"
import { Clock, MapPin, Edit } from "lucide-react"

interface RecicladorProfileContentProps {
  profile: any
  isOwnProfile: boolean
  userId: string
  onEdit: () => void
}

export function RecicladorProfileContent({ profile, isOwnProfile, userId, onEdit }: RecicladorProfileContentProps) {
  const [materials, setMaterials] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("info")
  const [isLoading, setIsLoading] = useState(false)

  const handleTabChange = async (value: string) => {
    setActiveTab(value)
    setIsLoading(true)

    try {
      if (value === "materials" && materials.length === 0) {
        const materialsData = await getUserMaterials(userId)
        setMaterials(materialsData)
      } else if (value === "transactions" && transactions.length === 0) {
        const transactionsData = await getUserTransactions(userId, "reciclador")
        setTransactions(transactionsData)
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="info" value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="info">Información</TabsTrigger>
        <TabsTrigger value="materials">Materiales Publicados</TabsTrigger>
        <TabsTrigger value="transactions">Transacciones</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sobre {profile.nombre}</CardTitle>
              <CardDescription>Información del reciclador</CardDescription>
            </div>
            {isOwnProfile && (
              <Button onClick={onEdit} variant="outline" size="sm" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.descripcion ? (
              <div>
                <h3 className="font-medium text-sm mb-1">Descripción</h3>
                <p className="text-sm text-muted-foreground">{profile.descripcion}</p>
              </div>
            ) : isOwnProfile ? (
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Añade una descripción para que los usuarios conozcan más sobre ti y tus servicios
                </p>
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Añadir descripción
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este reciclador no ha añadido una descripción.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.especialidad && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Especialidad</h3>
                  <p className="text-sm text-muted-foreground">{profile.especialidad}</p>
                </div>
              )}

              {profile.horario_atencion && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Horario de atención</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{profile.horario_atencion}</span>
                  </div>
                </div>
              )}

              {profile.ciudad && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Ubicación</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{profile.ciudad}</span>
                  </div>
                </div>
              )}
            </div>

            {profile.certificaciones && profile.certificaciones.length > 0 && (
              <div>
                <h3 className="font-medium text-sm mb-1">Certificaciones</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.certificaciones.map((cert: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Materiales que acepta</CardTitle>
              <CardDescription>Tipos de materiales que este reciclador procesa</CardDescription>
            </div>
            {isOwnProfile && (
              <Button onClick={onEdit} variant="outline" size="sm" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {profile.materiales_aceptados && profile.materiales_aceptados.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.materiales_aceptados.map((material: string, index: number) => (
                  <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                    {material}
                  </Badge>
                ))}
              </div>
            ) : isOwnProfile ? (
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Indica qué materiales aceptas para que los usuarios puedan encontrarte más fácilmente
                </p>
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Añadir materiales
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este reciclador no ha especificado qué materiales acepta.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="materials">
        <MaterialsList
          materials={materials}
          isLoading={isLoading}
          emptyMessage={
            isOwnProfile
              ? "Aún no has publicado materiales. Publica tus primeros materiales para comenzar a recibir contactos."
              : "Este reciclador no tiene materiales publicados actualmente."
          }
        />
      </TabsContent>

      <TabsContent value="transactions">
        <TransactionsList
          transactions={transactions}
          isLoading={isLoading}
          userRole="reciclador"
          emptyMessage={
            isOwnProfile
              ? "Aún no has realizado transacciones. Publica materiales para comenzar a vender."
              : "Este reciclador no tiene transacciones registradas."
          }
        />
      </TabsContent>
    </Tabs>
  )
}
