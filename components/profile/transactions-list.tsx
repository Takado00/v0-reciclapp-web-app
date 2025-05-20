"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardHeader>
            <CardTitle>{transaction.material?.nombre}</CardTitle>
            <CardDescription>{new Date(transaction.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estado: </span>
                <Badge
                  className={
                    transaction.estado === "completado"
                      ? "bg-green-100 text-green-800"
                      : transaction.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {transaction.estado}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Material: </span>
                <span>
                  {transaction.material?.nombre} ({transaction.material?.tipo})
                </span>
              </div>
              <div>
                <span className="font-medium">Vendedor: </span>
                <span>{transaction.vendedor?.nombre}</span>
              </div>
              <div>
                <span className="font-medium">Comprador: </span>
                <span>{transaction.comprador?.nombre}</span>
              </div>
              <div>
                <span className="font-medium">Monto: </span>
                <span>${transaction.monto}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
