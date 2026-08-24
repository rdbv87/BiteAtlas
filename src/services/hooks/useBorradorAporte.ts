'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FormData } from '@/components/aportes/FormularioAporte'

export interface BorradorAporte {
  formData: Partial<FormData>
  pasoActual: number
  guardadoEn: string // Timestamp ISO
  nombreOpcional?: string
}

const STORAGE_PREFIX = 'biteatlas_draft_'

export function useBorradorAporte(userId?: string | null) {
  const storageKey = userId ? `${STORAGE_PREFIX}${userId}` : `${STORAGE_PREFIX}default`

  const leerBorrador = useCallback((): {
    borrador: BorradorAporte | null
    ultimoGuardado: Date | null
  } => {
    if (typeof window === 'undefined') {
      return { borrador: null, ultimoGuardado: null }
    }
    try {
      // 1. Buscar con clave de usuario / actual
      let item = localStorage.getItem(storageKey)

      // 2. Si no hay, buscar clave de fallback
      if (!item && userId) {
        item = localStorage.getItem(`${STORAGE_PREFIX}default`)
      }

      // 3. Fallback genérico por si se guardó con cualquier otra clave de biteatlas
      if (!item) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith(STORAGE_PREFIX)) {
            item = localStorage.getItem(key)
            break
          }
        }
      }

      if (item) {
        const parsed: BorradorAporte = JSON.parse(item)
        return { borrador: parsed, ultimoGuardado: new Date(parsed.guardadoEn) }
      }
    } catch (err) {
      console.error('Error al leer borrador de localStorage:', err)
    }
    return { borrador: null, ultimoGuardado: null }
  }, [storageKey, userId])

  const [estado, setEstado] = useState<{
    borrador: BorradorAporte | null
    ultimoGuardado: Date | null
  }>(leerBorrador)
  const [estaGuardando, setEstaGuardando] = useState(false)

  // Sincronizar inmediatamente al montar o cuando el usuario/clave cambia
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setEstado(leerBorrador())
    })

    const handleStorage = () => {
      setEstado(leerBorrador())
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('storage', handleStorage)
    }
  }, [leerBorrador])

  const guardarBorrador = useCallback(
    (data: Partial<FormData>, pasoActual: number = 0) => {
      if (!storageKey || typeof window === 'undefined') return

      try {
        setEstaGuardando(true)
        const ahora = new Date()
        const nuevoBorrador: BorradorAporte = {
          formData: data,
          pasoActual,
          guardadoEn: ahora.toISOString(),
          nombreOpcional: data.nombre?.trim() || undefined,
        }

        localStorage.setItem(storageKey, JSON.stringify(nuevoBorrador))
        setEstado({ borrador: nuevoBorrador, ultimoGuardado: ahora })
      } catch (err) {
        console.error('Error al guardar borrador en localStorage:', err)
      } finally {
        setEstaGuardando(false)
      }
    },
    [storageKey]
  )

  const limpiarBorrador = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(storageKey)
      localStorage.removeItem(`${STORAGE_PREFIX}default`)
      // Limpiar cualquier otra clave huérfana de draft
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      }
      setEstado({ borrador: null, ultimoGuardado: null })
    } catch (err) {
      console.error('Error al limpiar borrador de localStorage:', err)
    }
  }, [storageKey])

  return {
    borrador: estado.borrador,
    ultimoGuardado: estado.ultimoGuardado,
    estaGuardando,
    guardarBorrador,
    limpiarBorrador,
    tieneBorrador: !!estado.borrador,
  }
}
