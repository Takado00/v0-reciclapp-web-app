import Link from "next/link"

export function MobileCategorias() {
  const categorias = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/6911/6911990.png",
      name: "Papel",
      href: "/materiales?categoria=papel",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3141/3141684.png",
      name: "Plástico",
      href: "/materiales?categoria=plastico",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3650/3650021.png",
      name: "Vidrio",
      href: "/materiales?categoria=vidrio",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/2865/2865855.png",
      name: "Metal",
      href: "/materiales?categoria=metal",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/9427/9427532.png",
      name: "Orgánico",
      href: "/materiales?categoria=organico",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3659/3659050.png",
      name: "Electrónico",
      href: "/materiales?categoria=electronico",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/4616/4616731.png",
      name: "Textil",
      href: "/materiales?categoria=textil",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3209/3209104.png",
      name: "Otros",
      href: "/materiales?categoria=otros",
    },
  ]

  return (
    <div className="py-4 px-4">
      <h2 className="text-base font-semibold mb-3">Categorías</h2>
      <div className="grid grid-cols-4 gap-3">
        {categorias.map((categoria, index) => (
          <Link key={index} href={categoria.href} className="flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-1 transition-all duration-300 group-hover:bg-green-200 group-hover:shadow-md">
              <img
                src={categoria.icon || "/placeholder.svg"}
                alt={categoria.name}
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-xs text-center transition-colors duration-300 group-hover:text-green-700">
              {categoria.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
