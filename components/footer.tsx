import Link from "next/link"
import { Recycle } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Recycle className="h-6 w-6 text-green-600" />
              <span className="font-bold text-xl">ReciclApp</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Conectando recicladores y empresas en Bogotá para un futuro más sostenible.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/materiales" className="text-muted-foreground hover:text-primary">
                  Materiales
                </Link>
              </li>
              <li>
                <Link href="/como-reciclar" className="text-muted-foreground hover:text-primary">
                  Cómo Reciclar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Usuarios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/registro?tipo=reciclador" className="text-muted-foreground hover:text-primary">
                  Recicladores
                </Link>
              </li>
              <li>
                <Link href="/registro?tipo=empresa" className="text-muted-foreground hover:text-primary">
                  Empresas
                </Link>
              </li>
              <li>
                <Link href="/registro?tipo=persona" className="text-muted-foreground hover:text-primary">
                  Personas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">contacto@reciclapp.co</li>
              <li className="text-muted-foreground">Bogotá, Colombia</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ReciclApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
