'use client'

import { useState } from 'react'

interface RecetaSectionProps {
  instrucciones: string[]
  ingredientes: { ingredienteId: string; cantidad: string; unidad: string }[]
}

export function RecetaSection({ instrucciones, ingredientes }: RecetaSectionProps) {
  const [pasosCompletados, setPasosCompletados] = useState<number[]>([])

  const alternarPaso = (index: number) => {
    setPasosCompletados((actuales) =>
      actuales.includes(index) ? actuales.filter((paso) => paso !== index) : [...actuales, index]
    )
  }

  return (
    <div className="space-y-8">
      {/* Ingredientes */}
      <div>
        <h3 className="text-lg font-semibold font-heading mb-4">Ingredientes</h3>
        <div className="bg-muted/50 rounded-lg p-4">
          <ul className="space-y-2">
            {ingredientes.map((ing, index) => (
              <li key={index} className="flex justify-between items-center text-sm">
                <span className="font-medium">
                  {ing.ingredienteId.replace(/-/g, ' ').replace('ing ', '')}
                </span>
                <span className="text-muted-foreground">
                  {ing.cantidad} {ing.unidad}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Instrucciones */}
      <div>
        <h3 className="text-lg font-semibold font-heading mb-4">Preparación</h3>
        <ol className="space-y-3">
          {instrucciones.map((paso, index) => (
            <li key={index} className="flex gap-4">
              <button
                type="button"
                onClick={() => alternarPaso(index)}
                aria-label={`Marcar paso ${index + 1} como completado`}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  pasosCompletados.includes(index)
                    ? 'bg-[#315955] text-white'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {pasosCompletados.includes(index) ? '✓' : index + 1}
              </button>
              <p
                className={`pt-1 text-sm leading-relaxed transition-opacity ${
                  pasosCompletados.includes(index)
                    ? 'text-muted-foreground line-through opacity-70'
                    : ''
                }`}
              >
                {paso}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">
          {pasosCompletados.length} de {instrucciones.length} pasos completados
        </p>
      </div>
    </div>
  )
}
