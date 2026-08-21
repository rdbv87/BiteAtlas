import { beforeEach, describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MapaMundi } from './MapaMundi'
import type { Pais, Platillo, Region } from '@/types'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

const japon: Pais = {
  id: 'japon-001',
  nombre: 'Japón',
  codigoISO: 'JP',
  continente: 'asia',
  descripcion: 'Cocina japonesa publicada por la comunidad.',
  lat: 36.2,
  lng: 138.25,
  zoom: 5,
}

const receta: Platillo = {
  id: 'receta-001',
  paisId: 'japon-001',
  regionId: 'japon-001-region-1',
  nombre: 'Sopa de miso',
  descripcion: 'Caldo dashi con pasta de miso y tofu.',
  instrucciones: ['Calentar el dashi', 'Disolver el miso'],
  ingredientes: [{ ingredienteId: 'Miso', cantidad: '2', unidad: 'cucharadas' }],
  dificultad: 'facil',
  imagenes: ['https://example.com/miso.jpg'],
  estado: 'publicado',
  createdAt: new Date('2026-08-21T00:00:00.000Z'),
}

const region: Region = {
  id: 'japon-001-region-1',
  paisId: 'japon-001',
  nombre: 'Kioto',
  lat: 35.01,
  lng: 135.77,
}

const mockLandingData = vi.hoisted<{
  paises: Pais[]
  paisesConRecetas: Pais[]
  recetasPorPais: Record<string, Platillo[]>
  regionesPorPais: Record<string, Region[]>
  isLoading: boolean
  error: Error | null
}>(() => ({
  paises: [],
  paisesConRecetas: [],
  recetasPorPais: {},
  regionesPorPais: {},
  isLoading: false,
  error: null,
}))

vi.mock('@/services/hooks/useLandingData', () => ({
  useLandingData: () => mockLandingData,
}))

function seedLandingData() {
  mockLandingData.paises = [japon]
  mockLandingData.paisesConRecetas = [japon]
  mockLandingData.recetasPorPais = { 'japon-001': [receta] }
  mockLandingData.regionesPorPais = { 'japon-001': [region] }
}

describe('MapaMundi', () => {
  beforeEach(seedLandingData)

  it('renderiza el componente sin errores', () => {
    const { container } = render(<MapaMundi />)
    expect(container).toBeInTheDocument()
  })

  it('muestra el container del mapa', async () => {
    render(<MapaMundi />)
    await waitFor(() => expect(screen.getByRole('region')).toBeInTheDocument())
  })

  it('renderiza marcadores para los países con recetas', async () => {
    const { container } = render(<MapaMundi />)
    await waitFor(() =>
      expect(container.querySelectorAll('.leaflet-marker-icon').length).toBeGreaterThan(0)
    )
  })

  it('invita a aportar cuando ningún país tiene recetas publicadas', async () => {
    mockLandingData.paisesConRecetas = []
    mockLandingData.recetasPorPais = {}

    const { container } = render(<MapaMundi />)

    await waitFor(() => expect(container.querySelectorAll('.leaflet-marker-icon')).toHaveLength(0))
    expect(screen.getByText('Aportar una receta')).toBeInTheDocument()
  })
})
