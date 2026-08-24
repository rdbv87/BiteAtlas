'use client'

import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import type { FormData } from './FormularioAporte'

// Paso 3: Instrucciones paso-a-paso de preparacion - permite agregar/eliminar dinamicamente
interface PasoRecetaProps {
  form: UseFormReturn<FormData>
}

const inputClassName =
  'h-11 rounded-xl border-[#173c3a]/15 bg-white px-3 text-sm text-[#173c3a] placeholder:text-[#47615a]/70 focus-visible:border-[#e8754f] focus-visible:ring-3 focus-visible:ring-[#e8754f]/25'

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
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">Paso 3</p>
          <h3 className="font-editorial mt-2 text-3xl leading-[1.03] tracking-[-0.02em] text-[#173c3a]">
            Método de preparación
          </h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={agregarPaso}
          className="h-10 rounded-full border-[#173c3a]/20 bg-[#f5f1e8] px-5 text-[#173c3a] hover:bg-[#ecf2e8]"
        >
          <Plus className="w-4 h-4" />
          Agregar Paso
        </Button>
      </div>

      {errors.instrucciones && (
        <p className="text-sm text-[#b5432a]">{errors.instrucciones.message}</p>
      )}

      <div className="space-y-4">
        {pasos.map((paso, index) => (
          <div key={index} className="rounded-2xl border border-[#173c3a]/10 bg-white p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8754f] text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div className="flex-1">
                <Input
                  placeholder={`Paso ${index + 1}`}
                  value={paso}
                  onChange={(e) => actualizarPaso(index, e.target.value)}
                  className={inputClassName}
                />
                <p className="mt-2 text-xs text-[#47615a]">
                  Usa verbos de acción para facilitar la reproducción de la receta.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => eliminarPaso(index)}
                className="h-11 w-11 rounded-xl text-[#b5432a] hover:bg-[#fdf1ec]"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {pasos.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={agregarPaso}
            className="mt-3 w-full h-11 rounded-2xl border-dashed border-[#173c3a]/25 bg-white/60 text-sm font-semibold text-[#173c3a] hover:border-[#173c3a]/50 hover:bg-white transition-colors"
          >
            <Plus className="mr-1.5 w-4 h-4 text-[#e8754f]" />
            Agregar siguiente paso
          </Button>
        )}
      </div>

      {pasos.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#173c3a]/20 bg-[#f5f1e8] py-12 text-center text-[#47615a]">
          <p className="text-base">No has agregado pasos de preparación aún.</p>
          <p className="mt-2 text-sm">Haz clic en Agregar Paso para comenzar.</p>
        </div>
      )}
    </div>
  )
}
