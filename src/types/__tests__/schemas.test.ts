import { describe, it, expect } from 'vitest'
import {
  PaisSchema,
  RegionSchema,
  PlatilloSchema,
  IngredienteSchema,
  IngredientePlatilloSchema,
  ContinenteSchema,
  DificultadSchema,
  CategoriaIngredienteSchema,
  EstadoPlatilloSchema,
} from '../schemas'
import { ValidationError } from '../../errors/validation-error'

// ── Fixtures ─────────────────────────────────────────────────────────────────

const validPais = {
  id: 'honduras-001',
  nombre: 'Honduras',
  codigoISO: 'HN',
  continente: 'america' as const,
  descripcion: 'País centroamericano',
}

const validRegion = {
  id: 'region-copan-001',
  paisId: 'honduras-001',
  nombre: 'Copán',
  descripcion: 'Región occidental',
}

const validIngrediente = {
  id: 'ing-frijoles-001',
  nombre: 'Frijoles',
  categoria: 'grano' as const,
}

const validIngredientePlatillo = {
  ingredienteId: 'ing-frijoles-001',
  cantidad: '1/2',
  unidad: 'taza',
}

const validPlatillo = {
  id: 'platillo-baleada-001',
  regionId: 'region-copan-001',
  nombre: 'Baleada',
  descripcion: 'Platillo típico hondureño',
  instrucciones: ['Calentar la tortilla', 'Agregar frijoles'],
  ingredientes: [validIngredientePlatillo],
  dificultad: 'facil' as const,
  imagenes: ['https://example.com/image.jpg'],
  estado: 'pendiente' as const,
  createdAt: new Date('2024-01-01'),
}

// ── Enums ────────────────────────────────────────────────────────────────────

describe('ContinenteSchema', () => {
  it('acepta continentes válidos', () => {
    expect(ContinenteSchema.parse('america')).toBe('america')
    expect(ContinenteSchema.parse('europa')).toBe('europa')
    expect(ContinenteSchema.parse('asia')).toBe('asia')
    expect(ContinenteSchema.parse('africa')).toBe('africa')
    expect(ContinenteSchema.parse('oceania')).toBe('oceania')
  })

  it('rechaza continente inválido', () => {
    expect(() => ContinenteSchema.parse('antartida')).toThrow()
  })
})

describe('DificultadSchema', () => {
  it('acepta dificultades válidas', () => {
    expect(DificultadSchema.parse('facil')).toBe('facil')
    expect(DificultadSchema.parse('medio')).toBe('medio')
    expect(DificultadSchema.parse('dificil')).toBe('dificil')
  })

  it('rechaza dificultad inválida', () => {
    expect(() => DificultadSchema.parse('imposible')).toThrow()
  })
})

describe('CategoriaIngredienteSchema', () => {
  it('acepta categorías válidas', () => {
    expect(CategoriaIngredienteSchema.parse('proteina')).toBe('proteina')
    expect(CategoriaIngredienteSchema.parse('vegetal')).toBe('vegetal')
    expect(CategoriaIngredienteSchema.parse('grano')).toBe('grano')
    expect(CategoriaIngredienteSchema.parse('especia')).toBe('especia')
  })

  it('rechaza categoría inválida', () => {
    expect(() => CategoriaIngredienteSchema.parse('carne')).toThrow()
  })
})

describe('EstadoPlatilloSchema', () => {
  it('acepta estados válidos', () => {
    expect(EstadoPlatilloSchema.parse('pendiente')).toBe('pendiente')
    expect(EstadoPlatilloSchema.parse('aprobado')).toBe('aprobado')
    expect(EstadoPlatilloSchema.parse('rechazado')).toBe('rechazado')
    expect(EstadoPlatilloSchema.parse('publicado')).toBe('publicado')
  })
})

// ── Entidades ────────────────────────────────────────────────────────────────

describe('PaisSchema', () => {
  it('acepta un país válido', () => {
    const result = PaisSchema.parse(validPais)
    expect(result.nombre).toBe('Honduras')
    expect(result.codigoISO).toBe('HN')
  })

  it('rechaza país sin nombre', () => {
    expect(() => PaisSchema.parse({ ...validPais, nombre: '' })).toThrow()
  })

  it('rechaza país con nombre muy largo', () => {
    expect(() => PaisSchema.parse({ ...validPais, nombre: 'A'.repeat(101) })).toThrow()
  })

  it('rechaza país sin continente', () => {
    expect(() => PaisSchema.parse({ ...validPais, continente: undefined })).toThrow()
  })

  it('acepta país sin descripción', () => {
    const paisSinDesc = {
      id: validPais.id,
      nombre: validPais.nombre,
      codigoISO: validPais.codigoISO,
      continente: validPais.continente,
    }
    const result = PaisSchema.parse(paisSinDesc)
    expect(result.descripcion).toBeUndefined()
  })
})

describe('RegionSchema', () => {
  it('acepta una región válida', () => {
    const result = RegionSchema.parse(validRegion)
    expect(result.nombre).toBe('Copán')
    expect(result.paisId).toBe('honduras-001')
  })

  it('rechaza región sin paisId', () => {
    expect(() => RegionSchema.parse({ ...validRegion, paisId: '' })).toThrow()
  })
})

describe('IngredienteSchema', () => {
  it('acepta un ingrediente válido', () => {
    const result = IngredienteSchema.parse(validIngrediente)
    expect(result.nombre).toBe('Frijoles')
    expect(result.categoria).toBe('grano')
  })

  it('rechaza ingrediente sin categoría', () => {
    expect(() => IngredienteSchema.parse({ ...validIngrediente, categoria: undefined })).toThrow()
  })
})

describe('IngredientePlatilloSchema', () => {
  it('acepta ingrediente-platillo válido', () => {
    const result = IngredientePlatilloSchema.parse(validIngredientePlatillo)
    expect(result.cantidad).toBe('1/2')
    expect(result.unidad).toBe('taza')
  })

  it('rechaza ingrediente-platillo sin cantidad', () => {
    expect(() =>
      IngredientePlatilloSchema.parse({ ...validIngredientePlatillo, cantidad: '' })
    ).toThrow()
  })
})

describe('PlatilloSchema', () => {
  it('acepta un platillo válido', () => {
    const result = PlatilloSchema.parse(validPlatillo)
    expect(result.nombre).toBe('Baleada')
    expect(result.instrucciones).toHaveLength(2)
  })

  it('rechaza platillo sin instrucciones', () => {
    expect(() => PlatilloSchema.parse({ ...validPlatillo, instrucciones: [] })).toThrow()
  })

  it('rechaza platillo sin ingredientes', () => {
    expect(() => PlatilloSchema.parse({ ...validPlatillo, ingredientes: [] })).toThrow()
  })

  it('rechaza platillo sin imágenes', () => {
    expect(() => PlatilloSchema.parse({ ...validPlatillo, imagenes: [] })).toThrow()
  })

  it('rechaza platillo con imagen inválida', () => {
    expect(() => PlatilloSchema.parse({ ...validPlatillo, imagenes: ['not-a-url'] })).toThrow()
  })

  it('acepta platillo con campos opcionales', () => {
    const platilloCompleto = {
      ...validPlatillo,
      tiempoPreparacion: 10,
      porciones: 4,
      video: 'https://youtube.com/watch?v=123',
      contextoHistorico: 'Historia del platillo',
      festividades: ['Fiestas patrias'],
    }
    const result = PlatilloSchema.parse(platilloCompleto)
    expect(result.tiempoPreparacion).toBe(10)
    expect(result.porciones).toBe(4)
  })

  it('usa estado por defecto "pendiente"', () => {
    const platilloSinEstado = {
      id: validPlatillo.id,
      regionId: validPlatillo.regionId,
      nombre: validPlatillo.nombre,
      descripcion: validPlatillo.descripcion,
      instrucciones: validPlatillo.instrucciones,
      ingredientes: validPlatillo.ingredientes,
      dificultad: validPlatillo.dificultad,
      imagenes: validPlatillo.imagenes,
      createdAt: validPlatillo.createdAt,
    }
    const result = PlatilloSchema.parse(platilloSinEstado)
    expect(result.estado).toBe('pendiente')
  })
})

// ── ValidationError ──────────────────────────────────────────────────────────

describe('ValidationError', () => {
  it('crea un error con campo y mensaje', () => {
    const error = new ValidationError('Nombre requerido', 'nombre')
    expect(error.name).toBe('ValidationError')
    expect(error.message).toBe('Nombre requerido')
    expect(error.field).toBe('nombre')
  })

  it('convierte errores de Zod correctamente', () => {
    const result = PaisSchema.safeParse({
      nombre: '',
      id: 'test',
      codigoISO: 'HN',
      continente: 'america',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const validationError = ValidationError.fromZodError(result.error)
      expect(validationError.field).toBe('nombre')
      expect(validationError.issues.length).toBeGreaterThan(0)
    }
  })

  it('serializa a JSON correctamente', () => {
    const error = new ValidationError('Test', 'field', [])
    const json = error.toJSON()
    expect(json.name).toBe('ValidationError')
    expect(json.field).toBe('field')
  })
})
