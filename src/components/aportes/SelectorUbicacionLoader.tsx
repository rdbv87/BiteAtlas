'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const SelectorUbicacion = dynamic(
  () => import('./SelectorUbicacion').then((module) => module.SelectorUbicacion),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-2xl bg-[#dce5dd]" />,
  }
)

export function SelectorUbicacionLoader(props: ComponentProps<typeof SelectorUbicacion>) {
  return <SelectorUbicacion {...props} />
}
