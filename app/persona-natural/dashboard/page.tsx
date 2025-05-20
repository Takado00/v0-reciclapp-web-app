import { createActionClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UserDashboardContent } from "@/components/user-dashboard-content"

export default async function PersonaNaturalDashboardPage() {
  const supabase = createActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: user } = await supabase.from("usuarios").select("*").eq("id", session.user.id).single()

  return (
    <DashboardLayout>
      <UserDashboardContent user={user} />
    </DashboardLayout>
  )
}
