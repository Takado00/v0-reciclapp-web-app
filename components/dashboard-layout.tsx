"use client"

import type { ReactNode } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { useSession } from "./session-provider"
import { redirect } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { status } = useSession()

  if (status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <div className="lg:hidden flex items-center border-b p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const sidebar = document.querySelector(".dashboard-sidebar")
              sidebar?.classList.toggle("hidden")
            }}
            className="mr-2"
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <Link href="/" className="font-bold text-primary text-xl">
              ReciclApp
            </Link>
          </div>
        </div>
        <DashboardHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
