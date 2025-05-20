import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, AlertCircle } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  buttonText?: string
  buttonHref?: string
  error?: string | null
}

export function EmptyState({ title, description, buttonText, buttonHref, error }: EmptyStateProps) {
  return (
    <div className="p-8 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
      {error ? (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
      ) : (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
          <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-medium mb-2">{error ? "Error" : title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto">{error || description}</p>
      {buttonText && buttonHref && (
        <Link href={buttonHref} className="mt-6">
          <Button>{buttonText}</Button>
        </Link>
      )}
    </div>
  )
}
