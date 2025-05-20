import { createServerClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { User, MessageSquare } from "lucide-react"
import Link from "next/link"

export default async function RecicladorListPage() {
  const supabase = createServerClient()

  // Obtener todos los recicladores (usuarios con rol_id = 2)
  const { data: recicladores, error } = await supabase.from("usuarios").select("id, nombre").eq("rol_id", 2)

  if (error) {
    console.error("Error al obtener recicladores:", error)
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Recicladores</h1>
        <p className="text-red-500">Error al cargar los recicladores. Por favor, intenta de nuevo más tarde.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recicladores</h1>

      {recicladores && recicladores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recicladores.map((reciclador) => (
            <Card key={reciclador.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-green-100 text-green-800">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{reciclador.nombre}</h3>
                    <p className="text-sm text-gray-500">Reciclador</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex space-x-2">
                <Link href={`/perfil/${reciclador.id}`} className="flex-1">
                  <Button size="sm" className="w-full" variant="outline">
                    Ver perfil
                  </Button>
                </Link>
                <Link
                  href={`/mensajes/contactar?id=${reciclador.id}&nombre=${encodeURIComponent(reciclador.nombre || "Reciclador")}`}
                  className="flex-1"
                  prefetch={false}
                >
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Contactar
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No se encontraron recicladores registrados.</p>
      )}
    </div>
  )
}
