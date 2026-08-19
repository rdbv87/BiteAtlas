import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

function Hello() {
  return <div>Hello BiteAtlas</div>
}

describe('Hello', () => {
  it('renders correctly', () => {
    render(<Hello />)
    expect(screen.getByText('Hello BiteAtlas')).toBeInTheDocument()
  })
})
