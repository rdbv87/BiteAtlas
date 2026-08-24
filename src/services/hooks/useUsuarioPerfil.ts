'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getUsuarioPerfil,
  crearOActualizarPerfil,
  actualizarPerfilUsuario,
  UMBRALES_ROLES,
} from '@/services/comunidad'

import { useAuth } from '@/services/hooks/useAuth'
import type { UsuarioPerfil, RolUsuario } from '@/types'

export interface SiguienteRangoInfo {
  siguienteRol: RolUsuario | null
  puntosFaltantes: number
  aportesFaltantes: number
  porcentajeProgreso: number
}

export function useUsuarioPerfil() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const cargarPerfil = useCallback(async () => {
    if (!user) {
      setPerfil(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const perfilFallback: UsuarioPerfil = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Explorador Culinario',
      photoURL: user.photoURL || undefined,
      rol: 'novicio',
      puntosAntropologicos: 0,
      puntosCuraduria: 0,
      aportesValidados: 0,
      regionesEspecialidad: [],
      insignias: [],
      createdAt: new Date(),
    }

    try {
      let data = await getUsuarioPerfil(user.uid)
      if (!data) {
        // Inicializar perfil si es nuevo usuario
        try {
          data = await crearOActualizarPerfil({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Explorador Culinario',
            photoURL: user.photoURL || undefined,
          })
        } catch {
          data = perfilFallback
        }
      }
      setPerfil(data || perfilFallback)
    } catch (err) {
      console.warn('Error al cargar perfil desde Firestore, usando perfil local:', err)
      setPerfil(perfilFallback)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!isAuthLoading) {
      const frame = requestAnimationFrame(() => {
        void cargarPerfil()
      })

      return () => cancelAnimationFrame(frame)
    }

    return undefined
  }, [isAuthLoading, cargarPerfil])

  const progresoRango: SiguienteRangoInfo = useMemo(() => {
    if (!perfil) {
      return {
        siguienteRol: 'cronista',
        puntosFaltantes: 100,
        aportesFaltantes: 3,
        porcentajeProgreso: 0,
      }
    }

    const { rol, puntosAntropologicos = 0, aportesValidados = 0 } = perfil

    if (rol === 'novicio') {
      const meta = UMBRALES_ROLES.cronista
      const pFalt = Math.max(0, meta.puntos - puntosAntropologicos)
      const aFalt = Math.max(0, meta.aportes - aportesValidados)
      const pctPuntos = Math.min(100, (puntosAntropologicos / meta.puntos) * 100)
      const pctAportes = Math.min(100, (aportesValidados / meta.aportes) * 100)
      return {
        siguienteRol: 'cronista',
        puntosFaltantes: pFalt,
        aportesFaltantes: aFalt,
        porcentajeProgreso: Math.round((pctPuntos + pctAportes) / 2),
      }
    }

    if (rol === 'cronista') {
      const meta = UMBRALES_ROLES.guardian
      const pFalt = Math.max(0, meta.puntos - puntosAntropologicos)
      const aFalt = Math.max(0, meta.aportes - aportesValidados)
      const pctPuntos = Math.min(
        100,
        ((puntosAntropologicos - UMBRALES_ROLES.cronista.puntos) /
          (meta.puntos - UMBRALES_ROLES.cronista.puntos)) *
          100
      )
      const pctAportes = Math.min(
        100,
        ((aportesValidados - UMBRALES_ROLES.cronista.aportes) /
          (meta.aportes - UMBRALES_ROLES.cronista.aportes)) *
          100
      )
      return {
        siguienteRol: 'guardian',
        puntosFaltantes: pFalt,
        aportesFaltantes: aFalt,
        porcentajeProgreso: Math.max(0, Math.round((pctPuntos + pctAportes) / 2)),
      }
    }

    if (rol === 'guardian') {
      const meta = UMBRALES_ROLES.maestro
      const pFalt = Math.max(0, meta.puntos - puntosAntropologicos)
      const aFalt = Math.max(0, meta.aportes - aportesValidados)
      const pctPuntos = Math.min(
        100,
        ((puntosAntropologicos - UMBRALES_ROLES.guardian.puntos) /
          (meta.puntos - UMBRALES_ROLES.guardian.puntos)) *
          100
      )
      const pctAportes = Math.min(
        100,
        ((aportesValidados - UMBRALES_ROLES.guardian.aportes) /
          (meta.aportes - UMBRALES_ROLES.guardian.aportes)) *
          100
      )
      return {
        siguienteRol: 'maestro',
        puntosFaltantes: pFalt,
        aportesFaltantes: aFalt,
        porcentajeProgreso: Math.max(0, Math.round((pctPuntos + pctAportes) / 2)),
      }
    }

    return {
      siguienteRol: null,
      puntosFaltantes: 0,
      aportesFaltantes: 0,
      porcentajeProgreso: 100,
    }
  }, [perfil])

  const actualizarPerfil = async (data: {
    displayName?: string
    photoURL?: string
    regionesEspecialidad?: string[]
  }) => {
    if (!user) throw new Error('Usuario no autenticado')
    setError(null)
    try {
      const actualizado = await actualizarPerfilUsuario(user.uid, data)
      setPerfil(actualizado)
      return actualizado
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar perfil'
      setError(msg)
      throw err
    }
  }

  return {
    user,
    perfil,
    progresoRango,
    isLoading: isAuthLoading || isLoading,
    error,
    recargarPerfil: cargarPerfil,
    actualizarPerfil,
  }
}
