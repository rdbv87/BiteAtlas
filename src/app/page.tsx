'use client'

import { startTransition, useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Compass, Utensils } from 'lucide-react'
import { FeaturedRecipeCard } from '@/components/mapas/FeaturedRecipeCard'
import { WorldAtlasMap } from '@/components/mapas/WorldAtlasMap'
import { WorldAtlasCountryCard } from '@/components/mapas/WorldAtlasCountryCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/ui/UserNav'
import { RecipeExplorer } from '@/components/fichas/RecipeExplorer'
import { useLandingData } from '@/services/hooks/useLandingData'
import { summarizeWords } from '@/lib/utils'
import { formatCoordenadas, getEncuadrePais, palabrasClaveDeReceta } from '@/lib/atlas'
import type { Pais } from '@/types'
import { useI18n } from '@/i18n/context'

export const dynamic = 'force-dynamic'

export default function Home() {
  const { t } = useI18n()
  const { paises, paisesConRecetas, recetasPorPais, regionesPorPais, isLoading, error } =
    useLandingData()
  const [featuredRecipeId, setFeaturedRecipeId] = useState<string | null>(null)
  const [selectedAtlasCountry, setSelectedAtlasCountry] = useState<Pais | null | undefined>(
    undefined
  )
  const atlasCountry =
    selectedAtlasCountry === undefined ? (paisesConRecetas[0] ?? null) : selectedAtlasCountry

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
    : t('landing.heroDefaultSummary')
  const emptyStateMessage = error
    ? t('common.error')
    : 'Todavía no hay recetas publicadas. Sé la primera persona en poner tu cocina en el mapa.'

  return (
    <main className="overflow-hidden bg-[#f5f1e8] text-[#173c3a]">
      {/* Navegación Superior */}
      <header className="border-b border-[#f5f1e8]/10 bg-[#173c3a] text-[#f5f1e8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-editorial text-2xl tracking-tight text-[#f5f1e8] flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#f0a35b]" />
              BiteAtlas
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-[#d4ddd1]">
              <Link href="/mapa" className="hover:text-[#f0a35b] transition-colors">
                {t('nav.map')}
              </Link>
              <Link href="#recetas" className="hover:text-[#f0a35b] transition-colors">
                {t('fichas.recipe')}
              </Link>
              <Link href="/aportes" className="hover:text-[#f0a35b] transition-colors">
                {t('nav.contribute')}
              </Link>
            </nav>
          </div>

          <UserNav variant="dark" />
        </div>
      </header>

      <section className="relative isolate min-h-180 bg-[#173c3a] text-[#f5f1e8]">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[linear-gradient(rgba(245,241,232,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(245,241,232,.12)_1px,transparent_1px)] bg-size-[72px_72px]" />
        <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full border-18 border-[#e8754f]/25 sm:right-12" />
        <div className="pointer-events-none absolute bottom-16 left-[8%] h-3 w-3 animate-bounce rounded-full bg-[#f0a35b] shadow-[0_0_0_10px_rgba(240,163,91,.15)]" />
        <div className="mx-auto grid min-h-180 max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#f0a35b]">
              <span className="h-px w-10 bg-[#f0a35b]" />
              {t('landing.heroBadge')}
            </div>

            <h1 className="max-w-3xl font-editorial text-6xl leading-[0.98] tracking-[-0.03em] sm:text-7xl lg:text-8xl">
              {t('landing.heroTitle')}
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
                      {t('landing.heroEnterMap')}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#recetas">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-[#d4ddd1]/40 bg-transparent text-[#f5f1e8] hover:bg-[#f5f1e8]/10 hover:text-[#f5f1e8] sm:w-auto"
                    >
                      {t('landing.heroViewRecipes')}
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/aportes">
                  <Button
                    size="lg"
                    className="w-full gap-2 bg-[#e8754f] text-white hover:bg-[#d96340] sm:w-auto"
                  >
                    {t('landing.heroPublishFirst')}
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
                {isLoading ? t('landing.heroLoadingFeatured') : t('landing.heroAtlasWaiting')}
              </p>
              <p className="mt-3 text-sm">
                {isLoading ? t('landing.heroAtlasReading') : emptyStateMessage}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-[#173c3a]/15 bg-[#e6eadc]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:grid-cols-3 sm:px-10">
          <div className="group">
            <p className="text-4xl font-editorial">{paisesConRecetas.length}</p>
            <p className="mt-1 text-sm text-[#47615a]">{t('landing.statsCountries')}</p>
          </div>
          <div>
            <p className="text-4xl font-editorial">{totalRecipes}</p>
            <p className="mt-1 text-sm text-[#47615a]">{t('landing.statsRecipes')}</p>
          </div>
          <div>
            <p className="text-4xl font-editorial">∞</p>
            <p className="mt-1 text-sm text-[#47615a]">{t('landing.statsWays')}</p>
          </div>
        </div>
      </section>

      <section id="recetas" className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#e8754f]">
              <Utensils className="h-4 w-4" /> {t('landing.fieldNotesBadge')}
            </div>
            <h2 className="playful-underline mt-5 max-w-lg font-editorial text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              {selectedCountry
                ? t('landing.fieldNotesTitlePlural', { country: selectedCountry.nombre })
                : t('landing.fieldNotesTitleEmpty')}
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[#47615a]">
            {t('landing.fieldNotesIntro')}
            {selectedCountry ? t('landing.fieldNotesCommunity') : t('landing.fieldNotesFirstStory')}
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
              <Compass className="h-4 w-4" /> {t('landing.expeditionBadge')}
            </div>
            <h2 className="playful-underline mt-5 max-w-2xl font-editorial text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl">
              {t('landing.expeditionTitle')}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#47615a]">
              {t('landing.expeditionDesc')}
            </p>
            <Link
              href={selectedCountry ? `/mapa?pais=${selectedCountry.id}` : '/aportes'}
              className="mt-8 inline-flex"
            >
              <Button size="lg" className="gap-2 bg-[#173c3a] text-[#f5f1e8] hover:bg-[#28524e]">
                {selectedCountry
                  ? t('landing.expeditionExploreCountry', { country: selectedCountry.nombre })
                  : t('landing.expeditionContribute')}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative min-h-75 overflow-hidden bg-[#173c3a] p-8 text-[#f5f1e8] bg-[radial-gradient(circle_at_20%_20%,rgba(240,163,91,.8)_0_2px,transparent_3px),linear-gradient(135deg,transparent_49%,rgba(212,221,209,.15)_50%,transparent_51%)] bg-size-[36px_36px,100%_100%]">
            <div className="absolute left-[22%] top-[30%] h-4 w-4 rounded-full bg-[#f0a35b] shadow-[0_0_0_8px_rgba(240,163,91,.18)]" />
            <div className="absolute left-[22%] top-[30%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f0a35b]/40" />
            <div className="absolute bottom-8 left-8 max-w-55">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f0a35b]">
                {t('landing.expeditionStartingPoint')}
              </p>
              <p className="mt-2 font-editorial text-3xl">
                {selectedCountry?.nombre ?? t('landing.expeditionYourKitchen')}
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
                {t('landing.travelAtlasBadge')}
              </p>
              <h2 className="mt-3 font-editorial text-4xl sm:text-5xl text-[#173c3a]">
                {t('landing.travelAtlasTitle')}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#47615a]">
              {t('landing.travelAtlasDesc')}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-start">
            <WorldAtlasMap
              paises={paises}
              paisesConRecetas={paisesConRecetas}
              recetasPorPais={recetasPorPais}
              selectedPaisId={atlasCountry?.id ?? null}
              onSelectPais={(pais) => setSelectedAtlasCountry(pais)}
              isLoading={isLoading}
            />

            <div className="sticky top-8">
              <WorldAtlasCountryCard
                pais={atlasCountry}
                recetas={atlasCountry ? (recetasPorPais[atlasCountry.id] ?? []) : []}
                onClose={() => setSelectedAtlasCountry(null)}
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#173c3a] px-6 py-10 text-[#d4ddd1] sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-editorial text-xl text-[#f5f1e8]">BiteAtlas</p>
          <p>{t('landing.footerTagline')}</p>
          <Link
            href="/aportes"
            className="inline-flex items-center gap-2 text-[#f0a35b] hover:text-[#f5f1e8]"
          >
            {t('landing.footerShareRecipe')} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </main>
  )
}
