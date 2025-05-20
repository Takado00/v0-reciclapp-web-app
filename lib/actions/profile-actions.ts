"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Tipos para los datos de perfil
type ProfileData = {
  nombre: string
  telefono?: string
  direccion?: string
  ciudad?: string
  descripcion?: string
  sitio_web?: string
  especialidad?: string
  horario_atencion?: string
  certificaciones?: string[]
  materiales_aceptados?: string[]
  foto_perfil?: string
  redes_sociales?: any
  intereses_reciclaje?: string[]
  nivel_experiencia?: string
  biografia?: string
  educacion?: string
  anos_experiencia?: number
  areas_servicio?: string[]
}

// Obtener perfil de usuario
export async function getUserProfile(userId: string) {
  try {
    if (!userId) {
      console.error("ID de usuario no proporcionado")
      return null
    }

    const supabase = createActionClient()

    // Primero, verificar si el usuario existe en Auth
    const { data: authUser, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error("Error al verificar usuario en Auth:", authError)
    }

    // Obtener datos básicos del usuario con su rol
    const { data: usuariosData, error: userError } = await supabase
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
        tipo_usuario,
        rol_id,
        roles(id, nombre)
      `)
      .eq("id", userId)
      .maybeSingle()

    if (userError) {
      console.error("Error al obtener usuario:", userError)

      // Si hay error, intentar obtener datos de Auth
      if (authUser?.user && authUser.user.id === userId) {
        const userData = authUser.user.user_metadata || {}

        return {
          profile: {
            id: userId,
            nombre: userData.nombre || userData.full_name || "Usuario",
            correo: authUser.user.email,
            fecha_registro: authUser.user.created_at,
            tipo_usuario: userData.tipo_usuario || "usuario",
            descripcion: userData.descripcion || null,
            ciudad: userData.ciudad || null,
            roles: { nombre: userData.tipo_usuario || "usuario" },
          },
          stats: {
            materiales: 0,
            transacciones: 0,
            valoraciones: 0,
          },
        }
      }

      throw userError
    }

    // Si no hay datos o hay múltiples, manejamos el caso
    const usuario = usuariosData || null

    // Si no hay usuario en la base de datos pero sí en Auth, creamos un perfil básico
    if (!usuario && authUser?.user && authUser.user.id === userId) {
      const userData = authUser.user.user_metadata || {}

      // Intentar crear el registro en la base de datos
      try {
        const { error: insertError } = await supabase.from("usuarios").insert({
          id: userId,
          nombre: userData.nombre || userData.full_name || "Usuario",
          correo: authUser.user.email,
          fecha_registro: authUser.user.created_at,
          tipo_usuario: userData.tipo_usuario || "usuario",
          rol_id: userData.rol_id || 1,
          descripcion: userData.descripcion || null,
          ciudad: userData.ciudad || null,
        })

        if (insertError) {
          console.error("Error al crear perfil desde Auth:", insertError)
        }
      } catch (error) {
        console.error("Error al intentar crear perfil:", error)
      }

      return {
        profile: {
          id: userId,
          nombre: userData.nombre || userData.full_name || "Usuario",
          correo: authUser.user.email,
          fecha_registro: authUser.user.created_at,
          tipo_usuario: userData.tipo_usuario || "usuario",
          descripcion: userData.descripcion || null,
          ciudad: userData.ciudad || null,
          roles: { nombre: userData.tipo_usuario || "usuario" },
        },
        stats: {
          materiales: 0,
          transacciones: 0,
          valoraciones: 0,
        },
      }
    }

    // Después de obtener el usuario básico, intentar obtener campos adicionales
    let camposAdicionales = {}
    if (usuario) {
      // Intentar obtener foto_perfil por separado
      try {
        const { data: fotoPerfilData, error: fotoPerfilError } = await supabase
          .from("usuarios")
          .select("foto_perfil")
          .eq("id", userId)
          .single()

        if (!fotoPerfilError && fotoPerfilData && fotoPerfilData.foto_perfil) {
          camposAdicionales = { ...camposAdicionales, foto_perfil: fotoPerfilData.foto_perfil }
        }
      } catch (error) {
        console.log("La columna foto_perfil no existe, continuando sin ella")
        // Si la columna no existe, intentamos crearla
        try {
          await supabase.rpc("add_column_if_not_exists", {
            table_name: "usuarios",
            column_name: "foto_perfil",
            column_type: "text",
          })
          console.log("Columna foto_perfil añadida a la tabla usuarios")
        } catch (createError) {
          console.error("Error al crear columna foto_perfil:", createError)
        }
      }

      try {
        // Intentar obtener otras columnas opcionales
        const { data: camposData, error: camposError } = await supabase
          .from("usuarios")
          .select(`
            sitio_web,
            especialidad,
            horario_atencion,
            certificaciones,
            materiales_aceptados,
            redes_sociales,
            intereses_reciclaje,
            nivel_experiencia,
            biografia,
            educacion,
            anos_experiencia,
            areas_servicio
          `)
          .eq("id", userId)
          .single()

        if (!camposError && camposData) {
          camposAdicionales = { ...camposAdicionales, ...camposData }
        }
      } catch (error) {
        console.log("Algunas columnas adicionales no existen, continuando sin ellas")
      }
    }

    // Combinar usuario básico con campos adicionales
    const usuarioCompleto = usuario ? { ...usuario, ...camposAdicionales } : null

    // Si no hay usuario, devolvemos un perfil predeterminado
    if (!usuarioCompleto) {
      return {
        profile: {
          id: userId,
          nombre: "Usuario",
          correo: "usuario@ejemplo.com",
          roles: { nombre: "persona-natural" },
        },
        stats: {
          materiales: 0,
          transacciones: 0,
          valoraciones: 0,
        },
      }
    }

    // Obtener estadísticas según el rol
    let stats = {}

    try {
      const tipoUsuario =
        usuarioCompleto.tipo_usuario ||
        (usuarioCompleto.roles?.nombre === "reciclador"
          ? "reciclador"
          : usuarioCompleto.roles?.nombre === "empresa"
            ? "empresa"
            : "usuario")

      if (tipoUsuario === "usuario" || tipoUsuario === "persona-natural") {
        // Estadísticas para persona natural
        const [materialesCount, transaccionesCount, valoracionesCount] = await Promise.all([
          supabase.from("publicaciones").select("id", { count: "exact" }).eq("usuario_id", userId),
          supabase.from("transacciones").select("id", { count: "exact" }).eq("comprador_id", userId),
          supabase.from("valoraciones").select("id", { count: "exact" }).eq("usuario_id", userId),
        ])

        stats = {
          materiales: materialesCount.count || 0,
          transacciones: transaccionesCount.count || 0,
          valoraciones: valoracionesCount.count || 0,
        }
      } else if (tipoUsuario === "reciclador") {
        // Estadísticas para reciclador
        const [materialesCount, transaccionesCount, clientesCount, valoracionPromedio] = await Promise.all([
          supabase.from("publicaciones").select("id", { count: "exact" }).eq("usuario_id", userId),
          supabase.from("transacciones").select("id", { count: "exact" }).eq("vendedor_id", userId),
          supabase
            .from("transacciones")
            .select("comprador_id", { count: "exact", head: true })
            .eq("vendedor_id", userId)
            .not("comprador_id", "is", null),
          supabase
            .from("valoraciones")
            .select("calificacion")
            .eq("usuario_id", userId)
            .then(({ data }) => {
              if (!data || data.length === 0) return 0
              const sum = data.reduce((acc, val) => acc + (val.calificacion || 0), 0)
              return sum / data.length
            }),
        ])

        stats = {
          materiales: materialesCount.count || 0,
          transacciones: transaccionesCount.count || 0,
          clientes: clientesCount.count || 0,
          valoracion: valoracionPromedio.toFixed(1),
        }
      } else if (tipoUsuario === "empresa") {
        // Estadísticas para empresa
        const [materialesCount, transaccionesCount, proveedoresCount, valoracionPromedio] = await Promise.all([
          supabase.from("publicaciones").select("id", { count: "exact" }).eq("usuario_id", userId),
          supabase.from("transacciones").select("id", { count: "exact" }).eq("comprador_id", userId),
          supabase
            .from("transacciones")
            .select("vendedor_id", { count: "exact", head: true })
            .eq("comprador_id", userId)
            .not("vendedor_id", "is", null),
          supabase
            .from("valoraciones")
            .select("calificacion")
            .eq("usuario_id", userId)
            .then(({ data }) => {
              if (!data || data.length === 0) return 0
              const sum = data.reduce((acc, val) => acc + (val.calificacion || 0), 0)
              return sum / data.length
            }),
        ])

        stats = {
          materiales: materialesCount.count || 0,
          transacciones: transaccionesCount.count || 0,
          proveedores: proveedoresCount.count || 0,
          valoracion: valoracionPromedio.toFixed(1),
        }
      }
    } catch (statsError) {
      console.error("Error al obtener estadísticas:", statsError)
      // Si hay un error al obtener estadísticas, continuamos con estadísticas vacías
      stats = {
        materiales: 0,
        transacciones: 0,
        valoraciones: 0,
      }
    }

    return {
      profile: usuarioCompleto,
      stats,
    }
  } catch (error) {
    console.error("Error al obtener perfil:", error)
    // En caso de error, devolvemos un perfil predeterminado para evitar que la página falle
    return {
      profile: {
        id: userId,
        nombre: "Usuario",
        correo: "usuario@ejemplo.com",
        roles: { nombre: "persona-natural" },
      },
      stats: {
        materiales: 0,
        transacciones: 0,
        valoraciones: 0,
      },
    }
  }
}

// Actualizar perfil de usuario
export async function updateUserProfile(userId: string, data: ProfileData) {
  const supabase = createActionClient()

  try {
    console.log("Actualizando perfil con ID:", userId)
    console.log("Datos a actualizar:", data)

    // Verificar que el usuario existe antes de actualizar
    const { data: existingUser, error: checkError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("id", userId)
      .single()

    if (checkError || !existingUser) {
      console.error("Error al verificar usuario:", checkError)
      return { success: false, error: "Usuario no encontrado" }
    }

    // Verificar si la columna descripcion existe
    let hasDescripcionColumn = false
    try {
      const { error } = await supabase.from("usuarios").select("descripcion").limit(1)
      hasDescripcionColumn = !error
    } catch (error) {
      console.log("La columna descripcion no existe")
    }

    // Si la columna no existe, intentamos crearla
    if (!hasDescripcionColumn && data.descripcion) {
      try {
        // Intentar añadir la columna descripcion
        const { error: alterError } = await supabase.rpc("add_column_if_not_exists", {
          table_name: "usuarios",
          column_name: "descripcion",
          column_type: "text",
        })

        if (alterError) {
          console.error("Error al añadir columna descripcion:", alterError)
        } else {
          console.log("Columna descripcion añadida correctamente")
          hasDescripcionColumn = true
        }
      } catch (error) {
        console.error("Error al intentar añadir columna:", error)
      }
    }

    // Iniciar con un objeto vacío para los datos a actualizar
    const updateData: any = {
      ultima_conexion: new Date().toISOString(),
      nombre: data.nombre,
    }

    // Añadir campos básicos que siempre deberían existir
    if (data.telefono !== undefined) updateData.telefono = data.telefono
    if (data.direccion !== undefined) updateData.direccion = data.direccion
    if (data.ciudad !== undefined) updateData.ciudad = data.ciudad

    // Verificar si la columna foto_perfil existe antes de intentar actualizarla
    try {
      const { error: fotoPerfilError } = await supabase.from("usuarios").select("foto_perfil").limit(1)
      if (!fotoPerfilError && data.foto_perfil !== undefined) {
        updateData.foto_perfil = data.foto_perfil
      } else if (fotoPerfilError) {
        console.log("La columna foto_perfil no existe en la tabla usuarios")

        // Intentar añadir la columna foto_perfil si no existe
        try {
          const { error: alterError } = await supabase.rpc("add_column_if_not_exists", {
            table_name: "usuarios",
            column_name: "foto_perfil",
            column_type: "text",
          })

          if (!alterError) {
            console.log("Columna foto_perfil añadida correctamente")
            updateData.foto_perfil = data.foto_perfil
          }
        } catch (error) {
          console.error("Error al intentar añadir columna foto_perfil:", error)
        }
      }
    } catch (error) {
      console.log("Error al verificar la columna foto_perfil:", error)
    }

    // Añadir descripcion solo si la columna existe
    if (hasDescripcionColumn && data.descripcion !== undefined) {
      updateData.descripcion = data.descripcion
    }

    // Verificar y añadir campos adicionales
    const camposAdicionales = [
      { name: "sitio_web", value: data.sitio_web },
      { name: "especialidad", value: data.especialidad },
      { name: "horario_atencion", value: data.horario_atencion },
      { name: "certificaciones", value: data.certificaciones },
      { name: "materiales_aceptados", value: data.materiales_aceptados },
      { name: "redes_sociales", value: data.redes_sociales },
      { name: "intereses_reciclaje", value: data.intereses_reciclaje },
      { name: "nivel_experiencia", value: data.nivel_experiencia },
      { name: "biografia", value: data.biografia },
      { name: "educacion", value: data.educacion },
      { name: "anos_experiencia", value: data.anos_experiencia },
      { name: "areas_servicio", value: data.areas_servicio },
    ]

    for (const campo of camposAdicionales) {
      if (campo.value !== undefined) {
        try {
          const { error } = await supabase.from("usuarios").select(campo.name).limit(1)
          if (!error) {
            updateData[campo.name] = campo.value
          } else {
            // Si la columna no existe, intentar crearla
            try {
              let columnType = "text"
              if (Array.isArray(campo.value)) {
                columnType = "text[]"
              } else if (typeof campo.value === "number") {
                columnType = "integer"
              } else if (typeof campo.value === "object") {
                columnType = "jsonb"
              }

              const { error: alterError } = await supabase.rpc("add_column_if_not_exists", {
                table_name: "usuarios",
                column_name: campo.name,
                column_type: columnType,
              })

              if (!alterError) {
                console.log(`Columna ${campo.name} añadida correctamente`)
                updateData[campo.name] = campo.value
              }
            } catch (error) {
              console.error(`Error al intentar añadir columna ${campo.name}:`, error)
            }
          }
        } catch (error) {
          console.log(`Campo ${campo.name} no existe o no se puede actualizar`)
        }
      }
    }

    // Realizar la actualización con los campos verificados
    const { error, data: updatedData } = await supabase.from("usuarios").update(updateData).eq("id", userId).select()

    if (error) {
      console.error("Error de Supabase:", error)
      return {
        success: false,
        error: error.message || "Error al actualizar el perfil",
        details: error.details || "",
      }
    }

    console.log("Perfil actualizado correctamente:", updatedData)

    // Revalidar todas las rutas relacionadas con el perfil
    revalidatePath(`/perfil/${userId}`)
    revalidatePath(`/perfil`)
    revalidatePath(`/mi-perfil`)
    revalidatePath(`/`)
    revalidatePath(`/perfil/[id]`)
    revalidatePath(`/perfil/${userId}`, "layout")
    revalidatePath(`/perfil/${userId}`, "page")

    return {
      success: true,
      data: updatedData,
      // Incluir información sobre campos que no se pudieron actualizar
      omittedFields: Object.keys(data).filter((key) => !Object.keys(updateData).includes(key)),
    }
  } catch (error: any) {
    console.error("Error al actualizar perfil:", error)
    return {
      success: false,
      error: error.message || "No se pudo actualizar el perfil",
      details: error.details || error.hint || "",
    }
  }
}

// Obtener materiales publicados por el usuario
export async function getUserMaterials(userId: string) {
  const supabase = createActionClient()

  try {
    const { data, error } = await supabase
      .from("publicaciones")
      .select(`
        id,
        titulo,
        descripcion,
        cantidad,
        unidad_medida,
        precio,
        imagen_url,
        estado,
        fecha_publicacion,
        materiales(id, nombre, categoria)
      `)
      .eq("usuario_id", userId)
      .order("fecha_publicacion", { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error al obtener materiales:", error)
    return []
  }
}

// Obtener transacciones del usuario
export async function getUserTransactions(userId: string, role: string) {
  const supabase = createActionClient()

  try {
    let query = supabase.from("transacciones").select(`
        id,
        cantidad,
        precio_total,
        estado,
        fecha_transaccion,
        publicaciones(id, titulo, imagen_url),
        compradores:usuarios!transacciones_comprador_id_fkey(id, nombre),
        vendedores:usuarios!transacciones_vendedor_id_fkey(id, nombre)
      `)

    // Filtrar según el rol
    if (role === "usuario" || role === "empresa") {
      query = query.eq("comprador_id", userId)
    } else if (role === "reciclador") {
      query = query.eq("vendedor_id", userId)
    }

    const { data, error } = await query.order("fecha_transaccion", { ascending: false })

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error al obtener transacciones:", error)
    return []
  }
}
