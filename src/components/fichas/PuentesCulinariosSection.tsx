'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitFork,
  Compass,
  History,
  Flame,
  Leaf,
  Plus,
  ShieldCheck,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PuenteCulinario, TipoVinculoPuente } from '@/types'

interface PuentesCulinariosSectionProps {
  puentes: PuenteCulinario[]
  onProponerPuente: (data: {
    destinoPlatilloId: string
    tipoVinculo: TipoVinculoPuente
    justificacionAntropologica: string
    fuentes?: string[]
    creadoPorId: string
    creadoPorNombre?: string
  }) => Promise<unknown>
  currentUserId?: string | null
  currentUserName?: string | null
}

const TIPO_VINCULO_META: Record<
  TipoVinculoPuente,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  migracion: {
    label: 'Ruta de Migración',
    icon: Compass,
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  evolucion_historica: {
    label: 'Evolución Histórica',
    icon: History,
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  ingrediente_compartido: {
    label: 'Ingrediente Compartido',
    icon: Leaf,
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  tecnica_comun: {
    label: 'Técnica Ancestral Común',
    icon: Flame,
    color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  },
}

export function PuentesCulinariosSection({
  puentes,
  onProponerPuente,
  currentUserId,
  currentUserName,
}: PuentesCulinariosSectionProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [destinoId, setDestinoId] = useState('')
  const [tipoVinculo, setTipoVinculo] = useState<TipoVinculoPuente>('migracion')
  const [justificacion, setJustificacion] = useState('')
  const [fuentes, setFuentes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!destinoId.trim() || justificacion.trim().length < 10) return

    setIsSubmitting(true)
    try {
      await onProponerPuente({
        destinoPlatilloId: destinoId.trim(),
        tipoVinculo,
        justificacionAntropologica: justificacion.trim(),
        fuentes: fuentes.trim() ? fuentes.split('\n').filter(Boolean) : undefined,
        creadoPorId: currentUserId || 'anonimo',
        creadoPorNombre: currentUserName || 'Explorador Culinario',
      })
      setDestinoId('')
      setJustificacion('')
      setFuentes('')
      setMostrarFormulario(false)
      setMensajeExito('¡Puente culinario propuesto! Será evaluado por los Guardianes.')
      setTimeout(() => setMensajeExito(null), 4000)
    } catch {
      // Error manejado por el hook
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header y Acción */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <GitFork className="w-5 h-5 text-primary" />
            Puentes Culinarios
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Red de conexiones culturales, rutas migratorias y técnicas compartidas con otras cocinas
            del mundo.
          </p>
        </div>

        <Button
          size="sm"
          variant={mostrarFormulario ? 'outline' : 'default'}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          {mostrarFormulario ? 'Cancelar' : 'Conectar Receta'}
        </Button>
      </div>

      {mensajeExito && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          {mensajeExito}
        </motion.div>
      )}

      {/* Formulario de Propuesta */}
      <AnimatePresence>
        {mostrarFormulario && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-4 border rounded-xl bg-card space-y-4 shadow-sm"
          >
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-primary" />
              Proponer Conexión Culinaria
            </h4>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                ID o Nombre de la Receta Conectada
              </label>
              <input
                type="text"
                value={destinoId}
                onChange={(e) => setDestinoId(e.target.value)}
                placeholder="ej: ceviche-peruano o birria-jalisco"
                required
                className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Tipo de Vínculo Antropológico
              </label>
              <select
                value={tipoVinculo}
                onChange={(e) => setTipoVinculo(e.target.value as TipoVinculoPuente)}
                className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="migracion">🧭 Ruta de Migración (Diáspora / Comercio)</option>
                <option value="evolucion_historica">⏳ Evolución Histórica (Linaje directo)</option>
                <option value="ingrediente_compartido">
                  🌿 Ingrediente Compartido (Botánica / Ecosistema)
                </option>
                <option value="tecnica_comun">
                  🔥 Técnica Ancestral Común (Cocción / Fermentación)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Justificación Antropológica y Cultural (mínimo 10 caracteres)
              </label>
              <textarea
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                placeholder="Explica cómo se cruzaron estas tradiciones culinarias, la evidencia histórica o el linaje de la técnica..."
                rows={3}
                required
                minLength={10}
                className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Fuentes o Referencias (opcional, una por línea)
              </label>
              <textarea
                value={fuentes}
                onChange={(e) => setFuentes(e.target.value)}
                placeholder="Libros, cronistas de Indias, estudios etnográficos, tradición oral..."
                rows={2}
                className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Publicar Propuesta'}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Lista de Puentes */}
      {puentes.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-xl bg-muted/20">
          <GitFork className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">
            Aún no hay puentes culinarios registrados
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Sé el primero en documentar los lazos culturales de esta receta con otras regiones del
            mundo.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {puentes.map((puente) => {
            const meta = TIPO_VINCULO_META[puente.tipoVinculo] || TIPO_VINCULO_META.migracion
            const Icon = meta.icon
            const esAprobado = puente.estado === 'aprobado'

            return (
              <motion.div
                key={puente.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-xl bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${meta.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {meta.label}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Conecta con:{' '}
                      <strong className="text-foreground">{puente.destinoPlatilloId}</strong>
                    </span>
                  </div>

                  {esAprobado ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      Validado por Guardianes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-500 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Clock className="w-3 h-3" />
                      En Curaduría
                    </span>
                  )}
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed">
                  {puente.justificacionAntropologica}
                </p>

                {puente.fuentes && puente.fuentes.length > 0 && (
                  <div className="pt-1 border-t border-border/50">
                    <p className="text-[11px] font-medium text-muted-foreground mb-1">Fuentes:</p>
                    <ul className="text-xs text-muted-foreground/80 space-y-0.5">
                      {puente.fuentes.map((f, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-primary shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
