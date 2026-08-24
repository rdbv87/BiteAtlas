import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PuentesCulinariosSection } from '../PuentesCulinariosSection'
import { AdaptacionesLocalesSection } from '../AdaptacionesLocalesSection'
import { ValidacionRaicesSection } from '../ValidacionRaicesSection'
import type { PuenteCulinario, AdaptacionLocal, ValidacionRaicesReview } from '@/types'

describe('PuentesCulinariosSection', () => {
  const mockPuente: PuenteCulinario = {
    id: 'puente-1',
    origenPlatilloId: 'platillo-1',
    destinoPlatilloId: 'platillo-2',
    tipoVinculo: 'migracion',
    justificacionAntropologica: 'Vínculo histórico a través de la ruta de la seda.',
    fuentes: ['Historia Culinaria tomo I'],
    creadoPorId: 'usr-1',
    estado: 'aprobado',
    aprobacionesGuardianes: ['g1', 'g2'],
    createdAt: new Date(),
  }

  it('renderiza la lista de puentes y badges de conexión', () => {
    render(<PuentesCulinariosSection puentes={[mockPuente]} onProponerPuente={vi.fn()} />)

    expect(screen.getByText('Puentes Culinarios')).toBeDefined()
    expect(screen.getByText('Ruta de Migración')).toBeDefined()
    expect(screen.getByText('Vínculo histórico a través de la ruta de la seda.')).toBeDefined()
    expect(screen.getByText('Validado por Guardianes')).toBeDefined()
  })

  it('despliega el formulario de propuesta al hacer click en el botón', () => {
    render(<PuentesCulinariosSection puentes={[]} onProponerPuente={vi.fn()} />)

    const btn = screen.getByText('Conectar Receta')
    fireEvent.click(btn)
    expect(screen.getByText('Proponer Conexión Culinaria')).toBeDefined()
  })
})

describe('AdaptacionesLocalesSection', () => {
  const mockAdaptacion: AdaptacionLocal = {
    id: 'adap-1',
    platilloId: 'platillo-1',
    autorId: 'usr-1',
    autorNombre: 'Doña María',
    comunidadRegion: 'Pueblos Mancomunados',
    ingredienteOriginal: 'Epazote',
    ingredienteSustituto: 'Poleo',
    tecnicaVariante: 'Tueste en comal de barro',
    justificacionCultural: 'El poleo silvestre de la sierra aporta notas aromáticas endémicas.',
    votosFavor: 8,
    votosContra: 1,
    estado: 'aprobado',
    aprobacionesGuardianes: ['g1', 'g2'],
    createdAt: new Date(),
  }

  it('renderiza la lista de adaptaciones y votos comunitarios', () => {
    render(
      <AdaptacionesLocalesSection
        adaptaciones={[mockAdaptacion]}
        onProponerAdaptacion={vi.fn()}
        onVotarAdaptacion={vi.fn()}
      />
    )

    expect(screen.getByText('Pueblos Mancomunados')).toBeDefined()
    expect(screen.getByText('Epazote')).toBeDefined()
    expect(screen.getByText('Poleo')).toBeDefined()
    expect(screen.getByText('8')).toBeDefined()
  })
})

describe('ValidacionRaicesSection', () => {
  const mockReview: ValidacionRaicesReview = {
    id: 'rev-1',
    platilloId: 'platillo-1',
    autorId: 'usr-1',
    autorNombre: 'Antropólogo Carlos',
    fidelidadCultural: 5,
    claridadInstrucciones: 4,
    riquezaHistorica: 5,
    comentarioCualitativo:
      'Excelente fidelidad con las técnicas mesoamericanas de nixtamalización.',
    votoConsenso: 'valida',
    createdAt: new Date(),
  }

  const mockMetricas = {
    fidelidadCultural: 5,
    claridadInstrucciones: 4,
    riquezaHistorica: 5,
    promedioGlobal: 4.7,
    totalReviews: 1,
  }

  it('renderiza métricas multidimensionales y comentarios cualitativos', () => {
    render(
      <ValidacionRaicesSection
        validaciones={[mockReview]}
        metricas={mockMetricas}
        onEnviarValidacion={vi.fn()}
      />
    )

    expect(screen.getByText('Validación de Raíces (Peer Review)')).toBeDefined()
    expect(screen.getByText('Auténtica y Verificada')).toBeDefined()
    expect(screen.getByText('Antropólogo Carlos')).toBeDefined()
    expect(screen.getByText(/Excelente fidelidad con las técnicas/i)).toBeDefined()
  })
})
