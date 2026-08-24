'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsuarioPerfil } from '@/services/hooks/useUsuarioPerfil'
import { PanelCuraduria } from '@/components/admin'

export default function CuraduriaPage() {
  const { user, perfil, isLoading } = useUsuarioPerfil()

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <Clock className="w-5 h-5 animate-spin text-primary" />
          <span>Verificando permisos de Guardián...</span>
        </div>
      </main>
    )
  }

  if (!user || !perfil) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Shield className="w-12 h-12 text-muted-foreground/40 mx-auto" />
        <h1 className="text-xl font-bold text-foreground">Acceso restringido</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Inicia sesión con una cuenta de Guardián Regional o Maestro Antropólogo para acceder a la
          curaduría.
        </p>
        <Link href="/auth/login">
          <Button>Iniciar Sesión</Button>
        </Link>
      </main>
    )
  }

  const esCurador = perfil.rol === 'guardian' || perfil.rol === 'maestro'

  if (!esCurador) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h1 className="text-xl font-bold text-foreground">Rango insuficiente para curaduría</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Tu rango actual es <strong>{perfil.rol}</strong>. Para acceder al panel de curaduría
          necesitas alcanzar el rango de <strong>Guardián Regional</strong> (500 XP y 10 aportes
          validados).
        </p>
        <Link href="/perfil">
          <Button variant="outline">Ver Mi Progreso</Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Encabezado */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/perfil"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Mi Perfil</span>
          </Link>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Sesión de Guardián
          </span>
        </div>
      </header>

      {/* Contenido del Panel */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <PanelCuraduria currentUserId={user.uid} />
      </div>
    </main>
  )
}
