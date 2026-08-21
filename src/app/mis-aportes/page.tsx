'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FirebaseError } from 'firebase/app'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { ArrowLeft, CheckCircle2, Clock3, Edit3, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { firestore } from '@/services/firebase'
import { useAuth } from '@/services/hooks/useAuth'
import { updatePlatillo } from '@/services/platillos'
import { FormularioAporte, type FormData } from '@/components/aportes/FormularioAporte'
import type { Platillo } from '@/types'

const estadoLabels: Record<Platillo['estado'], string> = {
  pendiente: 'Pendiente de revisión',
  publicado: 'Publicado',
  rechazado: 'Rechazado',
}

function formatDate(value: unknown) {
  const timestamp = value as { toDate?: () => Date } | null
  const date = value instanceof Date ? value : (timestamp?.toDate?.() ?? null)

  return date ? date.toLocaleDateString('es-HN') : 'Fecha no disponible'
}

export default function MisAportesPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [aportes, setAportes] = useState<Platillo[]>([])
  const [aporteEditando, setAporteEditando] = useState<Platillo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthLoading || !user || !firestore) return

    let cancelled = false

    getDocs(query(collection(firestore, 'platillos'), where('contribuidorId', '==', user.uid)))
      .then((snapshot) => {
        if (cancelled) return
        setAportes(snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as Platillo))
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar tus aportes.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isAuthLoading, user])

  const guardarEdicion = async (data: FormData, imageFiles: File[]) => {
    if (!user || !aporteEditando) return

    setIsSaving(true)
    setError(null)

    try {
      await updatePlatillo(aporteEditando.id, data, user.uid, imageFiles)
      setAportes((current) =>
        current.map((aporte) =>
          aporte.id === aporteEditando.id
            ? { ...aporte, ...data, estado: 'pendiente', updatedAt: new Date() }
            : aporte
        )
      )
      setAporteEditando(null)
    } catch (saveError) {
      console.error('Error actualizando aporte:', saveError)
      setError(
        saveError instanceof FirebaseError && saveError.code === 'permission-denied'
          ? 'No tienes permisos para editar este aporte. Despliega las reglas de Firestore y vuelve a intentarlo.'
          : 'No se pudo guardar el aporte. Intenta nuevamente.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isAuthLoading || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] text-[#173c3a]">
        Cargando tus aportes...
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-6 text-center text-[#173c3a]">
        <div>
          <h1 className="font-editorial text-4xl">Inicia sesión para ver tus aportes</h1>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex text-sm font-semibold text-[#e8754f]"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </main>
    )
  }

  if (aporteEditando) {
    return (
      <main className="min-h-screen bg-[#f5f1e8] px-6 py-10 text-[#173c3a] sm:px-10 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => setAporteEditando(null)}
            className="inline-flex items-center gap-2 text-sm text-[#47615a] hover:text-[#e8754f]"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a mis aportes
          </button>
          <div className="mt-8 border-b border-[#173c3a]/10 pb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#e8754f]">Edición completa</p>
            <h1 className="mt-2 font-editorial text-5xl leading-none">Edita tu aporte</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#47615a]">
              Puedes cambiar país, región, ubicación exacta, ingredientes, preparación, imágenes y
              contexto cultural. Al guardar, volverá a revisión.
            </p>
          </div>
          {error ? (
            <p className="mt-6 border border-[#b5432a]/20 bg-[#fdf1ec] p-4 text-sm text-[#b5432a]">
              {error}
            </p>
          ) : null}
          <div className="mt-8 rounded-[2rem] border border-[#173c3a]/10 bg-white/95 p-6 shadow-[0_24px_80px_rgba(23,60,58,0.08)] sm:p-9">
            <FormularioAporte
              initialValues={{
                paisId: aporteEditando.paisId,
                regionId: aporteEditando.regionId,
                lat: aporteEditando.lat,
                lng: aporteEditando.lng,
                nombre: aporteEditando.nombre,
                descripcion: aporteEditando.descripcion,
                instrucciones: aporteEditando.instrucciones,
                ingredientes: aporteEditando.ingredientes,
                tiempoPreparacion: aporteEditando.tiempoPreparacion,
                dificultad: aporteEditando.dificultad,
                porciones: aporteEditando.porciones,
                imagenes: aporteEditando.imagenes,
                video: aporteEditando.video,
                varianteDeId: aporteEditando.varianteDeId,
                contextoHistorico: aporteEditando.contextoHistorico,
                festividades: aporteEditando.festividades,
              }}
              onSubmit={guardarEdicion}
              onCancel={() => setAporteEditando(null)}
              submitLabel={isSaving ? 'Guardando aporte...' : 'Guardar cambios'}
            />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-6 py-10 text-[#173c3a] sm:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/aportes"
          className="inline-flex items-center gap-2 text-sm text-[#47615a] hover:text-[#e8754f]"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a aportar
        </Link>
        <div className="mt-8 flex flex-col gap-4 border-b border-[#173c3a]/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#e8754f]">
              Tu archivo culinario
            </p>
            <h1 className="mt-2 font-editorial text-5xl leading-none">Mis aportes</h1>
          </div>
          <span className="text-sm text-[#47615a]">{aportes.length} registros</span>
        </div>

        {error ? (
          <p className="mt-6 border border-[#b5432a]/20 bg-[#fdf1ec] p-4 text-sm text-[#b5432a]">
            {error}
          </p>
        ) : null}

        {aportes.length === 0 ? (
          <div className="mt-10 border border-dashed border-[#173c3a]/20 bg-white/60 p-10 text-center">
            <p className="font-editorial text-3xl">Todavía no tienes aportes.</p>
            <Link href="/aportes" className="mt-5 inline-flex text-sm font-semibold text-[#e8754f]">
              Crear mi primer aporte
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5">
            {aportes.map((aporte) => (
              <article
                key={aporte.id}
                className="border border-[#173c3a]/10 bg-white p-6 shadow-[0_12px_40px_rgba(23,60,58,0.06)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-editorial text-3xl">{aporte.nombre}</h2>
                    <p className="mt-2 text-xs text-[#47615a]">
                      Enviado el {formatDate(aporte.createdAt)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[#47615a]">
                    {aporte.estado === 'publicado' ? (
                      <CheckCircle2 className="h-4 w-4 text-[#2f7d62]" />
                    ) : aporte.estado === 'rechazado' ? (
                      <XCircle className="h-4 w-4 text-[#b5432a]" />
                    ) : (
                      <Clock3 className="h-4 w-4 text-[#e8754f]" />
                    )}
                    {estadoLabels[aporte.estado]}
                  </span>
                </div>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#47615a]">
                  {aporte.descripcion}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 gap-2"
                  onClick={() => setAporteEditando(aporte)}
                >
                  <Edit3 className="h-4 w-4" /> Editar aporte completo
                </Button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
