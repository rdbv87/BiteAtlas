'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Plus, BookOpen, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsuarioPerfil } from '@/services/hooks/useUsuarioPerfil'
import { PerfilUsuarioCard, VitrinaInsignias } from '@/components/perfil'

function MapGridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-75">
      <svg viewBox="0 0 900 900" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="perfil-grid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M72 0H0V72" fill="none" stroke="rgba(23,60,58,0.1)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="900" height="900" fill="url(#perfil-grid)" />
        <path
          d="M120 660C220 520 320 500 430 560C520 610 620 620 700 550C780 480 840 430 920 470"
          fill="none"
          stroke="rgba(23,60,58,0.15)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M80 560C170 430 250 420 340 470C430 520 540 520 620 470C700 430 760 400 840 450"
          fill="none"
          stroke="rgba(23,60,58,0.12)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="680" cy="180" r="48" fill="rgba(232,117,79,0.06)" />
        <circle cx="150" cy="220" r="32" fill="rgba(23,60,58,0.05)" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,60,58,0.08),transparent_45%)]" />
    </div>
  )
}

export default function PerfilPage() {
  const {
    user,
    perfil,
    progresoRango,
    isLoading,
    error,
    actualizarPerfil,
    sincronizarAportesHistoricos,
  } = useUsuarioPerfil()

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)

  const handleSincronizar = async () => {
    setIsSyncing(true)
    try {
      const res = await sincronizarAportesHistoricos()
      if (res.puntosSumados > 0) {
        setSyncFeedback(
          `¡Reconciliación exitosa! Se sumaron +${res.puntosSumados} XP de ${res.nuevosHistoriales} aporte(s) histórico(s).`
        )
      } else {
        setSyncFeedback('Tus aportes y XP ya se encuentran completamente sincronizados.')
      }
      setTimeout(() => setSyncFeedback(null), 5000)
    } catch {
      setSyncFeedback('Error al reconciliar aportes históricos.')
      setTimeout(() => setSyncFeedback(null), 5000)
    } finally {
      setIsSyncing(false)
    }
  }

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f5f1e8] text-[#173c3a] flex items-center justify-center p-6">
        <MapGridBackground />
        <div className="text-center space-y-4 rounded-[2rem] border border-[#173c3a]/10 bg-white/95 p-10 shadow-[0_20px_80px_rgba(23,60,58,0.08)] max-w-sm w-full">
          <div className="mx-auto h-12 w-12 rounded-full border-4 border-[#173c3a] border-t-transparent animate-spin" />
          <p className="font-medium text-[#47615a] text-sm">Cargando perfil antropológico...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f5f1e8] text-[#173c3a] flex items-center justify-center p-6">
        <MapGridBackground />
        <div className="text-center space-y-5 rounded-[2rem] border border-[#173c3a]/10 bg-white/95 p-8 sm:p-12 shadow-[0_24px_80px_rgba(23,60,58,0.08)] max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-[#173c3a]/5 border border-[#173c3a]/15 flex items-center justify-center mx-auto text-[#173c3a]">
            <BookOpen className="w-8 h-8 text-[#e8754f]" />
          </div>
          <span className="inline-flex rounded-full border border-[#173c3a]/20 bg-[#f5f1e8] px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.28em] text-[#173c3a] font-semibold">
            Comunidad Antropológica
          </span>
          <h1 className="font-editorial text-3xl font-bold text-[#173c3a] leading-tight">
            Inicia sesión para ver tu perfil
          </h1>
          <p className="text-sm leading-relaxed text-[#47615a]">
            Forma parte de la comunidad de BiteAtlas, documenta recetas ancestrales y sube de rango
            antropológico.
          </p>
          <div className="pt-2">
            <Link href="/auth/login">
              <Button className="rounded-full bg-[#173c3a] hover:bg-[#234c49] text-[#f5f1e8] px-8 h-11 text-sm font-semibold shadow-sm">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const perfilSeguro = perfil || {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'Explorador Culinario',
    photoURL: user.photoURL || undefined,
    rol: 'novicio' as const,
    puntosAntropologicos: 0,
    puntosCuraduria: 0,
    aportesValidados: 0,
    regionesEspecialidad: [],
    insignias: [],
    createdAt: new Date(),
  }

  const esCurador = perfilSeguro.rol === 'guardian' || perfilSeguro.rol === 'maestro'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f1e8] text-[#173c3a] pb-20">
      <MapGridBackground />

      {/* Barra superior de navegación */}
      <header className="border-b border-[#173c3a]/10 bg-white/85 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#173c3a]/15 bg-[#f5f1e8]/70 text-xs font-semibold text-[#173c3a] hover:bg-[#e9efe6] hover:border-[#173c3a]/30 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Mapa</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSincronizar}
              disabled={isSyncing}
              className="rounded-full border-[#173c3a]/20 bg-white hover:bg-[#f5f1e8] text-[#173c3a] gap-1.5 text-xs font-semibold"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#e8754f] ${isSyncing ? 'animate-spin' : ''}`}
              />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Aportes y XP'}
            </Button>

            {esCurador && (
              <Link href="/curaduria">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-emerald-600/30 text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 gap-1.5 text-xs font-semibold"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  Panel de Curaduría
                </Button>
              </Link>
            )}

            <Link href="/aportes">
              <Button
                size="sm"
                className="rounded-full bg-[#173c3a] hover:bg-[#234c49] text-[#f5f1e8] text-xs font-semibold px-4 gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#e8754f]" />
                Nuevo Aporte
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {syncFeedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-[#fdf1ec] text-[#b5432a] text-sm border border-[#b5432a]/20">
            {error}
          </div>
        )}

        {/* Tarjeta de Rango y Progreso */}
        <PerfilUsuarioCard
          perfil={perfilSeguro}
          progresoRango={progresoRango}
          onActualizarPerfil={actualizarPerfil}
        />

        {/* Vitrina de Insignias */}
        <VitrinaInsignias insigniasUsuario={perfilSeguro.insignias || []} />
      </div>
    </main>
  )
}
