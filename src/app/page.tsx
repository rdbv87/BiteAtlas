import { ArrowUpRight, Compass, MapPinned, Utensils } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RecipeExplorer } from '@/components/fichas/RecipeExplorer'
import { honduras, platillos } from '@/scripts/data/honduras'

const featuredRecipes = platillos.slice(0, 3)

const recipeImages = [
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85',
]

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f5f1e8] text-[#173c3a]">
      <section className="relative isolate min-h-[720px] bg-[#173c3a] text-[#f5f1e8]">
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(245,241,232,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(245,241,232,.12)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#f0a35b]">
              <span className="h-px w-10 bg-[#f0a35b]" />
              Atlas culinario · 01
            </div>
            <h1 className="max-w-3xl font-editorial text-6xl leading-[0.98] tracking-[-0.03em] sm:text-7xl lg:text-8xl">
              Donde cada plato guarda un territorio.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#d4ddd1]">
              Historias, ingredientes y recetas que cruzan fronteras. Empezamos en Honduras para
              leer un país a través de su mesa.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/mapa">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-[#e8754f] text-white hover:bg-[#d96340] sm:w-auto"
                >
                  Entrar al mapa
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#recetas">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-[#d4ddd1]/40 bg-transparent text-[#f5f1e8] hover:bg-[#f5f1e8]/10 hover:text-[#f5f1e8] sm:w-auto"
                >
                  Ver recetas
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:justify-self-end">
            <div className="absolute -right-3 -top-5 z-10 flex h-28 w-28 rotate-6 flex-col justify-center bg-[#f0a35b] p-4 text-[#173c3a] shadow-xl sm:-right-7">
              <span className="text-[10px] uppercase tracking-[0.2em]">En foco</span>
              <strong className="mt-1 font-editorial text-2xl">Honduras</strong>
              <span className="mt-1 text-xs">Caribe · Maíz · Coco</span>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-[#d4ddd1]/20 bg-[#315955] p-3 shadow-2xl">
              <Image
                src={recipeImages[0]!}
                alt="Baleada hondureña servida en una mesa"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="rounded-[1rem] object-cover p-3"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 max-w-[230px] bg-[#f5f1e8] p-4 text-[#173c3a] shadow-xl sm:-left-10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#e8754f]">
                <MapPinned className="h-4 w-4" /> Costa norte
              </div>
              <p className="mt-2 font-editorial text-lg leading-tight">
                La baleada como puerta de entrada.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#173c3a]/15 bg-[#e6eadc]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:grid-cols-3 sm:px-10">
          <div>
            <p className="text-4xl font-editorial">01</p>
            <p className="mt-1 text-sm text-[#47615a]">país en el atlas</p>
          </div>
          <div>
            <p className="text-4xl font-editorial">03</p>
            <p className="mt-1 text-sm text-[#47615a]">recetas con historia</p>
          </div>
          <div>
            <p className="text-4xl font-editorial">∞</p>
            <p className="mt-1 text-sm text-[#47615a]">maneras de compartir la mesa</p>
          </div>
        </div>
      </section>

      <section id="recetas" className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#e8754f]">
              <Utensils className="h-4 w-4" /> Cuaderno de campo
            </div>
            <h2 className="mt-5 max-w-lg font-editorial text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              Tres formas de contar Honduras.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[#47615a]">
            La cocina no es una lista de ingredientes. Es memoria, territorio y tiempo compartido.
            Estas son las primeras historias que ponemos sobre la mesa.
          </p>
        </div>

        <div className="mt-14">
          <RecipeExplorer recipes={featuredRecipes} images={recipeImages} />
        </div>
      </section>

      <section className="bg-[#dce5dd] px-6 py-24 sm:px-10 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#e8754f]">
              <Compass className="h-4 w-4" /> La expedición empieza aquí
            </div>
            <h2 className="mt-5 max-w-2xl font-editorial text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              Sigue el sabor hasta su lugar de origen.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#47615a]">
              Explora el mapa, elige un país y deja que sus regiones te lleven a sus ingredientes,
              sus voces y sus platos.
            </p>
            <Link href="/mapa" className="mt-8 inline-flex">
              <Button size="lg" className="gap-2 bg-[#173c3a] text-[#f5f1e8] hover:bg-[#28524e]">
                Explorar {honduras.nombre}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative min-h-[300px] overflow-hidden bg-[#173c3a] p-8 text-[#f5f1e8] [background-image:radial-gradient(circle_at_20%_20%,rgba(240,163,91,.8)_0_2px,transparent_3px),linear-gradient(135deg,transparent_49%,rgba(212,221,209,.15)_50%,transparent_51%)] [background-size:36px_36px,100%_100%]">
            <div className="absolute left-[22%] top-[30%] h-4 w-4 rounded-full bg-[#f0a35b] shadow-[0_0_0_8px_rgba(240,163,91,.18)]" />
            <div className="absolute left-[22%] top-[30%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f0a35b]/40" />
            <div className="absolute bottom-8 left-8 max-w-[220px]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f0a35b]">Punto de partida</p>
              <p className="mt-2 font-editorial text-3xl">Honduras</p>
              <p className="mt-2 text-sm leading-6 text-[#d4ddd1]">15° N · 86° O</p>
            </div>
            <span className="absolute right-8 top-8 text-xs uppercase tracking-[0.2em] text-[#d4ddd1]/60">
              BiteAtlas / mapa 01
            </span>
          </div>
        </div>
      </section>

      <footer className="bg-[#173c3a] px-6 py-10 text-[#d4ddd1] sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-editorial text-xl text-[#f5f1e8]">BiteAtlas</p>
          <p>Un atlas vivo de las cocinas que nos cuentan.</p>
          <Link
            href="/aportes"
            className="inline-flex items-center gap-2 text-[#f0a35b] hover:text-[#f5f1e8]"
          >
            Comparte una receta <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </main>
  )
}
