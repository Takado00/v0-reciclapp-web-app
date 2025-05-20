"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ProfileEditForm } from "./profile-edit-form"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProfileEditProps {
  profile?: any
  onCancel: () => void
}

export function ProfileEdit({ profile: initialProfile, onCancel }: ProfileEditProps) {
  const [profile, setProfile] = useState<any>(initialProfile || null)
  const [loading, setLoading] = useState(!initialProfile)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile)
      return
    }

    async function getProfile() {
      try {
        setLoading(true)

        // Obtener usuario actual
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          throw new Error("No se ha iniciado sesión")
        }

        // Obtener perfil del usuario
        const { data: userData, error: userDataError } = await supabase
          .from("usuarios")
          .select(`
            id, 
            nombre, 
            correo, 
            telefono, 
            direccion, 
            ciudad, 
            fecha_registro, 
            ultima_conexion,
            descripcion,
            sitio_web,
            especialidad,
            horario_atencion,
            certificaciones,
            materiales_aceptados,
            foto_perfil,
            redes_sociales,
            intereses_reciclaje,
            nivel_experiencia,
            biografia,
            educacion,
            anos_experiencia,
            areas_servicio,
            ocupacion,
            roles(id, nombre)
          `)
          .eq("id", user.id)
          .single()

        if (userDataError) {
          throw userDataError
        }

        setProfile(userData)
      } catch (error: any) {
        console.error("Error al cargar perfil:", error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [supabase, router, initialProfile])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          Error al cargar el perfil: {error}. Por favor, intenta de nuevo más tarde o contacta con soporte.
        </AlertDescription>
      </Alert>
    )
  }

  if (!profile) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>No se pudo cargar la información del perfil.</AlertDescription>
      </Alert>
    )
  }

  const userType =
    profile?.roles?.nombre === "reciclador"
      ? "reciclador"
      : profile?.roles?.nombre === "empresa"
        ? "empresa"
        : "persona-natural"

  return <ProfileEditForm profile={profile} onCancel={onCancel} userType={userType} />
}
