import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config()

import type { TipoVideoReceta, VideoReceta } from '@/types'

interface SearchItem {
  id?: { videoId?: string }
  snippet?: { title?: string; channelTitle?: string }
}

interface VideoItem {
  id: string
  snippet?: {
    title?: string
    channelTitle?: string
    publishedAt?: string
    thumbnails?: { high?: { url?: string }; medium?: { url?: string } }
    description?: string
  }
  contentDetails?: { duration?: string }
  statistics?: { viewCount?: string }
}

export interface YouTubeResponse<T> {
  items?: T[]
}

export interface YouTubeClient {
  request<T>(endpoint: string, params: Record<string, string>): Promise<YouTubeResponse<T>>
}

export function parseYouTubeDuration(duration: string): number {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (!match) return 0

  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0)
}

export function classifyVideo(durationSeconds: number, title: string): TipoVideoReceta {
  return durationSeconds <= 60 || /#shorts?\b/i.test(title) ? 'short' : 'normal'
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function matchesRecipe(item: VideoItem, recipeName: string): boolean {
  const terms = normalize(recipeName)
    .split(/\s+/)
    .filter((term) => term.length > 3)
  const title = normalize(item.snippet?.title ?? '')
  const description = normalize(item.snippet?.description ?? '')
  const text = `${title} ${description}`
  const culinarySignals =
    /receta|prepar|ingredien|cocina|cocinando|cocinar|paso a paso|como hacer|how to/
  const nonRecipeSignals =
    /cancion|musica|banda|proband|degust|reportaje|noticia|viaje|vlog|reaccion/
  const alternativeCountrySignals =
    /nicarag|mexic|colombia|peru|argentina|guatemala|el salvador|costa rica|panama/

  return (
    terms.every((term) => title.includes(term)) &&
    culinarySignals.test(text) &&
    !nonRecipeSignals.test(text) &&
    !alternativeCountrySignals.test(title)
  )
}

export async function curateRecipeVideos(
  client: YouTubeClient,
  recipeName: string,
  now = new Date()
): Promise<VideoReceta[]> {
  const consulta = `receta de ${recipeName} Honduras`
  const search = await client.request<SearchItem>('search', {
    part: 'snippet',
    q: consulta,
    type: 'video',
    order: 'viewCount',
    maxResults: '50',
    videoEmbeddable: 'true',
  })

  const ids = (search.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id))

  if (ids.length === 0) throw new Error(`YouTube no devolvió candidatos para ${consulta}`)

  const details = await client.request<VideoItem>('videos', {
    part: 'snippet,contentDetails,statistics',
    id: ids.join(','),
  })

  const candidates = (details.items ?? [])
    .filter((item) => matchesRecipe(item, recipeName))
    .map((item): VideoReceta => {
      const titulo = item.snippet?.title ?? recipeName
      const duracionSegundos = parseYouTubeDuration(item.contentDetails?.duration ?? '')
      const tipo = classifyVideo(duracionSegundos, titulo)
      return {
        id: item.id,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        titulo,
        canal: item.snippet?.channelTitle ?? 'YouTube',
        miniatura:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
        tipo,
        duracionSegundos,
        vistas: Number(item.statistics?.viewCount ?? 0),
        consulta,
        fuente: 'youtube',
        verificadoEn: now,
      }
    })

  const selected = (['short', 'normal'] as const).flatMap((tipo) =>
    candidates
      .filter((candidate) => candidate.tipo === tipo)
      .sort((a, b) => b.vistas - a.vistas)
      .slice(0, 1)
  )

  if (selected.length < 2) {
    throw new Error(`No hay un Short y un video normal verificables para "${consulta}"`)
  }

  return selected
}

async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) throw new Error('YOUTUBE_API_KEY es obligatorio para curar videos')

  const client: YouTubeClient = {
    async request<T>(endpoint: string, params: Record<string, string>) {
      const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`)
      Object.entries({ ...params, key: apiKey }).forEach(([key, value]) =>
        url.searchParams.set(key, value)
      )
      const response = await fetch(url)
      if (!response.ok) throw new Error(`YouTube API ${response.status}: ${await response.text()}`)
      return response.json() as Promise<YouTubeResponse<T>>
    },
  }

  const recipes = ['Baleada', 'Sopa de Caracol', 'Nacatamal']
  for (const recipe of recipes) {
    const videos = await curateRecipeVideos(client, recipe)
    console.log(JSON.stringify({ recipe, videos }, null, 2))
  }
}

if (process.argv[1]?.endsWith('youtube-curator.ts')) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
