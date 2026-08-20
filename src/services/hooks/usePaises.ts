'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import {
  canUseFirestoreReads,
  disableFirestoreReads,
  isMissingDefaultFirestoreDatabase,
} from '@/services/firestore-read-guard'
import { localPaises } from '@/scripts/data'
import type { Pais } from '@/types'

export function usePaises() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPaises() {
      if (!firestore || !canUseFirestoreReads()) {
        if (!cancelled) {
          setPaises(localPaises)
          setIsLoading(false)
        }
        return
      }

      try {
        const snapshot = await getDocs(collection(firestore, 'paises'))
        const data = snapshot.docs.map((doc) => doc.data() as Pais)
        if (!cancelled) {
          setPaises(data)
        }
      } catch (err) {
        if (!cancelled) {
          setPaises(localPaises)
          if (isMissingDefaultFirestoreDatabase(err)) {
            disableFirestoreReads()
          } else {
            console.warn('No se pudo sincronizar Firestore; usando paises locales.')
          }
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
