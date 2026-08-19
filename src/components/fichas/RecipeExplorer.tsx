'use client'

import { useState } from 'react'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { FichaCultural } from './FichaCultural'
import type { Platillo } from '@/types'

interface RecipeExplorerProps {
  recipes: Platillo[]
  images: string[]
}

export function RecipeExplorer({ recipes, images }: RecipeExplorerProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Platillo | null>(null)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {recipes.map((recipe, index) => (
          <article key={recipe.id} className="group border-t-2 border-[#173c3a] pt-4">
            <button
              type="button"
              onClick={() => setSelectedRecipe(recipe)}
              className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8754f]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#d4ddd1]">
                <img
                  src={images[index]}
                  alt={recipe.nombre}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#f5f1e8] px-3 py-2 text-xs text-[#173c3a]">
                  Ver ficha <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 pt-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#e8754f]">0{index + 1}</p>
                  <h3 className="mt-2 font-editorial text-3xl">{recipe.nombre}</h3>
                </div>
                <span className="mt-1 flex items-center gap-1 text-xs text-[#47615a]">
                  <Clock3 className="h-3.5 w-3.5" /> {recipe.tiempoPreparacion} min
                </span>
              </div>
            </button>
            <p className="mt-3 text-sm leading-6 text-[#47615a]">{recipe.descripcion}</p>
          </article>
        ))}
      </div>

      {selectedRecipe && (
        <FichaCultural
          platillo={selectedRecipe}
          isOpen={true}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  )
}
