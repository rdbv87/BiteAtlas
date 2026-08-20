'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/services/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const router = useRouter()
  const { register, signInWithGoogle, user, isLoading, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const displayedError = error ?? authError

  useEffect(() => {
    if (isLoading) return
    if (!user) return

    router.replace('/aportes')
  }, [isLoading, user, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await register(email, password, displayName)
      router.replace('/aportes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsGoogleSubmitting(true)

    try {
      await signInWithGoogle()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo iniciar sesion con Google. Intenta de nuevo.'
      )
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#e6eadc] text-[#173c3a]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(23,60,58,0.14),transparent_40%)]" />
        <svg viewBox="0 0 800 800" className="absolute inset-0 h-full w-full opacity-70">
          <defs>
            <pattern id="register-grid" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M72 0H0V72" fill="none" stroke="rgba(23,60,58,0.12)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="800" fill="url(#register-grid)" />
          <path
            d="M140 660C220 540 320 500 420 560C510 610 620 630 720 560C780 520 840 470 900 510"
            fill="none"
            stroke="rgba(23,60,58,0.18)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M90 560C170 440 250 430 340 480C430 530 520 530 610 480C690 440 760 400 830 450"
            fill="none"
            stroke="rgba(23,60,58,0.14)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="600" cy="230" r="42" fill="rgba(23,60,58,0.08)" />
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-screen items-center justify-center px-6 py-12 lg:px-10">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="space-y-8 rounded-[2rem] border border-[#173c3a]/10 bg-white/95 p-10 shadow-[0_24px_80px_rgba(23,60,58,0.08)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#173c3a]/15 bg-[#173c3a]/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#173c3a]">
              Registro nuevo
            </span>
            <div>
              <h1 className="text-5xl font-editorial font-semibold tracking-[-0.04em] sm:text-6xl">
                Crea tu cuenta y apunta un nuevo sabor en el mapa.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#47615a]">
                Regístrate con correo o Google para empezar a aportar recetas, fotos e historias de
                tu cocina.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[#173c3a]/10 bg-[#eff5ee] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">Compártelo</p>
                <p className="mt-3 text-sm leading-7 text-[#47615a]">
                  Tu receta queda lista para que otros la descubran.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[#173c3a]/10 bg-[#eff5ee] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">Presérvalo</p>
                <p className="mt-3 text-sm leading-7 text-[#47615a]">
                  Tu aporte se revisa antes de publicarse, preservando calidad.
                </p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-[#173c3a]/10 bg-white/95 p-10 shadow-[0_24px_80px_rgba(23,60,58,0.08)]">
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-[#173c3a]/10 blur-3xl" />
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">
                  Crear cuenta
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#173c3a]">
                  Haz que tu receta cuente.
                </h2>
              </div>

              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleSubmitting}
                >
                  {isGoogleSubmitting ? 'Continuando con Google...' : 'Continuar con Google'}
                </Button>

                <div className="flex items-center gap-3 text-sm text-[#47615a]">
                  <span className="h-px flex-1 bg-[#173c3a]/10" />
                  <span>o con tu correo</span>
                  <span className="h-px flex-1 bg-[#173c3a]/10" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-[#173c3a]" htmlFor="displayName">
                    Nombre de usuario
                  </label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#173c3a]" htmlFor="email">
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#173c3a]" htmlFor="password">
                    Contraseña
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="mt-2"
                  />
                </div>

                {displayedError ? (
                  <p className="text-sm text-destructive">{displayedError}</p>
                ) : null}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </form>

              <p className="mt-4 text-sm text-[#47615a]">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/auth/login"
                  className="text-[#173c3a] font-semibold underline-offset-4 hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
