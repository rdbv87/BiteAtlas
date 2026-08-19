'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Users, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecetaSection } from './RecetaSection'
import { HistoriaSection } from './HistoriaSection'
import { FestividadesSection } from './FestividadesSection'
import type { Platillo } from '@/types'

interface FichaCulturalProps {
  platillo: Platillo
  isOpen: boolean
  onClose: () => void
}

type TabId = 'receta' | 'historia' | 'festival'

const tabs: { id: TabId; label: string }[] = [
  { id: 'receta', label: 'Receta' },
  { id: 'historia', label: 'Historia' },
  { id: 'festival', label: 'Festividades' },
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
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
