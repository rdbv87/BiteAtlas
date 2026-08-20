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
  festividades?: string[]
}

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
    festividades: data.festividades || [],
    estado: 'pendiente',
    contribuidorId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  await addDoc(collection(firestore, 'platillos'), platillo)
}

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
    festividades: data.festividades || [],
    estado: 'pendiente',
    updatedAt: serverTimestamp(),
  })
}
