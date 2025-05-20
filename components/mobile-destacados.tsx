import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function MobileDestacados() {
  const materiales = [
    {
      id: 1,
      nombre: "Botellas PET",
      imagen: "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg",
      precio: "500-800",
      unidad: "kg",
      categoria: "Plástico",
    },
    {
      id: 2,
      nombre: "Cartón",
      imagen:
        "https://sjc.microlink.io/k1XNCI2NCfxBU5J28bwZqEGFnoaY5CgxQ9Clcx1ReocMRIoVUlSj8IaFeWySCkCzkfguQ8ljJqeqgO3He51jEQ.jpeg",
      precio: "200-350",
      unidad: "kg",
      categoria: "Papel",
    },
    {
      id: 3,
      nombre: "Aluminio",
      imagen: "https://limpiezademalaga.es/wp-content/uploads/2022/04/Post-reciclar-metales-abril22-1-1024x769.jpg",
      precio: "1500-2000",
      unidad: "kg",
      categoria: "Metal",
    },
    {
      id: 4,
      nombre: "Vidrio",
      imagen:
        "https://sjc.microlink.io/EYGEMpkCnAldyf9_z_SqQ15uHSZA5wRzhQk5M4j_NLgvesoQJBqmquWn924vj_7MG-2OJj7g9O3M--vecOe0bg.jpeg",
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
