import { PartyPopper } from 'lucide-react'

interface FestividadesSectionProps {
  festividades?: string[]
}

export function FestividadesSection({ festividades }: FestividadesSectionProps) {
  if (!festividades || festividades.length === 0) {
    return (
      <div className="text-center py-12">
        <PartyPopper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">No hay festividades asociadas a este platillo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-heading mb-4">Festividades Asociadas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Este platillo es especialmente popular en las siguientes celebraciones:
        </p>
      </div>

      <div className="grid gap-3">
        {festividades.map((festival, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50"
          >
            <PartyPopper className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium">{festival}</span>
          </div>
        ))}
      </div>

      {/* Decorative element */}
      <div className="flex items-center gap-4 py-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-2xl">🎊</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <p className="text-xs text-muted-foreground text-center italic">
        La gastronomía une a las personas en celebración
      </p>
    </div>
  )
}
