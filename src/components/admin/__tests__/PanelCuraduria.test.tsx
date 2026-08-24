import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PanelCuraduria } from '../PanelCuraduria'
import * as comunidadService from '@/services/comunidad'

vi.mock('@/services/firebase', () => ({
  firestore: {},
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({
    docs: [
      {
        id: 'puente-test-1',
        data: () => ({
          id: 'puente-test-1',
          origenPlatilloId: 'mole-poblano',
          destinoPlatilloId: 'curry-madras',
          tipoVinculo: 'tecnica_comun',
          justificacionAntropologica: 'Uso complejo de especias tostadas y molienda ancestral.',
          aprobacionesGuardianes: ['guardian-1'],
          estado: 'pendiente',
        }),
      },
    ],
  }),
  query: vi.fn(),
  where: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/services/comunidad', async () => {
  const actual =
    await vi.importActual<typeof import('@/services/comunidad')>('@/services/comunidad')
  return {
    ...actual,
    aprobarPuenteCulinario: vi.fn().mockResolvedValue({
      aprobado: true,
      puente: { id: 'puente-test-1', estado: 'aprobado' },
    }),
    aprobarAdaptacionLocal: vi.fn().mockResolvedValue({
      aprobado: true,
      adaptacion: { id: 'adap-test-1', estado: 'aprobado' },
    }),
  }
})

describe('PanelCuraduria', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el panel de curaduría con las propuestas pendientes', async () => {
    render(<PanelCuraduria currentUserId="guardian-2" />)

    await waitFor(() => {
      expect(screen.getByText('Panel de Curaduría de Guardianes')).toBeDefined()
      expect(screen.getByText(/Uso complejo de especias tostadas/i)).toBeDefined()
      expect(screen.getByText('Aprobar como Guardián')).toBeDefined()
    })
  })

  it('permite al guardián aprobar un puente culinario', async () => {
    render(<PanelCuraduria currentUserId="guardian-2" />)

    await waitFor(() => {
      expect(screen.getByText('Aprobar como Guardián')).toBeDefined()
    })

    const btnAprobar = screen.getByText('Aprobar como Guardián')
    fireEvent.click(btnAprobar)

    await waitFor(() => {
      expect(comunidadService.aprobarPuenteCulinario).toHaveBeenCalledWith(
        'puente-test-1',
        'guardian-2',
        false
      )
      expect(screen.getByText(/¡Puente culinario aprobado y publicado en el mapa!/i)).toBeDefined()
    })
  })
})
