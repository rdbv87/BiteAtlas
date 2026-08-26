'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, Bookmark, Shield, PlusCircle, ChevronDown } from 'lucide-react'
import { useAuth } from '@/services/hooks/useAuth'
import { useUsuarioPerfil } from '@/services/hooks/useUsuarioPerfil'
import { Button } from '@/components/ui/button'

import { useI18n } from '@/i18n/context'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

interface UserNavProps {
  variant?: 'light' | 'dark' | 'transparent'
}

export function UserNav({ variant = 'transparent' }: UserNavProps) {
  const { user, logout } = useAuth()
  const { perfil, isLoading } = useUsuarioPerfil()
  const { t } = useI18n()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (isLoading) {
    return <div className="h-9 w-24 rounded-full bg-muted/20 animate-pulse" />
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <LanguageSelector variant={variant} />
        <Link href="/auth/login">
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs font-semibold ${
              variant === 'dark'
                ? 'text-[#f5f1e8] hover:bg-white/10'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            {t('nav.login')}
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button
            size="sm"
            className="text-xs font-semibold bg-[#e8754f] text-white hover:bg-[#d96340] shadow-sm rounded-full px-3.5"
          >
            {t('nav.register')}
          </Button>
        </Link>
      </div>
    )
  }

  const esCurador = perfil?.rol === 'guardian' || perfil?.rol === 'maestro'
  const displayName =
    perfil?.displayName || user.displayName || user.email?.split('@')[0] || 'Explorador'
  const photoURL = perfil?.photoURL || user.photoURL

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    router.push('/')
  }

  return (
    <div className="flex items-center gap-2">
      <LanguageSelector variant={variant} />
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className={`flex items-center gap-2.5 p-1 pr-3 rounded-full border transition-all cursor-pointer ${
            dropdownOpen
              ? 'border-[#e8754f] ring-2 ring-[#e8754f]/20 bg-card'
              : variant === 'dark'
                ? 'border-white/20 bg-[#173c3a]/80 text-[#f5f1e8] hover:border-white/40'
                : 'border-border/60 bg-card/90 text-foreground hover:border-primary/40 shadow-xs'
          }`}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            {photoURL ? (
              <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-primary uppercase">
                {displayName.charAt(0)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-tight truncate max-w-27.5">{displayName}</p>
            {perfil?.rol && (
              <span className="text-[9px] uppercase font-semibold text-[#e8754f] tracking-wider block">
                {perfil.rol}
              </span>
            )}
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 mt-2 w-64 rounded-2xl border bg-card/95 backdrop-blur-md p-2 shadow-xl z-50 text-foreground space-y-1"
            >
              {/* Header del Perfil */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center overflow-hidden shrink-0">
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-primary uppercase">
                        {displayName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{displayName}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-semibold text-[#e8754f] uppercase tracking-wider">
                        {perfil?.rol || 'Novicio'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">·</span>
                      <span className="text-[10px] font-bold text-primary">
                        {perfil?.puntosAntropologicos || 0} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enlaces de Navegación */}
              <div className="py-1">
                <Link
                  href="/perfil"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span>{t('nav.profile')}</span>
                </Link>

                <Link
                  href="/mis-aportes"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>{t('nav.myContributions')}</span>
                </Link>

                <Link
                  href="/aportes"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted transition-colors text-foreground"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-500" />
                  <span>{t('nav.contribute')}</span>
                </Link>

                {esCurador && (
                  <Link
                    href="/curaduria"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted transition-colors text-purple-500"
                  >
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>{t('nav.curation')}</span>
                  </Link>
                )}
              </div>

              <div className="border-t pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
