'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { Language, TranslationSchema } from './types'
import { es } from './locales/es'
import { en } from './locales/en'

const translations: Record<Language, TranslationSchema> = {
  es,
  en,
}

const STORAGE_KEY = 'biteatlas_language'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (path: string, params?: Record<string, string | number>) => string
  translations: TranslationSchema
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'es'
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null
    if (stored === 'es' || stored === 'en') {
      return stored
    }
    return navigator.language.startsWith('es') ? 'es' : 'en'
  } catch {
    return 'es'
  }
}

function resolveNestedKey(obj: Record<string, unknown>, path: string): string | null {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return null
    }
  }

  return typeof current === 'string' ? current : null
}

function defaultTranslate(path: string, params?: Record<string, string | number>): string {
  const result =
    resolveNestedKey(translations.es as unknown as Record<string, unknown>, path) ?? path

  if (params) {
    return Object.entries(params).reduce((acc, [k, v]) => {
      return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v))
    }, result)
  }
  return result
}

const defaultContextValue: I18nContextType = {
  language: 'es',
  setLanguage: () => {},
  t: defaultTranslate,
  translations: es,
}

const I18nContext = createContext<I18nContextType>(defaultContextValue)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
      document.documentElement.lang = lang
    } catch {
      // Ignorar errores de localStorage
    }
  }, [])

  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const currentDict = (translations[language] || translations.es) as unknown as Record<
        string,
        unknown
      >
      const fallbackDict = translations.es as unknown as Record<string, unknown>

      const result =
        resolveNestedKey(currentDict, path) ?? resolveNestedKey(fallbackDict, path) ?? path

      if (params) {
        return Object.entries(params).reduce((acc, [k, v]) => {
          return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v))
        }, result)
      }

      return result
    },
    [language]
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      translations: translations[language] || translations.es,
    }),
    [language, setLanguage, t]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextType {
  return useContext(I18nContext)
}
