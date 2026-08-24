'use client'

import { useEffect, useMemo, useState } from 'react'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLandingData } from '@/services/hooks/useLandingData'
import { ENCUADRE_MUNDIAL, getEncuadrePais } from '@/lib/atlas'
import { PanelPais } from './PanelPais'
import { FichaCultural } from '@/components/fichas/FichaCultural'
import { UserNav } from '@/components/ui/UserNav'
import type { Pais, Platillo, UsuarioPerfil } from '@/types'

// MapaMundi: Mapa interactivo con todos los platillos y paises
// Muestra: Paises con markers de platillos, panel de detalles por pais, fichas de recetas individuales
// Usa Leaflet para cartografia y permite click en markers para ver detalles
// Fix for default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function createContributorMarkerIcon(photoUrl?: string, nombre?: string) {
  const avatarHtml = photoUrl
    ? `<img src="${photoUrl}" alt="${nombre || 'Aportante'}" class="w-full h-full object-cover rounded-full" />`
    : `<div class="w-full h-full rounded-full bg-[#e8754f] text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner">${(nombre || 'A').charAt(0)}</div>`

  return L.divIcon({
    className: 'contributor-avatar-marker',
    html: `
      <div class="relative group cursor-pointer flex flex-col items-center">
        <div class="w-9 h-9 rounded-full p-0.5 bg-linear-to-tr from-[#173c3a] via-[#e8754f] to-[#f0a35b] shadow-[0_4px_12px_rgba(23,60,58,0.35)] transition-all duration-200 group-hover:scale-115 group-hover:shadow-[0_6px_16px_rgba(232,117,79,0.5)]">
          <div class="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center border border-white/80">
            ${avatarHtml}
          </div>
        </div>
        <div class="w-2.5 h-2.5 bg-[#e8754f] rotate-45 -mt-1 rounded-[1px] shadow-xs"></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 40],
    popupAnchor: [0, -38],
  })
}

const spiceIcon = new L.DivIcon({
  className: 'biteatlas-marker',
  html: `
    <svg width="22" height="30" viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M11 0C5.08 0 0 5.08 0 11.06C0 17.53 11 30 11 30C11 30 22 17.53 22 11.06C22 5.08 16.92 0 11 0Z" fill="#2f6f4f"/>
      <circle cx="11" cy="11" r="4.8" fill="#f5f1e8"/>
    </svg>
  `,
  iconSize: [22, 30],
  iconAnchor: [11, 29],
  popupAnchor: [0, -24],
})

const MAP_TILE_STYLES = {
  light: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png',

  voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
} as const

const MAP_STYLE_LABELS: Record<keyof typeof MAP_TILE_STYLES, string> = {
  light: 'Light',
  voyager: 'Voyager',
  dark: 'Dark',
}

function MapController({
  selectedPais,
  recetas,
}: {
  selectedPais: Pais | null
  recetas: Platillo[]
}) {
  const map = useMap()

  useEffect(() => {
    if (!selectedPais) return

    const { lat, lng, zoom } = getEncuadrePais(selectedPais, recetas)
    map.flyTo([lat, lng], zoom, { duration: 1.5 })
  }, [map, selectedPais, recetas])

  return null
}

export function MapaMundi() {
  const { paisesConRecetas, recetasPorPais, regionesPorPais, isLoading, error } = useLandingData()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedPais, setSelectedPais] = useState<Pais | null>(null)
  const [selectedPlatillo, setSelectedPlatillo] = useState<Platillo | null>(null)
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_TILE_STYLES>('light')
  const [perfilesPorId, setPerfilesPorId] = useState<Record<string, UsuarioPerfil>>({})

  useEffect(() => {
    if (!firestore) return
    const db = firestore
    const contribuidorIds = Array.from(
      new Set(
        Object.values(recetasPorPais)
          .flat()
          .map((r) => r.contribuidorId)
          .filter((id): id is string => Boolean(id))
      )
    )

    if (contribuidorIds.length === 0) return

    let cancelled = false
    Promise.all(
      contribuidorIds.map(async (uid) => {
        try {
          const snap = await getDoc(doc(db, 'usuarios', uid))
          if (snap.exists()) {
            return { uid, data: snap.data() as UsuarioPerfil }
          }
        } catch {
          // ignore
        }
        return null
      })
    ).then((results) => {
      if (cancelled) return
      const map: Record<string, UsuarioPerfil> = {}
      results.forEach((res) => {
        if (res) map[res.uid] = res.data
      })
      setPerfilesPorId(map)
    })

    return () => {
      cancelled = true
    }
  }, [recetasPorPais])

  const totalRecetas = useMemo(
    () => Object.values(recetasPorPais).reduce((total, recetas) => total + recetas.length, 0),
    [recetasPorPais]
  )

  const totalRegiones = useMemo(
    () =>
      new Set(
        Object.values(recetasPorPais)
          .flat()
          .map((recipe) => recipe.regionId)
      ).size,
    [recetasPorPais]
  )

  const paisIdFromUrl = searchParams?.get('pais')
  const paisDesdeUrl = paisesConRecetas.find((pais) => pais.id === paisIdFromUrl) ?? null
  const paisActual = selectedPais ?? paisDesdeUrl ?? null
  const recetasDelPaisActual = paisActual ? (recetasPorPais[paisActual.id] ?? []) : []
  const isGlobalView = !selectedPais && !paisDesdeUrl

  const regionesConRecetas = useMemo(() => {
    const locations = new Map<
      string,
      { id: string; name: string; dish: string; recipe: Platillo; lat: number; lng: number }
    >()

    Object.values(recetasPorPais)
      .flat()
      .forEach((recipe) => {
        const region = regionesPorPais[recipe.paisId]?.find(
          (candidate) => candidate.id === recipe.regionId
        )
        const lat = recipe.lat ?? region?.lat
        const lng = recipe.lng ?? region?.lng
        const locationId = recipe.lat != null && recipe.lng != null ? recipe.id : region?.id

        if (lat == null || lng == null || !locationId || locations.has(locationId)) return

        locations.set(locationId, {
          id: locationId,
          name: region?.nombre ?? 'Ubicación del platillo',
          dish: recipe.nombre,
          recipe,
          lat,
          lng,
        })
      })

    return Array.from(locations.values())
  }, [recetasPorPais, regionesPorPais])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Cargando mapa del mundo...</p>
        </div>
      </div>
    )
  }

  if (error || paisesConRecetas.length === 0) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-[#173c3a] px-6 text-[#f5f1e8]"
        role="region"
        aria-label="Mapa culinario interactivo"
      >
        <div className="max-w-md border border-[#f0a35b]/45 bg-[#1f534f] p-8 text-center shadow-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-[#f0a35b]">Atlas culinario</p>
          <h1 className="font-editorial mt-3 text-4xl leading-tight">
            {error ? 'No pudimos abrir el atlas.' : 'El mapa todavía está en blanco.'}
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#d4ddd1]">
            {error
              ? 'Vuelve a intentarlo en unos minutos.'
              : 'Un país aparece en el mapa cuando alguien publica una receta suya. Aporta la tuya y colócala aquí.'}
          </p>
          <Link
            href={error ? '/' : '/aportes'}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e8754f] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d96340]"
          >
            {error ? (
              <>
                <ArrowLeft className="h-4 w-4" /> Volver al inicio
              </>
            ) : (
              'Aportar una receta'
            )}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full" role="region" aria-label="Mapa culinario interactivo">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-500 flex items-start justify-between p-4 sm:p-6">
        <div className="pointer-events-auto max-w-sm border border-[#f0a35b]/55 bg-[#173c3a]/95 p-4 text-[#f5f1e8] shadow-[0_18px_32px_rgba(8,36,31,0.28)] backdrop-blur-sm sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#f0a35b]">
              <span className="h-2 w-2 rounded-full bg-[#f0a35b]" /> Atlas culinario · mapa 01
            </div>
            <Link
              href="/"
              aria-label="Volver a la landing"
              className="inline-flex shrink-0 items-center gap-1 text-xs text-[#d4ddd1] transition-colors hover:text-[#f0a35b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0a35b]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Inicio
            </Link>
          </div>
          <h1 className="mt-2 font-editorial text-2xl sm:text-3xl">
            {paisActual ? `Explorando ${paisActual.nombre}` : 'El mundo empieza en la mesa.'}
          </h1>
          <p className="mt-2 text-xs leading-5 text-[#d4ddd1]">
            {paisActual
              ? `${recetasDelPaisActual.length} recetas y ${totalRegiones} regiones activas en este recorrido.`
              : 'Selecciona un punto para entrar en sus regiones y sabores.'}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#f0a35b]/40 bg-[#f0a35b]/10 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#f0a35b]">
              {paisActual ? paisActual.nombre : 'Mundo'}
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#d4ddd1]">
              {totalRecetas} recetas
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#d4ddd1]">
              {totalRegiones} regiones
            </span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-[#173c3a]/10 bg-[#f5f1e8]/90 p-1.5 shadow-lg backdrop-blur-md">
            {(Object.keys(MAP_TILE_STYLES) as Array<keyof typeof MAP_TILE_STYLES>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMapStyle(key)}
                aria-pressed={mapStyle === key}
                className={`rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  mapStyle === key
                    ? 'bg-[#173c3a] text-[#f5f1e8]'
                    : 'text-[#173c3a] hover:bg-[#173c3a]/5'
                }`}
              >
                {MAP_STYLE_LABELS[key]}
              </button>
            ))}
          </div>

          <UserNav />
        </div>
      </div>

      {/* Mapa */}
      <MapContainer
        center={[ENCUADRE_MUNDIAL.lat, ENCUADRE_MUNDIAL.lng]}
        zoom={ENCUADRE_MUNDIAL.zoom}
        minZoom={2}
        maxZoom={12}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={MAP_TILE_STYLES[mapStyle]}
        />
        <MapController selectedPais={paisActual} recetas={recetasDelPaisActual} />
        {paisesConRecetas.map((pais) => {
          const coords = getEncuadrePais(pais, recetasPorPais[pais.id] ?? [])

          return (
            <Marker
              key={pais.id}
              position={[coords.lat, coords.lng]}
              icon={spiceIcon}
              eventHandlers={{
                click: () => setSelectedPais(pais),
              }}
            >
              <Popup>
                <div className="text-center p-1">
                  <h3 className="font-semibold text-base">{pais.nombre}</h3>
                  <p className="text-xs text-gray-600 mt-1">{pais.descripcion}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {recetasPorPais[pais.id]?.length ?? 0} recetas publicadas
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}
        {regionesConRecetas.map((region) => {
          const perfilAportante = region.recipe.contribuidorId
            ? perfilesPorId[region.recipe.contribuidorId]
            : undefined

          return (
            <Marker
              key={region.id}
              position={[region.lat, region.lng]}
              icon={createContributorMarkerIcon(
                perfilAportante?.photoURL,
                perfilAportante?.displayName
              )}
              eventHandlers={{
                click: () => {
                  setSelectedPlatillo(region.recipe)
                },
              }}
            >
              <Popup>
                <div className="min-w-44 p-1.5 space-y-2.5">
                  {/* Cabecera del Aportante */}
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#e8754f]/15 border border-[#e8754f]/30 flex items-center justify-center shrink-0">
                      {perfilAportante?.photoURL ? (
                        <img
                          src={perfilAportante.photoURL}
                          alt={perfilAportante.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-[#e8754f] uppercase">
                          {(
                            perfilAportante?.displayName ||
                            region.recipe.contribuidorId ||
                            'A'
                          ).charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                        Aporte de
                      </p>
                      <p className="text-xs font-bold text-gray-900 leading-tight">
                        {perfilAportante?.displayName || 'Cocinero de la comunidad'}
                      </p>
                      {perfilAportante?.rol && (
                        <span className="text-[9px] font-semibold text-[#173c3a] uppercase tracking-wider">
                          {perfilAportante.rol}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Detalle del platillo y región */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 leading-snug">{region.dish}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{region.name}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPlatillo(region.recipe)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#173c3a] text-white text-xs font-semibold text-center hover:bg-[#234c49] transition-colors cursor-pointer"
                  >
                    Ver Ficha Cultural
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Panel lateral */}
      {paisActual && !isGlobalView && (
        <PanelPais
          pais={paisActual}
          recetas={recetasPorPais[paisActual.id] ?? []}
          onClose={() => {
            setSelectedPais(null)
            router.replace('/mapa')
          }}
          onSelectRecipe={setSelectedPlatillo}
        />
      )}

      {selectedPlatillo && (
        <FichaCultural
          platillo={selectedPlatillo}
          isOpen={true}
          onClose={() => setSelectedPlatillo(null)}
        />
      )}

      <div className="pointer-events-none absolute bottom-4 left-4 z-500 border border-[#f0a35b]/40 bg-[#173c3a]/95 px-4 py-3 text-[#f5f1e8] shadow-[0_18px_28px_rgba(8,36,31,0.32)] backdrop-blur-sm sm:bottom-6 sm:left-6">
        <div className="mb-2 h-1.5 w-12 rounded-full bg-[#f0a35b]" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#f0a35b]">
          {isGlobalView ? 'Vista general' : 'Pais activo'}
        </p>
        <p className="mt-1 font-editorial text-xl">
          {isGlobalView ? 'Mundo' : `${paisActual?.nombre} · ${recetasDelPaisActual.length}`}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#d4ddd1]">
          {isGlobalView
            ? `${paisesConRecetas.length} países con recetas`
            : recetasDelPaisActual.length > 0
              ? `${recetasDelPaisActual.length} recetas activas`
              : 'Explora recetas'}
        </p>
      </div>

      {/* Overlay de estilo */}
      <style jsx global>{`
        .biteatlas-marker {
          background: transparent;
          border: none;
          filter: drop-shadow(0 4px 8px rgba(24, 60, 50, 0.18));
        }
        .contributor-avatar-marker {
          background: transparent;
          border: none;
        }
        .biteatlas-marker svg {
          display: block;
          width: 22px;
          height: 30px;
        }
        .recipe-region-marker {
          animation: region-pulse 2.4s ease-in-out infinite;
          cursor: pointer;
          transform-origin: center;
        }
        @keyframes region-pulse {
          0%,
          100% {
            opacity: 0.78;
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 7px rgba(240, 163, 91, 0.85));
          }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 0.75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-content {
          margin: 12px 16px;
          font-family: var(--font-inter), system-ui, sans-serif;
        }
      `}</style>
    </div>
  )
}
