import dotenv from 'dotenv'
dotenv.config()

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { honduras, regiones, ingredientes, platillos } from './data/honduras'
import { PaisSchema, RegionSchema, IngredienteSchema, PlatilloSchema } from '@/types'
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
