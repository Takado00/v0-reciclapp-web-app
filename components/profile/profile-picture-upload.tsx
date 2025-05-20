"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { updateUserProfile } from "@/lib/actions/profile-actions"

interface ProfilePictureUploadProps {
  userId: string
  currentImageUrl: string | null
  onUploadComplete: (url: string) => void
}

export function ProfilePictureUpload({ userId, currentImageUrl, onUploadComplete }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setError("Formato de imagen no válido. Usa JPG, PNG o GIF.")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es demasiado grande. El tamaño máximo es 5MB.")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `profile_pictures/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) {
        console.error("Error al subir imagen:", uploadError)
        throw new Error("Error al subir la imagen: " + uploadError.message)
      }

      if (!data) {
        throw new Error("No se recibieron datos de la subida de la imagen")
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath)

      if (!urlData || !urlData.publicUrl) {
        throw new Error("No se pudo obtener la URL pública de la imagen")
      }

      console.log("Imagen subida correctamente:", urlData.publicUrl)

      // Update user profile with new image URL
      const { success, error: updateError } = await updateUserProfile(userId, {
        nombre: "", // Requerido por el tipo, pero no cambiará el valor existente
        foto_perfil: urlData.publicUrl,
      })

      if (!success) {
        console.error("Error al actualizar perfil con nueva imagen:", updateError)
        throw new Error("Error al actualizar el perfil con la nueva imagen")
      }

      // Return URL to parent component
      onUploadComplete(urlData.publicUrl)
    } catch (error: any) {
      console.error("Error en el proceso de subida de imagen:", error)
      setError(error.message || "Error al subir la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1.5 shadow-md"
        disabled={isUploading}
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={isUploading}
        />
      </button>

      {error && (
        <div className="absolute bottom-full right-0 mb-2 bg-red-100 text-red-800 text-xs p-1 rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  )
}
