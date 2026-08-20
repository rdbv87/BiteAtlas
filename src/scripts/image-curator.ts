import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

import type { ImagenReceta } from '@/types'

interface ImageTag {
  name?: string
}

export interface ImageItem {
  id: string
  title?: string
  url?: string
  foreign_landing_url?: string
  license?: string
  license_version?: string
  source?: string
  tags?: ImageTag[]
}

export interface OpenverseResponse<T> {
  results?: T[]
}

export interface OpenverseClient {
  request<T>(params: Record<string, string>): Promise<OpenverseResponse<T>>
}

// Licencias que permiten uso y publicación del proyecto sin restricción comercial.
const LICENCIAS_COMPATIBLES = new Set(['cc0', 'pdm', 'by', 'by-sa'])

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function matchesDish(item: ImageItem, dishName: string): boolean {
  const terms = normalize(dishName)
    .split(/\s+/)
    .filter((term) => term.length > 3)
  const title = normalize(item.title ?? '')
  const tags = (item.tags ?? []).map((tag) => normalize(tag.name ?? '')).join(' ')
  const text = `${title} ${tags}`
  const alternativeCountrySignals =
    /nicarag|mexic|colombia|peru|argentina|guatemala|el salvador|costa rica|panama/

  return (
    terms.length > 0 &&
    terms.every((term) => text.includes(term)) &&
    !alternativeCountrySignals.test(text)
  )
}

function hasCompatibleLicense(item: ImageItem): boolean {
  const license = normalize(item.license ?? '')
  return LICENCIAS_COMPATIBLES.has(license)
}

export async function curateRecipeImages(
  client: OpenverseClient,
  recipeName: string,
  maxCandidatos = 3
): Promise<ImagenReceta[]> {
  const consulta = `${recipeName} Honduras plato`
  const response = await client.request<ImageItem>({
    q: consulta,
    license_type: 'commercial,modification',
    page_size: '20',
  })

  const candidates = (response.results ?? []).filter(
    (item) => Boolean(item.url) && Boolean(item.foreign_landing_url) && hasCompatibleLicense(item)
  )

  const relevantes = candidates.filter((item) => matchesDish(item, recipeName))

  if (relevantes.length === 0) {
    throw new Error(`No se encontraron imágenes verificables de "${consulta}"`)
  }

  return relevantes.slice(0, maxCandidatos).map((item): ImagenReceta => ({
    url: item.url!,
    fuenteUrl: item.foreign_landing_url!,
    fuente: item.source ?? 'openverse',
    tituloFuente: item.title ?? recipeName,
    licencia: item.license ?? 'desconocida',
    // La automatización solo preselecciona; publicar requiere revisión humana (docs/curacion-de-medios.md).
    estado: 'pendiente',
  }))
}

async function main() {
  const client: OpenverseClient = {
    async request<T>(params: Record<string, string>) {
      const url = new URL('https://api.openverse.org/v1/images/')
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
      const response = await fetch(url)
      if (!response.ok)
        throw new Error(`Openverse API ${response.status}: ${await response.text()}`)
      return response.json() as Promise<OpenverseResponse<T>>
    },
  }

  const recipes = ['Baleada', 'Sopa de Caracol', 'Nacatamal']
  for (const recipe of recipes) {
    const imagenes = await curateRecipeImages(client, recipe)
    console.log(JSON.stringify({ recipe, imagenes }, null, 2))
  }
}

if (process.argv[1]?.endsWith('image-curator.ts')) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
