"use client"

import { useState } from "react"
import { UserProfileContent } from "./user-profile-content"
import { RecicladorProfileContent } from "./reciclador-profile-content"
import { EmpresaProfileContent } from "./empresa-profile-content"
import { ProfileHeader } from "./profile-header"
import { ProfileEdit } from "./profile-edit"
import { Button } from "@/components/ui/button"
import { Edit, ArrowLeft } from "lucide-react"

interface ProfileViewProps {
  profile: any
  stats: any
  isOwnProfile: boolean
  userId: string
}

export function ProfileView({ profile, stats, isOwnProfile, userId }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al perfil</span>
          </Button>
          <h2 className="text-2xl font-bold">Editar perfil</h2>
        </div>
        <ProfileEdit profile={profile} onCancel={handleCancelEdit} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Perfil</h2>
        {isOwnProfile && (
          <Button onClick={handleEdit} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Edit className="h-4 w-4" />
            Editar perfil
          </Button>
        )}
      </div>

      <ProfileHeader profile={profile} stats={stats} />

      {/* Descripción o biografía */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">Acerca de</h3>
        <p className="mt-1 text-sm text-gray-900">
          {profile.descripcion || profile.bio || profile.biografia || "Sin descripción disponible"}
        </p>
      </div>

      {profile.roles?.nombre === "reciclador" ? (
        <RecicladorProfileContent profile={profile} isOwnProfile={isOwnProfile} userId={userId} onEdit={handleEdit} />
      ) : profile.roles?.nombre === "empresa" ? (
        <EmpresaProfileContent profile={profile} isOwnProfile={isOwnProfile} userId={userId} onEdit={handleEdit} />
      ) : (
        <UserProfileContent profile={profile} isOwnProfile={isOwnProfile} userId={userId} onEdit={handleEdit} />
      )}
    </div>
  )
}
