'use client'

import dynamic from 'next/dynamic'

const MapaMundi = dynamic(() => import('./MapaMundi').then((module) => module.MapaMundi), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Cargando mapa del mundo...</p>
    </div>
  ),
})

export function MapaMundiLoader() {
  return <MapaMundi />
}
