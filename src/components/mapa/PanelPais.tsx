'use client'

import { X, MapPin, Utensils } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Pais } from '@/types'

interface PanelPaisProps {
  pais: Pais
  onClose: () => void
}

export function PanelPais({ pais, onClose }: PanelPaisProps) {
  const router = useRouter()

  return (
    <div className="absolute top-4 right-4 bottom-4 w-full max-w-sm z-[1000] animate-in slide-in-from-right duration-300">
      <Card className="h-full flex flex-col shadow-2xl border-2">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-2xl font-heading">{pais.nombre}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {pais.codigoISO} · {pais.continente}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {/* Descripción */}
          {pais.descripcion && (
            <p className="text-sm text-muted-foreground font-editorial leading-relaxed">
              {pais.descripcion}
            </p>
          )}

          {/* Imagen */}
          {pais.imagen && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img src={pais.imagen} alt={pais.nombre} className="object-cover w-full h-full" />
            </div>
          )}

          {/* Acciones */}
          <div className="space-y-2 pt-4">
            <Button className="w-full gap-2" size="lg" onClick={() => router.push('/honduras')}>
              <Utensils className="w-4 h-4" />
              Explorar Platillos
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Ver Regiones
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
