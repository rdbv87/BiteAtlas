import Image from 'next/image'
import { MapPinned } from 'lucide-react'
import type { Platillo, Region } from '@/types'
import { optimizeUnsplashUrl } from '@/lib/utils'

export function FeaturedRecipeCard({
  recipe,
  region,
  countryName,
  palabrasClave,
}: {
  recipe: Platillo
  region: Region | undefined
  countryName: string
  palabrasClave: string[]
}) {
  const imageSrc = optimizeUnsplashUrl(recipe.imagenes[0] ?? '/test.jpg')

  return (
    <div className="relative mx-auto w-full max-w-lg lg:justify-self-end">
      <div className="sticker-float absolute -right-3 -top-5 z-10 flex h-32 w-40 rotate-6 flex-col justify-center bg-[#f0a35b] p-4 text-[#173c3a] shadow-xl sm:-right-7">
        <span className="text-[10px] uppercase tracking-[0.2em]">En foco</span>
        <strong className="mt-1 whitespace-nowrap font-editorial text-[1.45rem] leading-none">
          {countryName}
        </strong>
        <span className="mt-2 max-w-[7.5rem] text-[0.7rem] leading-4">
          {palabrasClave.join(' · ')}
        </span>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-[#d4ddd1]/20 bg-[#315955] p-3 shadow-2xl">
        <Image
          src={imageSrc}
          alt={`${recipe.nombre} servida en una mesa`}
          fill
          loading="eager"
          sizes="(max-width: 1024px) 90vw, 40vw"
          className="rounded-[1rem] object-cover p-3"
        />
      </div>
      <div className="sticker-float-slow absolute -bottom-5 -left-5 max-w-[230px] bg-[#f5f1e8] p-4 text-[#173c3a] shadow-xl sm:-left-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#e8754f]">
          <MapPinned className="h-4 w-4" /> {region?.nombre ?? countryName}
        </div>
        <p className="mt-2 font-editorial text-lg leading-tight">{recipe.nombre}</p>
      </div>
    </div>
  )
}
