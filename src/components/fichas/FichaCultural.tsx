'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Users, ChefHat, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecetaSection } from './RecetaSection'
import { HistoriaSection } from './HistoriaSection'
import { FestividadesSection } from './FestividadesSection'
import { VideoPlayer } from './Secciones/VideoPlayer'
import type { Platillo } from '@/types'

interface FichaCulturalProps {
  platillo: Platillo
  isOpen: boolean
  onClose: () => void
}

type TabId = 'receta' | 'historia' | 'festival' | 'video'

// FichaCultural: Modal interactivo que presenta la receta completa con multiples secciones.
// Secciones disponibles: Receta (ingredientes + instrucciones), Historia, Festividades, Video
// Animaciones: Usa framer-motion para transiciones suaves entre tabs
const tabs: { id: TabId; label: string }[] = [
  { id: 'receta', label: 'Receta' },
  { id: 'historia', label: 'Historia' },
  { id: 'festival', label: 'Festividades' },
  { id: 'video', label: 'Video' },
]

export function FichaCultural({ platillo, isOpen, onClose }: FichaCulturalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('receta')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[1001]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-background z-[1002] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="relative h-64 shrink-0">
              {platillo.imagenes[0] ? (
                <img
                  src={platillo.imagenes[0]}
                  alt={platillo.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ChefHat className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 h-10 w-10 bg-black/20 hover:bg-black/40 text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold font-heading">{platillo.nombre}</h2>

                {/* Meta info */}
                <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                  {platillo.tiempoPreparacion && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{platillo.tiempoPreparacion} min</span>
                    </div>
                  )}
                  {platillo.porciones && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{platillo.porciones} porciones</span>
                    </div>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs capitalize">
                    {platillo.dificultad}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b shrink-0">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {activeTab === 'receta' && (
                    <RecetaSection
                      instrucciones={platillo.instrucciones}
                      ingredientes={platillo.ingredientes}
                    />
                  )}
                  {activeTab === 'historia' && (
                    <HistoriaSection contenido={platillo.contextoHistorico} />
                  )}
                  {activeTab === 'festival' && (
                    <FestividadesSection festividades={platillo.festividades} />
                  )}
                  {activeTab === 'video' && platillo.videos && platillo.videos.length > 0 && (
                    <div className="space-y-6">
                      {platillo.videos.map((video) => (
                        <div key={video.id}>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.18em] text-primary">
                                {video.tipo === 'short' ? 'Short' : 'Video completo'}
                              </p>
                              <h3 className="mt-1 font-semibold leading-tight">{video.titulo}</h3>
                            </div>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {video.vistas.toLocaleString('es-HN')} vistas
                            </span>
                          </div>
                          <VideoPlayer
                            url={video.url}
                            fallbackImage={video.miniatura}
                            alt={`Preparación de ${platillo.nombre}: ${video.titulo}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'video' && platillo.video && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-primary">
                          Video del aporte
                        </p>
                        <h3 className="mt-1 font-semibold leading-tight">
                          Preparación de {platillo.nombre}
                        </h3>
                      </div>
                      <VideoPlayer
                        url={platillo.video}
                        alt={`Video del aporte: preparación de ${platillo.nombre}`}
                      />
                    </div>
                  )}
                  {activeTab === 'video' &&
                    !platillo.video &&
                    (!platillo.videos || platillo.videos.length === 0) && (
                      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg bg-muted p-6 text-center">
                        <Play className="h-8 w-8 text-primary" />
                        <p className="font-semibold">Videos en curación</p>
                        <p className="text-sm text-muted-foreground">
                          Seleccionaremos un Short y un video completo con evidencia de vistas,
                          duración y consulta.
                        </p>
                      </div>
                    )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
