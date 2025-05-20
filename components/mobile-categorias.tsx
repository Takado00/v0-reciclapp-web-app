import Link from "next/link"

export function MobileCategorias() {
  const categorias = [
    {
      icon: "https://th.bing.com/th/id/R.fa63d61675d85afb70b3f30a69463d67?rik=q7bC8FXKq91XKA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-fTB4dW7UeGg%2fTfp7R8ipmRI%2fAAAAAAAAAC8%2fNviFFkuPLYM%2fs1600%2fpapel20fotografico.jpg&ehk=ixrA86CzjrkEF6M9oafk6ruJ4ZOAb6Zp8Ttjh9%2bgo6Y%3d&risl=&pid=ImgRaw&r=0",
      name: "Papel",
      href: "/materiales?categoria=papel",
    },
    {
      icon: "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg",
      name: "Plástico",
      href: "/materiales?categoria=plastico",
    },
    {
      icon: "https://sjc.microlink.io/EYGEMpkCnAldyf9_z_SqQ15uHSZA5wRzhQk5M4j_NLgvesoQJBqmquWn924vj_7MG-2OJj7g9O3M--vecOe0bg.jpeg",
      name: "Vidrio",
      href: "/materiales?categoria=vidrio",
    },
    {
      icon: "https://www.ecologiaverde.com/images/post/1200/1200-0-que-es-el-metal-definicion-tipos-y-caracteristicas.jpg",
      name: "Metal",
      href: "/materiales?categoria=metal",
    },
    {
      icon: "https://www.ecologiaverde.com/images/post/1200/1200-0-que-son-los-residuos-organicos-definicion-y-ejemplos.jpg",
      name: "Orgánico",
      href: "/materiales?categoria=organico",
    },
    {
      icon: "https://www.ecologiaverde.com/images/post/1200/1200-0-que-son-los-residuos-electronicos-definicion-y-ejemplos.jpg",
      name: "Electrónico",
      href: "/materiales?categoria=electronico",
    },
    {
      icon: "https://www.ecologiaverde.com/images/post/1200/1200-0-que-es-el-reciclaje-textil-y-su-importancia.jpg",
      name: "Textil",
      href: "/materiales?categoria=textil",
    },
    {
      icon: "https://www.ecologiaverde.com/images/post/1200/1200-0-que-son-los-residuos-inorganicos-definicion-y-ejemplos.jpg",
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
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-1 transition-all duration-300 group-hover:bg-green-200 group-hover:shadow-md overflow-hidden">
              <img
                src={categoria.icon || "/placeholder.svg"}
                alt={categoria.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
