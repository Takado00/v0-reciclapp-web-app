import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SessionProvider } from "@/components/session-provider"
import { FloatingActionButton } from "@/components/floating-action-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ReciclApp - Conectando recicladores y materiales",
  description: "Plataforma para conectar personas con materiales reciclables y recicladores profesionales",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <FloatingActionButton />
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
