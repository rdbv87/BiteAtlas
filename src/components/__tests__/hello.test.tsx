import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function Hello() {
  return <div>Hello BiteAtlas</div>
}

describe('Hello', () => {
  it('renders correctly', () => {
    render(<Hello />)
    expect(screen.getByText('Hello BiteAtlas')).toBeInTheDocument()
  })
})

describe('Datos runtime del atlas', () => {
  it('no usa el catálogo local como fuente runtime en hooks cliente', () => {
    const hookFiles = [
      'src/services/hooks/useLandingData.ts',
      'src/services/hooks/usePaises.ts',
      'src/services/hooks/useCountriesRegions.ts',
    ]

    for (const file of hookFiles) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      expect(source).not.toContain('@/scripts/data')
    }
  })
})
