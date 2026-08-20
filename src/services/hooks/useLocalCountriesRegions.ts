'use client'

import { localPaises, regionesPorPais } from '@/scripts/data'

export function useLocalCountriesRegions() {
  return { paises: localPaises, regionesPorPais }
}
