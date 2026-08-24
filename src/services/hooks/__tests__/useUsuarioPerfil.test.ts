import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useUsuarioPerfil } from '../useUsuarioPerfil'
import * as comunidadService from '@/services/comunidad'
import * as authHook from '../useAuth'
import type { UsuarioPerfil } from '@/types'
import type { User } from 'firebase/auth'

vi.mock('@/services/comunidad', async () => {
  const actual =
    await vi.importActual<typeof import('@/services/comunidad')>('@/services/comunidad')
  return {
    ...actual,
    getUsuarioPerfil: vi.fn(),
    crearOActualizarPerfil: vi.fn(),
    actualizarPerfilUsuario: vi.fn(),
  }
})

vi.mock('../useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('useUsuarioPerfil', () => {
  const mockUser = {
    uid: 'usr-test-123',
    email: 'guardiana@biteatlas.org',
    displayName: 'Itzel Guardiana',
    photoURL: null,
  }

  const mockPerfil: UsuarioPerfil = {
    uid: 'usr-test-123',
    email: 'guardiana@biteatlas.org',
    displayName: 'Itzel Guardiana',
    rol: 'cronista',
    puntosAntropologicos: 250,
    puntosCuraduria: 50,
    aportesValidados: 5,
    insignias: [],
    createdAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authHook.useAuth).mockReturnValue({
      user: mockUser as User,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      signInWithGoogle: vi.fn(),
      logout: vi.fn(),
    })

    vi.mocked(comunidadService.getUsuarioPerfil).mockResolvedValue(mockPerfil)
  })

  it('carga el perfil del usuario autenticado y calcula el progreso a Guardián', async () => {
    const { result } = renderHook(() => useUsuarioPerfil())

    await waitFor(() => {
      expect(result.current.perfil).toEqual(mockPerfil)
      expect(result.current.progresoRango.siguienteRol).toBe('guardian')
      expect(result.current.progresoRango.puntosFaltantes).toBe(250) // 500 - 250
      expect(result.current.progresoRango.aportesFaltantes).toBe(5) // 10 - 5
      expect(result.current.progresoRango.porcentajeProgreso).toBeGreaterThan(0)
    })
  })

  it('inicializa un perfil por defecto si no existe en Firestore', async () => {
    vi.mocked(comunidadService.getUsuarioPerfil).mockResolvedValue(null)
    vi.mocked(comunidadService.crearOActualizarPerfil).mockResolvedValue({
      ...mockPerfil,
      rol: 'novicio',
      puntosAntropologicos: 0,
      aportesValidados: 0,
    })

    const { result } = renderHook(() => useUsuarioPerfil())

    await waitFor(() => {
      expect(comunidadService.crearOActualizarPerfil).toHaveBeenCalled()
      expect(result.current.perfil?.rol).toBe('novicio')
    })
  })

  it('permite actualizar los datos del perfil del usuario', async () => {
    const perfilActualizado: UsuarioPerfil = {
      ...mockPerfil,
      displayName: 'Itzel Cronista Mayor',
      photoURL: 'https://example.com/avatar.jpg',
      regionesEspecialidad: ['Mesoamérica'],
    }
    vi.mocked(comunidadService.actualizarPerfilUsuario).mockResolvedValue(perfilActualizado)

    const { result } = renderHook(() => useUsuarioPerfil())

    await waitFor(() => {
      expect(result.current.perfil).not.toBeNull()
    })

    await act(async () => {
      await result.current.actualizarPerfil({
        displayName: 'Itzel Cronista Mayor',
        photoURL: 'https://example.com/avatar.jpg',
        regionesEspecialidad: ['Mesoamérica'],
      })
    })

    expect(comunidadService.actualizarPerfilUsuario).toHaveBeenCalledWith(
      'usr-test-123',
      expect.objectContaining({
        displayName: 'Itzel Cronista Mayor',
        photoURL: 'https://example.com/avatar.jpg',
        regionesEspecialidad: ['Mesoamérica'],
      })
    )
    expect(result.current.perfil?.displayName).toBe('Itzel Cronista Mayor')
  })
})
