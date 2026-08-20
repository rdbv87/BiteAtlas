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

export const TipoVideoRecetaSchema = z.enum(['short', 'normal'])

export const EstadoImagenRecetaSchema = z.enum(['pendiente', 'aprobada', 'rechazada'])

export const ImagenRecetaSchema = z.object({
  url: z.string().url(),
  fuenteUrl: z.string().url(),
  fuente: z.string().min(1),
  tituloFuente: z.string().min(1),
  licencia: z.string().min(1),
  estado: EstadoImagenRecetaSchema,
  revisadoEn: z.coerce.date().optional(),
})

export const VideoRecetaSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  titulo: z.string().min(1),
  canal: z.string().min(1),
  miniatura: z.string().url(),
  tipo: TipoVideoRecetaSchema,
  duracionSegundos: z.number().int().positive(),
  vistas: z.number().int().nonnegative(),
  consulta: z.string().min(1),
  fuente: z.literal('youtube'),
  verificadoEn: z.coerce.date(),
})

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
  lat: z.number().optional(),
  lng: z.number().optional(),
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
  paisId: z.string().min(1),
  regionId: z.string().min(1),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  nombre: z.string().min(1).max(200),
  descripcion: z.string().min(1),
  instrucciones: z.array(z.string().min(1)).min(1),
  ingredientes: z.array(IngredientePlatilloSchema).min(1),
  tiempoPreparacion: z.number().positive().optional(),
  dificultad: DificultadSchema,
  porciones: z.number().positive().optional(),
  imagenes: z.array(z.string().url()).min(1),
  imagenesFuentes: z.array(ImagenRecetaSchema).optional(),
  video: z.string().url().optional(),
  varianteDeId: z.string().optional(),
  contextoHistorico: z.string().optional(),
  festividades: z.array(z.string()).optional(),
  videos: z.array(VideoRecetaSchema).max(2).optional(),
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
export type TipoVideoReceta = z.infer<typeof TipoVideoRecetaSchema>
export type VideoReceta = z.infer<typeof VideoRecetaSchema>
export type EstadoImagenReceta = z.infer<typeof EstadoImagenRecetaSchema>
export type ImagenReceta = z.infer<typeof ImagenRecetaSchema>
export type Pais = z.infer<typeof PaisSchema>
export type Region = z.infer<typeof RegionSchema>
export type Ingrediente = z.infer<typeof IngredienteSchema>
export type IngredientePlatillo = z.infer<typeof IngredientePlatilloSchema>
export type Platillo = z.infer<typeof PlatilloSchema>
