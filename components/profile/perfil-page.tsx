"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import { ProfileHeader } from "./profile-header"
import { UserProfileContent } from "./user-profile-content"
import { RecicladorProfileContent } from "./reciclador-profile-content"
import { EmpresaProfileContent } from "./empresa-profile-content"
import { ProfileEdit } from "./profile-edit"

interface PerfilPageProps {
  usuario: any
  esPropio: boolean
  materiales?: any[]
  transacciones?: any[]
  ubicaciones?: any[]
}

export function PerfilPage({
  usuario,
  esPropio,
  materiales = [],
  transacciones = [],
  ubicaciones = [],
}: PerfilPageProps) {
  const [editMode, setEditMode] = useState(false)
  const router = useRouter()

  // Función para volver atrás
  const handleGoBack = () => {
    router.back()
  }

  if (editMode && esPropio) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setEditMode(false)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Editar perfil</h1>
        </div>
        <ProfileEdit usuario={usuario} onCancel={() => setEditMode(false)} />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        </div>
        {esPropio && (
          <Button onClick={() => setEditMode(true)} className="bg-green-600 hover:bg-green-700">
            <Edit className="h-4 w-4 mr-2" />
            Editar perfil
          </Button>
        )}
      </div>

      <ProfileHeader usuario={usuario} esPropio={esPropio} />

      <Tabs defaultValue="info" className="mt-8">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="info">Información</TabsTrigger>
          {usuario.tipo_usuario === "reciclador" && <TabsTrigger value="materiales">Materiales</TabsTrigger>}
          {usuario.tipo_usuario === "empresa" && <TabsTrigger value="servicios">Servicios</TabsTrigger>}
          {usuario.tipo_usuario === "empresa" && <TabsTrigger value="ubicaciones">Ubicaciones</TabsTrigger>}
          {esPropio && <TabsTrigger value="transacciones">Transacciones</TabsTrigger>}
        </TabsList>

        <TabsContent value="info" className="mt-6">
          {usuario.tipo_usuario === "reciclador" ? (
            <RecicladorProfileContent usuario={usuario} />
          ) : usuario.tipo_usuario === "empresa" ? (
            <EmpresaProfileContent usuario={usuario} />
          ) : (
            <UserProfileContent usuario={usuario} />
          )}
        </TabsContent>

        {usuario.tipo_usuario === "reciclador" && (
          <TabsContent value="materiales" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Materiales que recicla</h2>
            {/* Lista de materiales */}
          </TabsContent>
        )}

        {usuario.tipo_usuario === "empresa" && (
          <TabsContent value="servicios" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Servicios ofrecidos</h2>
            {/* Lista de servicios */}
          </TabsContent>
        )}

        {usuario.tipo_usuario === "empresa" && (
          <TabsContent value="ubicaciones" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Ubicaciones</h2>
            {/* Lista de ubicaciones */}
          </TabsContent>
        )}

        {esPropio && (
          <TabsContent value="transacciones" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Historial de transacciones</h2>
            {/* Lista de transacciones */}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
