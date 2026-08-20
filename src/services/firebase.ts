import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAnalytics, type Analytics } from 'firebase/analytics'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const REQUIRED_FIREBASE_KEYS = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
] as const

const missingFirebaseConfig = REQUIRED_FIREBASE_KEYS.filter(
  (key) => !firebaseConfig[key] || String(firebaseConfig[key]).trim().length === 0
)

export const isFirebaseConfigured = missingFirebaseConfig.length === 0

const shouldEnableAnalytics =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' &&
  !!firebaseConfig.measurementId

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null
let storage: FirebaseStorage | null = null
let analytics: Analytics | null = null

function initializeFirebase() {
  if (!isFirebaseConfigured) {
    console.warn(
      `Firebase no está configurado. Variables faltantes: ${missingFirebaseConfig.join(', ')}`
    )
    return { app: null, db: null, auth: null, storage: null, analytics: null }
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }

  db = getFirestore(app)

  if (typeof window !== 'undefined') {
    auth = getAuth(app)
    storage = getStorage(app)

    if (shouldEnableAnalytics) {
      try {
        analytics = getAnalytics(app)
      } catch (error) {
        console.warn('Firebase Analytics no está disponible:', error)
      }
    }
  }

  return { app, db, auth, storage, analytics }
}

const firebase = initializeFirebase()

export const firebaseApp = firebase.app
export const firestore = firebase.db
export const firebaseAuth = firebase.auth
export const firebaseStorage = firebase.storage
export const firebaseAnalytics = firebase.analytics
