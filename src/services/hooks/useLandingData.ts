'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import {
  canUseFirestoreReads,
  disableFirestoreReads,
  isMissingDefaultFirestoreDatabase,
} from '@/services/firestore-read-guard'
import {
  localPaises,
  recetasPorPais as recetasPorPaisLocal,
  regionesPorPais as regionesPorPaisLocal,
} from '@/scripts/data'
import type { Pais, Platillo, Region } from '@/types'

export function useLandingData() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [recetasPorPais, setRecetasPorPais] = useState<Record<string, Platillo[]>>({})
  const [regionesPorPais, setRegionesPorPais] = useState<Record<string, Region[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const setLocalFallback = () => {
      if (cancelled) return
      setPaises(localPaises)
      setRecetasPorPais(recetasPorPaisLocal)
      setRegionesPorPais(regionesPorPaisLocal)
    }

    async function fetchLandingData() {
      if (!firestore || !canUseFirestoreReads()) {
        setLocalFallback()
        setIsLoading(false)
        return
      }

      try {
        const paisSnapshot = await getDocs(collection(firestore, 'paises'))
        const firestorePaises = paisSnapshot.docs.map((doc) => doc.data() as Pais)
        const paisesDisponibles = firestorePaises.length > 0 ? firestorePaises : localPaises

        const platilloSnapshot = await getDocs(
          query(collection(firestore, 'platillos'), where('estado', '==', 'publicado'))
        )
        const firestorePlatillos = platilloSnapshot.docs.map((doc) => doc.data() as Platillo)

        const groupedRecetas: Record<string, Platillo[]> = {}
        firestorePlatillos.forEach((platillo) => {
          const list = groupedRecetas[platillo.paisId] ?? []
          list.push(platillo)
          groupedRecetas[platillo.paisId] = list
        })

        const regionesPorPaisMap: Record<string, Region[]> = {}
        await Promise.all(
          paisesDisponibles.map(async (pais) => {
            const regionesLocales = regionesPorPaisLocal[pais.id] ?? []

            if (firestorePaises.length === 0) {
              regionesPorPaisMap[pais.id] = regionesLocales
              return
            }

            const regionesSnapshot = await getDocs(
              collection(firestore, 'paises', pais.id, 'regiones')
            )
            regionesPorPaisMap[pais.id] = regionesSnapshot.empty
              ? regionesLocales
              : regionesSnapshot.docs.map((doc) => doc.data() as Region)
          })
        )

        if (!cancelled) {
          setPaises(paisesDisponibles)
          setRecetasPorPais(groupedRecetas)
          setRegionesPorPais(regionesPorPaisMap)
        }
      } catch (err) {
        if (!cancelled) {
          if (isMissingDefaultFirestoreDatabase(err)) {
            disableFirestoreReads()
          } else {
            console.warn(
              'No se pudo cargar datos de la landing desde Firestore; usando dataset local.'
            )
          }
          setLocalFallback()
          setError(err instanceof Error ? err : new Error('Error desconocido'))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchLandingData()

    return () => {
      cancelled = true
    }
  }, [])

  return { paises, recetasPorPais, regionesPorPais, isLoading, error }
}
