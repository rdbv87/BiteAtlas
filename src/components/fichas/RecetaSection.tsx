interface RecetaSectionProps {
  instrucciones: string[]
  ingredientes: { ingredienteId: string; cantidad: string; unidad: string }[]
}

export function RecetaSection({ instrucciones, ingredientes }: RecetaSectionProps) {
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
        <ol className="space-y-4">
          {instrucciones.map((paso, index) => (
            <li key={index} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed pt-1">{paso}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
