import { describe, expect, it } from 'vitest'
import { paisesMundo, regionesPorPaisMundo } from '../data/paises-mundo'
import { PaisSchema, RegionSchema } from '@/types'

describe('Catálogo geográfico del atlas', () => {
  it('valida todos los países contra el esquema', () => {
    for (const pais of paisesMundo) {
      expect(PaisSchema.safeParse(pais).success).toBe(true)
    }
  })

  it('no repite identificadores ni códigos ISO', () => {
    expect(new Set(paisesMundo.map((pais) => pais.id)).size).toBe(paisesMundo.length)
    expect(new Set(paisesMundo.map((pais) => pais.codigoISO)).size).toBe(paisesMundo.length)
  })

  it('da a cada país un encuadre de mapa para que el atlas sea global', () => {
    for (const pais of paisesMundo) {
      expect(pais.lat).toBeTypeOf('number')
      expect(pais.lng).toBeTypeOf('number')
      expect(pais.zoom).toBeTypeOf('number')
    }
  })

  it('asigna regiones válidas a cada país', () => {
    for (const pais of paisesMundo) {
      const regiones = regionesPorPaisMundo[pais.id] ?? []

      expect(regiones.length).toBeGreaterThan(0)

      for (const region of regiones) {
        expect(region.paisId).toBe(pais.id)
        expect(RegionSchema.safeParse(region).success).toBe(true)
      }
    }
  })

  it('no incluye recetas ni ingredientes sembrados', () => {
    for (const pais of paisesMundo) {
      expect(pais).not.toHaveProperty('platillos')
      expect(pais).not.toHaveProperty('ingredientes')
    }
  })
})
