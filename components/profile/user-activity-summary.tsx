"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserMaterials } from "@/lib/actions/profile-actions"
import { Loader2 } from "lucide-react"

interface UserActivitySummaryProps {
  userId: string
  userRole: string
}

export function UserActivitySummary({ userId, userRole }: UserActivitySummaryProps) {
  const [activeTab, setActiveTab] = useState("recent")
  const [recentMaterials, setRecentMaterials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const materialsData = await getUserMaterials(userId)
        setRecentMaterials(materialsData.slice(0, 3)) // Solo los 3 más recientes
      } catch (error) {
        console.error("Error al cargar datos de actividad:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="recent">Todo</TabsTrigger>
            <TabsTrigger value="materials">Materiales</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <TabsContent value="recent">
                {recentMaterials.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No hay actividad reciente para mostrar</div>
                ) : (
                  <div className="space-y-4">
                    {recentMaterials.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Materiales recientes</h3>
                        <ul className="space-y-2">
                          {recentMaterials.map((material) => (
                            <li key={material.id} className="border-b pb-2">
                              <p className="font-medium">{material.titulo}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(material.fecha_publicacion).toLocaleDateString()}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="materials">
                {recentMaterials.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No hay materiales para mostrar</div>
                ) : (
                  <ul className="space-y-2">
                    {recentMaterials.map((material) => (
                      <li key={material.id} className="border-b pb-2">
                        <p className="font-medium">{material.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(material.fecha_publicacion).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
