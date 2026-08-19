import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GaleriaProps {
  imagenes: string[]
  className?: string
}

export function Galeria({ imagenes, className }: GaleriaProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setActiveIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img
          src={imagenes[activeIndex]}
          alt={`Galeria de imágenes - paso ${activeIndex + 1}`}
          className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <ChevronLeft
          onClick={prevImage}
          className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Imagen anterior"
        />
        <ChevronRight
          onClick={nextImage}
          className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Imagen siguiente"
        />
      </div>

      <div className="mt-2 text-center text-sm text-muted-foreground">
        {`${activeIndex + 1} de ${imagenes.length}`}
      </div>
    </div>
  )
}
