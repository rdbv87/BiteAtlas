'use client'

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import type { FormData } from './FormularioAporte'

interface PasoIngredientesProps {
  form: UseFormReturn<FormData>
}

export function PasoIngredientes({ form }: PasoIngredientesProps) {
  const {
    register,
    formState: { errors },
    control,
  } = form
  const { fields, append, remove } = useFieldArray<FormData, 'ingredientes'>({
    control,
    name: 'ingredientes',
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ingredientes</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ ingredienteId: '', cantidad: '', unidad: '' })}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </Button>
      </div>

      {errors.ingredientes && (
        <p className="text-sm text-destructive">{errors.ingredientes.message}</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder="Ingrediente"
                {...register(`ingredientes.${index}.ingredienteId`)}
              />
            </div>
            <div className="w-24">
              <Input placeholder="Cantidad" {...register(`ingredientes.${index}.cantidad`)} />
            </div>
            <div className="w-24">
              <Input placeholder="Unidad" {...register(`ingredientes.${index}.unidad`)} />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="h-10 w-10 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No has agregado ingredientes aún.</p>
          <p className="text-sm mt-2">Haz clic en &quot;Agregar&quot; para comenzar.</p>
        </div>
      )}
    </div>
  )
}
