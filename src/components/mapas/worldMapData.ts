/**
 * worldMapData.ts
 * Geometrías SVG vectoriales reales del mapa mundial (Natural Earth), datos de continentes,
 * centros geográficos y funciones de proyección para el planisferio de BiteAtlas.
 */

import worldGeoData from './worldGeoData.json'

export interface CountrySvgFeature {
  iso: string
  iso3?: string
  name: string
  nameEn?: string
  continent: string
  path: string
  center: [number, number] // [x, y] in SVG viewBox coordinates (0 0 1000 500)
}

// Proyección equirectangular estándar SVG (viewBox: 0 0 1000 500)
export function projectGeoToSvg(lng: number, lat: number): [number, number] {
  const clampedLng = Math.max(-180, Math.min(180, lng))
  const clampedLat = Math.max(-85, Math.min(85, lat))

  const x = ((clampedLng + 180) / 360) * 1000
  const y = ((90 - clampedLat) / 180) * 500
  return [Number(x.toFixed(1)), Number(y.toFixed(1))]
}

export const WORLD_MAP_COUNTRIES: CountrySvgFeature[] = worldGeoData as CountrySvgFeature[]

// Cuadrícula náutica / cartográfica decorativa
export const LATITUDE_LINES = [
  { y: 65, label: '66.5° N · Círculo Polar Ártico' },
  { y: 185, label: '23.5° N · Trópico de Cáncer' },
  { y: 250, label: '0° · Ecuador Culinario' },
  { y: 315, label: '23.5° S · Trópico de Capricornio' },
  { y: 435, label: '66.5° S · Círculo Polar Antártico' },
]

export const MERIDIAN_LINES = [100, 250, 400, 500, 650, 800, 950]
