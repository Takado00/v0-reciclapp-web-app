import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Singleton para el cliente de Supabase
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Crear un cliente de Supabase para componentes del lado del cliente
export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    throw new Error("Supabase environment variables are not set")
  }

  try {
    console.log("Creating Supabase client with URL:", supabaseUrl)

    supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          "x-client-info": "reciclapp-web",
        },
      },
    })

    // Verificar que el cliente se creó correctamente
    if (!supabaseClient) {
      throw new Error("Failed to create Supabase client")
    }

    return supabaseClient
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw new Error("Failed to initialize Supabase client")
  }
}

// Exportar createClient como alias de getSupabaseClient para mantener compatibilidad
export const createClient = getSupabaseClient
