import { describe, expect, it } from 'vitest'
import {
  curateRecipeImages,
  type ImageItem,
  type OpenverseClient,
  type OpenverseResponse,
} from '../image-curator'

function client(results: ImageItem[]): OpenverseClient {
  return {
    async request<T>(): Promise<OpenverseResponse<T>> {
      return { results } as unknown as OpenverseResponse<T>
    },
  }
}

describe('Image recipe curator', () => {
  it('selecciona imágenes que mencionan el plato y tienen licencia compatible', async () => {
    const imagenes = await curateRecipeImages(
      client([
        {
          id: 'img-1',
          title: 'Baleada hondureña tradicional',
          url: 'https://example.org/baleada.jpg',
          foreign_landing_url: 'https://example.org/foto/baleada',
          license: 'by',
          source: 'flickr',
        },
      ]),
      'Baleada'
    )

    expect(imagenes).toHaveLength(1)
    expect(imagenes[0]?.estado).toBe('pendiente')
    expect(imagenes[0]?.url).toBe('https://example.org/baleada.jpg')
  })

  it('descarta imágenes con licencia no compatible', async () => {
    await expect(
      curateRecipeImages(
        client([
          {
            id: 'img-2',
            title: 'Baleada hondureña',
            url: 'https://example.org/baleada.jpg',
            foreign_landing_url: 'https://example.org/foto/baleada',
            license: 'by-nc-nd',
            source: 'flickr',
          },
        ]),
        'Baleada'
      )
    ).rejects.toThrow(/No se encontraron imágenes/)
  })

  it('descarta imágenes que no mencionan el plato', async () => {
    await expect(
      curateRecipeImages(
        client([
          {
            id: 'img-3',
            title: 'Plato de comida genérico',
            url: 'https://example.org/generico.jpg',
            foreign_landing_url: 'https://example.org/foto/generico',
            license: 'cc0',
            source: 'stocksnap',
          },
        ]),
        'Baleada'
      )
    ).rejects.toThrow(/No se encontraron imágenes/)
  })

  it('descarta imágenes de un plato similar de otro país', async () => {
    await expect(
      curateRecipeImages(
        client([
          {
            id: 'img-4',
            title: 'Nacatamales nicaragüenses tradicionales',
            url: 'https://example.org/nica.jpg',
            foreign_landing_url: 'https://example.org/foto/nica',
            license: 'cc0',
            source: 'flickr',
            tags: [{ name: 'nicaragua' }],
          },
        ]),
        'Nacatamal'
      )
    ).rejects.toThrow(/No se encontraron imágenes/)
  })
})
