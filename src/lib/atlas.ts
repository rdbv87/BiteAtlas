import type { Pais, Platillo } from '@/types'

export interface EncuadreMapa {
  lat: number
  lng: number
  zoom: number
}

export const ENCUADRE_MUNDIAL: EncuadreMapa = { lat: 20, lng: 0, zoom: 3 }

const ZOOM_POR_DEFECTO = 6

// Encuadra el mapa sobre un país usando lo que Firestore conoce de él:
// primero sus coordenadas, si no el centro de las recetas que la comunidad ha ubicado.
export function getEncuadrePais(
  pais: Pais | null | undefined,
  recetas: Platillo[] = []
): EncuadreMapa {
  if (pais?.lat != null && pais?.lng != null) {
    return { lat: pais.lat, lng: pais.lng, zoom: pais.zoom ?? ZOOM_POR_DEFECTO }
  }

  const ubicadas = recetas.filter((receta) => receta.lat != null && receta.lng != null)

  if (ubicadas.length > 0) {
    const lat = ubicadas.reduce((total, receta) => total + receta.lat!, 0) / ubicadas.length
    const lng = ubicadas.reduce((total, receta) => total + receta.lng!, 0) / ubicadas.length
    return { lat, lng, zoom: ZOOM_POR_DEFECTO }
  }

  return ENCUADRE_MUNDIAL
}

export function formatCoordenadas({ lat, lng }: EncuadreMapa) {
  const latLabel = `${Math.abs(lat).toFixed(0)}° ${lat >= 0 ? 'N' : 'S'}`
  const lngLabel = `${Math.abs(lng).toFixed(0)}° ${lng >= 0 ? 'E' : 'O'}`
  return `${latLabel} · ${lngLabel}`
}

const PALABRAS_CLAVE_POR_DEFECTO = ['Cocina', 'Tradición', 'Sabor']

// Los ingredientes se capturan como texto libre en el formulario de aportes,
// así que sirven de etiquetas para la receta destacada.
export function palabrasClaveDeReceta(receta: Platillo | null | undefined): string[] {
  const ingredientes = (receta?.ingredientes ?? [])
    .map((ingrediente) => ingrediente.ingredienteId.trim())
    .filter(Boolean)
    .slice(0, 3)

  return ingredientes.length > 0 ? ingredientes : PALABRAS_CLAVE_POR_DEFECTO
}
