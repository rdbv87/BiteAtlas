'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLandingData } from '@/services/hooks/useLandingData'
import { getCoordenadasPais } from '@/data/paises-coordenadas'
import { PanelPais } from './PanelPais'
import { FichaCultural } from '@/components/fichas/FichaCultural'
import type { Pais, Platillo } from '@/types'

// Fix for default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const spiceIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'biteatlas-marker',
})

function MapController({ selectedPais }: { selectedPais: Pais | null }) {
  const map = useMap()

  useEffect(() => {
    if (!selectedPais) return

    const coords = getCoordenadasPais(selectedPais.id)
    if (coords) {
      map.flyTo([coords.lat, coords.lng], coords.zoom, { duration: 1.5 })
    }
  }, [map, selectedPais])

  return null
}

export function MapaMundi() {
  const { paises, recetasPorPais, regionesPorPais, isLoading } = useLandingData()
  const [selectedPais, setSelectedPais] = useState<Pais | null>(null)
  const [selectedPlatillo, setSelectedPlatillo] = useState<Platillo | null>(null)

  const paisesConRecetas = useMemo(
    () => paises.filter((pais) => (recetasPorPais[pais.id]?.length ?? 0) > 0),
    [paises, recetasPorPais]
  )

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

  return (
    <div className="relative h-screen w-full" role="region" aria-label="Mapa culinario interactivo">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex items-start justify-between p-4 sm:p-6">
        <div className="pointer-events-auto max-w-sm border border-white/20 bg-[#173c3a]/95 p-4 text-[#f5f1e8] shadow-xl backdrop-blur-md sm:p-5">
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
          <h1 className="mt-2 font-editorial text-2xl sm:text-3xl">El mundo empieza en la mesa.</h1>
          <p className="mt-2 text-xs leading-5 text-[#d4ddd1]">
            Selecciona un punto para entrar en sus regiones y sabores.
          </p>
        </div>
        <div className="hidden border border-[#173c3a]/15 bg-[#f5f1e8]/95 p-4 text-[#173c3a] shadow-lg backdrop-blur-md sm:block">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#47615a]">Cómo jugar</p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="h-3 w-3 animate-pulse rounded-full bg-[#e8754f]" /> País con historias
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="h-3 w-3 rounded-full border-2 border-[#173c3a] bg-[#f0a35b]" /> Toca
            una región para abrir su receta
          </div>
        </div>
      </div>

      {/* Mapa */}
      <MapContainer
        center={[20, -60]}
        zoom={3}
        minZoom={2}
        maxZoom={12}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapController selectedPais={selectedPais} />
        {paisesConRecetas.map((pais) => {
          const coords = getCoordenadasPais(pais.id)
          if (!coords) return null

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
                </div>
              </Popup>
            </Marker>
          )
        })}
        {regionesConRecetas.map((region) => (
          <CircleMarker
            key={region.id}
            center={[region.lat, region.lng]}
            radius={8}
            eventHandlers={{
              click: () => {
                setSelectedPlatillo(region.recipe)
              },
            }}
            pathOptions={{
              className: 'recipe-region-marker',
              color: '#173c3a',
              fillColor: '#f0a35b',
              fillOpacity: 0.95,
              weight: 3,
            }}
          >
            <Popup>
              <div className="min-w-32 p-1">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#e8754f]">Región</p>
                <h3 className="mt-1 font-semibold text-base">{region.name}</h3>
                <p className="mt-1 text-xs text-gray-600">Plato asociado: {region.dish}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Panel lateral */}
      {selectedPais && (
        <PanelPais
          pais={selectedPais}
          recetas={recetasPorPais[selectedPais.id] ?? []}
          onClose={() => setSelectedPais(null)}
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

      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] border border-white/20 bg-[#173c3a]/90 px-4 py-3 text-[#f5f1e8] shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#f0a35b]">Punto de partida</p>
        <p className="mt-1 font-editorial text-xl">Honduras · 01</p>
      </div>

      {/* Overlay de estilo */}
      <style jsx global>{`
        .biteatlas-marker {
          filter: hue-rotate(15deg) saturate(1.5);
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
