'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { aprobarPuenteCulinario, aprobarAdaptacionLocal } from '@/services/comunidad'
import { Button } from '@/components/ui/button'
import {
  Shield,
  GitFork,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from 'lucide-react'
import type { PuenteCulinario, AdaptacionLocal } from '@/types'

interface PanelCuraduriaProps {
  currentUserId: string
  esAdmin?: boolean
}

type TabCuraduria = 'puentes' | 'adaptaciones'

export function PanelCuraduria({ currentUserId, esAdmin = false }: PanelCuraduriaProps) {
  const [tabActivo, setTabActivo] = useState<TabCuraduria>('puentes')
  const [puentesPendientes, setPuentesPendientes] = useState<PuenteCulinario[]>([])
  const [adaptacionesPendientes, setAdaptacionesPendientes] = useState<AdaptacionLocal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mensaje, setMensaje] = useState<string | null>(null)

  const cargarPropuestasPendientes = async () => {
    if (!firestore) return
    setIsLoading(true)

    try {
      // Puentes pendientes
      const qPuentes = query(
        collection(firestore, 'puentesCulinarios'),
        where('estado', '==', 'pendiente')
      )
      const snapPuentes = await getDocs(qPuentes)
      const puentes = snapPuentes.docs.map((d) => ({ ...d.data(), id: d.id }) as PuenteCulinario)
      setPuentesPendientes(puentes)

      // Adaptaciones pendientes (en Firestore, usando collectionGroup o consultas directas)
      const snapAdap = await getDocs(
        query(collection(firestore, 'adaptacionesLocales'), where('estado', '==', 'pendiente'))
      ).catch(() => ({ docs: [] }))
      const adaptaciones = snapAdap.docs.map((d) => ({ ...d.data(), id: d.id }) as AdaptacionLocal)
      setAdaptacionesPendientes(adaptaciones)
    } catch (err) {
      console.error('Error al cargar propuestas para curaduría:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void cargarPropuestasPendientes()
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  const handleAprobarPuente = async (puenteId: string) => {
    try {
      const { aprobado } = await aprobarPuenteCulinario(puenteId, currentUserId, esAdmin)
      setMensaje(
        aprobado
          ? '¡Puente culinario aprobado y publicado en el mapa!'
          : 'Voto de Guardián registrado. Esperando segunda validación.'
      )
      setPuentesPendientes((prev) => prev.filter((p) => p.id !== puenteId))
      setTimeout(() => setMensaje(null), 4000)
    } catch (err) {
      console.error(err)
    }
  }

  const handleRechazarPuente = async (puenteId: string) => {
    if (!firestore) return
    try {
      await updateDoc(doc(firestore, 'puentesCulinarios', puenteId), {
        estado: 'rechazado',
        updatedAt: new Date(),
      })
      setPuentesPendientes((prev) => prev.filter((p) => p.id !== puenteId))
      setMensaje('Puente culinario rechazado por no cumplir criterios etnográficos.')
      setTimeout(() => setMensaje(null), 4000)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAprobarAdaptacion = async (platilloId: string, adaptacionId: string) => {
    try {
      const { aprobado } = await aprobarAdaptacionLocal(
        platilloId,
        adaptacionId,
        currentUserId,
        esAdmin
      )
      setMensaje(
        aprobado ? '¡Adaptación local validada y publicada!' : 'Voto de Guardián registrado.'
      )
      setAdaptacionesPendientes((prev) => prev.filter((a) => a.id !== adaptacionId))
      setTimeout(() => setMensaje(null), 4000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Panel de Curaduría de Guardianes
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Revisión colaborativa con rigor antropológico. 2 aprobaciones de Guardianes publican
            automáticamente una propuesta.
          </p>
        </div>

        {/* Selector de pestañas */}
        <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl border border-border/50">
          <button
            onClick={() => setTabActivo('puentes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              tabActivo === 'puentes'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-primary" />
            <span>Puentes Culinarios ({puentesPendientes.length})</span>
          </button>
          <button
            onClick={() => setTabActivo('adaptaciones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              tabActivo === 'adaptaciones'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>Adaptaciones Locales ({adaptacionesPendientes.length})</span>
          </button>
        </div>
      </div>

      {mensaje && (
        <div className="p-3 text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {mensaje}
        </div>
      )}

      {/* Lista de Puentes Pendientes */}
      {tabActivo === 'puentes' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Cargando propuestas...
            </div>
          ) : puentesPendientes.length === 0 ? (
            <div className="p-10 text-center border border-dashed rounded-xl bg-muted/10 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto" />
              <p className="text-sm font-semibold">¡Todo al día!</p>
              <p className="text-xs text-muted-foreground">
                No hay puentes culinarios pendientes de curaduría.
              </p>
            </div>
          ) : (
            puentesPendientes.map((puente) => (
              <div key={puente.id} className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
                      {puente.tipoVinculo.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      De <strong className="text-foreground">{puente.origenPlatilloId}</strong>{' '}
                      hacia <strong className="text-foreground">{puente.destinoPlatilloId}</strong>
                    </span>
                  </div>

                  <span className="text-[11px] text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Aprobaciones: {puente.aprobacionesGuardianes?.length || 0} / 2
                  </span>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed">
                  {puente.justificacionAntropologica}
                </p>

                {puente.fuentes && puente.fuentes.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Fuentes aportadas:</strong> {puente.fuentes.join(', ')}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRechazarPuente(puente.id)}
                    className="text-rose-500 hover:text-rose-600 gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAprobarPuente(puente.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Aprobar como Guardián
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lista de Adaptaciones Pendientes */}
      {tabActivo === 'adaptaciones' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Cargando propuestas...
            </div>
          ) : adaptacionesPendientes.length === 0 ? (
            <div className="p-10 text-center border border-dashed rounded-xl bg-muted/10 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto" />
              <p className="text-sm font-semibold">¡Todo al día!</p>
              <p className="text-xs text-muted-foreground">
                No hay variaciones regionales pendientes de revisión.
              </p>
            </div>
          ) : (
            adaptacionesPendientes.map((adaptacion) => (
              <div
                key={adaptacion.id}
                className="p-5 rounded-2xl border bg-card shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-primary">
                    Comunidad: {adaptacion.comunidadRegion}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Por {adaptacion.autorNombre || 'Cocinero de la comunidad'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/50 text-xs">
                  <span className="text-muted-foreground">{adaptacion.ingredienteOriginal}</span> ➔{' '}
                  <strong className="text-foreground">{adaptacion.ingredienteSustituto}</strong>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed">
                  {adaptacion.justificacionCultural}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    onClick={() => handleAprobarAdaptacion(adaptacion.platilloId, adaptacion.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Validar Adaptación
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
