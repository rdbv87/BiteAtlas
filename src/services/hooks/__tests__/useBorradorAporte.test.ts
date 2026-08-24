import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBorradorAporte } from '../useBorradorAporte'

describe('useBorradorAporte', () => {
  const userId = 'user-test-123'
  const storageKey = `biteatlas_draft_${userId}`

  beforeEach(() => {
    localStorage.clear()
  })

  it('inicia sin borrador si localStorage está vacío', () => {
    const { result } = renderHook(() => useBorradorAporte(userId))
    expect(result.current.borrador).toBeNull()
    expect(result.current.tieneBorrador).toBe(false)
    expect(result.current.ultimoGuardado).toBeNull()
  })

  it('guarda el borrador correctamente en localStorage', () => {
    const { result } = renderHook(() => useBorradorAporte(userId))

    act(() => {
      result.current.guardarBorrador(
        {
          nombre: 'Baleada Especial',
          paisId: 'honduras-001',
          dificultad: 'facil',
        },
        1
      )
    })

    expect(result.current.tieneBorrador).toBe(true)
    expect(result.current.borrador?.formData.nombre).toBe('Baleada Especial')
    expect(result.current.borrador?.pasoActual).toBe(1)
    expect(result.current.ultimoGuardado).toBeInstanceOf(Date)

    const raw = localStorage.getItem(storageKey)
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(parsed.formData.nombre).toBe('Baleada Especial')
    expect(parsed.pasoActual).toBe(1)
  })

  it('limpia el borrador de localStorage', () => {
    const { result } = renderHook(() => useBorradorAporte(userId))

    act(() => {
      result.current.guardarBorrador({ nombre: 'Tamal' }, 2)
    })
    expect(result.current.tieneBorrador).toBe(true)

    act(() => {
      result.current.limpiarBorrador()
    })

    expect(result.current.tieneBorrador).toBe(false)
    expect(result.current.borrador).toBeNull()
    expect(localStorage.getItem(storageKey)).toBeNull()
  })

  it('carga un borrador preexistente en localStorage', () => {
    const preexistente = {
      formData: { nombre: 'Sopa de Caracol' },
      pasoActual: 3,
      guardadoEn: new Date().toISOString(),
    }
    localStorage.setItem(storageKey, JSON.stringify(preexistente))

    const { result } = renderHook(() => useBorradorAporte(userId))
    expect(result.current.tieneBorrador).toBe(true)
    expect(result.current.borrador?.formData.nombre).toBe('Sopa de Caracol')
    expect(result.current.borrador?.pasoActual).toBe(3)
  })
})
