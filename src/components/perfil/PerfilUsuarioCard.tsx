'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles, BookOpen, Award, Edit3, Globe2, Zap, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EditarPerfilModal } from './EditarPerfilModal'
import type { UsuarioPerfil, RolUsuario } from '@/types'
import type { SiguienteRangoInfo } from '@/services/hooks/useUsuarioPerfil'

interface PerfilUsuarioCardProps {
  perfil: UsuarioPerfil
  progresoRango: SiguienteRangoInfo
  onActualizarPerfil?: (data: {
    displayName: string
    photoURL?: string
    regionesEspecialidad: string[]
  }) => Promise<unknown>
}

const ROL_CONFIG: Record<
  RolUsuario,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    badgeBg: string
    desc: string
    chipColor: string
  }
> = {
  novicio: {
    label: 'Novicio Culinario',
    icon: BookOpen,
    badgeBg: 'bg-[#173c3a]/10 border-[#173c3a]/20 text-[#173c3a]',
    chipColor: 'text-[#173c3a]',
    desc: 'Iniciando la recopilación de recetas ancestrales y tradiciones familiares.',
  },
  cronista: {
    label: 'Cronista Culinario',
    icon: Sparkles,
    badgeBg: 'bg-[#e8754f]/15 border-[#e8754f]/30 text-[#b5432a]',
    chipColor: 'text-[#e8754f]',
    desc: 'Documentador activo con contexto antropológico e histórico verificado.',
  },
  guardian: {
    label: 'Guardián Regional',
    icon: Shield,
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300',
    chipColor: 'text-emerald-600',
    desc: 'Autoridad etnográfica con voto resolutivo en curaduría y puentes culinarios.',
  },
  maestro: {
    label: 'Maestro Antropólogo',
    icon: Award,
    badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-800 dark:text-purple-300',
    chipColor: 'text-purple-600',
    desc: 'Máximo rango de rigor científico y preservación del patrimonio culinario global.',
  },
}

export function PerfilUsuarioCard({
  perfil,
  progresoRango,
  onActualizarPerfil,
}: PerfilUsuarioCardProps) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const config = ROL_CONFIG[perfil.rol] || ROL_CONFIG.novicio
  const IconoRol = config.icon

  return (
    <section className="rounded-[2rem] border border-[#173c3a]/10 bg-white/95 p-6 sm:p-9 shadow-[0_24px_80px_rgba(23,60,58,0.08)] space-y-7 text-[#173c3a]">
      {/* Encabezado con Avatar, Nombre, Rol y Botón de Edición */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 border-b border-[#173c3a]/10">
        <div className="flex items-center sm:items-start gap-4 sm:gap-5">
          {/* Avatar Grande */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#173c3a] border-4 border-[#e8754f]/40 flex items-center justify-center text-white overflow-hidden shadow-md">
              {perfil.photoURL ? (
                <img
                  src={perfil.photoURL}
                  alt={perfil.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-editorial text-3xl sm:text-4xl font-bold uppercase text-[#f5f1e8]">
                  {perfil.displayName.charAt(0)}
                </span>
              )}
            </div>

            {onActualizarPerfil && (
              <button
                type="button"
                onClick={() => setModalAbierto(true)}
                title="Editar avatar"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-white border border-[#173c3a]/20 shadow-md text-[#173c3a] hover:bg-[#f5f1e8] hover:text-[#e8754f] transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Información del Usuario */}
          <div className="space-y-1.5">
            <div className="flex items-center flex-wrap gap-2.5">
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#173c3a] leading-tight">
                {perfil.displayName}
              </h1>

              {onActualizarPerfil && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalAbierto(true)}
                  className="h-7 px-2.5 text-xs text-[#47615a] hover:text-[#173c3a] hover:bg-[#173c3a]/5 rounded-full gap-1"
                >
                  <Edit3 className="w-3 h-3 text-[#e8754f]" />
                  Editar perfil
                </Button>
              )}
            </div>

            <p className="text-xs text-[#47615a]">{perfil.email}</p>

            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${config.badgeBg}`}
              >
                <IconoRol className="w-3.5 h-3.5" />
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* Métricas estilo Fichas de Campo */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
          <div className="p-3 sm:px-4 sm:py-3 rounded-2xl bg-[#f5f1e8]/80 border border-[#173c3a]/10 text-center min-w-24">
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#47615a]">
              Puntos XP
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#173c3a] font-editorial">
              {perfil.puntosAntropologicos || 0}
            </span>
          </div>

          <div className="p-3 sm:px-4 sm:py-3 rounded-2xl bg-[#f5f1e8]/80 border border-[#173c3a]/10 text-center min-w-24">
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#47615a]">
              Curaduría
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#e8754f] font-editorial">
              {perfil.puntosCuraduria || 0}
            </span>
          </div>

          <div className="p-3 sm:px-4 sm:py-3 rounded-2xl bg-[#f5f1e8]/80 border border-[#173c3a]/10 text-center min-w-24">
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#47615a]">
              Aportes
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#173c3a] font-editorial">
              {perfil.aportesValidados || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Regiones de Especialidad Etnográfica */}
      {perfil.regionesEspecialidad && perfil.regionesEspecialidad.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#47615a] flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#e8754f]" />
            Especialidades Etnográficas e Interés Culinario:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {perfil.regionesEspecialidad.map((reg) => (
              <span
                key={reg}
                className="text-xs font-medium px-3 py-1 rounded-full bg-[#173c3a]/5 text-[#173c3a] border border-[#173c3a]/15"
              >
                {reg}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cita de Rango Antropológico */}
      <p className="text-xs text-[#47615a] italic bg-[#f5f1e8]/50 p-3.5 rounded-xl border border-[#173c3a]/10 border-l-4 border-l-[#e8754f]">
        &ldquo;{config.desc}&rdquo;
      </p>

      {/* Progreso de Rango */}
      {progresoRango.siguienteRol ? (
        <div className="p-5 rounded-2xl bg-[#eff5ee] border border-[#173c3a]/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#173c3a] flex items-center gap-1.5 uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5 text-[#e8754f]" />
              Próximo Rango:{' '}
              <span className="text-[#e8754f] font-extrabold capitalize">
                {progresoRango.siguienteRol}
              </span>
            </span>
            <span className="text-[#47615a] font-semibold">
              {progresoRango.porcentajeProgreso}% completado
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#173c3a]/10 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progresoRango.porcentajeProgreso}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-linear-to-r from-[#173c3a] via-[#234c49] to-[#e8754f] rounded-full"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#47615a] pt-1 gap-2">
            <span>
              Faltan <strong className="text-[#173c3a]">{progresoRango.puntosFaltantes} XP</strong>{' '}
              antropológicos
            </span>
            <span>
              Faltan{' '}
              <strong className="text-[#173c3a]">{progresoRango.aportesFaltantes} aportes</strong>{' '}
              validados
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#f5f1e8] border border-purple-500/30 text-purple-900 text-xs font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
          <span>
            ¡Has alcanzado el máximo rango honorífico de Maestro Antropólogo en BiteAtlas!
          </span>
        </div>
      )}

      {/* Modal de edición */}
      {onActualizarPerfil && (
        <EditarPerfilModal
          perfil={perfil}
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onGuardar={onActualizarPerfil}
        />
      )}
    </section>
  )
}
