# Plan · 003 Modelo de Dominio + Zod

## Enfoque técnico

### 1. Instalación de Zod

```bash
npm install zod
```

### 2. Estructura de Entidades

```
País
├── id: string
├── nombre: string
├── codigoISO: string (2-3 letras)
├── continente: enum
├── descripcion?: string
├── imagen?: string
└── regiones: Región[]

Región
├── id: string
├── paisId: string (ref)
├── nombre: string
├── descripcion?: string
├── imagen?: string
└── platillos: Platillo[]

Platillo
├── id: string
├── regionId: string (ref)
├── nombre: string
├── descripcion: string
├── instrucciones: string[]
├── ingredientes: IngredientePlatillo[]
├── tiempoPreparacion?: number (minutos)
├── dificultad: enum ('facil', 'medio', 'dificil')
├── porciones?: number
├── imagenes: string[]
├──视频?: string
├── contextoHistorico?: string
├── festividades?: string[]
└── createdAt: Date

Ingrediente
├── id: string
├── nombre: string
├── categoria: enum ('proteina', 'vegetal', 'grano', 'especia', 'otro')
└── imagen?: string

IngredientePlatillo
├── ingredienteId: string (ref)
├── cantidad: string
└── unidad: string
```

### 3. Esquemas Zod

Crear `src/types/schemas.ts`:

```typescript
import { z } from 'zod'

export const ContinenteSchema = z.enum(['africa', 'america', 'asia', 'europa', 'oceania'])

export const DificultadSchema = z.enum(['facil', 'medio', 'dificil'])

export const CategoriaIngredienteSchema = z.enum([
  'proteina',
  'vegetal',
  'grano',
  'especia',
  'otro',
])

export const PaisSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1).max(100),
  codigoISO: z.string().length(2).or(z.string().length(3)),
  continente: ContinenteSchema,
  descripcion: z.string().optional(),
  imagen: z.string().url().optional(),
})

export const RegionSchema = z.object({
  id: z.string().uuid(),
  paisId: z.string().uuid(),
  nombre: z.string().min(1).max(100),
  descripcion: z.string().optional(),
  imagen: z.string().url().optional(),
})

export const IngredienteSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1).max(100),
  categoria: CategoriaIngredienteSchema,
  imagen: z.string().url().optional(),
})

export const IngredientePlatilloSchema = z.object({
  ingredienteId: z.string().uuid(),
  cantidad: z.string(),
  unidad: z.string(),
})

export const PlatilloSchema = z.object({
  id: z.string().uuid(),
  regionId: z.string().uuid(),
  nombre: z.string().min(1).max(200),
  descripcion: z.string().min(1),
  instrucciones: z.array(z.string()).min(1),
  ingredientes: z.array(IngredientePlatilloSchema).min(1),
  tiempoPreparacion: z.number().positive().optional(),
  dificultad: DificultadSchema,
  porciones: z.number().positive().optional(),
  imagenes: z.array(z.string().url()),
  video: z.string().url().optional(),
  contextoHistorico: z.string().optional(),
  festividades: z.array(z.string()).optional(),
  createdAt: z.date(),
})
```

### 4. Tipos Derivados

```typescript
export type Continente = z.infer<typeof ContinenteSchema>
export type Dificultad = z.infer<typeof DificultadSchema>
export type CategoriaIngrediente = z.infer<typeof CategoriaIngredienteSchema>
export type Pais = z.infer<typeof PaisSchema>
export type Region = z.infer<typeof RegionSchema>
export type Ingrediente = z.infer<typeof IngredienteSchema>
export type Platillo = z.infer<typeof PlatilloSchema>
```

### 5. Clases de Error

Crear `src/errors/validation-error.ts`:

```typescript
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly issues: z.ZodIssue[]
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}
```

## Decisiones técnicas

1. **Zod como fuente de verdad**: Los tipos se derivan de los esquemas, no al revés
2. **UUIDs para IDs**: Consistencia y seguridad en identificadores
3. **Arrays de instrucciones**: Paso a paso para recetas
4. **Campo video opcional**: No todos los platillos tendrán video

## Riesgos

- **Complejidad del modelo**: Mantener simple pero suficiente
- **Rendimiento de validación**: Zod es rápido, pero vigilar en ingesta masiva
