import { EmpresasDirectorio } from "@/components/empresas-directorio"

export default function UbicacionesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Directorio de Empresas Recicladoras</h1>
      <p className="text-muted-foreground mb-8">
        Encuentra empresas recicladoras, centros de acopio y puntos de reciclaje en tu ciudad.
      </p>
      <EmpresasDirectorio />
    </div>
  )
}
