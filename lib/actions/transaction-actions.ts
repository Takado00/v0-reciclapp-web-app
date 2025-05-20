"use server"

// Tipos para las funciones de transacciones
type TransactionData = {
  publicacion_id: number
  cantidad: number
  precio_total: number
}

type TransactionResult = {
  success: boolean
  error?: string
  transactionId?: number
}

// Función para crear una nueva transacción
export async function crearTransaccion(data: TransactionData): Promise<TransactionResult> {
  return {
    success: false,
    error: "La funcionalidad de transacciones económicas ha sido deshabilitada.",
  }
}

// Función para actualizar el estado de una transacción
export async function actualizarEstadoTransaccion(id: number, estado: string): Promise<TransactionResult> {
  return {
    success: false,
    error: "La funcionalidad de transacciones económicas ha sido deshabilitada.",
  }
}

// Función para obtener transacciones del usuario
export async function getTransaccionesUsuario() {
  return []
}
