'use client'

import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import type { FormData } from './FormularioAporte'

interface PasoBasicoProps {
  form: UseFormReturn<FormData>
}

export function PasoBasico({ form }: PasoBasicoProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre del Platillo *</label>
        <Input
          placeholder="Ej: Baleada Hondureña"
          {...register('nombre')}
          aria-invalid={!!errors.nombre}
        />
        {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Región *</label>
        <select
          {...register('regionId')}
          className="w-full p-2 border rounded-md bg-background"
          aria-invalid={!!errors.regionId}
        >
          <option value="">Selecciona una región</option>
          <option value="copan-001">Copán, Honduras</option>
          <option value="la-ceiba-001">La Ceiba, Honduras</option>
          <option value="comayagua-001">Comayagua, Honduras</option>
        </select>
        {errors.regionId && <p className="text-sm text-destructive">{errors.regionId.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descripción *</label>
        <textarea
          {...register('descripcion')}
          rows={3}
          className="w-full p-2 border rounded-md bg-background"
          placeholder="Describe el platillo y su importancia cultural..."
          aria-invalid={!!errors.descripcion}
        />
        {errors.descripcion && (
          <p className="text-sm text-destructive">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Dificultad</label>
          <select
            {...register('dificultad')}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="facil">Fácil</option>
            <option value="media">Media</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tiempo (min) *</label>
          <Input
            type="number"
            {...register('tiempoPreparacion', { valueAsNumber: true })}
            aria-invalid={!!errors.tiempoPreparacion}
          />
          {errors.tiempoPreparacion && (
            <p className="text-sm text-destructive">{errors.tiempoPreparacion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Porciones *</label>
          <Input
            type="number"
            {...register('porciones', { valueAsNumber: true })}
            aria-invalid={!!errors.porciones}
          />
          {errors.porciones && (
            <p className="text-sm text-destructive">{errors.porciones.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
