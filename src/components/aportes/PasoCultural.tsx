'use client'

import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import type { FormData } from './FormularioAporte'

interface PasoCulturalProps {
  form: UseFormReturn<FormData>
}

export function PasoCultural({ form }: PasoCulturalProps) {
  const { register, getValues, setValue } = form
  const [festividades, setFestividades] = useState<string[]>(getValues('festividades') || [])

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
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Contexto Histórico (opcional)</label>
        <textarea
          {...register('contextoHistorico')}
          rows={4}
          className="w-full p-2 border rounded-md bg-background"
          placeholder="Cuenta la historia detrás de este platillo, su origen y evolución..."
        />
        <p className="text-xs text-muted-foreground">
          Comparte la historia que hace único a este platillo.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Festividades Asociadas (opcional)</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={agregarFestival}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </Button>
        </div>

        <div className="space-y-2">
          {festividades.map((festival, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Nombre de la festividad"
                value={festival}
                onChange={(e) => actualizarFestival(index, e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => eliminarFestival(index)}
                className="h-10 w-10 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {festividades.length === 0 && (
          <p className="text-sm text-muted-foreground">
            ¿En qué festividades se sirve este platillo?
          </p>
        )}
      </div>
    </div>
  )
}
