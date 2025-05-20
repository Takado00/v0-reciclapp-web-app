"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useSession } from "@/components/session-provider"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardPage() {
  const { data, status } = useSession()

  useEffect(() => {
    // Redirect if user is not authenticated
    if (status === "unauthenticated") {
      redirect("/login")
    }

    // You can add admin role check here once roles are implemented
    // if (data?.user?.role !== 'admin') {
    //   redirect('/')
    // }
  }, [status, data])

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-6">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-5/6 mb-3" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard de Administrador</h1>
        <p>
          Bienvenido al panel de control para administradores. Aquí podrás gestionar usuarios, materiales, ubicaciones y
          más.
        </p>
      </div>
    </div>
  )
}
