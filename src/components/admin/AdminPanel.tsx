'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import type { Platillo } from '@/types'

type EstadoRevision = 'pendiente' | 'aprobado' | 'rechazado'

async function fetchPlatillosPorEstado(estado: EstadoRevision): Promise<Platillo[]> {
  const q = query(collection(firestore, 'platillos'), where('estado', '==', estado))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => d.data() as Platillo)
}

export function AdminPanel() {
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [filtro, setFiltro] = useState<EstadoRevision>('pendiente')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchPlatillosPorEstado(filtro)
      .then((data) => {
        if (!cancelled) {
          setPlatillos(data)
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error('Error fetching platillos:', error)
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [filtro])

  async function actualizarEstado(platilloId: string, nuevoEstado: EstadoRevision) {
    try {
      await updateDoc(doc(firestore, 'platillos', platilloId), {
        estado: nuevoEstado,
        updatedAt: new Date(),
      })
      setPlatillos((prev) => prev.filter((p) => p.id !== platilloId))
    } catch (error) {
      console.error('Error updating platillo:', error)
    }
  }

  const filtros: { id: EstadoRevision; label: string; icon: React.ReactNode }[] = [
    { id: 'pendiente', label: 'Pendientes', icon: <Clock className="w-4 h-4" /> },
    { id: 'aprobado', label: 'Aprobados', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'rechazado', label: 'Rechazados', icon: <XCircle className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Panel de Administración</h1>
        <span className="text-sm text-muted-foreground">
          {platillos.length} platillos {filtro}s
        </span>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {filtros.map((f) => (
          <Button
            key={f.id}
            variant={filtro === f.id ? 'default' : 'outline'}
            onClick={() => setFiltro(f.id)}
            className="gap-2"
          >
            {f.icon}
            {f.label}
          </Button>
        ))}
      </div>

      {/* Lista de platillos */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : platillos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No hay platillos {filtro}s.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {platillos.map((platillo) => (
            <Card key={platillo.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-heading">{platillo.nombre}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {platillo.createdAt.toLocaleDateString()}
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {platillo.descripcion}
                </p>
                <div className="flex items-center gap-2">
                  {filtro === 'pendiente' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => actualizarEstado(platillo.id, 'aprobado')}
                        className="gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => actualizarEstado(platillo.id, 'rechazado')}
                        className="gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" className="gap-1">
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
