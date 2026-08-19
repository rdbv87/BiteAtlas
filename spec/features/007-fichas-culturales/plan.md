# Plan · 007 Fichas Culturales Inmersivas

## Enfoque técnico

### 1. Instalación de Dependencias

```bash
npm install framer-motion
```

Framer Motion para animaciones fluidas de deslizamiento.

### 2. Estructura de Componentes

```
src/components/
├── FichasCulturales/
│   ├── FichaCultural.tsx        ← Componente principal
│   ├── FichaCultural.test.tsx   ← Tests
│   ├── Secciones/
│   │   ├── RecetaPaso.tsx       ← Paso de receta
│   │   ├── ContextoHistorico.tsx ← Sección histórica
│   │   ├── Festividades.tsx     ← Festividades
│   │   ├── Galeria.tsx          ← Galería de imágenes
│   │   └── VideoPlayer.tsx      ← Reproductor de video
│   ├── Header.tsx               ← Header con imagen principal
│   ├── Footer.tsx               ← Footer con info adicional
│   └── index.ts
└── UI/
    ├── Slider.tsx               ← Componente slider reutilizable
    └── Modal.tsx                ← Modal para vista expandida
```

### 3. Componente Principal

Crear `src/components/FichasCulturales/FichaCultural.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Platillo } from '@/types'
import { Header } from './Header'
import { RecetaPaso } from './Secciones/RecetaPaso'
import { ContextoHistorico } from './Secciones/ContextoHistorico'
import { Festividades } from './Secciones/Festividades'
import { Galeria } from './Secciones/Galeria'
import { VideoPlayer } from './Secciones/VideoPlayer'
import { Footer } from './Footer'

interface FichaCulturalProps {
  platillo: Platillo
  isOpen: boolean
  onClose: () => void
}

export function FichaCultural({ platillo, isOpen, onClose }: FichaCulturalProps) {
  const [seccionActiva, setSeccionActiva] = useState<'receta' | 'historia' | 'festival'>('receta')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
        >
          <Header platillo={platillo} onClose={onClose} />

          {/* Tabs de navegación */}
          <div className="flex border-b">
            <button
              onClick={() => setSeccionActiva('receta')}
              className={`flex-1 py-3 text-sm font-medium ${seccionActiva === 'receta' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
            >
              Receta
            </button>
            <button
              onClick={() => setSeccionActiva('historia')}
              className={`flex-1 py-3 text-sm font-medium ${seccionActiva === 'historia' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
            >
              Historia
            </button>
            <button
              onClick={() => setSeccionActiva('festival')}
              className={`flex-1 py-3 text-sm font-medium ${seccionActiva === 'festival' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
            >
              Festividades
            </button>
          </div>

          {/* Contenido */}
          <div className="p-4">
            {seccionActiva === 'receta' && (
              <RecetaPaso
                instrucciones={platillo.instrucciones}
                ingredientes={platillo.ingredientes}
              />
            )}
            {seccionActiva === 'historia' && (
              <ContextoHistorico contenido={platillo.contextoHistorico} />
            )}
            {seccionActiva === 'festival' && (
              <Festividades festividades={platillo.festividades} />
            )}
          </div>

          {/* Video si existe */}
          {platillo.video && (
            <div className="p-4 border-t">
              <VideoPlayer url={platillo.video} />
            </div>
          )}

          {/* Galería */}
          <div className="p-4 border-t">
            <Galeria imagenes={platillo.imagenes} />
          </div>

          <Footer platillo={platillo} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 4. Secciones Individuales

#### RecetaPaso.tsx

```typescript
interface RecetaPasoProps {
  instrucciones: string[]
  ingredientes: IngredientePlatillo[]
}

export function RecetaPaso({ instrucciones, ingredientes }: RecetaPasoProps) {
  return (
    <div className="space-y-6">
      {/* Ingredientes */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Ingredientes</h3>
        <ul className="space-y-2">
          {ingredientes.map((ing, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span>{ing.cantidad} {ing.unidad}</span>
              <span className="text-muted-foreground">{ing.ingredienteId}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instrucciones */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Preparación</h3>
        <ol className="space-y-4">
          {instrucciones.map((paso, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <p className="text-sm">{paso}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
```

#### ContextoHistorico.tsx

```typescript
interface ContextoHistoricoProps {
  contenido?: string
}

export function ContextoHistorico({ contenido }: ContextoHistoricoProps) {
  if (!contenido) return <p className="text-muted-foreground">No hay información histórica disponible.</p>

  return (
    <div className="prose prose-sm">
      <h3 className="text-lg font-semibold mb-3">Contexto Histórico</h3>
      <p className="font-editorial text-base leading-relaxed">{contenido}</p>
    </div>
  )
}
```

### 5. Animaciones

Usar Framer Motion para:

- Deslizamiento del panel desde la derecha
- Transiciones entre secciones
- Animaciones de entrada para pasos de receta
- Hover effects en botones

### 6. Responsive

- **Mobile:** Panel fullscreen con drag para cerrar
- **Desktop:** Panel lateral de 400px

## Decisiones técnicas

1. **Framer Motion:** Animaciones declarativas y performantes
2. **Panel deslizante:** Mejor UX que modal centrado
3. **Tabs:** Organización clara de información
4. **Lazy loading de video:** Solo cargar cuando sea visible

## Riesgos

- **Performance:** Muchas animaciones pueden afectar FPS
- **Mobile:** Drag gestures pueden conflictuar con scroll
- **Accesibilidad:** Asegurar que las animaciones no causen mareos
