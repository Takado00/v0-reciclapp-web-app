import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
    </div>
  )
}
