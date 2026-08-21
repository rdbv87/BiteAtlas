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
  id: 'japon-001',
  nombre: 'Japón',
  codigoISO: 'JP',
  continente: 'asia' as const,
  descripcion: 'Archipiélago del este de Asia',
  lat: 36.2,
  lng: 138.25,
  zoom: 5,
}

const validRegion = {
  id: 'japon-001-region-1',
  paisId: 'japon-001',
  nombre: 'Kioto',
  descripcion: 'Región de Kansai',
}

const validIngrediente = {
  id: 'ing-miso-001',
  nombre: 'Miso',
  categoria: 'grano' as const,
}

const validIngredientePlatillo = {
  ingredienteId: 'ing-miso-001',
  cantidad: '2',
  unidad: 'cucharadas',
}

const validPlatillo = {
  id: 'platillo-sopa-miso-001',
  paisId: 'japon-001',
  regionId: 'japon-001-region-1',
  nombre: 'Sopa de miso',
  descripcion: 'Caldo dashi con pasta de miso y tofu',
  instrucciones: ['Calentar el dashi', 'Disolver el miso'],
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
    expect(EstadoPlatilloSchema.parse('rechazado')).toBe('rechazado')
    expect(EstadoPlatilloSchema.parse('publicado')).toBe('publicado')
  })

  it('rechaza estados de moderación intermedios que no son visibles', () => {
    expect(() => EstadoPlatilloSchema.parse('aprobado')).toThrow()
  })
})

// ── Entidades ────────────────────────────────────────────────────────────────

describe('PaisSchema', () => {
  it('acepta un país válido', () => {
    const result = PaisSchema.parse(validPais)
    expect(result.nombre).toBe('Japón')
    expect(result.codigoISO).toBe('JP')
  })

  it('conserva el encuadre de mapa del país', () => {
    const result = PaisSchema.parse(validPais)
    expect(result.lat).toBe(36.2)
    expect(result.lng).toBe(138.25)
    expect(result.zoom).toBe(5)
  })

  it('rechaza coordenadas fuera de rango', () => {
    expect(() => PaisSchema.parse({ ...validPais, lat: 120 })).toThrow()
    expect(() => PaisSchema.parse({ ...validPais, lng: -200 })).toThrow()
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
    expect(result.nombre).toBe('Kioto')
    expect(result.paisId).toBe('japon-001')
  })

  it('rechaza región sin paisId', () => {
    expect(() => RegionSchema.parse({ ...validRegion, paisId: '' })).toThrow()
  })
})

describe('IngredienteSchema', () => {
  it('acepta un ingrediente válido', () => {
    const result = IngredienteSchema.parse(validIngrediente)
    expect(result.nombre).toBe('Miso')
    expect(result.categoria).toBe('grano')
  })

  it('rechaza ingrediente sin categoría', () => {
    expect(() => IngredienteSchema.parse({ ...validIngrediente, categoria: undefined })).toThrow()
  })
})

describe('IngredientePlatilloSchema', () => {
  it('acepta ingrediente-platillo válido', () => {
    const result = IngredientePlatilloSchema.parse(validIngredientePlatillo)
    expect(result.cantidad).toBe('2')
    expect(result.unidad).toBe('cucharadas')
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
    expect(result.nombre).toBe('Sopa de miso')
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
      paisId: validPlatillo.paisId,
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
