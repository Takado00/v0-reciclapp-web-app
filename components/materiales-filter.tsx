"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, Filter, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"

interface MaterialesFilterProps {
  categoriaActual: string
  busquedaActual: string
}

const categorias = [
  { value: "todas", label: "Todas las categorías" },
  { value: "Papel", label: "Papel y Cartón" },
  { value: "Plástico", label: "Plásticos" },
  { value: "Vidrio", label: "Vidrio" },
  { value: "Metal", label: "Metales" },
  { value: "Electrónico", label: "Electrónicos" },
  { value: "Textil", label: "Textiles" },
  { value: "Orgánico", label: "Orgánicos" },
]

export function MaterialesFilter({ categoriaActual, busquedaActual }: MaterialesFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [busqueda, setBusqueda] = useState(busquedaActual)
  const [categoria, setCategoria] = useState(categoriaActual)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(() => {
      const params = new URLSearchParams()
      if (busqueda) params.set("busqueda", busqueda)
      if (categoria && categoria !== "todas") params.set("categoria", categoria)

      const queryString = params.toString()
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    })
  }

  function handleReset() {
    setBusqueda("")
    setCategoria("todas")
    router.push(pathname)
  }

  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar materiales..."
                className="pl-10 pr-16"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700">
              Buscar
            </Button>
          </form>
        </div>

        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtrar materiales</SheetTitle>
                <SheetDescription>
                  Selecciona las categorías y criterios para filtrar los materiales reciclables.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-6 py-6">
                <div className="space-y-4">
                  <Label htmlFor="categoria">Categoría</Label>
                  <RadioGroup
                    id="categoria"
                    value={categoria}
                    onValueChange={setCategoria}
                    className="grid grid-cols-1 gap-3"
                  >
                    {categorias.map((cat) => (
                      <div key={cat.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={cat.value} id={`categoria-${cat.value}`} />
                        <Label htmlFor={`categoria-${cat.value}`} className="cursor-pointer">
                          {cat.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <SheetFooter className="gap-2 sm:space-x-0">
                  <Button type="button" variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                    Limpiar filtros
                  </Button>
                  <SheetClose asChild>
                    <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                      Aplicar filtros
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>

          {(busquedaActual || (categoriaActual && categoriaActual !== "todas")) && (
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <X className="h-4 w-4" />
              <span>Limpiar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mostrar filtros activos */}
      {(busquedaActual || (categoriaActual && categoriaActual !== "todas")) && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-muted-foreground">Filtros activos:</span>
          {categoriaActual && categoriaActual !== "todas" && (
            <Badge variant="secondary" className="gap-1">
              Categoría: {categoriaActual}
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  if (busquedaActual) params.set("busqueda", busquedaActual)
                  const queryString = params.toString()
                  router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {busquedaActual && (
            <Badge variant="secondary" className="gap-1">
              Búsqueda: {busquedaActual}
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  if (categoriaActual && categoriaActual !== "todas") params.set("categoria", categoriaActual)
                  const queryString = params.toString()
                  router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
