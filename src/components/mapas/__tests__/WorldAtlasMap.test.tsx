import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WorldAtlasMap } from '../WorldAtlasMap'
import { WorldAtlasCountryCard } from '../WorldAtlasCountryCard'
import type { Pais, Platillo } from '@/types'

const mockPaises: Pais[] = [
  {
    id: 'mexico',
    nombre: 'México',
    codigoISO: 'MX',
    continente: 'america',
    descripcion: 'Cuna del maíz, chiles y herencia prehispánica.',
    lat: 19.4326,
    lng: -99.1332,
  },
  {
    id: 'colombia',
    nombre: 'Colombia',
    codigoISO: 'CO',
    continente: 'america',
    descripcion: 'Tierra de café, arepas y rica biodiversidad.',
    lat: 4.711,
    lng: -74.0721,
  },
]

const mockRecetas: Record<string, Platillo[]> = {
  mexico: [
    {
      id: 'tacos-pastor',
      nombre: 'Tacos al Pastor',
      paisId: 'mexico',
      regionId: 'cdmx',
      descripcion: 'Clásico de trompo adobado con achiote y piña.',
      instrucciones: ['Marinar', 'Cocinar', 'Servir con cebolla y cilantro'],
      ingredientes: [{ ingredienteId: 'cerdo', cantidad: '500', unidad: 'g' }],
      dificultad: 'medio',
      imagenes: ['https://example.com/tacos.jpg'],
      estado: 'publicado',
      createdAt: new Date(),
    },
  ],
  colombia: [],
}

describe('WorldAtlasMap y WorldAtlasCountryCard', () => {
  it('renderiza el mapa planisferio con los filtros de continente', () => {
    const onSelectPais = vi.fn()
    render(
      <WorldAtlasMap
        paises={mockPaises}
        paisesConRecetas={[mockPaises[0]!]}
        recetasPorPais={mockRecetas}
        selectedPaisId="mexico"
        onSelectPais={onSelectPais}
      />
    )

    expect(screen.getByText('Todo el mundo')).toBeInTheDocument()
    expect(screen.getByText('América')).toBeInTheDocument()
    expect(screen.getByText('Europa')).toBeInTheDocument()
    expect(screen.getByText(/Con recetas \(1\)/i)).toBeInTheDocument()
  })

  it('renderiza la tarjeta editorial con información del país seleccionado y sus recetas', () => {
    render(
      <WorldAtlasCountryCard pais={mockPaises[0] ?? null} recetas={mockRecetas.mexico ?? []} />
    )

    expect(screen.getByText('México')).toBeInTheDocument()
    expect(screen.getByText(/1 receta/i)).toBeInTheDocument()
    expect(screen.getByText('Tacos al Pastor')).toBeInTheDocument()
    expect(screen.getByText('Explorar país en el mapa')).toBeInTheDocument()
  })

  it('muestra estado "Por descubrir" cuando un país aún no tiene recetas', () => {
    render(<WorldAtlasCountryCard pais={mockPaises[1] ?? null} recetas={[]} />)

    expect(screen.getByText('Colombia')).toBeInTheDocument()
    expect(screen.getByText(/Por descubrir/i)).toBeInTheDocument()
    expect(screen.getByText(/¿Conoces la cocina de Colombia\?/i)).toBeInTheDocument()
    expect(screen.getByText('Aportar primera receta')).toBeInTheDocument()
  })
})
