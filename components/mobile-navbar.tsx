"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Package, MessageSquare, User } from "lucide-react"

export function MobileNavbar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleNotificacionesClick = () => {
    router.push("/notificaciones")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-1 z-50">
      <div className="grid grid-cols-4 gap-1">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 ${
            isActive("/") ? "text-green-600" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Home size={20} />
          <span className="text-[10px] mt-0.5">Inicio</span>
        </Link>
        <Link
          href="/materiales"
          className={`flex flex-col items-center justify-center py-1 ${
            isActive("/materiales") ? "text-green-600" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Package size={20} />
          <span className="text-[10px] mt-0.5">Materiales</span>
        </Link>
        <Link
          href="/mensajes"
          className={`flex flex-col items-center justify-center py-1 ${
            isActive("/mensajes") ? "text-green-600" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px] mt-0.5">Mensajes</span>
        </Link>
        <Link
          href="/mi-perfil"
          className={`flex flex-col items-center justify-center py-1 ${
            isActive("/mi-perfil") ? "text-green-600" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <User size={20} />
          <span className="text-[10px] mt-0.5">Mi Cuenta</span>
        </Link>
      </div>
    </div>
  )
}
