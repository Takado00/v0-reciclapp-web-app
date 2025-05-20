import { NextResponse } from "next/server"
import { createActionClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return NextResponse.json({ error: "Se requiere ID de usuario y contraseña" }, { status: 400 })
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar en la tabla personalizada
    const supabase = createActionClient()
    const { error } = await supabase.from("usuarios").update({ contrasena: hashedPassword }).eq("id", userId)

    if (error) {
      console.error("Error al actualizar contraseña:", error)
      return NextResponse.json({ error: "Error al actualizar la contraseña" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en la API de actualización de contraseña:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
