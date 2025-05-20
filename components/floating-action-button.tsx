"use client"
import Link from "next/link"
import { Plus } from "lucide-react"

export function FloatingActionButton() {
  return (
    <Link href="/materiales/publicar">
      <button
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 z-50"
        aria-label="Publicar material"
      >
        <Plus className="h-6 w-6" />
      </button>
    </Link>
  )
}
