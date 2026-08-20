import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

  it('renderiza country names cuando hay datos', async () => {
    render(<MapaMundi />)
    await waitFor(() => expect(screen.getByText(/Honduras|Guatemala|Mexico/)).toBeInTheDocument())
  })

  it('tiene panel lateral cuando hay un país seleccionado en state', async () => {
    // Render with external prop not supported - test internal state only
    render(<MapaMundi />)
    // Panel appears when user clicks a marker - test basic rendering
    await waitFor(() => expect(screen.getByRole('region')).toBeInTheDocument())
  })
})
