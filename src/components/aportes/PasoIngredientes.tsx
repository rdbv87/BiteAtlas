'use client'

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import type { FormData } from './FormularioAporte'

// Paso 2: Lista de ingredientes con cantidad y unidad - permite agregar/eliminar dinamicamente
interface PasoIngredientesProps {
  form: UseFormReturn<FormData>
}

const inputClassName =
  'h-11 rounded-xl border-[#173c3a]/15 bg-white px-3 text-sm text-[#173c3a] placeholder:text-[#47615a]/70 focus-visible:border-[#e8754f] focus-visible:ring-3 focus-visible:ring-[#e8754f]/25'

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
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">Paso 2</p>
          <h3 className="font-editorial mt-2 text-3xl leading-[1.03] tracking-[-0.02em] text-[#173c3a]">
            Ingredientes y cantidades
          </h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ ingredienteId: '', cantidad: '', unidad: '' })}
          className="h-10 rounded-full border-[#173c3a]/20 bg-[#f5f1e8] px-5 text-[#173c3a] hover:bg-[#ecf2e8]"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </Button>
      </div>

      {errors.ingredientes && (
        <p className="text-sm text-[#b5432a]">{errors.ingredientes.message}</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-2xl border border-[#173c3a]/10 bg-white p-4 sm:p-5"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#173c3a]/60">
              Ingrediente {index + 1}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_100px_100px_auto] sm:items-start">
              <div className="flex-1">
                <Input
                  placeholder="Ingrediente"
                  {...register(`ingredientes.${index}.ingredienteId`)}
                  className={inputClassName}
                />
              </div>
              <div className="w-24">
                <Input
                  placeholder="Cantidad"
                  {...register(`ingredientes.${index}.cantidad`)}
                  className={inputClassName}
                />
              </div>
              <div className="w-24">
                <Input
                  placeholder="Unidad"
                  {...register(`ingredientes.${index}.unidad`)}
                  className={inputClassName}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="h-11 w-11 rounded-xl text-[#b5432a] hover:bg-[#fdf1ec]"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#173c3a]/20 bg-[#f5f1e8] py-12 text-center text-[#47615a]">
          <p className="text-base">No has agregado ingredientes aún.</p>
          <p className="mt-2 text-sm">Haz clic en Agregar para comenzar.</p>
        </div>
      )}
    </div>
  )
}
