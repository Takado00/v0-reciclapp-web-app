import { Bell } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Bell className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">No tienes notificaciones</h3>
      <p className="text-sm text-gray-500 max-w-md">
        Cuando recibas notificaciones sobre materiales, mensajes o eventos, aparecerán aquí.
      </p>
    </div>
  )
}
