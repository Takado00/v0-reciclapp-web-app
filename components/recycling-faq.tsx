import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function RecyclingFAQ() {
  const faqs = [
    {
      question: "¿Por qué es importante reciclar?",
      answer:
        "Reciclar es fundamental para reducir la cantidad de residuos que terminan en vertederos, conservar recursos naturales, ahorrar energía, disminuir la contaminación y combatir el cambio climático. Además, fomenta la economía circular y crea empleos en el sector del reciclaje.",
    },
    {
      question: "¿Qué materiales se pueden reciclar en Bogotá?",
      answer:
        "En Bogotá se pueden reciclar papel y cartón, plásticos (especialmente PET y HDPE), vidrio, metales (latas, aluminio), tetrapak y algunos electrónicos. La capacidad de reciclaje varía según la infraestructura disponible en cada localidad.",
    },
    {
      question: "¿Dónde puedo llevar mis materiales reciclables?",
      answer:
        "Puedes llevar tus materiales reciclables a puntos ecológicos distribuidos por la ciudad, centros de acopio, estaciones de clasificación y aprovechamiento (ECAs), o entregarlos directamente a recicladores de oficio. También puedes usar la sección de Ubicaciones en ReciclApp para encontrar el punto más cercano.",
    },
    {
      question: "¿Cómo puedo saber si un plástico es reciclable?",
      answer:
        "Los plásticos reciclables suelen tener un símbolo de reciclaje (triángulo de flechas) con un número del 1 al 7 en su interior. Los más fácilmente reciclables en Bogotá son el 1 (PET), 2 (HDPE) y 5 (PP). Sin embargo, es importante verificar qué tipos de plástico acepta cada centro de reciclaje.",
    },
    {
      question: "¿Debo lavar los envases antes de reciclarlos?",
      answer:
        "Sí, es recomendable enjuagar brevemente los envases para eliminar residuos de alimentos o productos. No necesitan estar perfectamente limpios, pero sí lo suficientemente libres de residuos para evitar malos olores, plagas y contaminación de otros materiales reciclables.",
    },
    {
      question: "¿Qué hago con los residuos electrónicos?",
      answer:
        "Los residuos electrónicos (computadores, celulares, electrodomésticos) deben llevarse a puntos especiales de recolección, ya que contienen componentes que requieren un tratamiento especial. Muchos fabricantes y tiendas de electrónicos tienen programas de recolección. También puedes consultar los puntos especializados en la sección de Ubicaciones de ReciclApp.",
    },
    {
      question: "¿Cómo puedo involucrarme más en el reciclaje en mi comunidad?",
      answer:
        "Puedes organizar campañas de concientización, crear un punto de reciclaje comunitario, contactar con recicladores locales para establecer rutas de recolección, participar en jornadas de limpieza, o unirte a organizaciones ambientales. ReciclApp te permite conectar con otros usuarios interesados en iniciativas de reciclaje en tu zona.",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Preguntas Frecuentes</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
