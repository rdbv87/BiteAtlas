'use client'

import { startTransition, useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Compass, Utensils } from 'lucide-react'
import { FeaturedRecipeCard } from '@/components/mapas/FeaturedRecipeCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RecipeExplorer } from '@/components/fichas/RecipeExplorer'
import { useLandingData } from '@/services/hooks/useLandingData'
import { summarizeWords } from '@/lib/utils'
import { formatCoordenadas, getEncuadrePais, palabrasClaveDeReceta } from '@/lib/atlas'

export const dynamic = 'force-dynamic'

export default function Home() {
  const { paisesConRecetas, recetasPorPais, regionesPorPais, isLoading, error } = useLandingData()
  const [featuredRecipeId, setFeaturedRecipeId] = useState<string | null>(null)

  useEffect(() => {
    const recipes = Object.values(recetasPorPais).flat()

    if (recipes.length > 0) {
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]
      startTransition(() => setFeaturedRecipeId(randomRecipe?.id ?? null))
    } else {
      startTransition(() => setFeaturedRecipeId(null))
    }
  }, [recetasPorPais])

  const featuredRecipe = useMemo(
    () =>
      Object.values(recetasPorPais)
        .flat()
        .find((recipe) => recipe.id === featuredRecipeId) ?? null,
    [featuredRecipeId, recetasPorPais]
  )

  const selectedCountry =
    paisesConRecetas.find((pais) => pais.id === featuredRecipe?.paisId) ?? null

  const country = selectedCountry
  const countryRecipes = useMemo(
    () => (country ? (recetasPorPais[country.id] ?? []) : []),
    [country, recetasPorPais]
  )
  const selectedCountryCoords = getEncuadrePais(country, countryRecipes)
  const featuredRecipes = countryRecipes.slice(0, 3)
  const totalRecipes = Object.values(recetasPorPais).flat().length
  const featuredRegion = featuredRecipe
    ? regionesPorPais[featuredRecipe.paisId]?.find((r) => r.id === featuredRecipe.regionId)
    : undefined
  const featuredSummary = featuredRecipe
    ? summarizeWords(featuredRecipe.descripcion, 20)
    : 'Cada receta que publicas suma un territorio nuevo al atlas. Empieza por la tuya.'
  const emptyStateMessage = error
    ? 'No pudimos leer el atlas en este momento. Vuelve a intentarlo en unos minutos.'
    : 'Todavía no hay recetas publicadas. Sé la primera persona en poner tu cocina en el mapa.'

  return (
    <main className="overflow-hidden bg-[#f5f1e8] text-[#173c3a]">
      <section className="relative isolate min-h-[720px] bg-[#173c3a] text-[#f5f1e8]">
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(245,241,232,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(245,241,232,.12)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full border-[18px] border-[#e8754f]/25 sm:right-12" />
        <div className="pointer-events-none absolute bottom-16 left-[8%] h-3 w-3 animate-bounce rounded-full bg-[#f0a35b] shadow-[0_0_0_10px_rgba(240,163,91,.15)]" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#f0a35b]">
              <span className="h-px w-10 bg-[#f0a35b]" />
              Atlas culinario · 01
            </div>
            <h1 className="max-w-3xl font-editorial text-6xl leading-[0.98] tracking-[-0.03em] sm:text-7xl lg:text-8xl">
              Donde cada plato guarda un territorio.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#d4ddd1]">{featuredSummary}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {featuredRecipe ? (
                <>
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
                </>
              ) : (
                <Link href="/aportes">
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-[#e8754f] text-white hover:bg-[#d96340] sm:w-auto"
                  >
                    Publicar la primera receta
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {featuredRecipe ? (
            <FeaturedRecipeCard
              recipe={featuredRecipe}
              region={featuredRegion}
              countryName={country?.nombre ?? ''}
              palabrasClave={palabrasClaveDeReceta(featuredRecipe)}
            />
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-[#1f534f] p-10 text-center text-[#d4ddd1] shadow-2xl">
              <p className="text-lg font-semibold">
                {isLoading ? 'Cargando receta destacada...' : 'El atlas espera su primera historia'}
              </p>
              <p className="mt-3 text-sm">
                {isLoading ? 'Estamos leyendo el atlas.' : emptyStateMessage}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-[#173c3a]/15 bg-[#e6eadc]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:grid-cols-3 sm:px-10">
          <div className="group">
            <p className="text-4xl font-editorial">{paisesConRecetas.length}</p>
            <p className="mt-1 text-sm text-[#47615a]">países en el atlas</p>
          </div>
          <div>
            <p className="text-4xl font-editorial">{totalRecipes}</p>
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
            <h2 className="playful-underline mt-5 max-w-lg font-editorial text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              {selectedCountry
                ? `Tres formas de contar ${selectedCountry.nombre}.`
                : 'Aún nadie ha contado su cocina aquí.'}
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[#47615a]">
            La cocina no es una lista de ingredientes. Es memoria, territorio y tiempo compartido.
            {selectedCountry
              ? ' Estas son las historias que la comunidad pone sobre la mesa.'
              : ' Publica tu receta y será la primera historia sobre la mesa.'}
          </p>
        </div>

        <div className="mt-14">
          <RecipeExplorer recipes={featuredRecipes} />
        </div>
      </section>

      <section className="bg-[#dce5dd] px-6 py-24 sm:px-10 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div className="group">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#e8754f]">
              <Compass className="h-4 w-4" /> La expedición empieza aquí
            </div>
            <h2 className="playful-underline mt-5 max-w-2xl font-editorial text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              Sigue el sabor hasta su lugar de origen.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#47615a]">
              Explora el mapa, elige un país y deja que sus regiones te lleven a sus ingredientes,
              sus voces y sus platos.
            </p>
            <Link
              href={selectedCountry ? `/mapa?pais=${selectedCountry.id}` : '/aportes'}
              className="mt-8 inline-flex"
            >
              <Button size="lg" className="gap-2 bg-[#173c3a] text-[#f5f1e8] hover:bg-[#28524e]">
                {selectedCountry ? `Explorar ${selectedCountry.nombre}` : 'Aportar una receta'}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative min-h-[300px] overflow-hidden bg-[#173c3a] p-8 text-[#f5f1e8] [background-image:radial-gradient(circle_at_20%_20%,rgba(240,163,91,.8)_0_2px,transparent_3px),linear-gradient(135deg,transparent_49%,rgba(212,221,209,.15)_50%,transparent_51%)] [background-size:36px_36px,100%_100%]">
            <div className="absolute left-[22%] top-[30%] h-4 w-4 rounded-full bg-[#f0a35b] shadow-[0_0_0_8px_rgba(240,163,91,.18)]" />
            <div className="absolute left-[22%] top-[30%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f0a35b]/40" />
            <div className="absolute bottom-8 left-8 max-w-[220px]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f0a35b]">Punto de partida</p>
              <p className="mt-2 font-editorial text-3xl">
                {selectedCountry?.nombre ?? 'Tu cocina'}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#d4ddd1]">
                {formatCoordenadas(selectedCountryCoords)}
              </p>
            </div>
            <span className="absolute right-8 top-8 text-xs uppercase tracking-[0.2em] text-[#d4ddd1]/60">
              BiteAtlas / mapa 01
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#faf5ed] px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#e8754f]">
                Atlas para tu viaje
              </p>
              <h2 className="mt-3 font-editorial text-4xl text-[#173c3a]">
                Explora países, regiones y sabores auténticos.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#47615a]">
              Elige un país y descubre tres recetas que cuentan su historia culinaria.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {paisesConRecetas.length > 0 ? (
              paisesConRecetas.map((pais) => (
                <div
                  key={pais.id}
                  className="rounded-[2rem] border border-[#173c3a]/10 bg-white p-6 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#e8754f]">
                    {pais.continente}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold text-[#173c3a]">{pais.nombre}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#47615a] line-clamp-4">
                    {pais.descripcion}
                  </p>
                  <Link
                    href={`/mapa?pais=${pais.id}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#173c3a] hover:text-[#e8754f]"
                  >
                    Explorar país
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="border border-dashed border-[#173c3a]/20 bg-white/60 p-8 text-[#47615a] sm:col-span-3">
                {isLoading ? 'Cargando el atlas...' : emptyStateMessage}
                {!isLoading && !error && (
                  <Link
                    href="/aportes"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#173c3a] hover:text-[#e8754f]"
                  >
                    Aportar una receta
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}
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
