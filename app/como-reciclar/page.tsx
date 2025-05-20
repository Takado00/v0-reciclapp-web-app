import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RecyclingGuide } from "@/components/recycling-guide"
import { RecyclingTips } from "@/components/recycling-tips"
import { RecyclingFAQ } from "@/components/recycling-faq"

export default function ComoReciclarPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-2">Cómo Reciclar Correctamente</h1>
          <p className="text-muted-foreground mb-8">
            Aprende a separar y aprovechar los materiales reciclables de manera efectiva.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecyclingGuide />
            </div>
            <div>
              <RecyclingTips />
            </div>
          </div>

          <div className="mt-12">
            <RecyclingFAQ />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
