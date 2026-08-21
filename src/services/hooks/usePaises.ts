'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import type { Pais } from '@/types'

// Hook que obtiene la lista de paises disponibles en la aplicacion.
// Firestore es la fuente autoritativa de datos de contenido en runtime.
export function usePaises() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPaises() {
      if (!firestore) {
        setError(new Error('Firebase no está configurado para leer países.'))
        setIsLoading(false)
        return
      }

      try {
        const snapshot = await getDocs(collection(firestore, 'paises'))
        const data = snapshot.docs.map(
          (document) =>
            ({
              ...document.data(),
              id: document.id,
            }) as Pais
        )
        if (!cancelled) {
          setPaises(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('No se pudo cargar países desde Firestore.', err)
          setError(err instanceof Error ? err : new Error('Error desconocido al cargar países'))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchPaises()

    return () => {
      cancelled = true
    }
  }, [])

  return { paises, isLoading, error }
}
