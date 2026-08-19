'use client'

import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import type { FormData } from './FormularioAporte'

interface PasoRecetaProps {
  form: UseFormReturn<FormData>
}

export function PasoReceta({ form }: PasoRecetaProps) {
  const {
    formState: { errors },
    setValue,
    getValues,
  } = form
  const [pasos, setPasos] = useState<string[]>(getValues('instrucciones') || [])

  const agregarPaso = () => {
    const nuevos = [...pasos, '']
    setPasos(nuevos)
    setValue('instrucciones', nuevos, { shouldValidate: true })
  }

  const eliminarPaso = (index: number) => {
    const nuevos = pasos.filter((_, i) => i !== index)
    setPasos(nuevos)
    setValue('instrucciones', nuevos, { shouldValidate: true })
  }

  const actualizarPaso = (index: number, valor: string) => {
    const nuevos = [...pasos]
    nuevos[index] = valor
    setPasos(nuevos)
    setValue('instrucciones', nuevos, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preparación</h3>
        <Button type="button" variant="outline" size="sm" onClick={agregarPaso} className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar Paso
        </Button>
      </div>

      {errors.instrucciones && (
        <p className="text-sm text-destructive">{errors.instrucciones.message}</p>
      )}

      <div className="space-y-4">
        {pasos.map((paso, index) => (
          <div key={index} className="flex gap-2 items-start">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-1">
              {index + 1}
            </span>
            <div className="flex-1">
              <Input
                placeholder={`Paso ${index + 1}`}
                value={paso}
                onChange={(e) => actualizarPaso(index, e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => eliminarPaso(index)}
              className="h-10 w-10 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {pasos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No has agregado pasos de preparación aún.</p>
          <p className="text-sm mt-2">Haz clic en &quot;Agregar Paso&quot; para comenzar.</p>
        </div>
      )}
    </div>
  )
}
