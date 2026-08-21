import { z } from 'zod'

// ═══════════════════════════════════════════════════════════════════════════
// ENUMS - Valores posibles para campos categoricos
// ═══════════════════════════════════════════════════════════════════════════

// Valida los continentes disponibles en la aplicacion
// Valida los continentes disponibles en la aplicacion
export const ContinenteSchema = z.enum(['africa', 'america', 'asia', 'europa', 'oceania'])

// Valida el nivel de dificultad de una receta
// Valida el nivel de dificultad de una receta
export const DificultadSchema = z.enum(['facil', 'medio', 'dificil'])

// Clasifica los ingredientes por tipo (proteina, vegetal, grano, etc.)
export const CategoriaIngredienteSchema = z.enum([
  'proteina',
  'vegetal',
  'grano',
  'especia',
  'lacteo',
  'fruta',
  'otro',
])

// Estados de moderacion de un platillo (flujo: pendiente -> publicado/rechazado)
// Estados de moderacion de un platillo (flujo: pendiente -> publicado/rechazado)
export const EstadoPlatilloSchema = z.enum(['pendiente', 'rechazado', 'publicado'])

// Tipo de video: short (TikTok-like) o normal (YouTube standard)
// Tipo de video: short (TikTok-like) o normal (YouTube standard)
export const TipoVideoRecetaSchema = z.enum(['short', 'normal'])

// Estado de revision de una imagen: pendiente de revision, aprobada o rechazada
// Estado de revision de una imagen: pendiente de revision, aprobada o rechazada
export const EstadoImagenRecetaSchema = z.enum(['pendiente', 'aprobada', 'rechazada'])

// Valida datos de una imagen de receta con informacion de fuente y licencia
// Requiere: URL de imagen, URL de fuente, atribucion y licencia
// Incluye: timestamp de revision (cuando fue moderada)
export const ImagenRecetaSchema = z.object({
  url: z.string().url(),
  fuenteUrl: z.string().url(),
  fuente: z.string().min(1),
  tituloFuente: z.string().min(1),
  licencia: z.string().min(1),
  estado: EstadoImagenRecetaSchema,
  revisadoEn: z.coerce.date().optional(),
})

// Valida datos de un video de receta (principalmente YouTube)
// Incluye: titulo, canal, tipo (short/normal), duracion, vistas, consulta usada
// verificadoEn: timestamp de cuando se valido que el video existe
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

// ═══════════════════════════════════════════════════════════════════════════
// ENTIDADES PRINCIPALES - Estructuras de datos del dominio
// ═══════════════════════════════════════════════════════════════════════════

// Pais: Entidad base de la aplicacion (ej: Mexico, Japon, Marruecos)
// Incluye: nombre, codigo ISO, continente, descripcion opcional, imagen y encuadre de mapa
export const PaisSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1).max(100),
  codigoISO: z.string().min(2).max(3),
  continente: ContinenteSchema,
  descripcion: z.string().optional(),
  imagen: z.string().url().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  zoom: z.number().int().min(1).max(18).optional(),
})

// Region: Subdivisions geograficas dentro de un Pais (provincias, departamentos, etc.)
// Incluye: nombre, descripcion, ubicacion (lat/lng opcional), imagen
// Referencia: paisId para asociar con el pais padre
export const RegionSchema = z.object({
  id: z.string().min(1),
  paisId: z.string().min(1),
  nombre: z.string().min(1).max(100),
  descripcion: z.string().optional(),
  imagen: z.string().url().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

// Ingrediente: Catálogo maestro de ingredientes disponibles
// Incluye: nombre, categoria (proteina, vegetal, etc.), imagen opcional
// Se referencia desde los platillos mediante IngredientePlatillo
export const IngredienteSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1).max(100),
  categoria: CategoriaIngredienteSchema,
  imagen: z.string().url().optional(),
})

// IngredientePlatillo: Relacion N-M entre Platillo e Ingrediente
// Incluye: cantidad (ej: "2") y unidad (ej: "tazas", "gramos")
// Se usa como array dentro de PlatilloSchema
export const IngredientePlatilloSchema = z.object({
  ingredienteId: z.string().min(1),
  cantidad: z.string().min(1),
  unidad: z.string().min(1),
})

// Platillo: Entidad principal de recetas gastronomicas
// Incluye datos basicos (nombre, descripcion, instrucciones), metadata culinaria
// (ingredientes, dificultad, tiempo, porciones), y tracking (estado, contributor, timestamps)
// Campos opcionales: coordenadas geograficas, video, variante de otro platillo,
// contexto historico, festividades, multiples videos/imagenes con fuentes
// Estado: pendiente (nuevo) -> publicado/rechazado (moderacion)
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

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS - Tipos TypeScript inferidos desde los Zod schemas
// ═══════════════════════════════════════════════════════════════════════════
// Estos tipos se generan automaticamente desde los schemas de validacion,
// asegurando que siempre estan sincronizados. Usar en lugar de tipos manuales.

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
