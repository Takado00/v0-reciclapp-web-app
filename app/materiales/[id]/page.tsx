import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Info, Recycle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Materiales predeterminados para mostrar cuando no se encuentra un material
const defaultMateriales = [
  {
    id: 1,
    nombre: "Botellas PET",
    descripcion: "Botellas de plástico PET reciclables, limpias y sin etiquetas.",
    categoria: "Plástico",
    imagen_url: "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg",
    precio_estimado: 5.5,
    unidad_medida: "kg",
    cantidad: 10,
    condicion: "Limpio",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    nombre: "Cartón",
    descripcion: "Cajas de cartón y cartón corrugado en buen estado.",
    categoria: "Cartón",
    imagen_url:
      "https://sjc.microlink.io/k1XNCI2NCfxBU5J28bwZqEGFnoaY5CgxQ9Clcx1ReocMRIoVUlSj8IaFeWySCkCzkfguQ8ljJqeqgO3He51jEQ.jpeg",
    precio_estimado: 3.2,
    unidad_medida: "kg",
    cantidad: 15,
    condicion: "Seco",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    nombre: "Latas de Aluminio",
    descripcion: "Latas de aluminio compactadas y limpias.",
    categoria: "Metal",
    imagen_url: "https://limpiezademalaga.es/wp-content/uploads/2022/04/Post-reciclar-metales-abril22-1-1024x769.jpg",
    precio_estimado: 12.75,
    unidad_medida: "kg",
    cantidad: 5,
    condicion: "Limpio",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    nombre: "Botellas de Vidrio",
    descripcion: "Botellas de vidrio transparente sin tapas ni etiquetas.",
    categoria: "Vidrio",
    imagen_url:
      "https://sjc.microlink.io/EYGEMpkCnAldyf9_z_SqQ15uHSZA5wRzhQk5M4j_NLgvesoQJBqmquWn924vj_7MG-2OJj7g9O3M--vecOe0bg.jpeg",
    precio_estimado: 2.8,
    unidad_medida: "kg",
    cantidad: 20,
    condicion: "Limpio",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    nombre: "Papel de Oficina",
    descripcion: "Papel blanco de oficina usado por un lado.",
    categoria: "Papel",
    imagen_url:
      "https://th.bing.com/th/id/R.fa63d61675d85afb70b3f30a69463d67?rik=q7bC8FXKq91XKA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-fTB4dW7UeGg%2fTfp7R8ipmRI%2fAAAAAAAAAC8%2fNviFFkuPLYM%2fs1600%2fpapel20fotografico.jpg&ehk=ixrA86CzjrkEF6M9oafk6ruJ4ZOAb6Zp8Ttjh9%2bgo6Y%3d&risl=&pid=ImgRaw&r=0",
    precio_estimado: 4.0,
    unidad_medida: "kg",
    cantidad: 8,
    condicion: "Usado",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    nombre: "Residuos Electrónicos",
    descripcion: "Componentes electrónicos pequeños como placas y cables.",
    categoria: "Electrónico",
    imagen_url:
      "https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2024/02/startup-gana-80000-euros-mes-extrayendo-oro-cobre-dispositivos-tiramos-basura-3270798.jpg?tf=1200x675",
    precio_estimado: 15.0,
    unidad_medida: "kg",
    cantidad: 3,
    condicion: "Usado",
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    nombre: "Textiles",
    descripcion: "Ropa y telas en buen estado para reutilización.",
    categoria: "Textil",
    imagen_url: "https://www.canecas.com.co/images/NOTICIAS_2020/reciclar-retazos-de-tela-2.jpg",
    precio_estimado: 6.5,
    unidad_medida: "kg",
    cantidad: 7,
    condicion: "Usado",
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    nombre: "Residuos Orgánicos",
    descripcion: "Residuos de cocina y jardín para compostaje.",
    categoria: "Orgánico",
    imagen_url: "https://cdn0.uncomo.com/es/posts/8/8/1/que_se_tira_en_el_contenedor_organico_33188_600.jpg",
    precio_estimado: 1.2,
    unidad_medida: "kg",
    cantidad: 25,
    condicion: "Fresco",
    created_at: new Date().toISOString(),
  },
]

export default async function MaterialDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Obtener los detalles del material
  const { data: material, error } = await supabase.from("materiales").select("*").eq("id", params.id).single()

  // Si no se encuentra el material en la base de datos, usar uno predeterminado
  let materialToShow = material
  let isDefaultMaterial = false

  if (error || !material) {
    console.log("Material no encontrado en la base de datos, usando material predeterminado")
    // Buscar un material predeterminado con el ID proporcionado o usar el primero
    const defaultId = Number.parseInt(params.id)
    materialToShow = defaultMateriales.find((m) => m.id === defaultId) || defaultMateriales[0]
    isDefaultMaterial = true

    // Intentar insertar el material predeterminado en la base de datos para futuras consultas
    try {
      const { error: insertError } = await supabase.from("materiales").insert({
        id: materialToShow.id,
        nombre: materialToShow.nombre,
        descripcion: materialToShow.descripcion,
        categoria: materialToShow.categoria,
        imagen_url: materialToShow.imagen_url,
        precio_estimado: materialToShow.precio_estimado,
        unidad_medida: materialToShow.unidad_medida,
        cantidad: materialToShow.cantidad,
        condicion: materialToShow.condicion,
        created_at: materialToShow.created_at,
      })

      if (insertError) {
        console.log("Error al insertar material predeterminado:", insertError)
      }
    } catch (insertErr) {
      console.log("Error al intentar insertar material predeterminado:", insertErr)
    }
  }

  // Función para obtener una imagen predeterminada según la categoría y el nombre
  const getDefaultImage = (categoria: string, nombre: string) => {
    const categoriaLower = categoria.toLowerCase()
    const nombreLower = nombre.toLowerCase()

    // Categoría Papel/Cartón
    if (categoriaLower.includes("papel") || categoriaLower.includes("cartón") || categoriaLower.includes("carton")) {
      if (
        nombreLower.includes("cartón") ||
        nombreLower.includes("carton") ||
        categoriaLower.includes("cartón") ||
        categoriaLower.includes("carton")
      ) {
        return "https://sjc.microlink.io/k1XNCI2NCfxBU5J28bwZqEGFnoaY5CgxQ9Clcx1ReocMRIoVUlSj8IaFeWySCkCzkfguQ8ljJqeqgO3He51jEQ.jpeg"
      }
      if (nombreLower.includes("periódico") || nombreLower.includes("periodico") || nombreLower.includes("diario")) {
        return "https://images.unsplash.com/photo-1598618443855-232ee0f819f6?q=80&w=800&auto=format&fit=crop"
      }
      return "https://th.bing.com/th/id/R.fa63d61675d85afb70b3f30a69463d67?rik=q7bC8FXKq91XKA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-fTB4dW7UeGg%2fTfp7R8ipmRI%2fAAAAAAAAAC8%2fNviFFkuPLYM%2fs1600%2fpapel20fotografico.jpg&ehk=ixrA86CzjrkEF6M9oafk6ruJ4ZOAb6Zp8Ttjh9%2bgo6Y%3d&risl=&pid=ImgRaw&r=0"
    }

    // Categoría Plástico
    else if (categoriaLower.includes("plástico") || categoriaLower.includes("plastico")) {
      if (nombreLower.includes("pet") || nombreLower.includes("botella")) {
        return "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg"
      }
      return "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg"
    }

    // Categoría Vidrio
    else if (categoriaLower.includes("vidrio")) {
      return "https://sjc.microlink.io/EYGEMpkCnAldyf9_z_SqQ15uHSZA5wRzhQk5M4j_NLgvesoQJBqmquWn924vj_7MG-2OJj7g9O3M--vecOe0bg.jpeg"
    }

    // Categoría Metal/Aluminio
    else if (categoriaLower.includes("metal") || categoriaLower.includes("aluminio")) {
      if (nombreLower.includes("lata") || nombreLower.includes("aluminio") || nombreLower.includes("latas")) {
        return "https://limpiezademalaga.es/wp-content/uploads/2022/04/Post-reciclar-metales-abril22-1-1024x769.jpg"
      }
      return "https://limpiezademalaga.es/wp-content/uploads/2022/04/Post-reciclar-metales-abril22-1-1024x769.jpg"
    }

    // Categoría Orgánico
    else if (categoriaLower.includes("orgánico") || categoriaLower.includes("organico")) {
      return "https://cdn0.uncomo.com/es/posts/8/8/1/que_se_tira_en_el_contenedor_organico_33188_600.jpg"
    }

    // Categoría Electrónico
    else if (categoriaLower.includes("electrónico") || categoriaLower.includes("electronico")) {
      return "https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2024/02/startup-gana-80000-euros-mes-extrayendo-oro-cobre-dispositivos-tiramos-basura-3270798.jpg?tf=1200x675"
    }

    // Categoría Textil
    else if (categoriaLower.includes("textil") || nombreLower.includes("ropa") || nombreLower.includes("tela")) {
      return "https://www.canecas.com.co/images/NOTICIAS_2020/reciclar-retazos-de-tela-2.jpg"
    }

    // Categoría por defecto
    else {
      return "https://www.renovablesverdes.com/wp-content/uploads/2021/04/materiales-reciclables-para-reutilizar.jpg"
    }
  }

  // Generar imágenes adicionales para la galería
  let gallery = []

  if (isDefaultMaterial) {
    // Si es un material predeterminado, generar imágenes de galería
    const baseImage = materialToShow.imagen_url || getDefaultImage(materialToShow.categoria, materialToShow.nombre)

    // Imágenes adicionales según la categoría
    const categoryImages = {
      Plástico: [
        "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg",
        "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg",
        "https://5.imimg.com/data5/PP/HO/MY-19274525/plastic-water-bottle-500x500.jpg",
      ],
      Cartón: [
        "https://sjc.microlink.io/k1XNCI2NCfxBU5J28bwZqEGFnoaY5CgxQ9Clcx1ReocMRIoVUlSj8IaFeWySCkCzkfguQ8ljJqeqgO3He51jEQ.jpeg",
        "https://sjc.microlink.io/k1XNCI2NCfxBU5J28bwZqEGFnoaY5CgxQ9Clcx1ReocMRIoVUlSj8IaFeWySCkCzkfguQ8ljJqeqgO3He51jEQ.jpeg",
        "https://sjc.microlink.io/k1XNCI2NCfxBU5J28bwZqEGFnoaY5CgxQ9Clcx1ReocMRIoVUlSj8IaFeWySCkCzkfguQ8ljJqeqgO3He51jEQ.jpeg",
      ],
      Metal: [
        "https://limpiezademalaga.es/wp-content/uploads/2022/04/Post-reciclar-metales-abril22-1-1024x769.jpg",
        "https://limpiezademalaga.es/wp-content/uploads/2022/04/Post-reciclar-metales-abril22-1-1024x769.jpg",
        "https://limpiezademalaga.es/wp-content/uploads/2022/04/Post-reciclar-metales-abril22-1-1024x769.jpg",
      ],
      Vidrio: [
        "https://sjc.microlink.io/EYGEMpkCnAldyf9_z_SqQ15uHSZA5wRzhQk5M4j_NLgvesoQJBqmquWn924vj_7MG-2OJj7g9O3M--vecOe0bg.jpeg",
        "https://sjc.microlink.io/EYGEMpkCnAldyf9_z_SqQ15uHSZA5wRzhQk5M4j_NLgvesoQJBqmquWn924vj_7MG-2OJj7g9O3M--vecOe0bg.jpeg",
        "https://sjc.microlink.io/EYGEMpkCnAldyf9_z_SqQ15uHSZA5wRzhQk5M4j_NLgvesoQJBqmquWn924vj_7MG-2OJj7g9O3M--vecOe0bg.jpeg",
      ],
      Papel: [
        "https://th.bing.com/th/id/R.fa63d61675d85afb70b3f30a69463d67?rik=q7bC8FXKq91XKA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-fTB4dW7UeGg%2fTfp7R8ipmRI%2fAAAAAAAAAC8%2fNviFFkuPLYM%2fs1600%2fpapel20fotografico.jpg&ehk=ixrA86CzjrkEF6M9oafk6ruJ4ZOAb6Zp8Ttjh9%2bgo6Y%3d&risl=&pid=ImgRaw&r=0",
        "https://th.bing.com/th/id/R.fa63d61675d85afb70b3f30a69463d67?rik=q7bC8FXKq91XKA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-fTB4dW7UeGg%2fTfp7R8ipmRI%2fAAAAAAAAAC8%2fNviFFkuPLYM%2fs1600%2fpapel20fotografico.jpg&ehk=ixrA86CzjrkEF6M9oafk6ruJ4ZOAb6Zp8Ttjh9%2bgo6Y%3d&risl=&pid=ImgRaw&r=0",
        "https://th.bing.com/th/id/R.fa63d61675d85afb70b3f30a69463d67?rik=q7bC8FXKq91XKA&riu=http%3a%2f%2f1.bp.blogspot.com%2f-fTB4dW7UeGg%2fTfp7R8ipmRI%2fAAAAAAAAAC8%2fNviFFkuPLYM%2fs1600%2fpapel20fotografico.jpg&ehk=ixrA86CzjrkEF6M9oafk6ruJ4ZOAb6Zp8Ttjh9%2bgo6Y%3d&risl=&pid=ImgRaw&r=0",
      ],
      Electrónico: [
        "https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2024/02/startup-gana-80000-euros-mes-extrayendo-oro-cobre-dispositivos-tiramos-basura-3270798.jpg?tf=1200x675",
        "https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2024/02/startup-gana-80000-euros-mes-extrayendo-oro-cobre-dispositivos-tiramos-basura-3270798.jpg?tf=1200x675",
        "https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2024/02/startup-gana-80000-euros-mes-extrayendo-oro-cobre-dispositivos-tiramos-basura-3270798.jpg?tf=1200x675",
      ],
      Textil: [
        "https://www.canecas.com.co/images/NOTICIAS_2020/reciclar-retazos-de-tela-2.jpg",
        "https://www.canecas.com.co/images/NOTICIAS_2020/reciclar-retazos-de-tela-2.jpg",
        "https://www.canecas.com.co/images/NOTICIAS_2020/reciclar-retazos-de-tela-2.jpg",
      ],
      Orgánico: [
        "https://cdn0.uncomo.com/es/posts/8/8/1/que_se_tira_en_el_contenedor_organico_33188_600.jpg",
        "https://cdn0.uncomo.com/es/posts/8/8/1/que_se_tira_en_el_contenedor_organico_33188_600.jpg",
        "https://cdn0.uncomo.com/es/posts/8/8/1/que_se_tira_en_el_contenedor_organico_33188_600.jpg",
      ],
    }

    // Usar imágenes específicas de la categoría o imágenes genéricas
    const categoryImages2 = categoryImages[materialToShow.categoria as keyof typeof categoryImages] || [
      "https://www.renovablesverdes.com/wp-content/uploads/2021/04/materiales-reciclables-para-reutilizar.jpg",
      "https://www.renovablesverdes.com/wp-content/uploads/2021/04/materiales-reciclables-para-reutilizar.jpg",
      "https://www.renovablesverdes.com/wp-content/uploads/2021/04/materiales-reciclables-para-reutilizar.jpg",
    ]

    gallery = [baseImage, ...categoryImages2]
  } else {
    // Obtener imágenes adicionales del material (si existen)
    const { data: imagenes } = await supabase
      .from("material_imagenes")
      .select("url, orden")
      .eq("material_id", materialToShow.id)
      .order("orden", { ascending: true })

    gallery = imagenes?.map((img) => img.url) || []

    // Si no hay suficientes imágenes, agregar algunas predeterminadas
    if (gallery.length < 4) {
      const defaultImages = [
        getDefaultImage(materialToShow.categoria, materialToShow.nombre + " variante 1"),
        getDefaultImage(materialToShow.categoria, materialToShow.nombre + " variante 2"),
        getDefaultImage(materialToShow.categoria, materialToShow.nombre + " variante 3"),
      ]

      gallery = [...gallery, ...defaultImages].slice(0, 4)
    }
  }

  // Información educativa y consejos según la categoría
  let educationalInfo = ""
  let handlingTips: string[] = []

  if (materialToShow.categoria === "Plástico") {
    educationalInfo =
      "Los plásticos tardan entre 100 y 1,000 años en descomponerse. Al reciclarlos, se pueden transformar en nuevos productos como muebles, envases, y textiles."
    handlingTips = [
      "Enjuaga y seca antes de reciclar",
      "Retira tapas y etiquetas si son de material diferente",
      "Compacta para ahorrar espacio",
    ]
  } else if (materialToShow.categoria === "Papel" || materialToShow.categoria === "Cartón") {
    educationalInfo =
      "Una tonelada de papel reciclado ahorra 17 árboles y 26,000 litros de agua. El papel puede ser reciclado entre 5-7 veces antes de que las fibras sean demasiado cortas para ser útiles."
    handlingTips = [
      "Mantén el papel seco y limpio",
      "Separa por tipos: periódico, revistas, cartón",
      "Retira grapas, clips y elementos plásticos",
    ]
  } else if (materialToShow.categoria === "Vidrio") {
    educationalInfo =
      "El vidrio es 100% reciclable y puede ser reciclado infinitamente sin perder calidad o pureza. Reciclar vidrio reduce la contaminación del aire en un 20% y del agua en un 50%."
    handlingTips = [
      "Enjuaga para eliminar residuos",
      "Separa por colores si es posible",
      "No incluyas cristales de ventanas o espejos",
    ]
  } else if (materialToShow.categoria === "Metal") {
    educationalInfo =
      "Reciclar aluminio requiere solo el 5% de la energía necesaria para producir aluminio nuevo. Los metales pueden reciclarse indefinidamente sin perder sus propiedades."
    handlingTips = [
      "Asegúrate de que estén limpios",
      "Compacta las latas para ahorrar espacio",
      "Separa metales ferrosos de no ferrosos si es posible",
    ]
  } else {
    educationalInfo =
      "El reciclaje reduce la cantidad de residuos enviados a vertederos y proporciona materias primas para nuevos productos, ahorrando energía y recursos naturales."
    handlingTips = [
      "Separa por tipo de material",
      "Limpia residuos antes de reciclar",
      "Consulta las normativas locales para su manejo",
    ]
  }

  // Calcular impacto ambiental (simulado)
  const idNum = Number.parseInt(params.id, 10) || 1
  const environmentalImpact = {
    co2_ahorrado: Math.round(idNum * 1.5 * 10) / 10,
    agua_ahorrada: Math.round(idNum * 25.7 * 10) / 10,
    energia_ahorrada: Math.round(idNum * 3.8 * 10) / 10,
    arboles_salvados: Math.max(1, Math.floor(idNum / 3)),
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <Link href="/materiales" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a materiales
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Imágenes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video relative rounded-lg overflow-hidden border group">
              <Image
                src={materialToShow.imagen_url || getDefaultImage(materialToShow.categoria, materialToShow.nombre)}
                alt={materialToShow.nombre}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {gallery.length > 0
                ? gallery.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square relative rounded-md overflow-hidden border cursor-pointer group"
                    >
                      <Image
                        src={img || getDefaultImage(materialToShow.categoria, materialToShow.nombre + " " + index)}
                        alt={`${materialToShow.nombre} - imagen ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  ))
                : Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="aspect-square relative rounded-md overflow-hidden border">
                        <Image
                          src={
                            getDefaultImage(materialToShow.categoria, materialToShow.nombre + " " + index) ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={`${materialToShow.nombre} - imagen ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
            </div>
          </div>

          {/* Columna derecha: Información */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                  {materialToShow.categoria}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold mt-2">{materialToShow.nombre}</h1>
              <p className="text-muted-foreground mt-1">{materialToShow.descripcion}</p>
            </div>

            {/* Detalles del material */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Detalles del material</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Cantidad</p>
                    <p className="font-medium">
                      {materialToShow.cantidad || "No especificada"} {materialToShow.unidad_medida || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estado</p>
                    <p className="font-medium">{materialToShow.condicion || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Publicado</p>
                    <p className="font-medium">
                      {materialToShow.created_at
                        ? new Date(materialToShow.created_at).toLocaleDateString()
                        : "Fecha no disponible"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impacto ambiental */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Impacto ambiental</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {environmentalImpact.co2_ahorrado} kg
                    </p>
                    <p className="text-xs text-muted-foreground">CO₂ Ahorrado</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {environmentalImpact.agua_ahorrada} L
                    </p>
                    <p className="text-xs text-muted-foreground">Agua Ahorrada</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {environmentalImpact.energia_ahorrada} kWh
                    </p>
                    <p className="text-xs text-muted-foreground">Energía Ahorrada</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {environmentalImpact.arboles_salvados}
                    </p>
                    <p className="text-xs text-muted-foreground">Árboles Salvados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="flex flex-col gap-3">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Recycle className="mr-2 h-4 w-4" />
                Contactar para reciclar
              </Button>
              <Button variant="outline" className="w-full">
                <Info className="mr-2 h-4 w-4" />
                Solicitar más información
              </Button>
            </div>
          </div>
        </div>

        {/* Información educativa */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Información sobre {materialToShow.categoria}</h2>
              <p className="text-muted-foreground mb-6">{educationalInfo}</p>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Consejos de manipulación</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {handlingTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Proceso de reciclaje</h3>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Recolección y transporte a centros de reciclaje</li>
                    <li>Clasificación por tipo de material</li>
                    <li>Limpieza y preparación para procesar</li>
                    <li>Transformación en nueva materia prima</li>
                    <li>Fabricación de nuevos productos</li>
                  </ol>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">¿Quieres reciclar este material?</h3>
                <p className="text-muted-foreground mb-4">
                  Para reciclar este material, puedes contactar con recicladores especializados o llevarlo a puntos de
                  recogida cercanos. Regístrate para ver más opciones y contactar directamente con recicladores.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/registro">
                    <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">Registrarse</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Iniciar sesión
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
