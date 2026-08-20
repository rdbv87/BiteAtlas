'use client'

import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export function FeaturedRegionMap({
  lat,
  lng,
  zoom = 7,
  markerLat,
  markerLng,
}: {
  lat: number
  lng: number
  zoom?: number
  markerLat?: number
  markerLng?: number
}) {
  return (
    <MapContainer
      key={`${lat}-${lng}-${zoom}`}
      center={[lat, lng]}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      {markerLat != null && markerLng != null && (
        <CircleMarker
          center={[markerLat, markerLng]}
          radius={10}
          pathOptions={{ color: '#f0a35b', fillColor: '#f0a35b', fillOpacity: 0.9, weight: 2 }}
        />
      )}
    </MapContainer>
  )
}
