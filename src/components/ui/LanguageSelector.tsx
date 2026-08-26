'use client'

import { Globe } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import type { Language } from '@/i18n/types'

interface LanguageSelectorProps {
  variant?: 'light' | 'dark' | 'transparent'
}

export function LanguageSelector({ variant = 'transparent' }: LanguageSelectorProps) {
  const { language, setLanguage } = useI18n()

  const toggleLanguage = () => {
    const nextLang: Language = language === 'es' ? 'en' : 'es'
    setLanguage(nextLang)
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      aria-label="Seleccionar idioma"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
        variant === 'dark'
          ? 'border-white/20 bg-white/10 text-[#f5f1e8] hover:bg-white/20'
          : 'border-border/60 bg-card/80 text-foreground hover:bg-muted shadow-xs'
      }`}
    >
      <Globe className="w-3.5 h-3.5 opacity-80" />
      <span className="uppercase tracking-wider">{language}</span>
    </button>
  )
}
