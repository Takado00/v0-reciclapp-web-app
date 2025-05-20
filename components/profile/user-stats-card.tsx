import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Star, Users, TrendingUp, Calendar } from "lucide-react"

interface UserStatsCardProps {
  stats: any
  userRole: string
}

export function UserStatsCard({ stats, userRole }: UserStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Materiales</p>
              <p className="font-medium">{stats.materiales || 0}</p>
            </div>
          </div>

          {userRole === "reciclador" && (
            <>
              <div className="flex items-center gap-2">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valoración</p>
                  <p className="font-medium">{stats.valoracion || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                  <p className="font-medium">{stats.clientes || 0}</p>
                </div>
              </div>
            </>
          )}

          {userRole === "empresa" && (
            <>
              <div className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Proveedores</p>
                  <p className="font-medium">{stats.proveedores || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valoración</p>
                  <p className="font-medium">{stats.valoracion || "N/A"}</p>
                </div>
              </div>
            </>
          )}

          {userRole === "persona-natural" && (
            <>
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valoraciones</p>
                  <p className="font-medium">{stats.valoraciones || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Miembro desde</p>
                  <p className="font-medium">{new Date().getFullYear()}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
