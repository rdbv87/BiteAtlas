'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import type { Pais, Region } from '@/types'

// Firestore es la fuente autoritativa de paises y regiones en runtime.
export function useCountriesRegions() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [regionesPorPais, setRegionesPorPais] = useState<Record<string, Region[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCountriesRegions() {
      if (!firestore) {
        setError(new Error('Firebase no está configurado para leer países y regiones.'))
        setIsLoading(false)
        return
      }

      const db = firestore

      try {
        const paisSnapshot = await getDocs(collection(db, 'paises'))
        const firestorePaises = paisSnapshot.docs.map(
          (document) =>
            ({
              ...document.data(),
              id: document.id,
            }) as Pais
        )

        const regionesMap: Record<string, Region[]> = {}
        await Promise.all(
          firestorePaises.map(async (pais) => {
            const regionesSnapshot = await getDocs(collection(db, 'paises', pais.id, 'regiones'))
            regionesMap[pais.id] = regionesSnapshot.docs.map(
              (document) =>
                ({
                  paisId: pais.id,
                  ...document.data(),
                  id: document.id,
                }) as Region
            )
          })
        )

        if (!cancelled) {
          setPaises(firestorePaises)
          setRegionesPorPais(regionesMap)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('No se pudo cargar países y regiones desde Firestore.', err)
          setError(
            err instanceof Error ? err : new Error('Error desconocido al cargar países y regiones')
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchCountriesRegions()

    return () => {
      cancelled = true
    }
  }, [])

  return { paises, regionesPorPais, isLoading, error }
}
