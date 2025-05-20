"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function publicacionRapida(userId: string, categoria = "otros") {
  try {
    const supabase = createActionClient()

    // Crear un material básico
    const { data: material, error: materialError } = await supabase
      .from("materiales")
      .insert({
        nombre: "Material reciclable",
        descripcion: "Material disponible para reciclar",
        categoria,
        cantidad: 1,
        unidad_medida: "unidad",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (materialError) {
      console.error("Error al crear material:", materialError)
      return { success: false, error: "Error al crear el material" }
    }

    // Registrar en el historial
    await supabase.from("historial").insert({
      usuario_id: userId,
      entidad: "materiales",
      entidad_id: material.id,
      accion: "crear",
      descripcion: `Publicación rápida de material`,
      fecha_accion: new Date().toISOString(),
    })

    // Revalidar la ruta de materiales para actualizar la lista
    revalidatePath("/materiales")
    revalidatePath("/")

    return {
      success: true,
      materialId: material.id,
    }
  } catch (error) {
    console.error("Error al crear publicación rápida:", error)
    return {
      success: false,
      error: "Error al procesar la solicitud",
    }
  }
}
