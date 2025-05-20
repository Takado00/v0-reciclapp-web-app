"use server"

import { redirect } from "next/navigation"
import { createActionClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

// Tipos para las funciones de autenticación
type LoginData = {
  email: string
  password: string
  userType: string
}

type RegisterData = {
  nombre: string
  email: string
  password: string
  userType: string
}

type AuthResult = {
  success: boolean
  error?: string
  userId?: string
  redirectTo?: string // Añadir esta línea para redirigir al perfil
}

// Función para iniciar sesión
export async function loginUser(data: LoginData): Promise<AuthResult> {
  try {
    const supabase = createActionClient()

    // Buscar el usuario por correo electrónico
    const { data: usuario, error: userError } = await supabase
      .from("usuarios")
      .select("id, nombre, correo, contrasena, rol_id, roles(nombre)")
      .eq("correo", data.email)
      .single()

    if (userError || !usuario) {
      return {
        success: false,
        error: "Usuario no encontrado. Por favor, verifica tu correo electrónico.",
      }
    }

    // Verificar que el rol coincida con el tipo de usuario seleccionado
    const rolNombre = usuario.roles?.nombre
    if (rolNombre !== data.userType) {
      return {
        success: false,
        error: `Este usuario no está registrado como ${data.userType}. Por favor, selecciona el tipo de usuario correcto.`,
      }
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(data.password, usuario.contrasena)
    if (!passwordMatch) {
      return {
        success: false,
        error: "Contraseña incorrecta. Por favor, inténtalo de nuevo.",
      }
    }

    // Crear una sesión de Supabase
    const { data: session, error: sessionError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (sessionError) {
      console.error("Error de sesión:", sessionError)
      return {
        success: false,
        error: "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
      }
    }

    // Actualizar última conexión
    await supabase.from("usuarios").update({ ultima_conexion: new Date().toISOString() }).eq("id", usuario.id)

    return {
      success: true,
      userId: usuario.id,
      redirectTo: "/mi-perfil", // Añadir esta línea para redirigir al perfil
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return {
      success: false,
      error: "Ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo más tarde.",
    }
  }
}

// Función para registrar un nuevo usuario
export async function registerUser(data: RegisterData): Promise<AuthResult> {
  try {
    const supabase = createActionClient()

    // Validar datos
    if (!data.nombre || !data.email || !data.password) {
      return {
        success: false,
        error: "Todos los campos son obligatorios.",
      }
    }

    if (!data.email.includes("@")) {
      return {
        success: false,
        error: "Por favor, ingresa un correo electrónico válido.",
      }
    }

    if (data.password.length < 6) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres.",
      }
    }

    // Verificar si el correo ya está registrado
    const { data: existingUser } = await supabase.from("usuarios").select("id").eq("correo", data.email).single()

    if (existingUser) {
      return {
        success: false,
        error: "Este correo electrónico ya está registrado. Por favor, utiliza otro o inicia sesión.",
      }
    }

    // Obtener el ID del rol según el tipo de usuario
    const { data: rol } = await supabase.from("roles").select("id").eq("nombre", data.userType).single()

    if (!rol) {
      return {
        success: false,
        error: "Tipo de usuario no válido.",
      }
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    // Insertar el usuario en nuestra tabla personalizada
    const { data: newUser, error: dbError } = await supabase
      .from("usuarios")
      .insert({
        id: authData?.user?.id,
        nombre: data.nombre,
        correo: data.email,
        contrasena: hashedPassword,
        rol_id: rol.id,
        fecha_registro: new Date().toISOString(),
      })
      .select()

    if (dbError) {
      console.error("Error al crear usuario en la base de datos:", dbError)
      return {
        success: false,
        error: "Error al crear el usuario. Por favor, inténtalo de nuevo.",
      }
    }

    return {
      success: true,
      userId: authData?.user?.id,
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return {
      success: false,
      error: "Ha ocurrido un error al procesar tu solicitud. Inténtalo de nuevo más tarde.",
    }
  }
}

// Función para cerrar sesión
export async function logoutUser(): Promise<void> {
  const supabase = createActionClient()
  await supabase.auth.signOut()
  redirect("/")
}

// Función para obtener el usuario actual
export async function getCurrentUser() {
  const supabase = createActionClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    return {
      userId: session.user.id,
      email: session.user.email,
    }
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error)
    return null
  }
}

// Middleware para proteger rutas
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}
