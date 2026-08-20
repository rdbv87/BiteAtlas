'use client'

import { useState } from 'react'

interface UploadImagenProps {
  onUpload: (file: File) => void
  onDelete: (index: number) => void
  previews: string[]
}

export function UploadImagen({ onUpload, onDelete, previews }: UploadImagenProps) {
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (previews.length >= 10) {
      setError('Máximo 10 imágenes por aporte.')
      return
    }

    setError(null)
    onUpload(file)
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-[#173c3a]">Imágenes de la receta</label>
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-dashed border-[#173c3a]/30 bg-white p-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full rounded-xl border border-[#173c3a]/15 bg-[#f8f5ef] px-3 py-2 text-sm text-[#173c3a] file:mr-3 file:rounded-full file:border-0 file:bg-[#173c3a] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#f5f1e8] file:transition-colors hover:file:bg-[#234c49]"
          />
          <p className="mt-3 text-xs text-[#47615a]">
            Sube hasta 10 imágenes en formato JPG o PNG.
          </p>
        </div>

        {error ? <p className="text-sm text-[#b5432a]">{error}</p> : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map((preview, index) => (
            <div
              key={preview}
              className="group relative overflow-hidden rounded-2xl border border-[#173c3a]/10 bg-white p-1"
            >
              <img
                src={preview}
                alt={`Vista previa ${index + 1}`}
                className="h-24 w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => onDelete(index)}
                className="absolute right-2 top-2 rounded-full bg-[#173c3a]/85 px-2 py-1 text-xs text-white transition-colors hover:bg-[#173c3a]"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {previews.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#173c3a]/20 bg-[#f5f1e8] px-4 py-3 text-sm text-[#47615a]">
            Aun no agregas imagenes. Incluye al menos una foto para continuar.
          </p>
        ) : null}
      </div>
    </div>
  )
}
