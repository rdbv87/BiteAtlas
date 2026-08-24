'use client'

import {
  addDoc,
  collection,
  deleteField,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { uploadRecipeImage } from '@/services/storage'

interface CreatePlatilloData {
  paisId: string
  regionId: string
  lat?: number
  lng?: number
  nombre: string
  descripcion: string
  instrucciones: string[]
  ingredientes: Array<{ ingredienteId: string; cantidad: string; unidad: string }>
  tiempoPreparacion: number
  dificultad: 'facil' | 'medio' | 'dificil'
  porciones: number
  video?: string
  varianteDeId?: string
  contextoHistorico?: string
  leyendaOrigen?: string
  guarniciones?: string[]
  festividades?: string[]
}

// Crea un nuevo platillo en Firestore con sus imagenes asociadas.
// Proceso:
// 1. Sube todas las imagenes a Firebase Storage (en paralelo)
// 2. Genera un ID unico para el platillo
// 3. Crea el documento en Firestore con estado = 'pendiente' (requiere moderacion)
// 4. Registra timestamps de creacion y contribuidor
// Notas:
// - Las coordenadas (lat/lng) son opcionales (para platillos sin ubicacion geografica)
// - varianteDeId, video y contextoHistorico son opcionales
// - Se genera UUID si esta disponible en el navegador; fallback a timestamp + random
export async function createPlatillo(data: CreatePlatilloData, userId: string, files: File[]) {
  if (!firestore) {
    throw new Error('Firestore no está inicializado')
  }

  const uploadResults = await Promise.all(files.map((file) => uploadRecipeImage(file, userId)))

  const imagenes = uploadResults.map((result) => result.url)

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const platillo = {
    id,
    paisId: data.paisId,
    regionId: data.regionId,
    ...(data.lat != null && data.lng != null ? { lat: data.lat, lng: data.lng } : {}),
    nombre: data.nombre,
    descripcion: data.descripcion,
    instrucciones: data.instrucciones,
    ingredientes: data.ingredientes,
    tiempoPreparacion: data.tiempoPreparacion,
    dificultad: data.dificultad,
    porciones: data.porciones,
    imagenes,
    video: data.video || null,
    varianteDeId: data.varianteDeId || null,
    contextoHistorico: data.contextoHistorico || null,
    leyendaOrigen: data.leyendaOrigen || null,
    guarniciones: data.guarniciones || [],
    festividades: data.festividades || [],
    estado: 'pendiente',
    contribuidorId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await addDoc(collection(firestore, 'platillos'), platillo)
}

// Actualiza un platillo existente en Firestore con nuevas imagenes.
// Proceso:
// 1. Sube nuevas imagenes a Storage (en paralelo)
// 2. Filtra las imagenes existentes que NO sean blobs temporales (blob:// URLs)
// 3. Combina imagenes existentes + nuevas subidas
// 4. Actualiza el documento en Firestore (sin cambiar estado, requiere aprobacion manual)
// 5. Limpia coordenadas si no estan presentes (deleteField)
// Notas:
// - blob: URLs son imagenes pre-cargadas en el formulario, no son persistentes
// - El estado vuelve a 'pendiente' tras actualizacion (requiere re-moderacion)
// - No se puede actualizar el estado del platillo con esta funcion (solo admin puede)
export async function updatePlatillo(
  platilloId: string,
  data: CreatePlatilloData & { imagenes: string[] },
  userId: string,
  files: File[]
) {
  if (!firestore) {
    throw new Error('Firestore no está inicializado')
  }

  const uploadResults = await Promise.all(files.map((file) => uploadRecipeImage(file, userId)))
  const existingImages = data.imagenes.filter((image) => !image.startsWith('blob:'))
  const imagenes = [...existingImages, ...uploadResults.map((result) => result.url)]

  await updateDoc(doc(firestore, 'platillos', platilloId), {
    paisId: data.paisId,
    regionId: data.regionId,
    ...(data.lat != null && data.lng != null
      ? { lat: data.lat, lng: data.lng }
      : { lat: deleteField(), lng: deleteField() }),
    nombre: data.nombre,
    descripcion: data.descripcion,
    instrucciones: data.instrucciones,
    ingredientes: data.ingredientes,
    tiempoPreparacion: data.tiempoPreparacion,
    dificultad: data.dificultad,
    porciones: data.porciones,
    imagenes,
    video: data.video || null,
    varianteDeId: data.varianteDeId || null,
    contextoHistorico: data.contextoHistorico || null,
    leyendaOrigen: data.leyendaOrigen || null,
    guarniciones: data.guarniciones || [],
    festividades: data.festividades || [],
    estado: 'pendiente',
    updatedAt: serverTimestamp(),
  })
}
