'use client'

import { ArrowUpRight, Clock3, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Pais, Platillo } from '@/types'

interface PanelPaisProps {
  pais: Pais
  recetas: Platillo[]
  onClose: () => void
  onSelectRecipe: (recipe: Platillo) => void
}

export function PanelPais({ pais, recetas, onClose, onSelectRecipe }: PanelPaisProps) {
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

          <div className="border-t pt-5">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                  Cuaderno de campo
                </p>
                <h3 className="mt-1 font-heading text-lg">Platos del territorio</h3>
              </div>
              <span className="text-xs text-muted-foreground">{recetas.length} recetas</span>
            </div>

            {recetas.length > 0 ? (
              <div className="space-y-2">
                {recetas.map((recipe) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => onSelectRecipe(recipe)}
                    className="group flex w-full items-center justify-between gap-3 border border-border bg-muted/30 p-3 text-left transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-heading font-semibold">
                        {recipe.nombre}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" /> {recipe.tiempoPreparacion ?? '—'} min ·{' '}
                        {recipe.dificultad}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Todavía estamos cartografiando sus recetas.
              </p>
            )}

            <Button variant="outline" className="mt-4 w-full" size="lg" onClick={onClose}>
              Seguir explorando el mapa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
