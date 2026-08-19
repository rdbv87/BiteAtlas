interface HistoriaSectionProps {
  contenido?: string
}

export function HistoriaSection({ contenido }: HistoriaSectionProps) {
  if (!contenido) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No hay información histórica disponible para este platillo.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-heading mb-4">Contexto Histórico</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-base leading-relaxed font-editorial text-foreground/90">{contenido}</p>
        </div>
      </div>

      {/* Decorative element */}
      <div className="flex items-center gap-4 py-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-2xl">🍳</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <p className="text-xs text-muted-foreground text-center italic">
        Cada platillo cuenta la historia de un pueblo
      </p>
    </div>
  )
}
