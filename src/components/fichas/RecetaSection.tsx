'use client'

import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'

interface RecetaSectionProps {
  instrucciones: string[]
  ingredientes: { ingredienteId: string; cantidad: string; unidad: string }[]
  guarniciones?: string[]
}

export function RecetaSection({ instrucciones, ingredientes, guarniciones }: RecetaSectionProps) {
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

      {/* Guarniciones y acompañantes */}
      {guarniciones && guarniciones.length > 0 && (
        <div className="rounded-2xl border border-[#173c3a]/10 bg-[#f9f7f2] p-5">
          <div className="flex items-center gap-2 mb-3">
            <UtensilsCrossed className="w-4 h-4 text-[#e8754f]" />
            <h4 className="text-sm font-semibold text-[#173c3a]">Acompañamientos tradicionales</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {guarniciones.map((guarnicion, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full border border-[#173c3a]/15 bg-white px-3.5 py-1.5 text-xs font-medium text-[#173c3a] shadow-sm"
              >
                {guarnicion}
              </span>
            ))}
          </div>
        </div>
      )}

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
