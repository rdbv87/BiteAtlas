import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Pais, Platillo, Region } from '@/types'
import Home from './page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

const paises: [Pais, Pais] = [
  {
    id: 'japon-001',
    nombre: 'Japón',
    codigoISO: 'JP',
    continente: 'asia',
    descripcion: 'Cocina japonesa.',
    lat: 36.2,
    lng: 138.25,
    zoom: 5,
  },
  {
    id: 'marruecos-001',
    nombre: 'Marruecos',
    codigoISO: 'MA',
    continente: 'africa',
    descripcion: 'Cocina marroquí.',
    lat: 31.79,
    lng: -7.09,
    zoom: 5,
  },
]

const receta: Platillo = {
  id: 'receta-001',
  paisId: 'japon-001',
  regionId: 'japon-001-region-1',
  nombre: 'Sopa de miso',
  descripcion: 'Caldo dashi con pasta de miso y tofu.',
  instrucciones: ['Calentar el dashi', 'Disolver el miso'],
  ingredientes: [
    { ingredienteId: 'Miso', cantidad: '2', unidad: 'cucharadas' },
    { ingredienteId: 'Dashi', cantidad: '500', unidad: 'ml' },
    { ingredienteId: 'Tofu', cantidad: '150', unidad: 'g' },
  ],
  dificultad: 'facil',
  imagenes: ['https://example.com/miso.jpg'],
  estado: 'publicado',
  createdAt: new Date('2026-08-21T00:00:00.000Z'),
}

const landingData = vi.hoisted(() => ({
  value: {} as {
    paises: Pais[]
    paisesConRecetas: Pais[]
    recetasPorPais: Record<string, Platillo[]>
    regionesPorPais: Record<string, Region[]>
    isLoading: boolean
    error: Error | null
  },
}))

vi.mock('@/services/hooks/useLandingData', () => ({
  useLandingData: () => landingData.value,
}))

vi.mock('@/components/mapas/FeaturedRegionMapBackground', () => ({
  FeaturedRegionMapBackground: () => null,
}))

describe('Home', () => {
  it('solo cuenta y lista países que tienen recetas publicadas', () => {
    landingData.value = {
      paises,
      paisesConRecetas: [paises[0]],
      recetasPorPais: { 'japon-001': [receta] },
      regionesPorPais: {},
      isLoading: false,
      error: null,
    }

    render(<Home />)

    expect(screen.getByText('países en el atlas').previousElementSibling).toHaveTextContent('1')
    expect(screen.getByRole('heading', { name: 'Japón' })).toBeInTheDocument()
    expect(screen.queryByText('Marruecos')).not.toBeInTheDocument()
  })

  it('invita a aportar cuando todavía no hay recetas publicadas', () => {
    landingData.value = {
      paises,
      paisesConRecetas: [],
      recetasPorPais: {},
      regionesPorPais: {},
      isLoading: false,
      error: null,
    }

    render(<Home />)

    expect(screen.getByText('países en el atlas').previousElementSibling).toHaveTextContent('0')
    expect(screen.getByText('Publicar la primera receta')).toBeInTheDocument()
    expect(
      screen.getAllByText(
        'Todavía no hay recetas publicadas. Sé la primera persona en poner tu cocina en el mapa.'
      ).length
    ).toBeGreaterThan(0)
  })
})
