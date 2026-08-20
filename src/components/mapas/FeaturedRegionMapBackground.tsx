'use client'

import dynamic from 'next/dynamic'

const FeaturedRegionMap = dynamic(
  () => import('./FeaturedRegionMap').then((m) => m.FeaturedRegionMap),
  { ssr: false }
)

export function FeaturedRegionMapBackground({
  lat,
  lng,
  zoom,
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
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 opacity-30 grayscale contrast-125">
        <FeaturedRegionMap
          lat={lat}
          lng={lng}
          zoom={zoom}
          markerLat={markerLat}
          markerLng={markerLng}
        />
      </div>
      {/* Blends the map into the hero's teal background so it stays faint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#173c3a]/70 via-[#173c3a]/55 to-[#173c3a]/85" />
    </div>
  )
}
