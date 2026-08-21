'use client'

import { useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLandingData } from '@/services/hooks/useLandingData'
import { Plus, Trash2 } from 'lucide-react'
import type { FormData } from './FormularioAporte'

// Paso 5: Informacion cultural - contexto historico, variante de otra receta, festividades asociadas
interface PasoCulturalProps {
  form: UseFormReturn<FormData>
}

const inputClassName =
  'h-11 rounded-xl border-[#173c3a]/15 bg-white px-3 text-sm text-[#173c3a] placeholder:text-[#47615a]/70 focus-visible:border-[#e8754f] focus-visible:ring-3 focus-visible:ring-[#e8754f]/25'

const selectClassName =
  'h-11 w-full rounded-xl border border-[#173c3a]/15 bg-white px-3 text-sm text-[#173c3a] transition-colors outline-none focus-visible:border-[#e8754f] focus-visible:ring-3 focus-visible:ring-[#e8754f]/25 disabled:cursor-not-allowed disabled:opacity-50'

const textareaClassName =
  'w-full rounded-xl border border-[#173c3a]/15 bg-white px-3 py-2 text-sm text-[#173c3a] placeholder:text-[#47615a]/70 outline-none transition-colors focus-visible:border-[#e8754f] focus-visible:ring-3 focus-visible:ring-[#e8754f]/25'

export function PasoCultural({ form }: PasoCulturalProps) {
  const { register, getValues, setValue, watch } = form
  const [festividades, setFestividades] = useState<string[]>(getValues('festividades') || [])
  const { recetasPorPais, isLoading, error } = useLandingData()
  const paisId = watch('paisId')
  const varianteDeId = watch('varianteDeId')

  const recetasDisponibles = useMemo(() => {
    if (!paisId) return []
    return (recetasPorPais[paisId] ?? []).slice().sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [paisId, recetasPorPais])

  const agregarFestival = () => {
    const nuevos = [...festividades, '']
    setFestividades(nuevos)
    setValue('festividades', nuevos)
  }

  const eliminarFestival = (index: number) => {
    const nuevos = festividades.filter((_, i) => i !== index)
    setFestividades(nuevos)
    setValue('festividades', nuevos)
  }

  const actualizarFestival = (index: number, valor: string) => {
    const nuevos = [...festividades]
    nuevos[index] = valor
    setFestividades(nuevos)
    setValue('festividades', nuevos)
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">Paso 5</p>
        <h3 className="font-editorial mt-2 text-3xl leading-[1.03] tracking-[-0.02em] text-[#173c3a]">
          Memoria y festividades
        </h3>
      </div>

      <div className="space-y-2">
        <label htmlFor="varianteDeId" className="text-sm font-medium text-[#173c3a]">
          Variante de otra receta del mismo país (opcional)
        </label>
        <select
          id="varianteDeId"
          {...register('varianteDeId')}
          value={varianteDeId ?? ''}
          className={selectClassName}
          disabled={!paisId || isLoading || !!error || recetasDisponibles.length === 0}
        >
          <option value="">
            {isLoading ? 'Cargando recetas publicadas...' : 'Es una receta original'}
          </option>
          {recetasDisponibles.map((platillo) => (
            <option key={platillo.id} value={platillo.id}>
              {platillo.nombre}
            </option>
          ))}
        </select>
        <p className="text-xs text-[#47615a]">
          {error
            ? 'No se pudieron cargar recetas publicadas desde Firestore.'
            : 'Si esta receta es una variación de una ya publicada en el mismo país, puedes asociarla aquí.'}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#173c3a]">Contexto histórico (opcional)</label>
        <textarea
          {...register('contextoHistorico')}
          rows={5}
          className={textareaClassName}
          placeholder="Cuenta la historia detrás de este platillo, su origen y evolución..."
        />
        <p className="text-xs text-[#47615a]">
          Comparte la historia que hace único a este platillo.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#173c3a]">
            Festividades asociadas (opcional)
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={agregarFestival}
            className="h-10 rounded-full border-[#173c3a]/20 bg-[#f5f1e8] px-5 text-[#173c3a] hover:bg-[#ecf2e8]"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </Button>
        </div>

        <div className="space-y-2">
          {festividades.map((festival, index) => (
            <div key={index} className="rounded-2xl border border-[#173c3a]/10 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#173c3a]/60">
                Festividad {index + 1}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Input
                  placeholder="Nombre de la festividad"
                  value={festival}
                  onChange={(e) => actualizarFestival(index, e.target.value)}
                  className={inputClassName}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => eliminarFestival(index)}
                  className="h-11 w-11 rounded-xl text-[#b5432a] hover:bg-[#fdf1ec]"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {festividades.length === 0 && (
          <p className="rounded-xl border border-dashed border-[#173c3a]/20 bg-[#f5f1e8] px-4 py-3 text-sm text-[#47615a]">
            ¿En qué festividades se sirve este platillo?
          </p>
        )}
      </div>
    </div>
  )
}
