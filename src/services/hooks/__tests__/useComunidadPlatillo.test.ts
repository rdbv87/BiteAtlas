import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useComunidadPlatillo } from '../useComunidadPlatillo'
import * as comunidadService from '@/services/comunidad'
import type { PuenteCulinario, AdaptacionLocal, ValidacionRaicesReview } from '@/types'

vi.mock('@/services/comunidad', async () => {
  const actual =
    await vi.importActual<typeof import('@/services/comunidad')>('@/services/comunidad')
  return {
    ...actual,
    obtenerPuentesPorPlatillo: vi.fn(),
    obtenerAdaptacionesPorPlatillo: vi.fn(),
    obtenerValidacionesPorPlatillo: vi.fn(),
    crearPuenteCulinario: vi.fn(),
    crearAdaptacionLocal: vi.fn(),
    votarAdaptacionLocal: vi.fn(),
    crearValidacionRaices: vi.fn(),
  }
})

describe('useComunidadPlatillo', () => {
  const mockPuente: PuenteCulinario = {
    id: 'p-1',
    origenPlatilloId: 'plat-1',
    destinoPlatilloId: 'plat-2',
    tipoVinculo: 'migracion',
    justificacionAntropologica: 'Ruta comercial histórica',
    creadoPorId: 'usr-1',
    estado: 'aprobado',
    aprobacionesGuardianes: ['g1', 'g2'],
    createdAt: new Date(),
  }

  const mockAdaptacion: AdaptacionLocal = {
    id: 'a-1',
    platilloId: 'plat-1',
    autorId: 'usr-2',
    comunidadRegion: 'Oaxaca',
    justificacionCultural: 'Variación de chile',
    votosFavor: 3,
    votosContra: 0,
    estado: 'aprobado',
    aprobacionesGuardianes: ['g1', 'g2'],
    createdAt: new Date(),
  }

  const mockValidacion: ValidacionRaicesReview = {
    id: 'v-1',
    platilloId: 'plat-1',
    autorId: 'usr-3',
    fidelidadCultural: 5,
    claridadInstrucciones: 5,
    riquezaHistorica: 5,
    comentarioCualitativo: 'Excelente rigor',
    votoConsenso: 'valida',
    createdAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(comunidadService.obtenerPuentesPorPlatillo).mockResolvedValue([mockPuente])
    vi.mocked(comunidadService.obtenerAdaptacionesPorPlatillo).mockResolvedValue([mockAdaptacion])
    vi.mocked(comunidadService.obtenerValidacionesPorPlatillo).mockResolvedValue([mockValidacion])
  })

  it('inicia vacío si platilloId es null', () => {
    const { result } = renderHook(() => useComunidadPlatillo(null))
    expect(result.current.puentes).toEqual([])
    expect(result.current.adaptaciones).toEqual([])
    expect(result.current.validaciones).toEqual([])
  })

  it('carga datos comunitarios y calcula métricas', async () => {
    const { result } = renderHook(() => useComunidadPlatillo('plat-1'))

    await waitFor(() => {
      expect(result.current.puentes.length).toBe(1)
      expect(result.current.adaptaciones.length).toBe(1)
      expect(result.current.validaciones.length).toBe(1)
      expect(result.current.metricas.promedioGlobal).toBe(5)
    })
  })

  it('permite proponer un nuevo puente culinario y lo agrega al estado', async () => {
    const nuevoPuente: PuenteCulinario = {
      id: 'p-2',
      origenPlatilloId: 'plat-1',
      destinoPlatilloId: 'plat-3',
      tipoVinculo: 'tecnica_comun',
      justificacionAntropologica: 'Técnica de horneado en pozo',
      creadoPorId: 'usr-1',
      estado: 'pendiente',
      aprobacionesGuardianes: [],
      createdAt: new Date(),
    }
    vi.mocked(comunidadService.crearPuenteCulinario).mockResolvedValue(nuevoPuente)

    const { result } = renderHook(() => useComunidadPlatillo('plat-1'))

    await waitFor(() => expect(result.current.puentes.length).toBe(1))

    await act(async () => {
      await result.current.proponerPuente({
        destinoPlatilloId: 'plat-3',
        tipoVinculo: 'tecnica_comun',
        justificacionAntropologica: 'Técnica de horneado en pozo',
        creadoPorId: 'usr-1',
      })
    })

    expect(result.current.puentes.length).toBe(2)
    expect(result.current.puentes[0]?.id).toBe('p-2')
  })

  it('permite votar una adaptación local y actualiza los contadores', async () => {
    vi.mocked(comunidadService.votarAdaptacionLocal).mockResolvedValue({
      votosFavor: 4,
      votosContra: 0,
    })

    const { result } = renderHook(() => useComunidadPlatillo('plat-1'))

    await waitFor(() => expect(result.current.adaptaciones.length).toBe(1))

    await act(async () => {
      await result.current.votarAdaptacion('a-1', 'favor')
    })

    expect(result.current.adaptaciones[0]?.votosFavor).toBe(4)
  })
})
