'use client'

import { useState } from 'react'
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

  if (selectedPais) {
    const coords = getCoordenadasPais(selectedPais.id)
    if (coords) {
      map.flyTo([coords.lat, coords.lng], coords.zoom, { duration: 1.5 })
    }
  }

  return null
}

export function MapaMundi() {
  const { paises, isLoading, error } = usePaises()
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-destructive">Error al cargar los datos</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full">
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
