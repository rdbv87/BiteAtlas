import { describe, it, expect } from 'vitest'
import { honduras, regiones, ingredientes, platillos } from '../data/honduras'
import { PaisSchema, RegionSchema, IngredienteSchema, PlatilloSchema } from '@/types'

describe('Honduras Data', () => {
  describe('País', () => {
    it('has valid country data', () => {
      const result = PaisSchema.safeParse(honduras)
      expect(result.success).toBe(true)
    })

    it('has correct country code', () => {
      expect(honduras.codigoISO).toBe('HN')
    })

    it('is in America continent', () => {
      expect(honduras.continente).toBe('america')
    })
  })

  describe('Regiones', () => {
    it('has at least 2 regions', () => {
      expect(regiones.length).toBeGreaterThanOrEqual(2)
    })

    it('all regions are valid', () => {
      for (const region of regiones) {
        const result = RegionSchema.safeParse(region)
        expect(result.success).toBe(true)
      }
    })

    it('all regions belong to Honduras', () => {
      for (const region of regiones) {
        expect(region.paisId).toBe(honduras.id)
      }
    })

    it('has unique region IDs', () => {
      const ids = regiones.map((r) => r.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })
  })

  describe('Ingredientes', () => {
    it('has at least 10 ingredients', () => {
      expect(ingredientes.length).toBeGreaterThanOrEqual(10)
    })

    it('all ingredients are valid', () => {
      for (const ingrediente of ingredientes) {
        const result = IngredienteSchema.safeParse(ingrediente)
        expect(result.success).toBe(true)
      }
    })

    it('has unique ingredient IDs', () => {
      const ids = ingredientes.map((i) => i.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    it('has various categories', () => {
      const categorias = new Set(ingredientes.map((i) => i.categoria))
      expect(categorias.size).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Platillos', () => {
    it('has at least 2 dishes', () => {
      expect(platillos.length).toBeGreaterThanOrEqual(2)
    })

    it('all dishes are valid', () => {
      for (const platillo of platillos) {
        const result = PlatilloSchema.safeParse(platillo)
        expect(result.success).toBe(true)
      }
    })

    it('all dishes belong to valid regions', () => {
      const regionIds = regiones.map((r) => r.id)
      for (const platillo of platillos) {
        expect(regionIds).toContain(platillo.regionId)
      }
    })

    it('all dishes have instructions', () => {
      for (const platillo of platillos) {
        expect(platillo.instrucciones.length).toBeGreaterThanOrEqual(1)
      }
    })

    it('all dishes have ingredients', () => {
      for (const platillo of platillos) {
        expect(platillo.ingredientes.length).toBeGreaterThanOrEqual(1)
      }
    })

    it('all dishes reference valid ingredients', () => {
      const ingredienteIds = ingredientes.map((i) => i.id)
      for (const platillo of platillos) {
        for (const ing of platillo.ingredientes) {
          expect(ingredienteIds).toContain(ing.ingredienteId)
        }
      }
    })

    it('has unique dish IDs', () => {
      const ids = platillos.map((p) => p.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    it('has cultural context for all dishes', () => {
      for (const platillo of platillos) {
        expect(platillo.contextoHistorico).toBeDefined()
        expect(platillo.contextoHistorico!.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Data Integrity', () => {
    it('has consistent references between entities', () => {
      const ingredienteIds = new Set(ingredientes.map((i) => i.id))

      for (const platillo of platillos) {
        for (const ing of platillo.ingredientes) {
          expect(ingredienteIds.has(ing.ingredienteId)).toBe(true)
        }
      }
    })

    it('has all required fields for public display', () => {
      for (const platillo of platillos) {
        expect(platillo.nombre).toBeTruthy()
        expect(platillo.descripcion).toBeTruthy()
        expect(platillo.imagenes.length).toBeGreaterThan(0)
      }
    })
  })
})
