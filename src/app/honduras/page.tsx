'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { RecipeExplorer } from '@/components/fichas/RecipeExplorer'
import { platillos as platillosLocales } from '@/scripts/data/honduras'
import type { Platillo, Region } from '@/types'

export default function HondurasPage() {
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPlatillos() {
      try {
        const snapshot = await getDocs(collection(firestore, 'paises', 'honduras-001', 'regiones'))
        const regionsData: Region[] = []
        snapshot.forEach((doc) => regionsData.push(doc.data() as Region))

        // Fetch platillos de cada región
        const allPlatillos: Platillo[] = []
        for (const region of regionsData) {
          const platillosSnap = await getDocs(
            collection(firestore, 'paises', 'honduras-001', 'regiones', region.id, 'platillos')
          )
          platillosSnap.forEach((doc) => {
            allPlatillos.push(doc.data() as Platillo)
          })
        }
        setPlatillos(allPlatillos.length > 0 ? allPlatillos : platillosLocales)
      } catch (err) {
        console.error('Error fetching platillos:', err)
        setPlatillos(platillosLocales)
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

      <RecipeExplorer
        recipes={platillos}
        images={platillos.map((platillo) => platillo.imagenes[0] ?? '/test.jpg')}
      />
    </div>
  )
}
