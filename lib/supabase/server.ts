import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Crear un cliente de Supabase para componentes del lado del servidor
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    throw new Error("Supabase environment variables are not set")
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Alias para mantener compatibilidad con código existente
export const createServerClient = createClient

// Crear un cliente de Supabase para acciones del servidor con service role key
export function createActionClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase URL or Service Role Key is missing")
    throw new Error("Supabase environment variables are not set")
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Función para crear un cliente de Supabase con cookies para componentes del servidor
export function createClientWithCookies() {
  return createClient()
}
