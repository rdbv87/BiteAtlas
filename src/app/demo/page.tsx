'use client'

import { FichaCultural } from '@/components/fichas/FichaCultural'
import { Platillo } from '@/types'

// Datos de ejemplo para la demo
const platilloEjemplo: Platillo = {
  id: 'demo-001',
  paisId: 'pais-demo-001',
  regionId: 'region-001',
  nombre: 'Demo Platillo',
  descripcion: 'Un platillo de demostración',
  instrucciones: ['Paso 1 de la receta', 'Paso 2 de la receta', 'Paso 3 de la receta'],
  ingredientes: [{ ingredienteId: 'ing-001', cantidad: '2', unidad: 'unidades' }],
  tiempoPreparacion: 30,
  dificultad: 'medio',
  porciones: 4,
  imagenes: ['/test.jpg'],
  video: undefined,
  contextoHistorico: 'Contexto histórico de prueba',
  festividades: ['Navidad'],
  estado: 'pendiente',
  contribuidorId: 'user-001',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default function DemoPage() {
  const handleClose = () => {}

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-6">Demo de BiteAtlas</h1>

      <FichaCultural platillo={platilloEjemplo} isOpen={true} onClose={handleClose} />
    </div>
  )
}
