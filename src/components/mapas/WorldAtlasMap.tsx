'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  WORLD_MAP_COUNTRIES,
  LATITUDE_LINES,
  MERIDIAN_LINES,
  projectGeoToSvg,
  type CountrySvgFeature,
} from './worldMapData'
import type { Continente, Pais, Platillo } from '@/types'
import { Sparkles, Utensils, Globe2 } from 'lucide-react'

interface WorldAtlasMapProps {
  paises: Pais[]
  paisesConRecetas: Pais[]
  recetasPorPais: Record<string, Platillo[]>
  selectedPaisId: string | null
  onSelectPais: (pais: Pais | null) => void
  isLoading?: boolean
}

type ContinentFilter = 'todos' | Continente

const CONTINENT_OPTIONS: { id: ContinentFilter; label: string }[] = [
  { id: 'todos', label: 'Todo el mundo' },
  { id: 'america', label: 'América' },
  { id: 'europa', label: 'Europa' },
  { id: 'asia', label: 'Asia' },
  { id: 'africa', label: 'África' },
  { id: 'oceania', label: 'Oceanía' },
]

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function WorldAtlasMap({
  paises,
  paisesConRecetas,
  recetasPorPais,
  selectedPaisId,
  onSelectPais,
  isLoading = false,
}: WorldAtlasMapProps) {
  const [hoveredIso, setHoveredIso] = useState<string | null>(null)
  const [selectedContinent, setSelectedContinent] = useState<ContinentFilter>('todos')

  // Mapeo exhaustivo por ISO, ID y Nombre normalizado
  const paisesMap = useMemo(() => {
    const map = new Map<string, Pais>()
    paises.forEach((p) => {
      if (p.codigoISO) {
        map.set(p.codigoISO.toUpperCase(), p)
      }
      map.set(p.id.toUpperCase(), p)
      map.set(p.id.toLowerCase(), p)
      map.set(normalizeKey(p.nombre), p)
    })
    return map
  }, [paises])

  const paisesConRecetasSet = useMemo(() => {
    const set = new Set<string>()
    paisesConRecetas.forEach((p) => {
      if (p.codigoISO) set.add(p.codigoISO.toUpperCase())
      set.add(p.id.toUpperCase())
      set.add(p.id.toLowerCase())
      set.add(normalizeKey(p.nombre))
    })
    return set
  }, [paisesConRecetas])

  const findPaisForFeature = (feature: CountrySvgFeature): Pais | undefined => {
    return (
      paisesMap.get(feature.iso.toUpperCase()) ||
      (feature.iso3 ? paisesMap.get(feature.iso3.toUpperCase()) : undefined) ||
      paisesMap.get(normalizeKey(feature.name)) ||
      (feature.nameEn ? paisesMap.get(normalizeKey(feature.nameEn)) : undefined)
    )
  }

  // Filtrado de países según continente seleccionado
  const visibleCountries = useMemo(() => {
    if (selectedContinent === 'todos') return WORLD_MAP_COUNTRIES
    return WORLD_MAP_COUNTRIES.filter((c) => {
      const match = findPaisForFeature(c)
      const cont = match?.continente || c.continent
      return cont === selectedContinent
    })
  }, [selectedContinent, paisesMap])

  // Identificar el país actualmente hovereado
  const hoveredCountryData = useMemo(() => {
    if (!hoveredIso) return null
    const feature = WORLD_MAP_COUNTRIES.find((c) => c.iso === hoveredIso)
    if (!feature) return null

    const paisEntity = findPaisForFeature(feature)
    const recipes = paisEntity ? (recetasPorPais[paisEntity.id] ?? []) : []
    return {
      feature,
      pais: paisEntity,
      recipesCount: recipes.length,
    }
  }, [hoveredIso, paisesMap, recetasPorPais])

  // Determinar si una feature de mapa tiene recetas
  const getCountryStatus = (feature: CountrySvgFeature) => {
    const paisEntity = findPaisForFeature(feature)
    const isActivo =
      paisesConRecetasSet.has(feature.iso.toUpperCase()) ||
      (feature.iso3 ? paisesConRecetasSet.has(feature.iso3.toUpperCase()) : false) ||
      paisesConRecetasSet.has(normalizeKey(feature.name)) ||
      (paisEntity ? (recetasPorPais[paisEntity.id]?.length ?? 0) > 0 : false)
    const isSelected = paisEntity ? paisEntity.id === selectedPaisId : false
    const isHovered = hoveredIso === feature.iso
    const recipeCount = paisEntity ? (recetasPorPais[paisEntity.id]?.length ?? 0) : 0

    return { paisEntity, isActivo, isSelected, isHovered, recipeCount }
  }

  const handleCountryClick = (feature: CountrySvgFeature) => {
    const paisEntity = findPaisForFeature(feature)
    if (paisEntity) {
      onSelectPais(paisEntity)
    } else {
      // Fallback para territorios sin registro previo en Firestore
      onSelectPais({
        id: feature.iso.toLowerCase(),
        nombre: feature.name,
        codigoISO: feature.iso,
        continente: (feature.continent as Continente) || 'america',
      })
    }
  }

  // Lista de marcadores / beacons para los países con recetas
  const beacons = useMemo(() => {
    return WORLD_MAP_COUNTRIES.map((feature) => {
      const paisEntity = findPaisForFeature(feature)
      const hasRecipes =
        paisesConRecetasSet.has(feature.iso.toUpperCase()) ||
        (feature.iso3 ? paisesConRecetasSet.has(feature.iso3.toUpperCase()) : false) ||
        paisesConRecetasSet.has(normalizeKey(feature.name)) ||
        (paisEntity ? (recetasPorPais[paisEntity.id]?.length ?? 0) > 0 : false)

      if (!hasRecipes) return null

      let centerCoords = feature.center
      if (paisEntity?.lat != null && paisEntity?.lng != null) {
        centerCoords = projectGeoToSvg(paisEntity.lng, paisEntity.lat)
      }

      const recipeCount = paisEntity ? (recetasPorPais[paisEntity.id]?.length ?? 0) : 0
      const isSelected = paisEntity?.id === selectedPaisId

      return {
        feature,
        paisEntity,
        center: centerCoords,
        recipeCount,
        isSelected,
      }
    }).filter(Boolean) as {
      feature: CountrySvgFeature
      paisEntity: Pais | undefined
      center: [number, number]
      recipeCount: number
      isSelected: boolean
    }[]
  }, [paisesMap, paisesConRecetasSet, recetasPorPais, selectedPaisId])

  return (
    <div className="relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#173c3a]/15 bg-linear-to-b from-[#1b4341] via-[#173c3a] to-[#122e2c] p-4 sm:p-7 text-[#f5f1e8] shadow-2xl">
      {/* Barra de Filtros por Continente y Estadísticas */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#f5f1e8]/10 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-2 hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d4ddd1]/70 md:inline-flex">
            <Globe2 className="h-3.5 w-3.5 text-[#f0a35b]" />
            Filtrar:
          </span>
          {CONTINENT_OPTIONS.map((opt) => {
            const isActive = selectedContinent === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedContinent(opt.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#e8754f] text-white shadow-xs font-semibold'
                    : 'bg-[#f5f1e8]/5 text-[#d4ddd1] hover:bg-[#f5f1e8]/15 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Indicadores de Leyenda */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f0a35b] shadow-[0_0_8px_#f0a35b]" />
            <span className="text-[#d4ddd1]">Con recetas ({paisesConRecetas.length})</span>
          </div>
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-[#204743] border border-[#f5f1e8]/20" />
            <span className="text-[#d4ddd1]/60">Territorios explorables</span>
          </div>
        </div>
      </div>

      {/* Contenedor del Mapa SVG Planisferio */}
      <div className="relative aspect-2/1 w-full overflow-hidden rounded-2xl bg-[#13302e]/80 select-none border border-[#f5f1e8]/5">
        {/* Rosa de los vientos / Cartografía de fondo */}
        <div className="pointer-events-none absolute right-4 top-4 hidden opacity-20 lg:block">
          <svg width="75" height="75" viewBox="0 0 100 100" fill="none" stroke="#f5f1e8">
            <circle cx="50" cy="50" r="45" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="35" strokeWidth="0.75" />
            <path d="M50 5 L50 95 M5 50 L95 50" strokeWidth="0.75" />
            <path
              d="M50 15 L53 45 L85 50 L53 55 L50 85 L47 55 L15 50 L47 45 Z"
              fill="#f0a35b"
              fillOpacity="0.4"
            />
          </svg>
        </div>

        <svg
          viewBox="0 0 1000 500"
          className="h-full w-full object-contain"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Mapa planisferio interactivo de BiteAtlas"
        >
          <defs>
            {/* Gradiente para países con recetas */}
            <linearGradient id="activeCountryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0a35b" />
              <stop offset="100%" stopColor="#e8754f" />
            </linearGradient>

            {/* Gradiente para país seleccionado */}
            <linearGradient id="selectedCountryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb36b" />
              <stop offset="100%" stopColor="#f75d31" />
            </linearGradient>

            {/* Filtro de Glow para países y beacons */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Cuadrícula náutica: Meridianos */}
          {MERIDIAN_LINES.map((x) => (
            <line
              key={`meridian-${x}`}
              x1={x}
              y1={20}
              x2={x}
              y2={480}
              stroke="#f5f1e8"
              strokeOpacity="0.05"
              strokeDasharray="3 3"
              strokeWidth="0.75"
            />
          ))}

          {/* Cuadrícula náutica: Paralelos y Ecuador */}
          {LATITUDE_LINES.map((line) => (
            <g key={`lat-${line.y}`}>
              <line
                x1={20}
                y1={line.y}
                x2={980}
                y2={line.y}
                stroke={line.y === 250 ? '#f0a35b' : '#f5f1e8'}
                strokeOpacity={line.y === 250 ? '0.18' : '0.06'}
                strokeDasharray={line.y === 250 ? undefined : '2 4'}
                strokeWidth={line.y === 250 ? '1' : '0.75'}
              />
              <text
                x={25}
                y={line.y - 4}
                fill="#f5f1e8"
                fillOpacity="0.25"
                fontSize="6.5"
                fontFamily="monospace"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* Renderizado de Polígonos de Países con límites geográficos reales */}
          {visibleCountries.map((feature, idx) => {
            const { isActivo, isSelected, isHovered } = getCountryStatus(feature)

            return (
              <path
                key={`country-${feature.iso}-${feature.name}-${idx}`}
                d={feature.path}
                fill={
                  isSelected
                    ? 'url(#selectedCountryGrad)'
                    : isActivo
                      ? isHovered
                        ? '#ff9f43'
                        : 'url(#activeCountryGrad)'
                      : isHovered
                        ? '#2d5e59'
                        : '#1b3e3a'
                }
                stroke={
                  isSelected ? '#ffffff' : isActivo ? '#fce1b4' : isHovered ? '#5ea89e' : '#15312e'
                }
                strokeWidth={isSelected ? 1.8 : isActivo ? 1.1 : 0.5}
                filter={isSelected || (isActivo && isHovered) ? 'url(#glow)' : undefined}
                className="cursor-pointer transition-colors duration-150"
                onMouseEnter={() => setHoveredIso(feature.iso)}
                onMouseLeave={() => setHoveredIso(null)}
                onClick={() => handleCountryClick(feature)}
              />
            )
          })}

          {/* Renderizado de Beacons / Puntos calientes pulsantes en países con recetas */}
          {beacons.map((beacon, idx) => {
            const [cx, cy] = beacon.center
            const isHovered = hoveredIso === beacon.feature.iso

            return (
              <g
                key={`beacon-${beacon.feature.iso}-${idx}`}
                transform={`translate(${cx}, ${cy})`}
                className="pointer-events-none"
              >
                {/* Anillo de pulso animado */}
                <circle
                  r={beacon.isSelected || isHovered ? 12 : 7.5}
                  fill="none"
                  stroke="#f0a35b"
                  strokeWidth="1"
                  opacity="0.65"
                  className="animate-ping origin-center"
                />

                {/* Círculo central brillante */}
                <circle
                  r={beacon.isSelected ? 5 : 3.5}
                  fill="#ffffff"
                  stroke="#e8754f"
                  strokeWidth="1.2"
                  filter="url(#glow)"
                />

                {/* Badge con el conteo de recetas */}
                <g transform="translate(0, -8)">
                  <rect
                    x="-7"
                    y="-6"
                    width="14"
                    height="9"
                    rx="4.5"
                    fill="#173c3a"
                    stroke="#f0a35b"
                    strokeWidth="0.75"
                  />
                  <text
                    x="0"
                    y="0.5"
                    textAnchor="middle"
                    fill="#f5f1e8"
                    fontSize="6"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {beacon.recipeCount}
                  </text>
                </g>
              </g>
            )
          })}
        </svg>

        {/* Tooltip interactivo flotante al hacer hover */}
        <AnimatePresence>
          {hoveredCountryData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute bottom-4 left-4 z-20 flex items-center gap-2.5 rounded-xl border border-[#f5f1e8]/20 bg-[#173c3a]/90 px-3.5 py-2 text-xs backdrop-blur-md shadow-lg"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-[#f5f1e8]">
                  {hoveredCountryData.pais?.nombre || hoveredCountryData.feature?.name}
                </span>
                <span className="text-[11px] text-[#d4ddd1]/80">
                  {hoveredCountryData.recipesCount > 0 ? (
                    <span className="text-[#f0a35b] font-medium flex items-center gap-1">
                      <Utensils className="h-2.5 w-2.5" />
                      {hoveredCountryData.recipesCount}{' '}
                      {hoveredCountryData.recipesCount === 1 ? 'receta viva' : 'recetas vivas'}
                    </span>
                  ) : (
                    <span className="text-[#d4ddd1]/60 flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> Territorio por sembrar
                    </span>
                  )}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selector rápido en chips de países activos con recetas */}
      <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#f5f1e8]/10">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d4ddd1]/60 mr-1">
          Acceso rápido:
        </span>
        {paisesConRecetas.map((pais) => {
          const isSelected = pais.id === selectedPaisId
          const count = recetasPorPais[pais.id]?.length ?? 0
          return (
            <button
              key={pais.id}
              type="button"
              onClick={() => onSelectPais(pais)}
              className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all duration-200 ${
                isSelected
                  ? 'bg-[#e8754f] text-white shadow-md font-semibold scale-105'
                  : 'bg-[#f5f1e8]/10 text-[#f5f1e8] hover:bg-[#f5f1e8]/20'
              }`}
            >
              <span>{pais.nombre}</span>
              <span
                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  isSelected ? 'bg-white text-[#e8754f]' : 'bg-[#e8754f] text-white'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
