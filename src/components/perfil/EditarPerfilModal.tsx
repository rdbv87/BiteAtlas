'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Image, Globe2, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { UsuarioPerfil } from '@/types'

interface EditarPerfilModalProps {
  perfil: UsuarioPerfil
  isOpen: boolean
  onClose: () => void
  onGuardar: (data: {
    displayName: string
    photoURL?: string
    regionesEspecialidad: string[]
  }) => Promise<unknown>
}

const REGIONES_DISPONIBLES = [
  'Mesoamérica',
  'Cocina Andina',
  'Mediterráneo',
  'Sudeste Asiático',
  'Caribe',
  'Cocina del Magreb',
  'Medio Oriente',
  'Asia Oriental',
  'África Subsahariana',
  'Norteamérica Indígena',
  'Amazonía',
  'Europa Nórdica',
]

const subscribeToNothing = () => () => undefined

export function EditarPerfilModal({ perfil, isOpen, onClose, onGuardar }: EditarPerfilModalProps) {
  const [displayName, setDisplayName] = useState(perfil.displayName || '')
  const [photoURL, setPhotoURL] = useState(perfil.photoURL || '')
  const [imageError, setImageError] = useState(false)
  const [regiones, setRegiones] = useState<string[]>(perfil.regionesEspecialidad || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )

  // Sincronizar estado cuando se abra o cambie el perfil
  useEffect(() => {
    if (!isOpen) return

    const frame = requestAnimationFrame(() => {
      setDisplayName(perfil.displayName || '')
      setPhotoURL(perfil.photoURL || '')
      setImageError(false)
      setRegiones(perfil.regionesEspecialidad || [])
      setError(null)
    })

    return () => cancelAnimationFrame(frame)
  }, [isOpen, perfil])

  const esUrlValida = (url: string) => {
    if (!url || typeof url !== 'string') return false
    const trimmed = url.trim()
    return (
      trimmed.startsWith('https://') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('data:image/') ||
      trimmed.startsWith('/')
    )
  }

  const toggleRegion = (reg: string) => {
    setRegiones((prev) => (prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onGuardar({
        displayName: displayName.trim(),
        photoURL: photoURL.trim() || undefined,
        regionesEspecialidad: regiones,
      })
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar cambios'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Overlay oscuro y desenfocado con bloqueo completo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#173c3a]/75 backdrop-blur-sm z-100"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            className="relative w-full max-w-lg rounded-[2rem] border border-[#173c3a]/15 bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(23,60,58,0.25)] z-101 space-y-6 my-auto text-[#173c3a]"
          >
            {/* Header del Modal */}
            <div className="flex items-start justify-between border-b border-[#173c3a]/10 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173c3a]/5 text-[#173c3a] text-[11px] font-semibold uppercase tracking-[0.2em]">
                  <User className="w-3.5 h-3.5 text-[#e8754f]" />
                  Identidad del Cronista
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#173c3a] mt-2">
                  Editar Perfil Antropológico
                </h3>
                <p className="text-xs text-[#47615a] mt-1">
                  Personaliza tu firma culinaria, avatar y áreas de investigación.
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full hover:bg-[#173c3a]/10 text-[#173c3a] shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {error && (
              <div className="p-3.5 text-xs bg-[#fdf1ec] text-[#b5432a] border border-[#b5432a]/20 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Vista previa del Avatar */}
              <div className="flex items-center gap-4 p-4 bg-[#f5f1e8]/70 rounded-2xl border border-[#173c3a]/10">
                <div className="w-16 h-16 rounded-full bg-[#173c3a] border-2 border-[#e8754f] flex items-center justify-center overflow-hidden shrink-0 shadow-sm text-white">
                  {photoURL && esUrlValida(photoURL) && !imageError ? (
                    <img
                      src={photoURL}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="font-editorial text-2xl font-bold uppercase text-[#f5f1e8]">
                      {(displayName || 'A').charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#173c3a] uppercase tracking-wider">
                    Vista Previa de Identidad
                  </p>
                  <p className="text-[11px] text-[#47615a] mt-0.5 leading-relaxed">
                    Esta imagen se mostrará en tus fichas de aporte, en el mapa mundi y en tus
                    revisiones de curaduría.
                  </p>
                </div>
              </div>

              {/* Nombre de Cronista */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#173c3a] mb-1.5">
                  Nombre o Firma Culinaria
                </label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="ej: Itzel Cronista"
                  required
                  className="h-11 rounded-xl bg-white"
                />
              </div>

              {/* URL de Foto de Perfil */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#173c3a] mb-1.5 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-[#e8754f]" />
                  URL de Foto de Perfil / Avatar
                </label>
                <Input
                  type="url"
                  value={photoURL}
                  onChange={(e) => {
                    setPhotoURL(e.target.value)
                    setImageError(false)
                  }}
                  placeholder="https://ejemplo.com/tu-foto.jpg"
                  className="h-11 rounded-xl bg-white"
                />
                <p className="text-[11px] text-[#47615a] mt-1">
                  Enlace web directo a imagen en formato JPG, PNG o WebP.
                </p>
              </div>

              {/* Regiones de Especialidad Cultural */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#173c3a] mb-2 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[#e8754f]" />
                  Regiones de Especialidad Etnográfica
                </label>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                  {REGIONES_DISPONIBLES.map((reg) => {
                    const seleccionada = regiones.includes(reg)
                    return (
                      <button
                        type="button"
                        key={reg}
                        onClick={() => toggleRegion(reg)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          seleccionada
                            ? 'bg-[#173c3a] text-[#f5f1e8] border-[#173c3a] shadow-xs'
                            : 'bg-[#f5f1e8]/70 text-[#47615a] hover:bg-[#e9efe6] border-[#173c3a]/15'
                        }`}
                      >
                        {seleccionada && <Check className="w-3 h-3 text-[#e8754f]" />}
                        {reg}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#173c3a]/10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full px-5 text-xs text-[#47615a] hover:bg-[#173c3a]/10"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#173c3a] hover:bg-[#234c49] text-[#f5f1e8] px-6 text-xs font-semibold gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#e8754f]" />
                  {isSubmitting ? 'Guardando...' : 'Guardar Perfil'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}
