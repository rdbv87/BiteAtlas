'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PasoBasico } from './PasoBasico'
import { PasoIngredientes } from './PasoIngredientes'
import { PasoReceta } from './PasoReceta'
import { PasoCultural } from './PasoCultural'
import { PasoMedia } from './PasoMedia'

// ═══════════════════════════════════════════════════════════════════════════
// ESQUEMAS DE VALIDACION - Schemas Zod por paso del formulario multi-paso
// ═══════════════════════════════════════════════════════════════════════════

// Paso 1: Informacion basica del platillo (pais, region, nombre, descripcion, etc.)
// La ubicacion es obligatoria: sin coordenadas la receta no podria aparecer en el mapa.
const esquemaPaso1 = z.object({
  paisId: z.string().min(1, 'Selecciona un país'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  regionId: z.string().min(1, 'Selecciona una región'),
  lat: z.number({ error: 'Marca en el mapa el origen del platillo' }).min(-90).max(90),
  lng: z.number({ error: 'Marca en el mapa el origen del platillo' }).min(-180).max(180),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  dificultad: z.enum(['facil', 'medio', 'dificil']),
  tiempoPreparacion: z.number().min(1, 'El tiempo debe ser mayor a 0'),
  porciones: z.number().min(1, 'Las porciones deben ser al menos 1'),
})

// Paso 2: Lista de ingredientes con cantidades y unidades, más guarniciones/acompañantes sugeridos
const esquemaPaso2 = z.object({
  ingredientes: z
    .array(
      z.object({
        ingredienteId: z.string().min(1),
        cantidad: z.string().min(1),
        unidad: z.string().min(1),
      })
    )
    .min(1, 'Agrega al menos un ingrediente'),
  guarniciones: z.array(z.string().min(1)).optional(),
})

// Paso 3: Instrucciones paso-a-paso de preparacion
const esquemaPaso3 = z.object({
  instrucciones: z
    .array(z.string().min(5, 'Cada paso debe tener al menos 5 caracteres'))
    .min(1, 'Agrega al menos un paso de preparación'),
})

// Paso 4: Imagenes y video de la receta
const esquemaPaso4 = z.object({
  imagenes: z.array(z.string().url()).min(1, 'Agrega al menos una imagen de la receta'),
  video: z.string().url().optional(),
})

// Paso 5: Informacion cultural adicional (variante de otra receta, contexto historico, leyenda de origen, festividades)
const esquemaPaso5 = z.object({
  varianteDeId: z.string().optional(),
  contextoHistorico: z.string().optional(),
  leyendaOrigen: z.string().optional(),
  festividades: z.array(z.string()).optional(),
})

const esquemaCompleto = esquemaPaso1
  .merge(esquemaPaso2)
  .merge(esquemaPaso3)
  .merge(esquemaPaso4)
  .merge(esquemaPaso5)

export type FormData = z.infer<typeof esquemaCompleto>

const PASOS = ['Básico', 'Ingredientes', 'Receta', 'Media', 'Cultural']

// FormularioAporte: Componente orquestador del flujo multi-paso para crear/editar platillos.
interface FormularioAporteProps {
  onSubmit: (data: FormData, imageFiles: File[]) => void
  onCancel: () => void
  onStepChange?: (step: number) => void
  onSaveDraft?: (data: Partial<FormData>, step: number) => void
  initialValues?: Partial<FormData>
  initialStep?: number
  draftSavedAt?: Date | null
  submitLabel?: string
}

export function FormularioAporte({
  onSubmit,
  onCancel,
  onStepChange,
  onSaveDraft,
  initialValues,
  initialStep = 0,
  draftSavedAt,
  submitLabel = 'Enviar aporte',
}: FormularioAporteProps) {
  const [pasoActual, setPasoActual] = useState(initialStep)
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const form = useForm<FormData>({
    resolver: zodResolver(esquemaCompleto),
    defaultValues: {
      paisId: '',
      nombre: '',
      regionId: '',
      lat: undefined,
      lng: undefined,
      descripcion: '',
      dificultad: 'medio',
      tiempoPreparacion: 30,
      porciones: 4,
      ingredientes: [],
      guarniciones: [],
      instrucciones: [],
      imagenes: [],
      video: '',
      varianteDeId: '',
      contextoHistorico: '',
      leyendaOrigen: '',
      festividades: [],
      ...initialValues,
    },
  })

  // Auto-guardado reactivo en cambios del formulario (con debounce)
  useEffect(() => {
    if (!onSaveDraft) return

    const subscription = form.watch((values) => {
      onSaveDraft(values as Partial<FormData>, pasoActual)
    })

    return () => subscription.unsubscribe()
  }, [form, pasoActual, onSaveDraft])

  const siguiente = async () => {
    let valid = false

    if (pasoActual === 0) {
      valid = await form.trigger([
        'paisId',
        'nombre',
        'regionId',
        'lat',
        'lng',
        'descripcion',
        'dificultad',
        'tiempoPreparacion',
        'porciones',
      ])
    } else if (pasoActual === 1) {
      valid = await form.trigger('ingredientes')
    } else if (pasoActual === 2) {
      valid = await form.trigger('instrucciones')
    } else if (pasoActual === 3) {
      valid = await form.trigger('imagenes')
    } else {
      valid = true
    }

    if (valid) {
      if (pasoActual < PASOS.length - 1) {
        const nextStep = pasoActual + 1
        setPasoActual(nextStep)
        onStepChange?.(nextStep)
        onSaveDraft?.(form.getValues(), nextStep)
      }
    }
  }

  const anterior = () => {
    if (pasoActual > 0) {
      const previousStep = pasoActual - 1
      setPasoActual(previousStep)
      onStepChange?.(previousStep)
      onSaveDraft?.(form.getValues(), previousStep)
    }
  }

  const handleGuardarYSalir = () => {
    if (onSaveDraft) {
      onSaveDraft(form.getValues(), pasoActual)
    }
    onCancel()
  }

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data, imageFiles)
  })

  return (
    <div className="w-full space-y-7">
      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">
            Progreso de edición
          </p>
          {draftSavedAt && (
            <div className="flex items-center gap-1.5 text-xs text-[#2c7a7b]">
              <Save className="h-3.5 w-3.5" />
              <span>Borrador guardado</span>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-5 sm:gap-2">
          {PASOS.map((paso, index) => {
            const isActive = index === pasoActual
            const isCompleted = index < pasoActual

            return (
              <div key={paso} className="group space-y-2">
                <div className="relative flex items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                      isCompleted
                        ? 'border-[#173c3a] bg-[#173c3a] text-[#f5f1e8]'
                        : isActive
                          ? 'border-[#e8754f] bg-[#e8754f] text-white'
                          : 'border-[#173c3a]/20 bg-[#f5f1e8] text-[#47615a]'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < PASOS.length - 1 ? (
                    <div className="absolute left-10 top-1/2 hidden h-px w-[calc(100%-2.25rem)] -translate-y-1/2 bg-[#173c3a]/15 sm:block" />
                  ) : null}
                </div>
                <p
                  className={`text-xs leading-5 ${
                    isActive || isCompleted ? 'text-[#173c3a]' : 'text-[#47615a]'
                  }`}
                >
                  {paso}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="min-h-105 rounded-[1.5rem] border border-[#173c3a]/10 bg-[#fbf9f5] p-5 sm:p-6">
        {pasoActual === 0 && <PasoBasico form={form} />}
        {pasoActual === 1 && <PasoIngredientes form={form} />}
        {pasoActual === 2 && <PasoReceta form={form} />}
        {pasoActual === 3 && (
          <PasoMedia form={form} imageFiles={imageFiles} onFilesChange={setImageFiles} />
        )}
        {pasoActual === 4 && <PasoCultural form={form} />}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#173c3a]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={pasoActual === 0 ? onCancel : anterior}
            className="h-11 rounded-full border-[#173c3a]/20 bg-[#f5f1e8] px-6 text-[#173c3a] transition-colors hover:bg-[#ebf0e7]"
          >
            {pasoActual === 0 ? 'Volver' : 'Paso anterior'}
          </Button>

          {onSaveDraft && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleGuardarYSalir}
              className="h-11 rounded-full px-5 text-xs font-semibold text-[#47615a] hover:bg-[#173c3a]/5 hover:text-[#173c3a]"
            >
              <Save className="mr-1.5 h-4 w-4 text-[#e8754f]" />
              Guardar y salir
            </Button>
          )}
        </div>

        {pasoActual === PASOS.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={form.formState.isSubmitting}
            className="h-11 rounded-full bg-[#173c3a] px-7 text-[#f5f1e8] transition-colors hover:bg-[#234c49]"
          >
            {form.formState.isSubmitting ? 'Guardando aporte...' : submitLabel}
          </Button>
        ) : (
          <Button
            onClick={siguiente}
            className="h-11 rounded-full bg-[#e8754f] px-7 text-white transition-colors hover:bg-[#d96340]"
          >
            Continuar
          </Button>
        )}
      </div>
    </div>
  )
}
