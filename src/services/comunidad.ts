import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import {
  UsuarioPerfilSchema,
  InsigniaOtorgadaSchema,
  HistorialPuntosSchema,
  PuenteCulinarioSchema,
  AdaptacionLocalSchema,
  ValidacionRaicesReviewSchema,
  type UsuarioPerfil,
  type InsigniaOtorgada,
  type HistorialPuntos,
  type PuenteCulinario,
  type AdaptacionLocal,
  type ValidacionRaicesReview,
  type RolUsuario,
  type TipoReferenciaPuntos,
} from '@/types'
import { ValidationError, CommunityError } from '@/errors'

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES Y UMBRALES DE PROGRESIÓN Y CONSENSO
// ═══════════════════════════════════════════════════════════════════════════

export const UMBRALES_ROLES = {
  maestro: { puntos: 1500, aportes: 25 },
  guardian: { puntos: 500, aportes: 10 },
  cronista: { puntos: 100, aportes: 3 },
  novicio: { puntos: 0, aportes: 0 },
} as const

export const UMBRAL_APROBACION_GUARDIANES = 2

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PURAS DE LÓGICA DE NEGOCIO Y GAMIFICACIÓN
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calcula el rango o rol antropológico del usuario basado en sus puntos y aportes validados.
 */
export function calcularRolUsuario(
  puntosAntropologicos: number,
  aportesValidados: number
): RolUsuario {
  if (
    puntosAntropologicos >= UMBRALES_ROLES.maestro.puntos &&
    aportesValidados >= UMBRALES_ROLES.maestro.aportes
  ) {
    return 'maestro'
  }
  if (
    puntosAntropologicos >= UMBRALES_ROLES.guardian.puntos &&
    aportesValidados >= UMBRALES_ROLES.guardian.aportes
  ) {
    return 'guardian'
  }
  if (
    puntosAntropologicos >= UMBRALES_ROLES.cronista.puntos &&
    aportesValidados >= UMBRALES_ROLES.cronista.aportes
  ) {
    return 'cronista'
  }
  return 'novicio'
}

/**
 * Determina si una propuesta comunitaria (puente o adaptación) alcanza el consenso para publicarse.
 */
export function evaluarConsensoComunitario(
  aprobacionesGuardianes: string[],
  esAdmin: boolean = false
): boolean {
  if (esAdmin) return true
  const guardianesUnicos = new Set(aprobacionesGuardianes)
  return guardianesUnicos.size >= UMBRAL_APROBACION_GUARDIANES
}

/**
 * Calcula las métricas promedio de una lista de evaluaciones de validación de raíces.
 */
export function calcularPromedioValidaciones(reviews: ValidacionRaicesReview[]) {
  if (reviews.length === 0) {
    return {
      fidelidadCultural: 0,
      claridadInstrucciones: 0,
      riquezaHistorica: 0,
      promedioGlobal: 0,
      totalReviews: 0,
    }
  }

  const suma = reviews.reduce(
    (acc, rev) => ({
      fidelidad: acc.fidelidad + rev.fidelidadCultural,
      claridad: acc.claridad + rev.claridadInstrucciones,
      riqueza: acc.riqueza + rev.riquezaHistorica,
    }),
    { fidelidad: 0, claridad: 0, riqueza: 0 }
  )

  const count = reviews.length
  const fidelidad = Number((suma.fidelidad / count).toFixed(1))
  const claridad = Number((suma.claridad / count).toFixed(1))
  const riqueza = Number((suma.riqueza / count).toFixed(1))
  const promedioGlobal = Number(((fidelidad + claridad + riqueza) / 3).toFixed(1))

  return {
    fidelidadCultural: fidelidad,
    claridadInstrucciones: claridad,
    riquezaHistorica: riqueza,
    promedioGlobal,
    totalReviews: count,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICIOS FIRESTORE - PERFILES Y GAMIFICACIÓN
// ═══════════════════════════════════════════════════════════════════════════

function getFirestoreInstance() {
  if (!firestore) {
    throw new CommunityError('Firestore no está inicializado', 'FIRESTORE_NOT_INITIALIZED')
  }
  return firestore
}

/**
 * Obtiene el perfil de un usuario desde Firestore.
 */
export async function getUsuarioPerfil(uid: string): Promise<UsuarioPerfil | null> {
  const db = getFirestoreInstance()
  const userRef = doc(db, 'usuarios', uid)
  const snap = await getDoc(userRef)

  if (!snap.exists()) {
    return null
  }

  const parseResult = UsuarioPerfilSchema.safeParse(snap.data())
  if (!parseResult.success) {
    throw ValidationError.fromZodError(parseResult.error)
  }

  return parseResult.data
}

/**
 * Crea o actualiza el perfil base de un usuario.
 */
export async function crearOActualizarPerfil(
  data: Partial<UsuarioPerfil> & { uid: string; email: string; displayName: string }
): Promise<UsuarioPerfil> {
  const db = getFirestoreInstance()
  const userRef = doc(db, 'usuarios', data.uid)
  const snap = await getDoc(userRef)

  const now = new Date()

  let perfil: UsuarioPerfil

  if (!snap.exists()) {
    perfil = {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      rol: 'novicio',
      puntosAntropologicos: 0,
      puntosCuraduria: 0,
      aportesValidados: 0,
      insignias: [],
      regionesEspecialidad: data.regionesEspecialidad ?? [],
      createdAt: now,
      updatedAt: now,
    }
  } else {
    const prev = snap.data()
    perfil = {
      ...prev,
      ...data,
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      updatedAt: now,
    } as UsuarioPerfil
  }

  const validado = UsuarioPerfilSchema.safeParse(perfil)
  if (!validado.success) {
    throw ValidationError.fromZodError(validado.error)
  }

  await setDoc(userRef, {
    ...validado.data,
    updatedAt: serverTimestamp(),
    ...(snap.exists() ? {} : { createdAt: serverTimestamp() }),
  })

  return validado.data
}

/**
 * Actualiza los datos editables del perfil de usuario (nombre, foto, regiones de especialidad).
 */
export async function actualizarPerfilUsuario(
  uid: string,
  data: {
    displayName?: string
    photoURL?: string
    regionesEspecialidad?: string[]
  }
): Promise<UsuarioPerfil> {
  const db = getFirestoreInstance()
  const userRef = doc(db, 'usuarios', uid)
  const snap = await getDoc(userRef)

  if (!snap.exists()) {
    throw new CommunityError('Usuario no encontrado', 'USER_NOT_FOUND')
  }

  const prev = snap.data() as UsuarioPerfil
  const actualizado: UsuarioPerfil = {
    ...prev,
    displayName: data.displayName !== undefined ? data.displayName : prev.displayName,
    photoURL: data.photoURL !== undefined ? data.photoURL.trim() || undefined : prev.photoURL,
    regionesEspecialidad:
      data.regionesEspecialidad !== undefined
        ? data.regionesEspecialidad
        : prev.regionesEspecialidad,
    updatedAt: new Date(),
  }

  const validado = UsuarioPerfilSchema.safeParse(actualizado)
  if (!validado.success) {
    throw ValidationError.fromZodError(validado.error)
  }

  await updateDoc(userRef, {
    displayName: validado.data.displayName,
    ...(validado.data.photoURL ? { photoURL: validado.data.photoURL } : {}),
    regionesEspecialidad: validado.data.regionesEspecialidad ?? [],
    updatedAt: serverTimestamp(),
  })

  return validado.data
}

/**
 * Registra puntos en el historial del usuario y actualiza su rango si corresponde.
 */
export async function agregarPuntosUsuario(
  uid: string,
  puntos: number,
  motivo: string,
  referenciaTipo: TipoReferenciaPuntos,
  referenciaId?: string
): Promise<{ nuevosPuntos: number; nuevoRol: RolUsuario }> {
  const db = getFirestoreInstance()
  const userRef = doc(db, 'usuarios', uid)
  const historialRef = doc(collection(db, 'usuarios', uid, 'historialPuntos'))

  return await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef)
    if (!userDoc.exists()) {
      throw new CommunityError('Usuario no encontrado', 'USER_NOT_FOUND')
    }

    const userData = userDoc.data()
    const puntosActuales = (userData.puntosAntropologicos as number) || 0
    const aportesValidados = (userData.aportesValidados as number) || 0
    const nuevosPuntos = Math.max(0, puntosActuales + puntos)
    const nuevoRol = calcularRolUsuario(nuevosPuntos, aportesValidados)

    const registroHistorial: HistorialPuntos = {
      id: historialRef.id,
      usuarioId: uid,
      puntos,
      motivo,
      referenciaTipo,
      referenciaId,
      createdAt: new Date(),
    }

    const validacionHistorial = HistorialPuntosSchema.safeParse(registroHistorial)
    if (!validacionHistorial.success) {
      throw ValidationError.fromZodError(validacionHistorial.error)
    }

    transaction.set(historialRef, {
      ...validacionHistorial.data,
      createdAt: serverTimestamp(),
    })

    transaction.update(userRef, {
      puntosAntropologicos: nuevosPuntos,
      rol: nuevoRol,
      updatedAt: serverTimestamp(),
    })

    return { nuevosPuntos, nuevoRol }
  })
}

/**
 * Otorga una insignia al perfil del usuario.
 */
export async function otorgarInsignia(
  uid: string,
  insigniaData: Omit<InsigniaOtorgada, 'id' | 'otorgadaEn'>
): Promise<InsigniaOtorgada> {
  const db = getFirestoreInstance()
  const userRef = doc(db, 'usuarios', uid)
  const insigniaId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const nuevaInsignia: InsigniaOtorgada = {
    ...insigniaData,
    id: insigniaId,
    otorgadaEn: new Date(),
  }

  const validacion = InsigniaOtorgadaSchema.safeParse(nuevaInsignia)
  if (!validacion.success) {
    throw ValidationError.fromZodError(validacion.error)
  }

  await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef)
    if (!userDoc.exists()) {
      throw new CommunityError('Usuario no encontrado', 'USER_NOT_FOUND')
    }

    const prevInsignias = (userDoc.data().insignias as InsigniaOtorgada[]) || []
    const yaExiste = prevInsignias.some((i) => i.codigo === insigniaData.codigo)
    if (yaExiste) {
      return
    }

    transaction.update(userRef, {
      insignias: [...prevInsignias, validacion.data],
      updatedAt: serverTimestamp(),
    })
  })

  return validacion.data
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICIOS FIRESTORE - RED DE RECETAS (PUENTES CULINARIOS)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Propone un nuevo Puente Culinario entre dos recetas.
 */
export async function crearPuenteCulinario(
  data: Omit<
    PuenteCulinario,
    'id' | 'estado' | 'aprobacionesGuardianes' | 'createdAt' | 'updatedAt'
  >
): Promise<PuenteCulinario> {
  const db = getFirestoreInstance()
  const puenteId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const nuevoPuente: PuenteCulinario = {
    ...data,
    id: puenteId,
    estado: 'pendiente',
    aprobacionesGuardianes: [],
    createdAt: new Date(),
  }

  const validacion = PuenteCulinarioSchema.safeParse(nuevoPuente)
  if (!validacion.success) {
    throw ValidationError.fromZodError(validacion.error)
  }

  await setDoc(doc(db, 'puentesCulinarios', puenteId), {
    ...validacion.data,
    createdAt: serverTimestamp(),
  })

  return validacion.data
}

/**
 * Obtiene todos los puentes culinarios conectados a un platillo dado (como origen o destino).
 */
export async function obtenerPuentesPorPlatillo(platilloId: string): Promise<PuenteCulinario[]> {
  const db = getFirestoreInstance()
  const puentesRef = collection(db, 'puentesCulinarios')

  const qOrigen = query(puentesRef, where('origenPlatilloId', '==', platilloId))
  const qDestino = query(puentesRef, where('destinoPlatilloId', '==', platilloId))

  const [snapOrigen, snapDestino] = await Promise.all([getDocs(qOrigen), getDocs(qDestino)])

  const mapaPuentes = new Map<string, PuenteCulinario>()

  for (const docSnap of [...snapOrigen.docs, ...snapDestino.docs]) {
    const validado = PuenteCulinarioSchema.safeParse(docSnap.data())
    if (validado.success) {
      mapaPuentes.set(validado.data.id, validado.data)
    }
  }

  return Array.from(mapaPuentes.values())
}

/**
 * Registra una aprobación de guardián o administrador para un puente culinario.
 */
export async function aprobarPuenteCulinario(
  puenteId: string,
  guardianUid: string,
  esAdmin: boolean = false
): Promise<{ aprobado: boolean; puente: PuenteCulinario }> {
  const db = getFirestoreInstance()
  const puenteRef = doc(db, 'puentesCulinarios', puenteId)

  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(puenteRef)
    if (!snap.exists()) {
      throw new CommunityError('Puente culinario no encontrado', 'BRIDGE_NOT_FOUND')
    }

    const puenteData = snap.data() as PuenteCulinario
    const aprobaciones = new Set(puenteData.aprobacionesGuardianes || [])
    aprobaciones.add(guardianUid)

    const listaAprobaciones = Array.from(aprobaciones)
    const alcanzaConsenso = evaluarConsensoComunitario(listaAprobaciones, esAdmin)
    const nuevoEstado = alcanzaConsenso ? 'aprobado' : 'pendiente'

    const puenteActualizado: PuenteCulinario = {
      ...puenteData,
      aprobacionesGuardianes: listaAprobaciones,
      estado: nuevoEstado,
      updatedAt: new Date(),
    }

    const validacion = PuenteCulinarioSchema.safeParse(puenteActualizado)
    if (!validacion.success) {
      throw ValidationError.fromZodError(validacion.error)
    }

    transaction.update(puenteRef, {
      aprobacionesGuardianes: listaAprobaciones,
      estado: nuevoEstado,
      updatedAt: serverTimestamp(),
    })

    return { aprobado: alcanzaConsenso, puente: validacion.data }
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICIOS FIRESTORE - SUGERENCIAS Y ADAPTACIONES LOCALES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Propone una nueva adaptación local para una receta.
 */
export async function crearAdaptacionLocal(
  platilloId: string,
  data: Omit<
    AdaptacionLocal,
    | 'id'
    | 'platilloId'
    | 'votosFavor'
    | 'votosContra'
    | 'estado'
    | 'aprobacionesGuardianes'
    | 'createdAt'
    | 'updatedAt'
  >
): Promise<AdaptacionLocal> {
  const db = getFirestoreInstance()
  const adaptacionId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const nuevaAdaptacion: AdaptacionLocal = {
    ...data,
    id: adaptacionId,
    platilloId,
    votosFavor: 0,
    votosContra: 0,
    estado: 'pendiente',
    aprobacionesGuardianes: [],
    createdAt: new Date(),
  }

  const validacion = AdaptacionLocalSchema.safeParse(nuevaAdaptacion)
  if (!validacion.success) {
    throw ValidationError.fromZodError(validacion.error)
  }

  await setDoc(doc(db, 'platillos', platilloId, 'adaptacionesLocales', adaptacionId), {
    ...validacion.data,
    createdAt: serverTimestamp(),
  })

  return validacion.data
}

/**
 * Obtiene todas las adaptaciones locales registradas para un platillo.
 */
export async function obtenerAdaptacionesPorPlatillo(
  platilloId: string
): Promise<AdaptacionLocal[]> {
  const db = getFirestoreInstance()
  const adaptacionesRef = collection(db, 'platillos', platilloId, 'adaptacionesLocales')
  const snap = await getDocs(adaptacionesRef)

  const adaptaciones: AdaptacionLocal[] = []
  for (const docSnap of snap.docs) {
    const validado = AdaptacionLocalSchema.safeParse(docSnap.data())
    if (validado.success) {
      adaptaciones.push(validado.data)
    }
  }

  return adaptaciones
}

/**
 * Emite un voto favorable o en contra para una adaptación local.
 */
export async function votarAdaptacionLocal(
  platilloId: string,
  adaptacionId: string,
  tipoVoto: 'favor' | 'contra'
): Promise<{ votosFavor: number; votosContra: number }> {
  const db = getFirestoreInstance()
  const adaptacionRef = doc(db, 'platillos', platilloId, 'adaptacionesLocales', adaptacionId)

  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(adaptacionRef)
    if (!snap.exists()) {
      throw new CommunityError('Adaptación no encontrada', 'ADAPTATION_NOT_FOUND')
    }

    const data = snap.data() as AdaptacionLocal
    const votosFavor = tipoVoto === 'favor' ? (data.votosFavor || 0) + 1 : data.votosFavor || 0
    const votosContra = tipoVoto === 'contra' ? (data.votosContra || 0) + 1 : data.votosContra || 0

    transaction.update(adaptacionRef, {
      votosFavor,
      votosContra,
      updatedAt: serverTimestamp(),
    })

    return { votosFavor, votosContra }
  })
}

/**
 * Registra una aprobación de guardián o administrador para una adaptación local.
 */
export async function aprobarAdaptacionLocal(
  platilloId: string,
  adaptacionId: string,
  guardianUid: string,
  esAdmin: boolean = false
): Promise<{ aprobado: boolean; adaptacion: AdaptacionLocal }> {
  const db = getFirestoreInstance()
  const adaptacionRef = doc(db, 'platillos', platilloId, 'adaptacionesLocales', adaptacionId)

  return await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(adaptacionRef)
    if (!snap.exists()) {
      throw new CommunityError('Adaptación no encontrada', 'ADAPTATION_NOT_FOUND')
    }

    const adaptacionData = snap.data() as AdaptacionLocal
    const aprobaciones = new Set(adaptacionData.aprobacionesGuardianes || [])
    aprobaciones.add(guardianUid)

    const listaAprobaciones = Array.from(aprobaciones)
    const alcanzaConsenso = evaluarConsensoComunitario(listaAprobaciones, esAdmin)
    const nuevoEstado = alcanzaConsenso ? 'aprobado' : 'pendiente'

    const adaptacionActualizada: AdaptacionLocal = {
      ...adaptacionData,
      aprobacionesGuardianes: listaAprobaciones,
      estado: nuevoEstado,
      updatedAt: new Date(),
    }

    const validacion = AdaptacionLocalSchema.safeParse(adaptacionActualizada)
    if (!validacion.success) {
      throw ValidationError.fromZodError(validacion.error)
    }

    transaction.update(adaptacionRef, {
      aprobacionesGuardianes: listaAprobaciones,
      estado: nuevoEstado,
      updatedAt: serverTimestamp(),
    })

    return { aprobado: alcanzaConsenso, adaptacion: validacion.data }
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICIOS FIRESTORE - PEER REVIEW CULINARIO ("VALIDACIÓN DE RAÍCES")
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Registra una evaluación de "Validación de Raíces" sobre una receta.
 */
export async function crearValidacionRaices(
  platilloId: string,
  data: Omit<ValidacionRaicesReview, 'id' | 'platilloId' | 'createdAt'>
): Promise<ValidacionRaicesReview> {
  const db = getFirestoreInstance()
  const reviewId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const nuevoReview: ValidacionRaicesReview = {
    ...data,
    id: reviewId,
    platilloId,
    createdAt: new Date(),
  }

  const validacion = ValidacionRaicesReviewSchema.safeParse(nuevoReview)
  if (!validacion.success) {
    throw ValidationError.fromZodError(validacion.error)
  }

  await setDoc(doc(db, 'platillos', platilloId, 'validacionesRaices', reviewId), {
    ...validacion.data,
    createdAt: serverTimestamp(),
  })

  return validacion.data
}

/**
 * Obtiene todas las evaluaciones de validación de raíces para un platillo.
 */
export async function obtenerValidacionesPorPlatillo(
  platilloId: string
): Promise<ValidacionRaicesReview[]> {
  const db = getFirestoreInstance()
  const reviewsRef = collection(db, 'platillos', platilloId, 'validacionesRaices')
  const snap = await getDocs(reviewsRef)

  const reviews: ValidacionRaicesReview[] = []
  for (const docSnap of snap.docs) {
    const validado = ValidacionRaicesReviewSchema.safeParse(docSnap.data())
    if (validado.success) {
      reviews.push(validado.data)
    }
  }

  return reviews
}
