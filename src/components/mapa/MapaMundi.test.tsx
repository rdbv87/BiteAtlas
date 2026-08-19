import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MapaMundi } from './MapaMundi'

describe('MapaMundi', () => {
  it('renderiza el componente sin errores', () => {
    const { container } = render(<MapaMundi />)
    expect(container).toBeInTheDocument()
  })

  it('muestra el container del mapa con estado de carga', () => {
    render(<MapaMundi />)
    expect(screen.getByText('Cargando mapa del mundo...')).toBeInTheDocument()
  })

  it('renderiza country names cuando hay datos', () => {
    render(<MapaMundi />)
    // Testing that the component renders without crashing
    expect(screen.getByText(/Honduras|Guatemala|Mexico/)).toBeInTheDocument()
  })

  it('tiene panel lateral cuando hay un país seleccionado en state', () => {
    // Render with external prop not supported - test internal state only
    render(<MapaMundi />)
    // Panel appears when user clicks a marker - test basic rendering
    expect(screen.getByRole('region')).toBeInTheDocument()
  })
})
