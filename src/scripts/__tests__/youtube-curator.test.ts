import { describe, expect, it } from 'vitest'
import {
  classifyVideo,
  curateRecipeVideos,
  parseYouTubeDuration,
  type YouTubeClient,
  type YouTubeResponse,
} from '../youtube-curator'

describe('YouTube recipe curator', () => {
  it('parses ISO 8601 durations', () => {
    expect(parseYouTubeDuration('PT45S')).toBe(45)
    expect(parseYouTubeDuration('PT1M20S')).toBe(80)
    expect(parseYouTubeDuration('PT1H2M3S')).toBe(3723)
  })

  it('classifies Shorts and normal videos', () => {
    expect(classifyVideo(38, 'Baleada hondureña #shorts')).toBe('short')
    expect(classifyVideo(301, 'Receta de baleada hondureña')).toBe('normal')
  })

  it('selects the most viewed candidate of each type', async () => {
    const client: YouTubeClient = {
      async request<T>(endpoint: string): Promise<YouTubeResponse<T>> {
        if (endpoint === 'search') {
          return {
            items: [{ id: { videoId: 'short-1' } }, { id: { videoId: 'normal-1' } }],
          } as unknown as YouTubeResponse<T>
        }

        return {
          items: [
            {
              id: 'short-1',
              snippet: {
                title: 'Receta rápida de Baleada hondureña #shorts',
                channelTitle: 'Cocina HN',
              },
              contentDetails: { duration: 'PT40S' },
              statistics: { viewCount: '900' },
            },
            {
              id: 'normal-1',
              snippet: {
                title: 'Receta de baleada hondureña paso a paso',
                channelTitle: 'Cocina HN',
              },
              contentDetails: { duration: 'PT12M' },
              statistics: { viewCount: '1200' },
            },
            {
              id: 'music-1',
              snippet: { title: 'Banda Blanca - Sopa de Caracol', channelTitle: 'Música' },
              contentDetails: { duration: 'PT4M' },
              statistics: { viewCount: '99999999' },
            },
            {
              id: 'wrong-country-1',
              snippet: {
                title: 'Receta de Nacatamales nicaragüenses paso a paso',
                channelTitle: 'Cocina Centroamericana',
              },
              contentDetails: { duration: 'PT10M' },
              statistics: { viewCount: '99999999' },
            },
          ],
        } as unknown as YouTubeResponse<T>
      },
    }

    const result = await curateRecipeVideos(client, 'Baleada', new Date('2026-08-19'))

    expect(result.map((video) => video.id)).toEqual(['short-1', 'normal-1'])
    expect(result.every((video) => video.consulta === 'receta de Baleada Honduras')).toBe(true)
  })
})
