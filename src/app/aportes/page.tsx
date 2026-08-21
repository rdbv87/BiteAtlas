'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FormularioAporte, type FormData } from '@/components/aportes/FormularioAporte'
import { useAuth } from '@/services/hooks/useAuth'
import { createPlatillo } from '@/services/platillos'

const GUIA_EDITORIAL = [
  {
    titulo: 'Contexto base',
    copy: 'Presenta el nombre, país y región, y marca en el mapa el punto exacto de origen.',
  },
  {
    titulo: 'Ingredientes vivos',
    copy: 'Documenta proporciones reales para que la receta pueda reproducirse fielmente.',
  },
  {
    titulo: 'Método de cocina',
    copy: 'Describe la técnica paso a paso con lenguaje claro y accionable.',
  },
  {
    titulo: 'Archivo visual',
    copy: 'Sube imágenes y recursos que muestren color, textura y presentación final.',
  },
  {
    titulo: 'Memoria cultural',
    copy: 'Añade la historia local para conservar el valor simbólico del platillo.',
  },
]

function MapGridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-80">
      <svg viewBox="0 0 900 900" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M72 0H0V72" fill="none" stroke="rgba(23,60,58,0.12)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="900" height="900" fill="url(#grid)" />
        <path
          d="M120 660C220 520 320 500 430 560C520 610 620 620 700 550C780 480 840 430 920 470"
          fill="none"
          stroke="rgba(23,60,58,0.18)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M80 560C170 430 250 420 340 470C430 520 540 520 620 470C700 430 760 400 840 450"
          fill="none"
          stroke="rgba(23,60,58,0.14)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="580" cy="220" r="42" fill="rgba(23,60,58,0.08)" />
        <circle cx="170" cy="170" r="28" fill="rgba(23,60,58,0.06)" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,60,58,0.12),transparent_40%)]" />
    </div>
  )
}

export default function AportesPage() {
  const { user, isLoading } = useAuth()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pasoActivo, setPasoActivo] = useState(0)

  const onSubmit = async (data: FormData, imageFiles: File[]) => {
    if (!user) return

    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await createPlatillo(data, user.uid, imageFiles)
      setSuccessMessage('Tu aporte se envió correctamente y está pendiente de revisión.')
    } catch (error) {
      console.error('Error enviando aporte:', error)
      setErrorMessage('No se pudo enviar el aporte. Intenta de nuevo más tarde.')
    }
  }

  const onCancel = () => {
    window.history.back()
  }

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f5f1e8] text-[#173c3a]">
        <MapGridBackground />
        <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
          <div className="text-center space-y-4 rounded-[2rem] border border-[#173c3a]/10 bg-white/95 p-10 shadow-[0_20px_80px_rgba(23,60,58,0.08)]">
            <div className="mx-auto h-12 w-12 rounded-full border-4 border-[#173c3a] border-t-transparent animate-spin" />
            <p className="font-medium text-[#47615a]">Verificando tu sesión...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f5f1e8] text-[#173c3a]">
        <MapGridBackground />
        <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-10">
            <section className="rounded-[2rem] border border-[#173c3a]/10 bg-white/90 p-7 shadow-[0_24px_80px_rgba(23,60,58,0.08)] sm:p-9 lg:p-10">
              <p className="inline-flex rounded-full border border-[#173c3a]/20 bg-[#f5f1e8] px-4 py-2 text-[0.72rem] uppercase tracking-[0.3em] text-[#173c3a]">
                Convocatoria abierta
              </p>

              <h1 className="font-editorial mt-6 max-w-[16ch] text-5xl leading-[0.98] tracking-[-0.03em] sm:text-6xl">
                Tu cocina también cuenta la historia de tu territorio.
              </h1>

              <p className="mt-6 max-w-[34rem] text-base leading-8 text-[#47615a] sm:text-lg">
                Para publicar un aporte en BiteAtlas, inicia sesión o crea tu cuenta. El proceso
                dura pocos minutos y deja un registro cultural valioso para la comunidad.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/auth/login"
                  className="inline-flex h-[4.15rem] items-center justify-center rounded-full bg-[#173c3a] px-6 text-[1.02rem] font-semibold text-[#f5f1e8] transition-colors hover:bg-[#234c49] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#173c3a]/40"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex h-[4.15rem] items-center justify-center rounded-full border border-[#173c3a]/15 bg-[#f5f1e8] px-6 text-[1.02rem] font-semibold text-[#173c3a] transition-colors hover:bg-[#e9efe6] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#173c3a]/30"
                >
                  Crear cuenta
                </Link>
              </div>
            </section>

            <aside className="overflow-hidden rounded-[2rem] border border-[#173c3a]/10 bg-[#173c3a] text-[#f5f1e8] shadow-[0_24px_80px_rgba(23,60,58,0.22)]">
              <div className="h-full bg-[linear-gradient(160deg,rgba(240,163,91,0.16),rgba(23,60,58,0)_38%),linear-gradient(rgba(245,241,232,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(245,241,232,0.08)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px] p-7 sm:p-9">
                <p className="text-[0.72rem] uppercase tracking-[0.3em] text-[#d4ddd1]">
                  Sello de curaduría
                </p>
                <h2 className="font-editorial mt-5 max-w-[16ch] text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl">
                  Cada receta es un archivo vivo de memoria gastronómica.
                </h2>

                <div className="mt-7 space-y-3">
                  <article className="rounded-[1.35rem] border border-white/15 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#d4ddd1]">Paso 1</p>
                    <p className="mt-3 text-base font-semibold text-white">Ubica la receta</p>
                    <p className="mt-2 text-sm leading-7 text-[#e6eee9]">
                      Define país, región y contexto inicial para situar el aporte con precisión.
                    </p>
                  </article>
                  <article className="rounded-[1.35rem] border border-white/15 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#d4ddd1]">Paso 2</p>
                    <p className="mt-3 text-base font-semibold text-white">Documenta y comparte</p>
                    <p className="mt-2 text-sm leading-7 text-[#e6eee9]">
                      Incluye ingredientes, preparación y referencias visuales para que otros puedan
                      recrearla.
                    </p>
                  </article>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f1e8] text-[#173c3a]">
      <MapGridBackground />
      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[.98fr_1.02fr] lg:items-start lg:gap-10">
          <section className="space-y-6">
            <article className="rounded-[2rem] border border-[#173c3a]/10 bg-white/90 p-7 shadow-[0_24px_80px_rgba(23,60,58,0.08)] sm:p-9">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#173c3a]/15 bg-[#173c3a]/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#173c3a]">
                Edición comunitaria
              </span>
              <h1 className="font-editorial mt-6 text-5xl leading-[0.99] tracking-[-0.03em] sm:text-6xl">
                Tu aporte puede convertirse en la próxima ficha cultural del atlas.
              </h1>
              <p className="mt-6 max-w-[34rem] text-base leading-8 text-[#47615a] sm:text-lg">
                Completa el formulario con precisión culinaria y contexto local. El equipo de
                curaduría revisará tu envío antes de publicarlo.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[#173c3a]/10 bg-[#eff5ee] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">Cobertura</p>
                  <p className="mt-3 text-sm leading-7 text-[#47615a]">
                    Incluye técnica, ingredientes y contexto cultural para enriquecer el mapa
                    gastronómico.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[#173c3a]/10 bg-[#eff5ee] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">
                    Proceso editorial
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#47615a]">
                    Cada aporte se revisa para asegurar calidad, trazabilidad y valor histórico.
                  </p>
                </div>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-[#173c3a]/10 bg-[#173c3a] text-[#f5f1e8] shadow-[0_24px_80px_rgba(23,60,58,0.2)]">
              <div className="grid gap-4 border-l-[6px] border-[#e8754f] bg-[linear-gradient(140deg,rgba(240,163,91,0.2),rgba(23,60,58,0)_40%)] p-6 sm:p-7">
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#d4ddd1]">
                  Sello de curaduría
                </p>
                <p className="font-editorial text-3xl leading-[1.06] tracking-[-0.02em] text-[#f5f1e8] sm:text-4xl">
                  {GUIA_EDITORIAL[pasoActivo]?.titulo}
                </p>
                <p className="text-sm leading-7 text-[#dfeae5] sm:text-base">
                  {GUIA_EDITORIAL[pasoActivo]?.copy}
                </p>
              </div>
            </article>
          </section>

          <section className="rounded-[2rem] border border-[#173c3a]/10 bg-white/95 p-7 shadow-[0_24px_80px_rgba(23,60,58,0.08)] sm:p-9">
            <div className="flex flex-col gap-4 border-b border-[#173c3a]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#173c3a]/70">
                  Formulario de aporte
                </p>
                <h2 className="font-editorial mt-2 text-4xl leading-[1.02] tracking-[-0.02em] text-[#173c3a]">
                  Tu aporte en el atlas
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/mis-aportes"
                  className="rounded-full border border-[#173c3a]/20 bg-white px-4 py-2 text-xs font-semibold text-[#173c3a] transition-colors hover:border-[#e8754f] hover:text-[#e8754f]"
                >
                  Mis aportes
                </Link>
                <div className="rounded-full border border-[#173c3a]/15 bg-[#f5f1e8] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#173c3a]">
                  Paso {pasoActivo + 1} de {GUIA_EDITORIAL.length}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#47615a]">
              Completa cada bloque con detalle y claridad. Tu contenido se publica cuando termine la
              revisión editorial.
            </p>

            <div className="mt-8">
              <FormularioAporte
                onSubmit={onSubmit}
                onCancel={onCancel}
                onStepChange={setPasoActivo}
              />
            </div>

            {successMessage ? (
              <div className="mt-6 rounded-2xl border border-[#173c3a]/15 bg-[#ecf4eb] px-4 py-3 text-sm text-[#173c3a]">
                {successMessage}
              </div>
            ) : null}
            {errorMessage ? (
              <div className="mt-6 rounded-2xl border border-[#b5432a]/25 bg-[#fdf1ec] px-4 py-3 text-sm text-[#b5432a]">
                {errorMessage}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  )
}
