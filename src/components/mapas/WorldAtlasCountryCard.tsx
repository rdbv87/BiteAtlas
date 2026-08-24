'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Compass, Sparkles, Utensils, ChefHat, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Pais, Platillo } from '@/types'

interface WorldAtlasCountryCardProps {
  pais: Pais | null
  recetas: Platillo[]
  onClose?: () => void
}

export function WorldAtlasCountryCard({ pais, recetas, onClose }: WorldAtlasCountryCardProps) {
  if (!pais) {
    return (
      <div className="flex h-full min-h-90 flex-col items-center justify-center rounded-[2.5rem] border border-[#173c3a]/15 bg-[#faf5ed]/90 p-8 text-center backdrop-blur-md shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#173c3a]/5 text-[#e8754f]">
          <Compass className="h-8 w-8 animate-[spin_12s_linear_infinite]" />
        </div>
        <h4 className="mt-4 font-editorial text-2xl text-[#173c3a]">Explora la cartografía viva</h4>
        <p className="mt-2 max-w-sm text-sm text-[#47615a] leading-relaxed">
          Haz clic o pasa el cursor sobre los países iluminados en el mapa para descubrir sus raíces
          culinarias y platos emblemáticos.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#e8754f]">
          <span className="h-2 w-2 rounded-full bg-[#e8754f] animate-ping" />
          Países iluminados activos
        </div>
      </div>
    )
  }

  const tieneRecetas = recetas.length > 0
  const topRecetas = recetas.slice(0, 3)

  return (
    <motion.div
      key={pais.id}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#173c3a]/15 bg-white/95 p-6 sm:p-8 backdrop-blur-md shadow-xl"
    >
      {/* Glow decorativo sutil en esquina */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-linear-to-br from-[#e8754f]/15 to-[#f0a35b]/10 blur-2xl" />

      <div>
        {/* Header con Continente y Badges */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#173c3a]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8754f]">
              {pais.continente}
            </span>
            <span className="text-xs font-mono font-medium text-[#173c3a]/50">
              ISO {pais.codigoISO}
            </span>
          </div>

          {tieneRecetas ? (
            <span className="flex items-center gap-1.5 rounded-full bg-[#e8754f]/10 px-3 py-1 text-xs font-semibold text-[#e8754f]">
              <Utensils className="h-3 w-3" />
              {recetas.length} {recetas.length === 1 ? 'receta' : 'recetas'}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-[#f0a35b]/15 px-3 py-1 text-xs font-semibold text-[#b85b24]">
              <Sparkles className="h-3 w-3" />
              Por descubrir
            </span>
          )}
        </div>

        {/* Título de País */}
        <h3 className="mt-4 font-editorial text-3xl sm:text-4xl text-[#173c3a] tracking-tight">
          {pais.nombre}
        </h3>

        {/* Descripción cultural */}
        <p className="mt-3 text-sm leading-relaxed text-[#47615a] line-clamp-3">
          {pais.descripcion ||
            (tieneRecetas
              ? `Descubre la riqueza gastronómica y cultural de ${pais.nombre} a través de las tradiciones documentadas por nuestra comunidad.`
              : `Aún no hay recetas documentadas en ${pais.nombre}. Ayúdanos a mapear su herencia culinaria.`)}
        </p>

        {/* Lista de Platos destacados o Llamado a la acción */}
        {tieneRecetas ? (
          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#173c3a]/70">
              Platos emblemáticos registrados
            </p>
            <div className="grid gap-2.5 sm:grid-cols-1">
              {topRecetas.map((receta) => {
                const fotoPrincipal = receta.imagenes?.[0]
                return (
                  <Link
                    key={receta.id}
                    href={`/mapa?pais=${pais.id}&receta=${receta.id}`}
                    className="group flex items-center justify-between rounded-2xl border border-[#173c3a]/10 bg-[#faf5ed]/70 p-3 transition-all duration-200 hover:border-[#e8754f]/40 hover:bg-[#faf5ed] hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {fotoPrincipal ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-stone-200">
                          <Image
                            src={fotoPrincipal}
                            alt={receta.nombre}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-108"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173c3a]/5 text-[#e8754f]">
                          <ChefHat className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#173c3a] group-hover:text-[#e8754f]">
                          {receta.nombre}
                        </p>
                        <p className="truncate text-xs text-[#47615a]/80">
                          {receta.contextoHistorico || receta.descripcion || 'Tradición auténtica'}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#173c3a]/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#e8754f]" />
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[#e8754f]/30 bg-[#faf5ed] p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#e8754f]/10 text-[#e8754f]">
              <PlusCircle className="h-5 w-5" />
            </div>
            <p className="mt-2 text-sm font-semibold text-[#173c3a]">
              ¿Conoces la cocina de {pais.nombre}?
            </p>
            <p className="mt-1 text-xs text-[#47615a]">
              Sé la primera persona en sembrar un platillo tradicional y poner su gastronomía en el
              atlas.
            </p>
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
        {tieneRecetas ? (
          <>
            <Link
              href={`/mapa?pais=${pais.id}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#173c3a] px-5 py-3.5 text-sm font-semibold text-[#f5f1e8] shadow-md transition-all duration-200 hover:bg-[#173c3a]/90 hover:shadow-lg active:scale-[0.99]"
            >
              <Compass className="h-4 w-4" />
              Explorar país en el mapa
            </Link>
            <Link
              href={`/aportes?pais=${pais.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#173c3a]/15 bg-white px-4 py-3.5 text-sm font-semibold text-[#173c3a] transition-colors duration-200 hover:border-[#e8754f]/40 hover:text-[#e8754f]"
              title="Aportar nueva receta"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Aportar</span>
            </Link>
          </>
        ) : (
          <Link
            href={`/aportes?pais=${pais.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#e8754f] px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#d96640] hover:shadow-lg active:scale-[0.99]"
          >
            <PlusCircle className="h-4 w-4" />
            Aportar primera receta
          </Link>
        )}
      </div>
    </motion.div>
  )
}
