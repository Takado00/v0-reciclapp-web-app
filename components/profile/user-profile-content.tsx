"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MaterialsList } from "./materials-list"
import { TransactionsList } from "./transactions-list"
import { getUserMaterials, getUserTransactions } from "@/lib/actions/profile-actions"
import { Edit } from "lucide-react"

interface UserProfileContentProps {
  profile: any
  isOwnProfile: boolean
  userId: string
  onEdit: () => void
}

export function UserProfileContent({ profile, isOwnProfile, userId, onEdit }: UserProfileContentProps) {
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
        const transactionsData = await getUserTransactions(userId, "usuario")
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
        <TabsTrigger value="materials">Materiales Guardados</TabsTrigger>
        <TabsTrigger value="transactions">Transacciones</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sobre {profile.nombre}</CardTitle>
              <CardDescription>Información personal y preferencias</CardDescription>
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
                <p className="text-sm text-muted-foreground mb-2">Aún no has añadido una descripción a tu perfil</p>
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Añadir descripción
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este usuario no ha añadido una descripción.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm mb-1">Miembro desde</h3>
                <p className="text-sm text-muted-foreground">{new Date(profile.fecha_registro).toLocaleDateString()}</p>
              </div>
              {profile.ciudad && (
                <div>
                  <h3 className="font-medium text-sm mb-1">Ubicación</h3>
                  <p className="text-sm text-muted-foreground">{profile.ciudad}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Intereses de Reciclaje</CardTitle>
              <CardDescription>Materiales y categorías de interés</CardDescription>
            </div>
            {isOwnProfile && (
              <Button onClick={onEdit} variant="outline" size="sm" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {profile.intereses_reciclaje && profile.intereses_reciclaje.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.intereses_reciclaje.map((interes: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {interes}
                  </span>
                ))}
              </div>
            ) : isOwnProfile ? (
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Añade tus intereses de reciclaje para recibir recomendaciones personalizadas
                </p>
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Añadir intereses
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este usuario no ha compartido sus intereses de reciclaje.</p>
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
              ? "Aún no has guardado materiales. Explora la sección de materiales para encontrar opciones interesantes."
              : "Este usuario no tiene materiales guardados."
          }
        />
      </TabsContent>

      <TabsContent value="transactions">
        <TransactionsList
          transactions={transactions}
          isLoading={isLoading}
          userRole="usuario"
          emptyMessage={
            isOwnProfile
              ? "Aún no has realizado transacciones. Explora los materiales disponibles para comenzar."
              : "Este usuario no tiene transacciones registradas."
          }
        />
      </TabsContent>
    </Tabs>
  )
}
