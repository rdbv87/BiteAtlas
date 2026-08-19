'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { honduras } from '@/scripts/data/honduras'
import type { Pais } from '@/types'

export function usePaises() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchPaises() {
      try {
        const snapshot = await getDocs(collection(firestore, 'paises'))
        const data = snapshot.docs.map((doc) => doc.data() as Pais)
        if (!cancelled) {
          setPaises(data.length > 0 ? data : [honduras])
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('No se pudo sincronizar Firestore; usando el atlas local.', err)
          setPaises([honduras])
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

  return { paises, isLoading, error: null }
}
