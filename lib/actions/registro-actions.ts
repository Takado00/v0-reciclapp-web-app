"use server"

import { createActionClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

type RegistroData = {
  email: string
  password: string
  nombre: string
  userType: string
  telefono?: string
  ciudad?: string
  direccion?: string
  descripcion?: string
  // Campos específicos para reciclador
  especialidad?: string
  experiencia?: string
  areasServicio?: string
  // Campos específicos para empresa
  sitioWeb?: string
  horarioAtencion?: string
  materialesAceptados?: string
}

export async function registrarUsuario(data: RegistroData) {
  // Usamos el cliente con service role key para bypass de RLS
  const supabase = createActionClient()

  try {
    console.log("Iniciando registro de usuario:", data.email, "como", data.userType)

    // Verificar si el correo ya está registrado
    const { data: existingUser, error: checkError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("correo", data.email)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar usuario existente:", checkError)
      return { success: false, error: "Error al verificar disponibilidad del correo" }
    }

    if (existingUser) {
      return { success: false, error: "Este correo electrónico ya está registrado" }
    }

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          nombre: data.nombre,
          tipo_usuario: data.userType,
        },
      },
    })

    if (authError) {
      console.error("Error en Auth:", authError)
      return { success: false, error: `Error al crear la cuenta: ${authError.message}` }
    }

    // Generar ID si no se obtuvo de Auth
    const userId = authData?.user?.id || uuidv4()

    // Encriptar contraseña para almacenamiento en tabla usuarios
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Mapeo de roles
    const rolMapping: Record<string, number> = {
      usuario: 1,
      reciclador: 2,
      empresa: 3,
      admin: 4,
    }

    // Intento 1: Insertar datos completos
    try {
      // Preparar datos básicos
      const userData: any = {
        id: userId,
        nombre: data.nombre,
        correo: data.email,
        contrasena: hashedPassword,
        rol_id: rolMapping[data.userType] || 1,
        tipo_usuario: data.userType,
        telefono: data.telefono || null,
        ciudad: data.ciudad || null,
        direccion: data.direccion || null,
        fecha_registro: new Date().toISOString(),
        activo: true,
      }

      // Añadir campos específicos según tipo
      if (data.userType === "reciclador") {
        userData.especialidad = data.especialidad || null
        userData.nivel_experiencia = data.experiencia || null
        userData.areas_servicio = data.areasServicio ? data.areasServicio.split(",").map((a: string) => a.trim()) : null
        userData.descripcion = data.descripcion || null
      } else if (data.userType === "empresa") {
        userData.sitio_web = data.sitioWeb || null
        userData.horario_atencion = data.horarioAtencion || null
        userData.materiales_aceptados = data.materialesAceptados
          ? data.materialesAceptados.split(",").map((m: string) => m.trim())
          : null
        userData.descripcion = data.descripcion || null
      }

      console.log("Insertando usuario con datos completos")
      const { error: insertError } = await supabase.from("usuarios").insert(userData)

      if (insertError) {
        throw new Error(`Error en intento 1: ${insertError.message}`)
      } else {
        console.log("Usuario insertado exitosamente en intento 1")

        // Revalidar rutas para asegurar que los datos se actualicen
        revalidatePath(`/perfil/${userId}`)
        revalidatePath(`/perfil`)

        return {
          success: true,
          message: "Usuario registrado correctamente",
          userId,
          credentials: {
            email: data.email,
            password: data.password,
          },
        }
      }
    } catch (error: any) {
      console.error("Error en intento 1:", error.message)

      // Intento 2: Datos reducidos
      try {
        console.log("Intentando con datos reducidos...")
        const datosReducidos = {
          id: userId,
          nombre: data.nombre,
          correo: data.email,
          contrasena: hashedPassword,
          rol_id: rolMapping[data.userType] || 1,
          tipo_usuario: data.userType,
          fecha_registro: new Date().toISOString(),
          descripcion: data.descripcion || null,
          ciudad: data.ciudad || null,
        }

        const { error: error2 } = await supabase.from("usuarios").insert(datosReducidos)

        if (error2) {
          throw new Error(`Error en intento 2: ${error2.message}`)
        } else {
          console.log("Usuario insertado exitosamente en intento 2")

          // Revalidar rutas
          revalidatePath(`/perfil/${userId}`)
          revalidatePath(`/perfil`)

          return {
            success: true,
            message: "Usuario registrado correctamente (datos básicos)",
            userId,
            credentials: {
              email: data.email,
              password: data.password,
            },
          }
        }
      } catch (error2: any) {
        console.error("Error en intento 2:", error2.message)

        // Intento 3: Datos mínimos
        try {
          console.log("Intentando con datos mínimos...")
          const datosMinimos = {
            id: userId,
            nombre: data.nombre,
            correo: data.email,
            rol_id: rolMapping[data.userType] || 1,
            fecha_registro: new Date().toISOString(),
          }

          const { error: error3 } = await supabase.from("usuarios").insert(datosMinimos)

          if (error3) {
            throw new Error(`Error en intento 3: ${error3.message}`)
          } else {
            console.log("Usuario insertado exitosamente en intento 3")

            // Revalidar rutas
            revalidatePath(`/perfil/${userId}`)
            revalidatePath(`/perfil`)

            return {
              success: true,
              message: "Usuario registrado correctamente (datos mínimos)",
              userId,
              credentials: {
                email: data.email,
                password: data.password,
              },
            }
          }
        } catch (error3: any) {
          console.error("Error en intento 3:", error3.message)

          // Actualizar metadatos en Auth como último recurso
          try {
            await supabase.auth.updateUser({
              data: {
                nombre: data.nombre,
                rol: data.userType,
                rol_id: rolMapping[data.userType] || 1,
                tipo_usuario: data.userType,
                ciudad: data.ciudad || null,
                descripcion: data.descripcion || null,
              },
            })

            console.log("Metadatos actualizados en Auth como alternativa")
            return {
              success: true,
              message: "Usuario registrado parcialmente (solo en Auth)",
              userId,
              partial: true,
              credentials: {
                email: data.email,
                password: data.password,
              },
            }
          } catch (error4: any) {
            console.error("Error en actualización de Auth:", error4)
            return {
              success: false,
              error: "No se pudo registrar el usuario en la base de datos. Por favor contacte al administrador.",
            }
          }
        }
      }
    }
  } catch (error: any) {
    console.error("Error inesperado durante el registro:", error)
    return {
      success: false,
      error: `Error inesperado: ${error.message || "Desconocido"}`,
    }
  }
}
