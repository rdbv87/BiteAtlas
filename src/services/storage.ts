'use client'

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { firebaseStorage } from '@/services/firebase'

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface UploadResult {
  url: string
  path: string
}

export async function uploadRecipeImage(file: File, userId: string): Promise<UploadResult> {
  if (!firebaseStorage) {
    throw new Error('Firebase Storage no está inicializado')
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Formato de imagen no permitido. Usa jpg, png o webp.')
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('La imagen excede el tamaño máximo de 5MB.')
  }

  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name}`.replace(/\s+/g, '_')
  const path = `users/${userId}/aportes/${timestamp}/imagenes/${filename}`
  const storageRef = ref(firebaseStorage, path)

  const snapshot = await uploadBytes(storageRef, file)
  const url = await getDownloadURL(snapshot.ref)

  return { url, path }
}
