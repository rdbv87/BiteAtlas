import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app'
import {
  getFirestore,
  type DocumentData,
  type DocumentReference,
  type WriteBatch,
} from 'firebase-admin/firestore'
import { paisesMundo, regionesPorPaisMundo } from './data/paises-mundo'
import { PaisSchema, RegionSchema } from '@/types'
import { ValidationError } from '@/errors/validation-error'

// ── Firebase Admin Setup ─────────────────────────────────────────────────────

function initializeFirebaseAdmin() {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID is required')
  }

  // For local development, use application default credentials
  // For production, use service account
  const serviceAccount: ServiceAccount | undefined = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId,
    })
  } else {
    // Use default credentials (gcloud auth application-default login)
    initializeApp({ projectId })
  }

  return getFirestore()
}

async function seedAtlas() {
  const db = initializeFirebaseAdmin()
  const todasLasRegiones = Object.values(regionesPorPaisMundo).flat()

  const validationResults = [
    ...paisesMundo.map((pais) => PaisSchema.safeParse(pais)),
    ...todasLasRegiones.map((region) => RegionSchema.safeParse(region)),
  ]
  const validationError = validationResults.find((result) => !result.success)

  if (validationError && !validationError.success) {
    throw ValidationError.fromZodError(validationError.error)
  }

  const entities = [
    { collection: 'paises', values: paisesMundo },
    ...Object.entries(regionesPorPaisMundo).map(([paisId, values]) => ({
      collection: `paises/${paisId}/regiones`,
      values,
    })),
  ]

  let batch: WriteBatch = db.batch()
  let operationCount = 0

  async function queueSet(documentRef: DocumentReference, value: DocumentData) {
    batch.set(documentRef, value, { merge: true })
    operationCount += 1

    if (operationCount >= 450) {
      await batch.commit()
      batch = db.batch()
      operationCount = 0
    }
  }

  for (const entity of entities) {
    for (const value of entity.values) {
      const documentId = value.id
      await queueSet(db.collection(entity.collection).doc(documentId), value)
    }
  }

  if (operationCount > 0) {
    await batch.commit()
  }

  const paisesSnapshot = await db.collection('paises').get()

  if (paisesSnapshot.size < paisesMundo.length) {
    throw new Error(
      `Seed incompleto: Firestore tiene ${paisesSnapshot.size}/${paisesMundo.length} países.`
    )
  }

  console.log(
    `Atlas geográfico sembrado: ${paisesMundo.length} países y ${todasLasRegiones.length} regiones. Las recetas provienen únicamente de los aportes de la comunidad.`
  )
}

seedAtlas().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Error durante el seed del atlas: ${message}`)
  process.exitCode = 1
})
