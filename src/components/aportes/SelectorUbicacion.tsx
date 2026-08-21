'use client'

import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface SelectorUbicacionProps {
  center: [number, number]
  value?: { lat: number; lng: number }
  onChange: (location: { lat: number; lng: number }) => void
}

function LocationClickHandler({ onChange }: Pick<SelectorUbicacionProps, 'onChange'>) {
  useMapEvents({
    click: (event) => {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng })
    },
  })

  return null
}

export function SelectorUbicacion({ center, value, onChange }: SelectorUbicacionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#173c3a]/15 bg-[#dce5dd]">
      <MapContainer
        key={`${center[0]}-${center[1]}`}
        center={value ? [value.lat, value.lng] : center}
        zoom={value ? 11 : 7}
        minZoom={3}
        maxZoom={16}
        scrollWheelZoom
        className="h-64 w-full"
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
        />
        <LocationClickHandler onChange={onChange} />
        {value ? (
          <CircleMarker
            center={[value.lat, value.lng]}
            radius={9}
            pathOptions={{
              className: 'recipe-location-marker',
              color: '#173c3a',
              fillColor: '#f0a35b',
              fillOpacity: 1,
              weight: 3,
            }}
          />
        ) : null}
      </MapContainer>
      <style jsx global>{`
        .recipe-location-marker {
          animation: recipe-location-pulse 1.8s ease-in-out infinite;
        }

        @keyframes recipe-location-pulse {
          0%,
          100% {
            opacity: 0.7;
            filter: drop-shadow(0 0 0 rgba(240, 163, 91, 0));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 9px rgba(240, 163, 91, 0.95));
          }
        }
      `}</style>
    </div>
  )
}
