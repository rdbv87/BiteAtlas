'use client'

import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import type { Pais, Platillo, Region } from '@/types'

// Hook que obtiene todos los datos necesarios para la pagina de landing.
// Datos cargados:
// - paises: catalogo geografico completo (necesario para el formulario de aportes)
// - paisesConRecetas: unicos que se muestran en la landing y el mapa
// - recetasPorPais: platillos agrupados por pais (solo los publicados)
// - regionesPorPais: regiones por pais desde Firestore
export function useLandingData() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [recetasPorPais, setRecetasPorPais] = useState<Record<string, Platillo[]>>({})
  const [regionesPorPais, setRegionesPorPais] = useState<Record<string, Region[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchLandingData() {
      if (!firestore) {
        setError(new Error('Firebase no está configurado para leer datos del atlas.'))
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

        const platilloSnapshot = await getDocs(
          query(collection(db, 'platillos'), where('estado', '==', 'publicado'))
        )
        const firestorePlatillos = platilloSnapshot.docs.map(
          (document) =>
            ({
              ...document.data(),
              id: document.id,
            }) as Platillo
        )

        const groupedRecetas: Record<string, Platillo[]> = {}
        firestorePlatillos.forEach((platillo) => {
          const recipes = groupedRecetas[platillo.paisId] ?? []
          groupedRecetas[platillo.paisId] = [...recipes, platillo]
        })

        const regionesPorPaisMap: Record<string, Region[]> = {}
        await Promise.all(
          firestorePaises.map(async (pais) => {
            const regionesSnapshot = await getDocs(collection(db, 'paises', pais.id, 'regiones'))
            regionesPorPaisMap[pais.id] = regionesSnapshot.docs.map(
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
          setRecetasPorPais(groupedRecetas)
          setRegionesPorPais(regionesPorPaisMap)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('No se pudo cargar datos de la landing desde Firestore.', err)
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

  const paisesConRecetas = useMemo(
    () =>
      paises
        .filter((pais) => (recetasPorPais[pais.id]?.length ?? 0) > 0)
        .sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [paises, recetasPorPais]
  )

  return { paises, paisesConRecetas, recetasPorPais, regionesPorPais, isLoading, error }
}
