import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, ChefHat } from 'lucide-react'
import type { Platillo } from '@/types'

interface ResumenAporteProps {
  platillo: Platillo
}

export function ResumenAporte({ platillo }: ResumenAporteProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-heading">{platillo.nombre}</CardTitle>
            <p className="text-sm text-muted-foreground">Tu aporte está pendiente de revisión</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          {platillo.tiempoPreparacion && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{platillo.tiempoPreparacion} min</span>
            </div>
          )}
          {platillo.porciones && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{platillo.porciones} porciones</span>
            </div>
          )}
          <span className="px-2 py-0.5 rounded-full bg-muted text-xs capitalize">
            {platillo.dificultad}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">{platillo.descripcion}</p>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm">
            Tu aporte será revisado por nuestro equipo antes de ser publicado.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Te notificaremos cuando sea aprobado.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
