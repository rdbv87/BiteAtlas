'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { usePaises } from '@/services/hooks/usePaises'
import { getCoordenadasPais } from '@/data/paises-coordenadas'
import { PanelPais } from './PanelPais'
import type { Pais } from '@/types'

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
  const { paises, isLoading } = usePaises()
  const [selectedPais, setSelectedPais] = useState<Pais | null>(null)

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
    <div className="relative h-screen w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex items-start justify-between p-4 sm:p-6">
        <div className="pointer-events-auto max-w-sm border border-white/20 bg-[#173c3a]/95 p-4 text-[#f5f1e8] shadow-xl backdrop-blur-md sm:p-5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#f0a35b]">
            <span className="h-2 w-2 rounded-full bg-[#f0a35b]" /> Atlas culinario · mapa 01
          </div>
          <h1 className="mt-2 font-editorial text-2xl sm:text-3xl">El mundo empieza en la mesa.</h1>
          <p className="mt-2 text-xs leading-5 text-[#d4ddd1]">
            Selecciona un punto para entrar en sus regiones y sabores.
          </p>
        </div>
        <div className="hidden border border-[#173c3a]/15 bg-[#f5f1e8]/95 p-4 text-[#173c3a] shadow-lg backdrop-blur-md sm:block">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#47615a]">Leyenda</p>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="h-3 w-3 rounded-full bg-[#e8754f]" /> Destino con historias
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="h-3 w-3 rounded-full border-2 border-[#173c3a]" /> Región cartografiada
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
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController selectedPais={selectedPais} />
        {paises.map((pais) => {
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
      </MapContainer>

      {/* Panel lateral */}
      {selectedPais && <PanelPais pais={selectedPais} onClose={() => setSelectedPais(null)} />}

      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] border border-white/20 bg-[#173c3a]/90 px-4 py-3 text-[#f5f1e8] shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#f0a35b]">Punto de partida</p>
        <p className="mt-1 font-editorial text-xl">Honduras · 01</p>
      </div>

      {/* Overlay de estilo */}
      <style jsx global>{`
        .biteatlas-marker {
          filter: hue-rotate(15deg) saturate(1.5);
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
