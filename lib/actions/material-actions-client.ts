"use client"

import { createClient } from "@/lib/supabase/client"

// Función para crear una nueva publicación de material (versión cliente)
export async function crearPublicacionClient(formData: FormData) {
  try {
    const supabase = createClient()

    // Verificar si el usuario está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Debes iniciar sesión para publicar materiales." }
    }

    // Extraer datos del formulario
    const titulo = formData.get("titulo") as string
    const descripcion = formData.get("descripcion") as string
    const material_id = Number.parseInt(formData.get("material_id") as string)
    const cantidad = Number.parseFloat(formData.get("cantidad") as string)
    const unidad_medida = formData.get("unidad_medida") as string
    const precio = Number.parseFloat(formData.get("precio") as string) || 0
    const ubicacion_id = Number.parseInt(formData.get("ubicacion_id") as string) || null
    const imagen_url = (formData.get("imagen_url") as string) || null
    const condicion = (formData.get("condicion") as string) || null
    const origen = (formData.get("origen") as string) || null
    const comentarios_adicionales = (formData.get("comentarios_adicionales") as string) || null
    const disponibilidad = (formData.get("disponibilidad") as string) || null

    // Validar datos
    if (!titulo || !material_id || !cantidad || !unidad_medida) {
      return { error: "Faltan campos obligatorios." }
    }

    // Insertar la publicación
    const { data: nuevaPublicacion, error } = await supabase
      .from("publicaciones")
      .insert({
        usuario_id: user.id,
        material_id: material_id,
        titulo: titulo,
        descripcion: descripcion,
        cantidad: cantidad,
        unidad_medida: unidad_medida,
        precio: precio,
        ubicacion_id: ubicacion_id,
        imagen_url: imagen_url,
        condicion: condicion,
        origen: origen,
        comentarios_adicionales: comentarios_adicionales,
        disponibilidad: disponibilidad,
        estado: "disponible",
        fecha_publicacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error al crear publicación:", error)
      return { error: "Error al crear la publicación. Por favor, inténtalo de nuevo." }
    }

    // Registrar en el historial
    await supabase.from("historial").insert({
      usuario_id: user.id,
      accion: "crear_publicacion",
      descripcion: `Publicación de material: ${titulo}`,
      entidad: "publicaciones",
      entidad_id: nuevaPublicacion[0].id,
      fecha_accion: new Date().toISOString(),
    })

    return { success: true, publicacionId: nuevaPublicacion[0].id }
  } catch (error) {
    console.error("Error al crear publicación:", error)
    return { error: "Ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo más tarde." }
  }
}
