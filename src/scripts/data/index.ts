import { paisesMundo, regionesPorPaisMundo } from './paises-mundo'
import type { Pais, Platillo, Region } from '@/types'

export const paises: Pais[] = paisesMundo
export const localPaises = paises

export const regionesPorPais: Record<string, Region[]> = regionesPorPaisMundo

export const recetasPorPais: Record<string, Platillo[]> = {}
