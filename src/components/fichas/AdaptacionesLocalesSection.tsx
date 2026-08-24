'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  ArrowRightLeft,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AdaptacionLocal } from '@/types'

interface AdaptacionesLocalesSectionProps {
  adaptaciones: AdaptacionLocal[]
  onProponerAdaptacion: (data: {
    autorId: string
    autorNombre?: string
    comunidadRegion: string
    ingredienteOriginal?: string
    ingredienteSustituto?: string
    tecnicaVariante?: string
    justificacionCultural: string
  }) => Promise<unknown>
  onVotarAdaptacion: (adaptacionId: string, tipoVoto: 'favor' | 'contra') => Promise<void>
  currentUserId?: string | null
  currentUserName?: string | null
}

export function AdaptacionesLocalesSection({
  adaptaciones,
  onProponerAdaptacion,
  onVotarAdaptacion,
  currentUserId,
  currentUserName,
}: AdaptacionesLocalesSectionProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [comunidadRegion, setComunidadRegion] = useState('')
  const [ingredienteOriginal, setIngredienteOriginal] = useState('')
  const [ingredienteSustituto, setIngredienteSustituto] = useState('')
  const [tecnicaVariante, setTecnicaVariante] = useState('')
  const [justificacionCultural, setJustificacionCultural] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comunidadRegion.trim() || justificacionCultural.trim().length < 10) return

    setIsSubmitting(true)
    try {
      await onProponerAdaptacion({
        autorId: currentUserId || 'anonimo',
        autorNombre: currentUserName || 'Cocinero Tradicional',
        comunidadRegion: comunidadRegion.trim(),
        ingredienteOriginal: ingredienteOriginal.trim() || undefined,
        ingredienteSustituto: ingredienteSustituto.trim() || undefined,
        tecnicaVariante: tecnicaVariante.trim() || undefined,
        justificacionCultural: justificacionCultural.trim(),
      })
      setComunidadRegion('')
      setIngredienteOriginal('')
      setIngredienteSustituto('')
      setTecnicaVariante('')
      setJustificacionCultural('')
      setMostrarFormulario(false)
      setMensajeExito('¡Variación local compartida con la comunidad!')
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
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            Adaptaciones y Variaciones Locales
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sustitutos endémicos, variantes de comunidad y giros regionales transmitidos por
            tradición oral.
          </p>
        </div>

        <Button
          size="sm"
          variant={mostrarFormulario ? 'outline' : 'default'}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          {mostrarFormulario ? 'Cancelar' : 'Aportar Variante'}
        </Button>
      </div>

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

      {/* Formulario */}
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
              <MapPin className="w-4 h-4 text-primary" />
              Sugerir Sustitución o Variante Regional
            </h4>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Comunidad, Pueblo o Región
              </label>
              <input
                type="text"
                value={comunidadRegion}
                onChange={(e) => setComunidadRegion(e.target.value)}
                placeholder="ej: Costa Chica de Guerrero o Valle Sagrado"
                required
                className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Ingrediente de la receta base
                </label>
                <input
                  type="text"
                  value={ingredienteOriginal}
                  onChange={(e) => setIngredienteOriginal(e.target.value)}
                  placeholder="ej: Epazote fresco"
                  className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Sustituto local en tu comunidad
                </label>
                <input
                  type="text"
                  value={ingredienteSustituto}
                  onChange={(e) => setIngredienteSustituto(e.target.value)}
                  placeholder="ej: Hoja de aguacate o Pipicha"
                  className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Técnica o paso distintivo (opcional)
              </label>
              <input
                type="text"
                value={tecnicaVariante}
                onChange={(e) => setTecnicaVariante(e.target.value)}
                placeholder="ej: Cocción en comal de barro o tatemado directo a la leña"
                className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Contexto Cultural y Justificación (mínimo 10 caracteres)
              </label>
              <textarea
                value={justificacionCultural}
                onChange={(e) => setJustificacionCultural(e.target.value)}
                placeholder="¿Por qué se usa este ingrediente? ¿Qué simbolismo o disponibilidad estacional tiene en tu comunidad?"
                rows={3}
                required
                minLength={10}
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
                {isSubmitting ? 'Enviando...' : 'Compartir Variante'}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Lista de Adaptaciones */}
      {adaptaciones.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-xl bg-muted/20">
          <ArrowRightLeft className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Sin adaptaciones locales aún</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            ¿En tu comunidad preparan este platillo con ingredientes o técnicas distintas?
            ¡Compártelo!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {adaptaciones.map((adaptacion) => {
            const esAprobada = adaptacion.estado === 'aprobado'

            return (
              <motion.div
                key={adaptacion.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-xl bg-card/60 backdrop-blur-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{adaptacion.comunidadRegion}</span>
                  </div>

                  {esAprobada && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      Validada por Guardianes
                    </span>
                  )}
                </div>

                {/* Comparación de Ingredientes */}
                {(adaptacion.ingredienteOriginal || adaptacion.ingredienteSustituto) && (
                  <div className="p-2.5 rounded-lg bg-muted/50 text-xs flex items-center gap-2 flex-wrap">
                    {adaptacion.ingredienteOriginal && (
                      <span className="text-muted-foreground line-through">
                        {adaptacion.ingredienteOriginal}
                      </span>
                    )}
                    <span className="text-primary font-bold">➔</span>
                    <span className="font-semibold text-foreground">
                      {adaptacion.ingredienteSustituto}
                    </span>
                  </div>
                )}

                {adaptacion.tecnicaVariante && (
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Técnica variante:</strong>{' '}
                    {adaptacion.tecnicaVariante}
                  </p>
                )}

                <p className="text-sm text-foreground/90 leading-relaxed">
                  {adaptacion.justificacionCultural}
                </p>

                {/* Votación Comunitaria */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <span>Por {adaptacion.autorNombre || 'Cocinero de la comunidad'}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onVotarAdaptacion(adaptacion.id, 'favor')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                      title="Votar a favor"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{adaptacion.votosFavor || 0}</span>
                    </button>
                    <button
                      onClick={() => onVotarAdaptacion(adaptacion.id, 'contra')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Votar en contra"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{adaptacion.votosContra || 0}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
