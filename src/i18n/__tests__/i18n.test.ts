import { describe, it, expect } from 'vitest'
import { es } from '../locales/es'
import { en } from '../locales/en'

describe('Sistema de Internacionalización (i18n)', () => {
  it('los diccionarios en español e inglés deben tener la misma estructura exacta de claves', () => {
    function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
      return Object.keys(obj).reduce((res: string[], key: string) => {
        const fullKey = prefix ? `${prefix}.${key}` : key
        const val = obj[key]
        if (typeof val === 'object' && val !== null) {
          res.push(...getKeys(val as Record<string, unknown>, fullKey))
        } else {
          res.push(fullKey)
        }
        return res
      }, [])
    }

    const esKeys = getKeys(es as unknown as Record<string, unknown>).sort()
    const enKeys = getKeys(en as unknown as Record<string, unknown>).sort()

    expect(esKeys).toEqual(enKeys)
  })

  it('todas las traducciones en inglés y español deben ser cadenas no vacías', () => {
    function checkValues(obj: Record<string, unknown>) {
      for (const key in obj) {
        const val = obj[key]
        if (typeof val === 'object' && val !== null) {
          checkValues(val as Record<string, unknown>)
        } else {
          expect(typeof val).toBe('string')
          expect((val as string).trim().length).toBeGreaterThan(0)
        }
      }
    }

    checkValues(es as unknown as Record<string, unknown>)
    checkValues(en as unknown as Record<string, unknown>)
  })
})
