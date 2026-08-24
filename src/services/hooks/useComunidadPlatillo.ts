'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  obtenerPuentesPorPlatillo,
  obtenerAdaptacionesPorPlatillo,
  obtenerValidacionesPorPlatillo,
  crearPuenteCulinario,
  crearAdaptacionLocal,
  votarAdaptacionLocal,
  crearValidacionRaices,
  calcularPromedioValidaciones,
} from '@/services/comunidad'
import type {
  PuenteCulinario,
  AdaptacionLocal,
  ValidacionRaicesReview,
  TipoVinculoPuente,
  VotoConsensoReview,
} from '@/types'

export interface MetricasValidacion {
  fidelidadCultural: number
  claridadInstrucciones: number
  riquezaHistorica: number
  promedioGlobal: number
  totalReviews: number
}

export function useComunidadPlatillo(platilloId: string | null) {
  const [puentes, setPuentes] = useState<PuenteCulinario[]>([])
  const [adaptaciones, setAdaptaciones] = useState<AdaptacionLocal[]>([])
  const [validaciones, setValidaciones] = useState<ValidacionRaicesReview[]>([])
  const [metricas, setMetricas] = useState<MetricasValidacion>({
    fidelidadCultural: 0,
    claridadInstrucciones: 0,
    riquezaHistorica: 0,
    promedioGlobal: 0,
    totalReviews: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const cargarDatosComunidad = useCallback(async () => {
    if (!platilloId) {
      setPuentes([])
      setAdaptaciones([])
      setValidaciones([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [puentesData, adaptacionesData, validacionesData] = await Promise.all([
        obtenerPuentesPorPlatillo(platilloId).catch(() => []),
        obtenerAdaptacionesPorPlatillo(platilloId).catch(() => []),
        obtenerValidacionesPorPlatillo(platilloId).catch(() => []),
      ])

      setPuentes(puentesData)
      setAdaptaciones(adaptacionesData)
      setValidaciones(validacionesData)
      setMetricas(calcularPromedioValidaciones(validacionesData))
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar datos comunitarios'
      setError(mensaje)
    } finally {
      setIsLoading(false)
    }
  }, [platilloId])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void cargarDatosComunidad()
    })

    return () => cancelAnimationFrame(frame)
  }, [cargarDatosComunidad])

  const proponerPuente = async (data: {
    destinoPlatilloId: string
    tipoVinculo: TipoVinculoPuente
    justificacionAntropologica: string
    fuentes?: string[]
    creadoPorId: string
    creadoPorNombre?: string
  }) => {
    if (!platilloId) return null
    setError(null)
    try {
      const nuevo = await crearPuenteCulinario({
        origenPlatilloId: platilloId,
        destinoPlatilloId: data.destinoPlatilloId,
        tipoVinculo: data.tipoVinculo,
        justificacionAntropologica: data.justificacionAntropologica,
        fuentes: data.fuentes,
        creadoPorId: data.creadoPorId,
        creadoPorNombre: data.creadoPorNombre,
      })
      setPuentes((prev) => [nuevo, ...prev])
      return nuevo
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al proponer puente culinario'
      setError(msg)
      throw err
    }
  }

  const proponerAdaptacion = async (data: {
    autorId: string
    autorNombre?: string
    comunidadRegion: string
    ingredienteOriginal?: string
    ingredienteSustituto?: string
    tecnicaVariante?: string
    justificacionCultural: string
  }) => {
    if (!platilloId) return null
    setError(null)
    try {
      const nueva = await crearAdaptacionLocal(platilloId, data)
      setAdaptaciones((prev) => [nueva, ...prev])
      return nueva
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al sugerir adaptación local'
      setError(msg)
      throw err
    }
  }

  const votarAdaptacion = async (adaptacionId: string, tipoVoto: 'favor' | 'contra') => {
    if (!platilloId) return
    try {
      const { votosFavor, votosContra } = await votarAdaptacionLocal(
        platilloId,
        adaptacionId,
        tipoVoto
      )
      setAdaptaciones((prev) =>
        prev.map((item) => (item.id === adaptacionId ? { ...item, votosFavor, votosContra } : item))
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al registrar voto'
      setError(msg)
    }
  }

  const enviarValidacionRaices = async (data: {
    autorId: string
    autorNombre?: string
    fidelidadCultural: number
    claridadInstrucciones: number
    riquezaHistorica: number
    comentarioCualitativo: string
    referencias?: string[]
    votoConsenso?: VotoConsensoReview
  }) => {
    if (!platilloId) return null
    setError(null)
    try {
      const nueva = await crearValidacionRaices(platilloId, {
        autorId: data.autorId,
        autorNombre: data.autorNombre,
        fidelidadCultural: data.fidelidadCultural,
        claridadInstrucciones: data.claridadInstrucciones,
        riquezaHistorica: data.riquezaHistorica,
        comentarioCualitativo: data.comentarioCualitativo,
        referencias: data.referencias,
        votoConsenso: data.votoConsenso ?? 'valida',
      })
      const listaActualizada = [nueva, ...validaciones]
      setValidaciones(listaActualizada)
      setMetricas(calcularPromedioValidaciones(listaActualizada))
      return nueva
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al enviar validación de raíces'
      setError(msg)
      throw err
    }
  }

  return {
    puentes,
    adaptaciones,
    validaciones,
    metricas,
    isLoading,
    error,
    recargar: cargarDatosComunidad,
    proponerPuente,
    proponerAdaptacion,
    votarAdaptacion,
    enviarValidacionRaices,
  }
}
