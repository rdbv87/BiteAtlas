'use client'

import { motion } from 'framer-motion'
import { Award, Lock, Flame, Leaf, Compass, BookOpen, CheckCircle2, Sparkles } from 'lucide-react'
import type { InsigniaOtorgada, InsigniaCategoria } from '@/types'

interface VitrinaInsigniasProps {
  insigniasUsuario: InsigniaOtorgada[]
}

interface InsigniaCatalogo {
  codigo: string
  nombre: string
  descripcion: string
  categoria: InsigniaCategoria
  categoriaLabel: string
  icono: string
  requisito: string
}

const CATALOGO_INSIGNIAS: InsigniaCatalogo[] = [
  {
    codigo: 'maiz_nativo',
    nombre: 'Guardián del Maíz Nativo',
    descripcion:
      'Aportó y documentó recetas con razas autóctonas de maíz mesoamericano y nixtamalización.',
    categoria: 'ingrediente_nativo',
    categoriaLabel: 'Ingrediente Nativo',
    icono: 'corn',
    requisito: 'Publicar 1 receta verificada con maíz nativo.',
  },
  {
    codigo: 'tecnicas_ancestrales',
    nombre: 'Técnicas Ancestrales',
    descripcion:
      'Dominio de procesos culinarios milenarios (cocción en pozo, metate, fermentación).',
    categoria: 'tecnica_ancestral',
    categoriaLabel: 'Técnica Ancestral',
    icono: 'flame',
    requisito: 'Documentar 3 recetas con técnicas prehispánicas.',
  },
  {
    codigo: 'puente_culturas',
    nombre: 'Constructor de Puentes',
    descripcion: 'Conectó platillos de distintos continentes identificando rutas de migración.',
    categoria: 'antropologia',
    categoriaLabel: 'Antropología Culinaria',
    icono: 'compass',
    requisito: 'Proponer 2 puentes culinarios validados por Guardianes.',
  },
  {
    codigo: 'curador_riguroso',
    nombre: 'Curador Riguroso',
    descripcion: 'Emitió evaluaciones de validación de raíces con fuentes bibliográficas sólidas.',
    categoria: 'antropologia',
    categoriaLabel: 'Curaduría & Etnografía',
    icono: 'book',
    requisito: 'Realizar 5 Peer Reviews con dictamen consensuado.',
  },
  {
    codigo: 'cronista_andes',
    nombre: 'Cronista de los Andes',
    descripcion: 'Especialista en tubérculos, ajíes y gastronomía de las altas cumbres andinas.',
    categoria: 'region',
    categoriaLabel: 'Especialidad Regional',
    icono: 'mountain',
    requisito: 'Aportar 3 recetas de la región andina con historia documentada.',
  },
]

const CATEGORIA_ICONS: Record<InsigniaCategoria, React.ComponentType<{ className?: string }>> = {
  ingrediente_nativo: Leaf,
  tecnica_ancestral: Flame,
  antropologia: BookOpen,
  region: Compass,
}

export function VitrinaInsignias({ insigniasUsuario }: VitrinaInsigniasProps) {
  const codigosDesbloqueados = new Set(insigniasUsuario.map((i) => i.codigo))

  return (
    <section className="rounded-[2rem] border border-[#173c3a]/10 bg-white/95 p-6 sm:p-9 shadow-[0_24px_80px_rgba(23,60,58,0.08)] space-y-6 text-[#173c3a]">
      {/* Encabezado de la vitrina */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#173c3a]/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173c3a]/5 text-[#173c3a] text-xs uppercase tracking-[0.24em] font-semibold">
            <Award className="w-3.5 h-3.5 text-[#e8754f]" />
            Patrimonio Vivo
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#173c3a] mt-2">
            Vitrina de Insignias Antropológicas
          </h2>
          <p className="text-xs text-[#47615a] mt-1">
            Reconocimientos honoríficos por rescate etnográfico, técnicas ancestrales y rigor
            culinario.
          </p>
        </div>

        <span className="self-start sm:self-center text-xs font-semibold px-4 py-2 rounded-full bg-[#f5f1e8] text-[#173c3a] border border-[#173c3a]/15 shadow-2xs">
          {insigniasUsuario.length} de {CATALOGO_INSIGNIAS.length} Desbloqueadas
        </span>
      </div>

      {/* Grid de Insignias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATALOGO_INSIGNIAS.map((insignia) => {
          const desbloqueada = codigosDesbloqueados.has(insignia.codigo)
          const CategoriaIcon = CATEGORIA_ICONS[insignia.categoria] || Award

          return (
            <motion.article
              key={insignia.codigo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                desbloqueada
                  ? 'bg-linear-to-br from-[#faf4ec] via-[#fdfbf7] to-[#f4ebe1] border-[#e8754f]/40 shadow-sm'
                  : 'bg-[#f5f1e8]/40 border-[#173c3a]/10 opacity-80 hover:opacity-100 hover:bg-[#f5f1e8]/70'
              }`}
            >
              <div className="space-y-3">
                {/* Categoría e Indicador de Estado */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#47615a] flex items-center gap-1">
                    <CategoriaIcon className="w-3 h-3 text-[#e8754f]" />
                    {insignia.categoriaLabel}
                  </span>

                  {desbloqueada ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Obtenida
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#47615a] bg-[#173c3a]/5 px-2.5 py-0.5 rounded-full border border-[#173c3a]/10">
                      <Lock className="w-3 h-3" />
                      Bloqueada
                    </span>
                  )}
                </div>

                {/* Emblema y Título */}
                <div className="flex items-start gap-3.5 pt-1">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      desbloqueada
                        ? 'bg-[#173c3a] text-[#f5f1e8] border-2 border-[#e8754f]'
                        : 'bg-white border border-[#173c3a]/15 text-[#47615a]'
                    }`}
                  >
                    {desbloqueada ? (
                      <Sparkles className="w-5 h-5 text-[#e8754f]" />
                    ) : (
                      <CategoriaIcon className="w-5 h-5 text-[#47615a]/70" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-editorial text-base font-bold text-[#173c3a] leading-snug">
                      {insignia.nombre}
                    </h3>
                    <p className="text-xs text-[#47615a] mt-1 leading-relaxed">
                      {insignia.descripcion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Requisito */}
              <div className="mt-4 pt-3 border-t border-[#173c3a]/10 text-[11px] text-[#47615a]">
                <strong className="text-[#173c3a] font-semibold">Requisito:</strong>{' '}
                {insignia.requisito}
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
