import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { MaterialsPreview } from "@/components/materials-preview"
import { MobileNavbar } from "@/components/mobile-navbar"
import { MobileHeader } from "@/components/mobile-header"
import { MobileCarousel } from "@/components/mobile-carousel"
import { MobileCategorias } from "@/components/mobile-categorias"
import { MobileDestacados } from "@/components/mobile-destacados"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar para desktop */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Header para móvil */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <main className="flex-1">
        {/* Contenido para desktop */}
        <div className="hidden md:block">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <MaterialsPreview />
        </div>

        {/* Contenido para móvil */}
        <div className="md:hidden pb-16">
          <MobileCarousel />
          <MobileCategorias />
          <MobileDestacados />
        </div>
      </main>

      {/* Footer para desktop */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Barra de navegación móvil */}
      <div className="md:hidden">
        <MobileNavbar />
      </div>
    </div>
  )
}
