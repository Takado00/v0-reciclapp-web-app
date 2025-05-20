import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Lista de rutas que requieren autenticación
  const protectedRoutes = [
    "/usuario/dashboard",
    "/reciclador/dashboard",
    "/empresa/dashboard",
    "/admin/dashboard",
    "/perfil/editar",
  ]

  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(
    (route) => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route),
  )

  // Si no hay sesión y la ruta requiere autenticación, redirigir a login
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
}
