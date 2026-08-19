import { z } from 'zod'

// ── Enums ────────────────────────────────────────────────────────────────────

export const ContinenteSchema = z.enum(['africa', 'america', 'asia', 'europa', 'oceania'])

export const DificultadSchema = z.enum(['facil', 'medio', 'dificil'])

export const CategoriaIngredienteSchema = z.enum([
  'proteina',
  'vegetal',
  'grano',
  'especia',
  'lacteo',
  'fruta',
  'otro',
])

export const EstadoPlatilloSchema = z.enum(['pendiente', 'aprobado', 'rechazado', 'publicado'])

// ── Entidades ────────────────────────────────────────────────────────────────

export const PaisSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1).max(100),
  codigoISO: z.string().min(2).max(3),
  continente: ContinenteSchema,
  descripcion: z.string().optional(),
  imagen: z.string().url().optional(),
})

export const RegionSchema = z.object({
  id: z.string().min(1),
  paisId: z.string().min(1),
  nombre: z.string().min(1).max(100),
  descripcion: z.string().optional(),
  imagen: z.string().url().optional(),
})

export const IngredienteSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1).max(100),
  categoria: CategoriaIngredienteSchema,
  imagen: z.string().url().optional(),
})

export const IngredientePlatilloSchema = z.object({
  ingredienteId: z.string().min(1),
  cantidad: z.string().min(1),
  unidad: z.string().min(1),
})

export const PlatilloSchema = z.object({
  id: z.string().min(1),
  regionId: z.string().min(1),
  nombre: z.string().min(1).max(200),
  descripcion: z.string().min(1),
  instrucciones: z.array(z.string().min(1)).min(1),
  ingredientes: z.array(IngredientePlatilloSchema).min(1),
  tiempoPreparacion: z.number().positive().optional(),
  dificultad: DificultadSchema,
  porciones: z.number().positive().optional(),
  imagenes: z.array(z.string().url()).min(1),
  video: z.string().url().optional(),
  contextoHistorico: z.string().optional(),
  festividades: z.array(z.string()).optional(),
  estado: EstadoPlatilloSchema.default('pendiente'),
  contribuidorId: z.string().min(1).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
})

// ── Types ────────────────────────────────────────────────────────────────────

export type Continente = z.infer<typeof ContinenteSchema>
export type Dificultad = z.infer<typeof DificultadSchema>
export type CategoriaIngrediente = z.infer<typeof CategoriaIngredienteSchema>
export type EstadoPlatillo = z.infer<typeof EstadoPlatilloSchema>
export type Pais = z.infer<typeof PaisSchema>
export type Region = z.infer<typeof RegionSchema>
export type Ingrediente = z.infer<typeof IngredienteSchema>
export type IngredientePlatillo = z.infer<typeof IngredientePlatilloSchema>
export type Platillo = z.infer<typeof PlatilloSchema>
