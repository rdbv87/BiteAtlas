'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { RecipeExplorer } from '@/components/fichas/RecipeExplorer'
import type { Platillo } from '@/types'

export default function HondurasPage() {
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPlatillos() {
      if (!firestore) {
        setPlatillos([])
        setIsLoading(false)
        return
      }

      try {
        const snapshot = await getDocs(
          query(
            collection(firestore, 'platillos'),
            where('paisId', '==', 'honduras-001'),
            where('estado', '==', 'publicado')
          )
        )
        setPlatillos(snapshot.docs.map((doc) => doc.data() as Platillo))
      } catch (err) {
        console.error('Error fetching platillos:', err)
        setPlatillos([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlatillos()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Cargando recetas hondureñas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Recetas Hondureñas Tradicionales</h1>

      <RecipeExplorer recipes={platillos} />
    </div>
  )
}
