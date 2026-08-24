'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ValidacionRaicesReview, VotoConsensoReview } from '@/types'
import type { MetricasValidacion } from '@/services/hooks/useComunidadPlatillo'

interface ValidacionRaicesSectionProps {
  validaciones: ValidacionRaicesReview[]
  metricas: MetricasValidacion
  onEnviarValidacion: (data: {
    autorId: string
    autorNombre?: string
    fidelidadCultural: number
    claridadInstrucciones: number
    riquezaHistorica: number
    comentarioCualitativo: string
    referencias?: string[]
    votoConsenso?: VotoConsensoReview
  }) => Promise<unknown>
  currentUserId?: string | null
  currentUserName?: string | null
}

const VEREDICTO_META: Record<
  VotoConsensoReview,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  valida: {
    label: 'Auténtica y Verificada',
    icon: CheckCircle,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  requiere_ajustes: {
    label: 'Requiere Ajustes Menores',
    icon: AlertTriangle,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  no_autentica: {
    label: 'Discrepancia Etnográfica',
    icon: XCircle,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  },
}

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (val: number) => void
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-primary font-bold">{value} / 5</span>
      </div>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 text-muted-foreground/40 hover:text-amber-400 focus:outline-none transition-colors"
          >
            <Star
              className={`w-5 h-5 ${
                star <= value ? 'text-amber-400 fill-amber-400' : 'stroke-current'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function ValidacionRaicesSection({
  validaciones,
  metricas,
  onEnviarValidacion,
  currentUserId,
  currentUserName,
}: ValidacionRaicesSectionProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [fidelidad, setFidelidad] = useState(5)
  const [claridad, setClaridad] = useState(5)
  const [riqueza, setRiqueza] = useState(5)
  const [comentario, setComentario] = useState('')
  const [referencias, setReferencias] = useState('')
  const [votoConsenso, setVotoConsenso] = useState<VotoConsensoReview>('valida')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (comentario.trim().length < 10) return

    setIsSubmitting(true)
    try {
      await onEnviarValidacion({
        autorId: currentUserId || 'anonimo',
        autorNombre: currentUserName || 'Curador Comunitario',
        fidelidadCultural: fidelidad,
        claridadInstrucciones: claridad,
        riquezaHistorica: riqueza,
        comentarioCualitativo: comentario.trim(),
        referencias: referencias.trim() ? referencias.split('\n').filter(Boolean) : undefined,
        votoConsenso,
      })
      setComentario('')
      setReferencias('')
      setFidelidad(5)
      setClaridad(5)
      setRiqueza(5)
      setMostrarFormulario(false)
      if (currentUserId && currentUserId !== 'anonimo') {
        setMensajeExito('¡Evaluación registrada! Has ganado +25 XP antropológicos.')
      } else {
        setMensajeExito(
          '¡Evaluación registrada! Inicia sesión para acumular puntos de experiencia.'
        )
      }
      setTimeout(() => setMensajeExito(null), 4000)
    } catch {
      // Error manejado por hook
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Validación de Raíces (Peer Review)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curaduría colectiva con rigor etnográfico: autenticidad, técnicas y contexto
            antropológico.
          </p>
        </div>

        <Button
          size="sm"
          variant={mostrarFormulario ? 'outline' : 'default'}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          {mostrarFormulario ? 'Cancelar' : 'Evaluar Receta'}
        </Button>
      </div>

      {/* Tarjeta de Métricas Promedio */}
      {metricas.totalReviews > 0 && (
        <div className="p-4 border rounded-xl bg-card/60 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rúbrica Antropológica Promedio
            </span>
            <span className="text-xs text-muted-foreground">
              {metricas.totalReviews} {metricas.totalReviews === 1 ? 'evaluación' : 'evaluaciones'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Fidelidad Cultural</p>
              <p className="text-xl font-bold text-primary">{metricas.fidelidadCultural} / 5</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Claridad de Pasos</p>
              <p className="text-xl font-bold text-primary">{metricas.claridadInstrucciones} / 5</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Riqueza Histórica</p>
              <p className="text-xl font-bold text-primary">{metricas.riquezaHistorica} / 5</p>
            </div>
          </div>
        </div>
      )}

      {mensajeExito && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          {mensajeExito}
        </motion.div>
      )}

      {/* Formulario de Evaluación */}
      <AnimatePresence>
        {mostrarFormulario && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-4 border rounded-xl bg-card space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                Nueva Validación de Raíces
              </h4>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                +25 XP Antropológicos
              </span>
            </div>

            {!currentUserId && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs">
                ⚠️ Estás evaluando como anónimo. Inicia sesión para registrar los 25 XP en tu
                perfil.
              </div>
            )}

            <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
              <RatingInput
                label="Fidelidad Cultural y Tradición"
                value={fidelidad}
                onChange={setFidelidad}
              />
              <RatingInput
                label="Claridad del Paso a Paso e Instrucciones"
                value={claridad}
                onChange={setClaridad}
              />
              <RatingInput
                label="Riqueza del Contexto Histórico y Antropológico"
                value={riqueza}
                onChange={setRiqueza}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Dictamen de Consenso
              </label>
              <select
                value={votoConsenso}
                onChange={(e) => setVotoConsenso(e.target.value as VotoConsensoReview)}
                className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="valida">✅ Auténtica y verificada</option>
                <option value="requiere_ajustes">
                  ⚠️ Requiere ajustes menores en técnica/historia
                </option>
                <option value="no_autentica">❌ Discrepancia etnográfica significativa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Comentario Crítico y Etnográfico (mínimo 10 caracteres)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Detalla tu evaluación: ¿Los ingredientes corresponden a la región? ¿La técnica es auténtica?..."
                rows={3}
                required
                minLength={10}
                className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Referencias bibliográficas o fuentes orales (opcional)
              </label>
              <textarea
                value={referencias}
                onChange={(e) => setReferencias(e.target.value)}
                placeholder="Estudios gastronómicos, testimonios de cocineras tradicionales..."
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
                {isSubmitting ? 'Enviando...' : 'Emitir Evaluación'}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Lista de Validaciones */}
      {validaciones.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-xl bg-muted/20">
          <Award className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Sin evaluaciones antropológicas aún</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Ayuda a preservar el patrimonio culinario evaluando el rigor cultural y la fidelidad de
            esta receta.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {validaciones.map((rev) => {
            const veredicto = VEREDICTO_META[rev.votoConsenso] || VEREDICTO_META.valida
            const IconoVeredicto = veredicto.icon

            return (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-xl bg-card/60 backdrop-blur-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-foreground">
                    {rev.autorNombre || 'Curador Comunitario'}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${veredicto.color}`}
                  >
                    <IconoVeredicto className="w-3 h-3" />
                    {veredicto.label}
                  </span>
                </div>

                {/* Puntajes individuales */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span>
                    Fidelidad: <strong className="text-primary">{rev.fidelidadCultural}/5</strong>
                  </span>
                  <span>
                    Claridad:{' '}
                    <strong className="text-primary">{rev.claridadInstrucciones}/5</strong>
                  </span>
                  <span>
                    Historia: <strong className="text-primary">{rev.riquezaHistorica}/5</strong>
                  </span>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed">
                  {rev.comentarioCualitativo}
                </p>

                {rev.referencias && rev.referencias.length > 0 && (
                  <div className="pt-1 border-t border-border/50">
                    <p className="text-[11px] font-medium text-muted-foreground mb-0.5">
                      Referencias:
                    </p>
                    <ul className="text-xs text-muted-foreground/80 space-y-0.5">
                      {rev.referencias.map((ref, i) => (
                        <li key={i} className="truncate">
                          • {ref}
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
