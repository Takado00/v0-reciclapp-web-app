import { Skeleton } from "@/components/ui/skeleton"
import { NotificacionesPublic } from "@/components/notificaciones/notificaciones-public"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function NotificacionesPage() {
  return <NotificacionesPublic />
}

function NotificacionesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
