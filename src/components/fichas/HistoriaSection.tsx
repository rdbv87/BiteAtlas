import { Sparkles, BookOpen } from 'lucide-react'

interface HistoriaSectionProps {
  contenido?: string
  leyendaOrigen?: string
}

export function HistoriaSection({ contenido, leyendaOrigen }: HistoriaSectionProps) {
  if (!contenido && !leyendaOrigen) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No hay información histórica ni leyendas disponibles para este platillo.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {contenido && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-semibold font-heading text-[#173c3a]">
              Contexto Histórico
            </h3>
          </div>
          <div className="prose prose-sm max-w-none bg-muted/30 rounded-2xl p-5 border border-[#173c3a]/10">
            <p className="text-base leading-relaxed font-editorial text-foreground/90">
              {contenido}
            </p>
          </div>
        </div>
      )}

      {leyendaOrigen && (
        <div className="relative overflow-hidden rounded-2xl border border-[#e8754f]/30 bg-linear-to-br from-[#faf4ec] via-[#fdfbf7] to-[#f4ebe1] p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#b5432a] mb-3">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs uppercase tracking-[0.22em] font-semibold">
              Mito y Tradición Oral
            </h4>
          </div>
          <p className="text-xs text-[#47615a] mb-3 italic">
            Relato popular transmitido entre generaciones sin registro histórico formal:
          </p>
          <div className="relative pl-4 border-l-2 border-[#e8754f]">
            <p className="text-sm sm:text-base leading-relaxed font-editorial italic text-[#173c3a]/90">
              &ldquo;{leyendaOrigen}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Decorative element */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xl">✨</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <p className="text-xs text-muted-foreground text-center italic">
        Cada platillo cuenta la historia y la imaginación de un pueblo
      </p>
    </div>
  )
}
