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
    imagen_url: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=800&auto=format&fit=crop",
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
    imagen_url: "https://images.unsplash.com/photo-1607583444909-8cc42d46f7b2?q=80&w=800&auto=format&fit=crop",
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
    imagen_url:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPC-WIbhoXUB_A9DUrcUH6N7UmPXC433xlZA-YXF2MaYRtR8RfT-UUQbBP_52OTVHezB4pavp2ocZe6to9eAHvw8Hqjr-5v_N-pH6LXOHDiHSPzETQtgI74M0T5vNzB1lsfbJYN4kXCzo/s16000-rw/lata.jpg",
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
    imagen_url: "https://images.unsplash.com/photo-1604349841434-d6e7837fc372?q=80&w=800&auto=format&fit=crop",
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
    imagen_url: "https://images.unsplash.com/photo-1598618443855-232ee0f819f6?q=80&w=800&auto=format&fit=crop",
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
    imagen_url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop",
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
    imagen_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
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
    imagen_url: "https://images.unsplash.com/photo-1591954746678-a253972b2177?q=80&w=800&auto=format&fit=crop",
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
      if (nombreLower.includes("periódico") || nombreLower.includes("periodico") || nombreLower.includes("diario")) {
        return "https://images.unsplash.com/photo-1598618443855-232ee0f819f6?q=80&w=800&auto=format&fit=crop"
      }
      return "https://images.unsplash.com/photo-1607583444909-8cc42d46f7b2?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Plástico
    else if (categoriaLower.includes("plástico") || categoriaLower.includes("plastico")) {
      if (nombreLower.includes("pet") || nombreLower.includes("botella")) {
        return "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=800&auto=format&fit=crop"
      }
      return "https://images.unsplash.com/photo-1571727153934-b9e0a8a8b1b1?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Vidrio
    else if (categoriaLower.includes("vidrio")) {
      return "https://images.unsplash.com/photo-1604349841434-d6e7837fc372?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Metal/Aluminio
    else if (categoriaLower.includes("metal") || categoriaLower.includes("aluminio")) {
      if (nombreLower.includes("lata") || nombreLower.includes("aluminio") || nombreLower.includes("latas")) {
        return "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPC-WIbhoXUB_A9DUrcUH6N7UmPXC433xlZA-YXF2MaYRtR8RfT-UUQbBP_52OTVHezB4pavp2ocZe6to9eAHvw8Hqjr-5v_N-pH6LXOHDiHSPzETQtgI74M0T5vNzB1lsfbJYN4kXCzo/s16000-rw/lata.jpg"
      }
      return "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Orgánico
    else if (categoriaLower.includes("orgánico") || categoriaLower.includes("organico")) {
      return "https://images.unsplash.com/photo-1591954746678-a253972b2177?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Electrónico
    else if (categoriaLower.includes("electrónico") || categoriaLower.includes("electronico")) {
      return "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría Textil
    else if (categoriaLower.includes("textil") || nombreLower.includes("ropa") || nombreLower.includes("tela")) {
      return "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop"
    }

    // Categoría por defecto
    else {
      return "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop"
    }
  }

  // Verificar si estamos viendo el material de latas de aluminio (ID 3)
  const isAluminumCans =
    materialToShow.id === 3 ||
    (materialToShow.nombre &&
      materialToShow.nombre.toLowerCase().includes("lata") &&
      materialToShow.categoria &&
      materialToShow.categoria.toLowerCase().includes("metal"))

  // Forzar la URL de la imagen para latas de aluminio
  if (isAluminumCans) {
    materialToShow.imagen_url =
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPC-WIbhoXUB_A9DUrcUH6N7UmPXC433xlZA-YXF2MaYRtR8RfT-UUQbBP_52OTVHezB4pavp2ocZe6to9eAHvw8Hqjr-5v_N-pH6LXOHDiHSPzETQtgI74M0T5vNzB1lsfbJYN4kXCzo/s16000-rw/lata.jpg"
  }

  // Generar imágenes adicionales para la galería
  let gallery = []

  if (isAluminumCans) {
    // Para latas de aluminio, no mostrar galería adicional
    gallery = []
  } else if (isDefaultMaterial) {
    // Si es un material predeterminado, generar imágenes de galería
    const baseImage = materialToShow.imagen_url || getDefaultImage(materialToShow.categoria, materialToShow.nombre)

    // Imágenes adicionales según la categoría
    const categoryImages = {
      Plástico: [
        "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571727153934-b9e0a8a8b1b1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?q=80&w=800&auto=format&fit=crop",
      ],
      Cartón: [
        "https://images.unsplash.com/photo-1607583444909-8cc42d46f7b2?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1607583444918-da5fb2631d37?q=80&w=800&auto=format&fit=crop",
      ],
      Metal: [
        "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1561116108-4ecaa5e95932?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605792657667-9d0148b11fa2?q=80&w=800&auto=format&fit=crop",
      ],
      Vidrio: [
        "https://images.unsplash.com/photo-1604349841434-d6e7837fc372?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550411294-56f7d0c7fbe6?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1485550409059-9afb054cada4?q=80&w=800&auto=format&fit=crop",
      ],
      Papel: [
        "https://images.unsplash.com/photo-1598618443855-232ee0f819f6?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1598618253208-d75408cee680?q=80&w=800&auto=format&fit=crop",
      ],
      Electrónico: [
        "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop",
      ],
      Textil: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
      ],
      Orgánico: [
        "https://images.unsplash.com/photo-1591954746678-a253972b2177?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580852300654-03c803a14e24?q=80&w=800&auto=format&fit=crop",
      ],
    }

    // Usar imágenes específicas de la categoría o imágenes genéricas
    const categoryImages2 = categoryImages[materialToShow.categoria as keyof typeof categoryImages] || [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=800&auto=format&fit=crop",
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

            {/* Solo mostrar la galería si no es el material de latas de aluminio */}
            {!isAluminumCans && gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {gallery.map((img, index) => (
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
                  </div>
                ))}
              </div>
            )}
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
