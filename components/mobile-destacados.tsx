import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function MobileDestacados() {
  const materiales = [
    {
      id: 1,
      nombre: "Botellas PET",
      imagen: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=500&auto=format&fit=crop",
      precio: "500-800",
      unidad: "kg",
      categoria: "Plástico",
    },
    {
      id: 2,
      nombre: "Cartón",
      imagen: "https://images.unsplash.com/photo-1607583444909-8cc42d46f7b2?q=80&w=500&auto=format&fit=crop",
      precio: "200-350",
      unidad: "kg",
      categoria: "Papel",
    },
    {
      id: 3,
      nombre: "Aluminio",
      imagen: "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=500&auto=format&fit=crop",
      precio: "1500-2000",
      unidad: "kg",
      categoria: "Metal",
    },
    {
      id: 4,
      nombre: "Vidrio",
      imagen: "https://images.unsplash.com/photo-1604349841434-d6e7837fc372?q=80&w=500&auto=format&fit=crop",
      precio: "100-200",
      unidad: "kg",
      categoria: "Vidrio",
    },
  ]

  return (
    <div className="py-3 px-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-semibold">Materiales destacados</h2>
        <Link href="/materiales" className="text-xs text-green-600">
          Ver todos
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {materiales.map((material) => (
          <Link key={material.id} href={`/materiales/${material.id}`} className="block">
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="h-24 overflow-hidden group">
                <img
                  src={material.imagen || "/placeholder.svg"}
                  alt={material.nombre}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-2">
                <Badge variant="outline" className="mb-1 text-xs">
                  {material.categoria}
                </Badge>
                <h3 className="font-medium text-sm line-clamp-1">{material.nombre}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
