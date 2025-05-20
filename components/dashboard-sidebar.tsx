"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Home,
  MessageSquare,
  Package,
  Settings,
  Users,
  Map,
  LayoutDashboard,
  Trash2,
  Briefcase,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "./session-provider"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles?: string[]
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data } = useSession()

  const userRole = data?.user?.user_metadata?.role || "usuario"

  const navItems: NavItem[] = [
    {
      title: "Inicio",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Dashboard",
      href: `/${userRole}/dashboard`,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Mensajes",
      href: "/mensajes",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Materiales",
      href: "/materiales",
      icon: <Package className="h-5 w-5" />,
      roles: ["reciclador", "empresa", "admin"],
    },
    {
      title: "Puntos de Reciclaje",
      href: "/ubicaciones",
      icon: <Map className="h-5 w-5" />,
    },
    {
      title: "Usuarios",
      href: "/admin/usuarios",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Empresas",
      href: "/admin/empresas",
      icon: <Briefcase className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Recicladores",
      href: "/admin/recicladores",
      icon: <Trash2 className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Personas naturales",
      href: "/admin/usuarios",
      icon: <User className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Estadísticas",
      href: "/estadisticas",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["admin", "empresa", "reciclador"],
    },
    {
      title: "Configuración",
      href: "/configuracion",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  // Filter navItems based on user role
  const filteredNavItems = navItems.filter((item) => !item.roles || item.roles.includes(userRole))

  return (
    <div className="hidden border-r bg-background lg:block">
      <div className="flex h-16 items-center justify-center border-b px-4">
        <Link href="/" className="flex items-center justify-center">
          <h2 className="text-lg font-bold text-primary">ReciclApp</h2>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-1 p-2">
          {filteredNavItems.map((item, index) => (
            <Button
              key={index}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("justify-start", pathname === item.href && "bg-muted")}
            >
              <Link href={item.href}>
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
