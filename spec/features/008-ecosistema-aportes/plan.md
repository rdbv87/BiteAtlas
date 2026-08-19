# Plan · 008 Ecosistema de Aportes Comunales

## Enfoque técnico

### 1. Modelo de Datos

Agregar campo `estado` a `Platillo`:

```typescript
export const EstadoPlatilloSchema = z.enum([
  'pendiente', // Recién subido, esperando revisión
  'aprobado', // Aprobado por un curador
  'rechazado', // Rechazado con motivo
  'publicado', // Visible públicamente
])

export const PlatilloSchema = z.object({
  // ... campos existentes
  estado: EstadoPlatilloSchema,
  contribuidorId: z.string().uuid(),
  motivoRechazo: z.string().optional(),
  revisadoPor: z.string().uuid().optional(),
  revisadoEn: z.date().optional(),
})
```

### 2. Estructura de Componentes

```
src/components/
├── Aportes/
│   ├── FormularioAporte.tsx      ← Formulario principal
│   ├── FormularioAporte.test.tsx ← Tests
│   ├── PasoDatosBasicos.tsx      ← Nombre, descripción, región
│   ├── PasoIngredientes.tsx      ← Lista de ingredientes
│   ├── PasoInstrucciones.tsx     ← Pasos de preparación
│   ├── PasoMedia.tsx             ← Imágenes y video
│   ├── PasoResumen.tsx           ← Preview antes de enviar
│   ├── UploadImagen.tsx          ← Componente de upload
│   └── index.ts
├── Admin/
│   ├── PanelRevision.tsx         ← Lista de pendientes
│   ├── TarjetaAporte.tsx         ← Card de aporte
│   ├── ModalRevision.tsx         ← Modal para revisar
│   └── index.ts
└── UI/
    ├── Stepper.tsx               ← Stepper reutilizable
    └── Dropzone.tsx              ← Area de drop para archivos
```

### 3. Formulario Multi-Paso

Crear `src/components/Aportes/FormularioAporte.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlatilloSchema } from '@/types'
import { PasoDatosBasicos } from './PasoDatosBasicos'
import { PasoIngredientes } from './PasoIngredientes'
import { PasoInstrucciones } from './PasoInstrucciones'
import { PasoMedia } from './PasoMedia'
import { PasoResumen } from './PasoResumen'

const PASOS = ['Datos básicos', 'Ingredientes', 'Instrucciones', 'Media', 'Resumen']

export function FormularioAporte() {
  const [pasoActual, setPasoActual] = useState(0)

  const form = useForm({
    resolver: zodResolver(PlatilloSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      regionId: '',
      ingredientes: [],
      instrucciones: [],
      imagenes: [],
      dificultad: 'medio',
    },
  })

  const siguientePaso = () => setPasoActual(prev => Math.min(prev + 1, PASOS.length - 1))
  const pasoAnterior = () => setPasoActual(prev => Math.max(prev - 1, 0))

  const onSubmit = async (data: any) => {
    // Validar con Zod
    const validated = PlatilloSchema.parse(data)

    // Enviar a Firebase
    await submitAporte(validated)

    // Mostrar éxito
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        {PASOS.map((paso, index) => (
          <div key={paso} className={`flex items-center ${index <= pasoActual ? 'text-primary' : 'text-muted-foreground'}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
              {index < pasoActual ? '✓' : index + 1}
            </span>
            <span className="ml-2">{paso}</span>
          </div>
        ))}
      </div>

      {/* Formulario */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {pasoActual === 0 && <PasoDatosBasicos form={form} />}
        {pasoActual === 1 && <PasoIngredientes form={form} />}
        {pasoActual === 2 && <PasoInstrucciones form={form} />}
        {pasoActual === 3 && <PasoMedia form={form} />}
        {pasoActual === 4 && <PasoResumen form={form} />}

        {/* Botones */}
        <div className="flex justify-between mt-8">
          {pasoActual > 0 && (
            <button type="button" onClick={pasoAnterior}>
              Anterior
            </button>
          )}
          {pasoActual < PASOS.length - 1 ? (
            <button type="button" onClick={siguientePaso}>
              Siguiente
            </button>
          ) : (
            <button type="submit">
              Enviar Aporte
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
```

### 4. Upload de Imágenes

Opciones:

- **Firebase Storage:** Integración directa, pero más complejo
- **Cloudinary:** Servicio externo, más simple
- **Base64:** Simple pero limitado

**Decisión:** Firebase Storage (consistencia con el stack)

### 5. Panel de Administración

```typescript
// src/components/Admin/PanelRevision.tsx
export function PanelRevision() {
  const { aportesPendientes, isLoading } = useAportesPendientes()

  return (
    <div>
      <h1>Aportes Pendientes ({aportesPendientes.length})</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4">
          {aportesPendientes.map((aporte) => (
            <TarjetaAporte key={aporte.id} aporte={aporte} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### 6. Flujo de Curación

```
Contribuidor envía → Estado: 'pendiente'
                         ↓
Curador revisa → Estado: 'aprobado' o 'rechazado'
                         ↓
Si aprobado → Estado: 'publicado'
Si rechazado → Notificación al contribuidor
```

### 7. Rate Limiting

Implementar rate limiting básico:

- Máximo 5 aportes por usuario por día
- Máximo 10 imágenes por aporte
- Tamaño máximo 5MB por imagen

## Decisiones técnicas

1. **react-hook-form:** Formularios performantes con validación
2. **Multi-paso:** Mejor UX que formulario largo
3. **Firebase Storage:** Consistencia con el stack
4. **Flujo de curación:** Control de calidad antes de publicar

## Riesgos

- **Abuso:** Rate limiting y moderación manual
- **Calidad de imágenes:** Validar tamaño y formato
- **Spam:** Requerir login futuro (fuera de alcance actual)
