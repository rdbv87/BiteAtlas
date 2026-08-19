'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PasoBasico } from './PasoBasico'
import { PasoIngredientes } from './PasoIngredientes'
import { PasoReceta } from './PasoReceta'
import { PasoCultural } from './PasoCultural'

const esquemaPaso1 = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  regionId: z.string().min(1, 'Selecciona una región'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  dificultad: z.enum(['facil', 'media', 'dificil']),
  tiempoPreparacion: z.number().min(1, 'El tiempo debe ser mayor a 0'),
  porciones: z.number().min(1, 'Las porciones deben ser al menos 1'),
})

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
})

const esquemaPaso3 = z.object({
  instrucciones: z
    .array(z.string().min(5, 'Cada paso debe tener al menos 5 caracteres'))
    .min(1, 'Agrega al menos un paso de preparación'),
})

const esquemaPaso4 = z.object({
  contextoHistorico: z.string().optional(),
  festividades: z.array(z.string()).optional(),
})

const esquemaCompleto = esquemaPaso1.merge(esquemaPaso2).merge(esquemaPaso3).merge(esquemaPaso4)

export type FormData = z.infer<typeof esquemaCompleto>

const PASOS = ['Básico', 'Ingredientes', 'Receta', 'Cultural']

interface FormularioAporteProps {
  onSubmit: (data: FormData) => void
  onCancel: () => void
}

export function FormularioAporte({ onSubmit, onCancel }: FormularioAporteProps) {
  const [pasoActual, setPasoActual] = useState(0)

  const form = useForm<FormData>({
    resolver: zodResolver(esquemaCompleto),
    defaultValues: {
      nombre: '',
      regionId: '',
      descripcion: '',
      dificultad: 'media',
      tiempoPreparacion: 30,
      porciones: 4,
      ingredientes: [],
      instrucciones: [],
      contextoHistorico: '',
      festividades: [],
    },
  })

  const siguiente = async () => {
    let valid = false

    if (pasoActual === 0) {
      valid = await form.trigger([
        'nombre',
        'regionId',
        'descripcion',
        'dificultad',
        'tiempoPreparacion',
        'porciones',
      ])
    } else if (pasoActual === 1) {
      valid = await form.trigger('ingredientes')
    } else if (pasoActual === 2) {
      valid = await form.trigger('instrucciones')
    } else {
      valid = true
    }

    if (valid) {
      if (pasoActual < PASOS.length - 1) {
        setPasoActual(pasoActual + 1)
      }
    }
  }

  const anterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1)
    }
  }

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-heading">Aportar Platillo</CardTitle>
        <div className="flex items-center gap-2 mt-4">
          {PASOS.map((paso, index) => (
            <div key={paso} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index <= pasoActual
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm ${
                  index <= pasoActual ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {paso}
              </span>
              {index < PASOS.length - 1 && <div className="w-8 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="min-h-[400px]">
        {pasoActual === 0 && <PasoBasico form={form} />}
        {pasoActual === 1 && <PasoIngredientes form={form} />}
        {pasoActual === 2 && <PasoReceta form={form} />}
        {pasoActual === 3 && <PasoCultural form={form} />}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={pasoActual === 0 ? onCancel : anterior}>
          {pasoActual === 0 ? 'Cancelar' : 'Anterior'}
        </Button>
        {pasoActual === PASOS.length - 1 ? (
          <Button onClick={handleSubmit} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Aporte'}
          </Button>
        ) : (
          <Button onClick={siguiente}>Siguiente</Button>
        )}
      </CardFooter>
    </Card>
  )
}
