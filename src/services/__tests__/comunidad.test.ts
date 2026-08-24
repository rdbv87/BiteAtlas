import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import {
  calcularRolUsuario,
  evaluarConsensoComunitario,
  calcularPromedioValidaciones,
  PUNTOS_VALIDACION_RAICES,
  PUNTOS_APORTE_PLATILLO,
  PUNTOS_PUENTE_CULINARIO,
  PUNTOS_ADAPTACION_LOCAL,
} from '../comunidad'
import type { ValidacionRaicesReview } from '@/types'

describe('Constantes de Gamificación', () => {
  it('define valores positivos coherentes para todos los tipos de aportes', () => {
    expect(PUNTOS_VALIDACION_RAICES).toBe(25)
    expect(PUNTOS_APORTE_PLATILLO).toBe(50)
    expect(PUNTOS_PUENTE_CULINARIO).toBe(30)
    expect(PUNTOS_ADAPTACION_LOCAL).toBe(20)
  })
})

describe('Lógica de Gamificación y Roles (calcularRolUsuario)', () => {
  it('asigna "novicio" a usuarios recién registrados o con aportes insuficientes', () => {
    expect(calcularRolUsuario(0, 0)).toBe('novicio')
    expect(calcularRolUsuario(99, 10)).toBe('novicio')
    expect(calcularRolUsuario(200, 2)).toBe('novicio') // Puntos suficientes pero faltan aportes
  })

  it('asigna "cronista" al cumplir umbral de puntos y aportes', () => {
    expect(calcularRolUsuario(100, 3)).toBe('cronista')
    expect(calcularRolUsuario(499, 9)).toBe('cronista')
  })

  it('asigna "guardian" al cumplir 500 puntos y 10 aportes validados', () => {
    expect(calcularRolUsuario(500, 10)).toBe('guardian')
    expect(calcularRolUsuario(1499, 24)).toBe('guardian')
  })

  it('asigna "maestro" al superar 1500 puntos y 25 aportes validados', () => {
    expect(calcularRolUsuario(1500, 25)).toBe('maestro')
    expect(calcularRolUsuario(3000, 50)).toBe('maestro')
  })
})

describe('Consenso de Curaduría (evaluarConsensoComunitario)', () => {
  it('aprueba inmediatamente si la acción es ejecutada por un Administrador', () => {
    expect(evaluarConsensoComunitario([], true)).toBe(true)
    expect(evaluarConsensoComunitario(['guardian-1'], true)).toBe(true)
  })

  it('no aprueba con menos de 2 aprobaciones de guardianes para usuarios regulares', () => {
    expect(evaluarConsensoComunitario([])).toBe(false)
    expect(evaluarConsensoComunitario(['guardian-1'])).toBe(false)
  })

  it('no cuenta aprobaciones duplicadas del mismo guardián', () => {
    expect(evaluarConsensoComunitario(['guardian-1', 'guardian-1'])).toBe(false)
  })

  it('aprueba cuando hay al menos 2 guardianes distintos', () => {
    expect(evaluarConsensoComunitario(['guardian-1', 'guardian-2'])).toBe(true)
    expect(evaluarConsensoComunitario(['guardian-1', 'guardian-2', 'guardian-3'])).toBe(true)
  })
})

describe('Cálculo de Métricas Peer Review (calcularPromedioValidaciones)', () => {
  it('devuelve ceros si la lista de reviews está vacía', () => {
    const res = calcularPromedioValidaciones([])
    expect(res.totalReviews).toBe(0)
    expect(res.promedioGlobal).toBe(0)
  })

  it('calcula promedios correctamente para múltiples evaluaciones', () => {
    const reviews: ValidacionRaicesReview[] = [
      {
        id: 'rev-1',
        platilloId: 'plat-1',
        autorId: 'usr-1',
        fidelidadCultural: 5,
        claridadInstrucciones: 4,
        riquezaHistorica: 5,
        comentarioCualitativo: 'Excelente rigor histórico.',
        votoConsenso: 'valida',
        createdAt: new Date(),
      },
      {
        id: 'rev-2',
        platilloId: 'plat-1',
        autorId: 'usr-2',
        fidelidadCultural: 4,
        claridadInstrucciones: 4,
        riquezaHistorica: 3,
        comentarioCualitativo: 'Muy buena receta, instrucciones claras.',
        votoConsenso: 'valida',
        createdAt: new Date(),
      },
    ]

    const metricas = calcularPromedioValidaciones(reviews)
    expect(metricas.totalReviews).toBe(2)
    expect(metricas.fidelidadCultural).toBe(4.5)
    expect(metricas.claridadInstrucciones).toBe(4)
    expect(metricas.riquezaHistorica).toBe(4)
    expect(metricas.promedioGlobal).toBe(4.2)
  })
})

describe('Reglas de comunidad en Firestore', () => {
  it('permite crear evaluaciones usando autorId, no usuarioId, para coincidir con la estructura real', () => {
    const rulesPath = resolve(process.cwd(), 'firestore.rules')
    const rules = readFileSync(rulesPath, 'utf8')

    expect(rules).toContain('match /platillos/{platilloId}/validacionesRaices/{valId}')
    expect(rules).toContain('request.resource.data.autorId == request.auth.uid')
    expect(rules).not.toContain('request.resource.data.usuarioId == request.auth.uid')
  })
})
