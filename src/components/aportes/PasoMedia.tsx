'use client'

import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadImagen } from './UploadImagen'
import type { FormData } from './FormularioAporte'

interface PasoMediaProps {
  form: UseFormReturn<FormData>
  imageFiles: File[]
  onFilesChange: (files: File[]) => void
}

const inputClassName =
  'h-11 rounded-xl border-[#173c3a]/15 bg-white px-3 text-sm text-[#173c3a] placeholder:text-[#47615a]/70 focus-visible:border-[#e8754f] focus-visible:ring-3 focus-visible:ring-[#e8754f]/25'

export function PasoMedia({ form, imageFiles, onFilesChange }: PasoMediaProps) {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = form

  const [previews, setPreviews] = useState<string[]>(getValues('imagenes') || [])

  const handleUpload = (file: File) => {
    const previewUrl = URL.createObjectURL(file)
    const nuevos = [...previews, previewUrl]
    setPreviews(nuevos)
    onFilesChange([...imageFiles, file])
    setValue('imagenes', nuevos, { shouldValidate: true })
  }

  const handleDelete = (index: number) => {
    const nuevos = previews.filter((_, i) => i !== index)
    setPreviews(nuevos)
    onFilesChange(imageFiles.filter((_, i) => i !== index))
    setValue('imagenes', nuevos, { shouldValidate: true })
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">Paso 4</p>
        <h3 className="font-editorial mt-2 text-3xl leading-[1.03] tracking-[-0.02em] text-[#173c3a]">
          Soporte visual de la receta
        </h3>
      </div>

      <div>
        <UploadImagen onUpload={handleUpload} onDelete={handleDelete} previews={previews} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#173c3a]">Video de la receta (opcional)</label>
        <Input
          placeholder="https://youtu.be/..."
          {...register('video')}
          aria-invalid={!!errors.video}
          className={inputClassName}
        />
        <p className="text-xs text-[#47615a]">
          Incluye un enlace corto de apoyo (YouTube o Vimeo).
        </p>
        {errors.video ? <p className="text-sm text-[#b5432a]">{errors.video.message}</p> : null}
      </div>
    </div>
  )
}
