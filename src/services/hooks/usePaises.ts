'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import type { Pais } from '@/types'

export function usePaises() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPaises() {
      try {
        const snapshot = await getDocs(collection(firestore, 'paises'))
        const data = snapshot.docs.map((doc) => doc.data() as Pais)
        if (!cancelled) {
          setPaises(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error)
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
