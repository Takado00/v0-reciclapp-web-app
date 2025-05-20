"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface TransactionsListProps {
  userId: string
}

export function TransactionsList({ userId }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("transacciones")
          .select(`
            *,
            material:material_id(nombre, tipo),
            comprador:comprador_id(nombre),
            vendedor:vendedor_id(nombre)
          `)
          .or(`comprador_id.eq.${userId},vendedor_id.eq.${userId}`)
          .order("created_at", { ascending: false })

        if (error) throw error
        setTransactions(data || [])
      } catch (error) {
        console.error("Error al cargar transacciones:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId, supabase])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No hay transacciones registradas</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="py-8 text-center">
        <p className="text-muted-foreground">La funcionalidad de transacciones económicas ha sido deshabilitada.</p>
      </CardContent>
    </Card>
  )
}
