import { ArrowRight, Globe, BookOpen, Users, ChefHat, MapPin, Award } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Globe,
    title: '001 · Setup del Proyecto Base',
    description:
      'Configuración inicial de Next.js App Router, TypeScript estricto, Vitest, ESLint, Prettier, Husky y estructura de directorios core.',
    status: 'completed',
  },
  {
    icon: BookOpen,
    title: '002 · UI Foundation',
    description:
      'Tailwind CSS + shadcn/ui + Radix UI con tokens de diseño (paleta cartográfica, tipografías, breakpoints responsive).',
    status: 'completed',
  },
  {
    icon: MapPin,
    title: '003 · Modelo de Dominio + Zod',
    description:
      'Definición del modelo de datos (País > Región > Platillo) y esquemas de validación estrictos con Zod.',
    status: 'completed',
  },
  {
    icon: Users,
    title: '004 · Firebase Setup',
    description:
      'Configuración de Firebase Firestore, credenciales, reglas de seguridad y estructura de colecciones.',
    status: 'completed',
  },
  {
    icon: Award,
    title: '005 · Motor de Ingesta',
    description:
      'Script versionado para poblar Firestore con Honduras como región piloto (datos antropológicos).',
    status: 'completed',
  },
  {
    icon: Globe,
    title: '006 · Navegación Cartográfica Interactiva',
    description:
      'Mapa interactivo con Leaflet/React-Leaflet, navegación por teclado, ARIA labels y panel de información lateral.',
    status: 'completed',
  },
  {
    icon: BookOpen,
    title: '007 · Fichas Culturales Inmersivas',
    description:
      'Panel deslizante con tabs (Receta/Historia/Festividades), videos YouTube/Vimeo y galería de imágenes.',
    status: 'completed',
  },
  {
    icon: ChefHat,
    title: '008 · Ecosistema de Aportes',
    description:
      'Módulo seguro para que chefs locales y guardianes de tradiciones aporten patrimonio culinario.',
    status: 'in-progress',
  },
]

const stats = [
  { value: '8', label: 'Features' },
  { value: '7', label: 'Hechas ✅' },
  { value: '1', label: 'En progreso' },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center bg-gradient-to-b from-background to-muted/50">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-heading">
            <span className="text-primary">Bite</span>Atlas
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto font-editorial">
            Expedición culinaria global. Conecta con las tradiciones, historias antropológicas y
            recetas auténticas de todo el mundo.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Link href="/mapa" className="flex items-center gap-2">
              <Button size="lg" className="gap-2">
                Explorar el Mapa
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo" className="flex items-center gap-2">
              <Button size="lg" variant="outline" className="gap-2">
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="grid grid-cols-3 divide-x max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-8 text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
              Explora la Gastronomía Mundial
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              BiteAtlas es más que un recetario. Es un puente cultural que conecta personas a través
              de lo que comemos.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-2 hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
            ¿Listo para Explorar?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            Únete a la comunidad de exploradores culinarios y descubre los sabores del mundo.
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Comenzar Ahora
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t bg-background">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 BiteAtlas. Plataforma de expedición culinaria global.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Acerca de
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
