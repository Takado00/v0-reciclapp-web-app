"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function MaterialImageUpload() {
  const [images, setImages] = useState<{ url: string; file: File }[]>([])
  const [uploading, setUploading] = useState(false)
  const supabase = createClientComponentClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files).slice(0, 3 - images.length)
    if (newFiles.length === 0) return

    setUploading(true)

    try {
      const newImages = await Promise.all(
        newFiles.map(async (file) => {
          // Crear una URL temporal para previsualización
          const previewUrl = URL.createObjectURL(file)
          return { url: previewUrl, file }
        }),
      )

      setImages([...images, ...newImages].slice(0, 3))
    } catch (error) {
      console.error("Error al procesar las imágenes:", error)
      alert("Error al procesar las imágenes. Inténtalo de nuevo.")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    // Liberar la URL de objeto si es una previsualización
    if (newImages[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(newImages[index].url)
    }
    newImages.splice(index, 1)
    setImages(newImages)
  }

  // Esta función se ejecutará al enviar el formulario
  const uploadImagesToStorage = async () => {
    if (images.length === 0) return []

    try {
      const uploadedUrls = await Promise.all(
        images.map(async (image, index) => {
          const fileExt = image.file.name.split(".").pop()
          const fileName = `${Date.now()}-${index}.${fileExt}`
          const filePath = `material-images/${fileName}`

          const { data, error } = await supabase.storage.from("materials").upload(filePath, image.file)

          if (error) throw error

          // Obtener la URL pública
          const { data: publicUrlData } = supabase.storage.from("materials").getPublicUrl(filePath)

          return publicUrlData.publicUrl
        }),
      )

      return uploadedUrls
    } catch (error) {
      console.error("Error al subir imágenes:", error)
      throw error
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={`Material preview ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {Array(3 - images.length)
          .fill(0)
          .map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square rounded-md border border-dashed flex items-center justify-center bg-muted/50"
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          ))}
      </div>

      <div className="flex items-center justify-center">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading || images.length >= 3}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            disabled={uploading || images.length >= 3}
            className="cursor-pointer"
            asChild
          >
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Subiendo..." : "Subir imágenes"}
            </span>
          </Button>
        </label>
      </div>

      {/* Campo oculto para pasar las URLs al formulario */}
      <input type="hidden" name="imagen_url" value={images.length > 0 ? images[0].url : ""} />
    </div>
  )
}
