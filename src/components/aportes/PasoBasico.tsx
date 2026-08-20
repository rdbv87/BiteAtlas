'use client'

import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { useLocalCountriesRegions } from '@/services/hooks/useLocalCountriesRegions'
import { getCoordenadasPais } from '@/data/paises-coordenadas'
import { SelectorUbicacionLoader } from './SelectorUbicacionLoader'
import type { FormData } from './FormularioAporte'

interface PasoBasicoProps {
  form: UseFormReturn<FormData>
}

const inputClassName =
  'h-11 rounded-xl border-[#173c3a]/15 bg-white px-3 text-sm text-[#173c3a] placeholder:text-[#47615a]/70 focus-visible:border-[#e8754f] focus-visible:ring-3 focus-visible:ring-[#e8754f]/25'

const selectClassName =
  'h-11 w-full rounded-xl border border-[#173c3a]/15 bg-white px-3 text-sm text-[#173c3a] transition-colors outline-none focus-visible:border-[#e8754f] focus-visible:ring-3 focus-visible:ring-[#e8754f]/25 disabled:cursor-not-allowed disabled:opacity-50'

const textareaClassName =
  'w-full rounded-xl border border-[#173c3a]/15 bg-white px-3 py-2 text-sm text-[#173c3a] placeholder:text-[#47615a]/70 transition-colors outline-none focus-visible:border-[#e8754f] focus-visible:ring-3 focus-visible:ring-[#e8754f]/25'

const labelsPorContinente: Record<string, string> = {
  africa: 'África',
  america: 'América',
  asia: 'Asia',
  europa: 'Europa',
  oceania: 'Oceanía',
}

export function PasoBasico({ form }: PasoBasicoProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form

  const { paises, regionesPorPais } = useLocalCountriesRegions()
  const paisId = watch('paisId')
  const lat = watch('lat')
  const lng = watch('lng')
  const regiones = useMemo(() => {
    if (!paisId) return []
    return regionesPorPais[paisId] ?? []
  }, [paisId, regionesPorPais])

  const countryCoordinates = paisId ? getCoordenadasPais(paisId) : undefined
  const mapCenter: [number, number] = countryCoordinates
    ? [countryCoordinates.lat, countryCoordinates.lng]
    : [20, -60]

  const paisesPorContinente = useMemo(() => {
    const base = Object.fromEntries(
      Object.keys(labelsPorContinente).map((continente) => [continente, [] as typeof paises])
    )

    for (const pais of paises) {
      const grupo = base[pais.continente] ?? (base[pais.continente] = [])
      grupo.push(pais)
    }

    return Object.entries(labelsPorContinente).map(([continente, label]) => ({
      continente,
      label,
      paises: base[continente]?.sort((a, b) => a.nombre.localeCompare(b.nombre)) ?? [],
    }))
  }, [paises])

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">Paso 1</p>
        <h3 className="font-editorial mt-2 text-3xl leading-[1.03] tracking-[-0.02em] text-[#173c3a]">
          Define identidad y origen del platillo
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#173c3a]">Nombre del platillo *</label>
        <Input
          placeholder="Ej: Baleada Hondureña"
          {...register('nombre')}
          aria-invalid={!!errors.nombre}
          className={inputClassName}
        />
        {errors.nombre ? <p className="text-sm text-[#b5432a]">{errors.nombre.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#173c3a]">País *</label>
        <select
          {...register('paisId', {
            onChange: () => {
              setValue('lat', undefined, { shouldDirty: true })
              setValue('lng', undefined, { shouldDirty: true })
            },
          })}
          className={selectClassName}
          aria-invalid={!!errors.paisId}
        >
          <option value="">Selecciona un país</option>
          {paisesPorContinente.map(({ continente, label, paises: paisesDelContinente }) => (
            <optgroup key={continente} label={label}>
              {paisesDelContinente.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.nombre}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {errors.paisId ? <p className="text-sm text-[#b5432a]">{errors.paisId.message}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#173c3a]">Región *</label>
        <select
          {...register('regionId')}
          className={selectClassName}
          aria-invalid={!!errors.regionId}
          disabled={!paisId}
        >
          <option value="">Selecciona una región</option>
          {regiones.map((region) => (
            <option key={region.id} value={region.id}>
              {region.nombre}
            </option>
          ))}
        </select>
        {errors.regionId ? (
          <p className="text-sm text-[#b5432a]">{errors.regionId.message}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-[#173c3a]">Ubicación exacta (opcional)</label>
          <p className="mt-1 text-xs leading-5 text-[#47615a]">
            Haz clic en el mapa para ubicar el origen del platillo. El punto naranja parpadeante
            marcará esa posición.
          </p>
        </div>
        <SelectorUbicacionLoader
          center={mapCenter}
          value={lat != null && lng != null ? { lat, lng } : undefined}
          onChange={({ lat: nextLat, lng: nextLng }) => {
            setValue('lat', nextLat, { shouldDirty: true, shouldValidate: true })
            setValue('lng', nextLng, { shouldDirty: true, shouldValidate: true })
          }}
        />
        {lat != null && lng != null ? (
          <p className="text-xs text-[#47615a]">
            Punto seleccionado: {lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#173c3a]">Descripción *</label>
        <textarea
          {...register('descripcion')}
          rows={4}
          className={textareaClassName}
          placeholder="Describe el platillo y su importancia cultural..."
          aria-invalid={!!errors.descripcion}
        />
        {errors.descripcion && (
          <p className="text-sm text-destructive">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#173c3a]">Dificultad</label>
          <select {...register('dificultad')} className={selectClassName}>
            <option value="facil">Fácil</option>
            <option value="medio">Media</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#173c3a]">Tiempo (min) *</label>
          <Input
            type="number"
            {...register('tiempoPreparacion', { valueAsNumber: true })}
            aria-invalid={!!errors.tiempoPreparacion}
            className={inputClassName}
          />
          {errors.tiempoPreparacion && (
            <p className="text-sm text-[#b5432a]">{errors.tiempoPreparacion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#173c3a]">Porciones *</label>
          <Input
            type="number"
            {...register('porciones', { valueAsNumber: true })}
            aria-invalid={!!errors.porciones}
            className={inputClassName}
          />
          {errors.porciones && <p className="text-sm text-[#b5432a]">{errors.porciones.message}</p>}
        </div>
      </div>
    </div>
  )
}
