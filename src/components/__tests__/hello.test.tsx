import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { localPaises, regionesPorPais } from '@/scripts/data'

function Hello() {
  return <div>Hello BiteAtlas</div>
}

describe('Hello', () => {
  it('renders correctly', () => {
    render(<Hello />)
    expect(screen.getByText('Hello BiteAtlas')).toBeInTheDocument()
  })
})

describe('Datos globales del formulario', () => {
  it('incluye todos los países y al menos una región por país', () => {
    expect(localPaises.length).toBeGreaterThanOrEqual(195)
    expect(localPaises.every((pais) => (regionesPorPais[pais.id]?.length ?? 0) > 0)).toBe(true)
  })
})
