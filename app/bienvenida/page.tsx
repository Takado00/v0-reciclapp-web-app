"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Recycle, Users, Shield, ArrowRight, ChevronRight } from "lucide-react"

export default function BienvenidaPage() {
  const [activeTab, setActiveTab] = useState("inicio")
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">ReciclApp</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold">Bienvenido a ReciclApp</CardTitle>
              <CardDescription className="text-lg">
                La plataforma que conecta donantes de materiales reciclables con recicladores
              </CardDescription>
            </CardHeader>

            <Tabs defaultValue="inicio" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="inicio">Inicio</TabsTrigger>
                  <TabsTrigger value="acceso">Acceso</TabsTrigger>
                  <TabsTrigger value="info">Información</TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6">
                <TabsContent value="inicio" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Únete a nuestra comunidad de reciclaje</h2>
                      <p className="text-muted-foreground mb-6">
                        ReciclApp es una plataforma que facilita la conexión entre personas que desean donar materiales
                        reciclables y aquellos que pueden darles un nuevo uso, contribuyendo así a un futuro más
                        sostenible.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Impacto ambiental positivo</h3>
                            <p className="text-sm text-muted-foreground">
                              Reduce la huella de carbono y contribuye a la economía circular
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Comunidad colaborativa</h3>
                            <p className="text-sm text-muted-foreground">
                              Conecta con personas comprometidas con el medio ambiente
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Intercambios seguros</h3>
                            <p className="text-sm text-muted-foreground">
                              Sistema de verificación y calificaciones para mayor confianza
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          size="lg"
                          onClick={() => setActiveTab("acceso")}
                        >
                          Comenzar ahora
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => setActiveTab("info")}>
                          Saber más
                        </Button>
                      </div>
                    </div>
                    <div className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src="/collaborative-recycling.png"
                        alt="Reciclaje colaborativo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="acceso" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
                      <p className="text-muted-foreground mb-6">
                        ¿Ya tienes una cuenta? Inicia sesión para acceder a todas las funcionalidades de ReciclApp.
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-green-600" />
                          <span>Accede a tu perfil personal</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-green-600" />
                          <span>Gestiona tus materiales publicados</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-green-600" />
                          <span>Contacta con otros usuarios</span>
                        </li>
                      </ul>
                      <Link href="/login">
                        <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                          Iniciar sesión
                        </Button>
                      </Link>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                      <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>
                      <p className="text-muted-foreground mb-6">
                        ¿Eres nuevo en ReciclApp? Regístrate para formar parte de nuestra comunidad de reciclaje.
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-green-600" />
                          <span>Publica materiales para reciclar</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-green-600" />
                          <span>Encuentra materiales cerca de ti</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-green-600" />
                          <span>Contribuye al cuidado del medio ambiente</span>
                        </li>
                      </ul>
                      <Link href="/registro">
                        <Button className="w-full" variant="outline" size="lg">
                          Crear cuenta
                        </Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="info" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">¿Cómo funciona ReciclApp?</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                          <div className="bg-white dark:bg-green-800 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">1</span>
                          </div>
                          <h3 className="font-medium mb-2">Regístrate</h3>
                          <p className="text-sm text-muted-foreground">
                            Crea tu cuenta como usuario, reciclador o empresa
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                          <div className="bg-white dark:bg-green-800 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">2</span>
                          </div>
                          <h3 className="font-medium mb-2">Publica o busca</h3>
                          <p className="text-sm text-muted-foreground">
                            Comparte tus materiales o encuentra los que necesitas
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                          <div className="bg-white dark:bg-green-800 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">3</span>
                          </div>
                          <h3 className="font-medium mb-2">Conecta</h3>
                          <p className="text-sm text-muted-foreground">Coordina la entrega y contribuye al reciclaje</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold mb-4">Preguntas frecuentes</h2>
                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">¿Es gratis usar ReciclApp?</h3>
                          <p className="text-sm text-muted-foreground">
                            Sí, ReciclApp es completamente gratuito para todos los usuarios. Nuestro objetivo es
                            fomentar el reciclaje y la economía circular.
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">¿Qué tipo de materiales puedo publicar?</h3>
                          <p className="text-sm text-muted-foreground">
                            Puedes publicar todo tipo de materiales reciclables: plástico, papel, cartón, vidrio,
                            metales, textiles, electrónicos y más.
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">¿Cómo se garantiza la seguridad en las transacciones?</h3>
                          <p className="text-sm text-muted-foreground">
                            Contamos con un sistema de verificación de usuarios, calificaciones y reseñas que ayudan a
                            construir confianza en la comunidad.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>

              <CardFooter className="flex flex-col text-center text-sm text-muted-foreground">
                <p>
                  Al registrarte, aceptas nuestros{" "}
                  <Link href="#" className="text-green-600 hover:underline">
                    Términos y Condiciones
                  </Link>{" "}
                  y{" "}
                  <Link href="#" className="text-green-600 hover:underline">
                    Política de Privacidad
                  </Link>
                </p>
                <p className="mt-2">© 2023 ReciclApp. Todos los derechos reservados.</p>
              </CardFooter>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
