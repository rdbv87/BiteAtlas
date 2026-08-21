import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app'
import {
  getFirestore,
  type DocumentData,
  type Firestore,
  type QueryDocumentSnapshot,
} from 'firebase-admin/firestore'

function initializeFirebaseAdmin() {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID is required')
  }

  const serviceAccount: ServiceAccount | undefined = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined

  if (serviceAccount) {
    initializeApp({ credential: cert(serviceAccount), projectId })
  } else {
    initializeApp({ projectId })
  }

  return getFirestore()
}

async function deleteDocs(db: Firestore, docs: QueryDocumentSnapshot<DocumentData>[]) {
  let batch = db.batch()
  let operationCount = 0

  for (const doc of docs) {
    batch.delete(doc.ref)
    operationCount += 1

    if (operationCount >= 450) {
      await batch.commit()
      batch = db.batch()
      operationCount = 0
    }
  }

  if (operationCount > 0) {
    await batch.commit()
  }
}

async function purgeSeedData() {
  const confirm = process.argv.includes('--confirm')
  const db = initializeFirebaseAdmin()

  const [platillosSnapshot, ingredientesSnapshot] = await Promise.all([
    db.collection('platillos').get(),
    db.collection('ingredientes').get(),
  ])

  // Los platillos sembrados en la etapa piloto no tienen contribuidor; los aportes de la comunidad sí.
  const platillosSembrados = platillosSnapshot.docs.filter((doc) => !doc.get('contribuidorId'))

  console.log(
    confirm
      ? `Eliminando ${platillosSembrados.length} platillos sembrados y ${ingredientesSnapshot.size} ingredientes.`
      : `Se eliminarían ${platillosSembrados.length} platillos sembrados y ${ingredientesSnapshot.size} ingredientes.`
  )

  for (const doc of platillosSembrados) {
    console.log(`  platillos/${doc.id} · ${doc.get('nombre') ?? 'sin nombre'}`)
  }

  if (!confirm) {
    console.log('Simulación. Vuelve a ejecutar con --confirm para aplicar los borrados.')
    return
  }

  await deleteDocs(db, platillosSembrados)
  await deleteDocs(db, ingredientesSnapshot.docs)

  console.log('Limpieza completada. Solo quedan los aportes de la comunidad.')
}

purgeSeedData().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Error durante la limpieza de datos sembrados: ${message}`)
  process.exitCode = 1
})
