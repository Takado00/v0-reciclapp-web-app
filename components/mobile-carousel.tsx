"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop",
      title: "Recicla materiales",
      description: "Contribuye al medio ambiente reciclando correctamente",
    },
    {
      image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=1000&auto=format&fit=crop",
      title: "Papel y cartón",
      description: "Aprende a separar y reciclar papel correctamente",
    },
    {
      image:
        "https://sjc.microlink.io/EYGEMpkCnAldyf9_z_SqQ15uHSZA5wRzhQk5M4j_NLgvesoQJBqmquWn924vj_7MG-2OJj7g9O3M--vecOe0bg.jpeg",
      title: "Vidrio reciclable",
      description: "El vidrio es 100% reciclable y reutilizable",
    },
    {
      image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=1000&auto=format&fit=crop",
      title: "Plásticos",
      description: "Conoce los diferentes tipos de plásticos reciclables",
    },
    {
      image: "https://images.unsplash.com/photo-1616069555273-2f4d7d369c17?q=80&w=1000&auto=format&fit=crop",
      title: "Metales",
      description: "Los metales pueden reciclarse infinitas veces",
    },
  ]

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }, [slides.length])

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <div className="relative w-full h-48 overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white text-xl font-bold">{slide.title}</h3>
              <p className="text-white/90 text-sm">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 border-none"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 border-none"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
