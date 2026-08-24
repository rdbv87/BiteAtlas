import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  runTransaction,
  serverTimestamp,
  onSnapshot,
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
export const PUNTOS_VALIDACION_RAICES = 25
export const PUNTOS_APORTE_PLATILLO = 50
export const PUNTOS_PUENTE_CULINARIO = 30
export const PUNTOS_ADAPTACION_LOCAL = 20

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
 * Suscribe un listener en tiempo real a los cambios del perfil de usuario en Firestore.
 */
export function suscribirUsuarioPerfil(
  uid: string,
  onUpdate: (perfil: UsuarioPerfil | null) => void,
  onError?: (error: Error) => void
): () => void {
  const db = getFirestoreInstance()
  const userRef = doc(db, 'usuarios', uid)

  return onSnapshot(
    userRef,
    (snap) => {
      if (!snap.exists()) {
        onUpdate(null)
        return
      }

      const parseResult = UsuarioPerfilSchema.safeParse(snap.data())
      if (parseResult.success) {
        onUpdate(parseResult.data)
      } else {
        onError?.(ValidationError.fromZodError(parseResult.error))
      }
    },
    (err) => {
      onError?.(err)
    }
  )
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

    let puntosActuales = 0
    let puntosCuraduriaActuales = 0
    let aportesValidados = 0
    let displayName = 'Explorador Culinario'
    let email = ''
    let photoURL: string | undefined = undefined
    let insignias: InsigniaOtorgada[] = []
    let regionesEspecialidad: string[] = []

    if (userDoc.exists()) {
      const userData = userDoc.data()
      puntosActuales = (userData.puntosAntropologicos as number) || 0
      puntosCuraduriaActuales = (userData.puntosCuraduria as number) || 0
      aportesValidados = (userData.aportesValidados as number) || 0
      displayName = (userData.displayName as string) || displayName
      email = (userData.email as string) || email
      photoURL = (userData.photoURL as string) || undefined
      insignias = (userData.insignias as InsigniaOtorgada[]) || []
      regionesEspecialidad = (userData.regionesEspecialidad as string[]) || []
    }

    const nuevosPuntos = Math.max(0, puntosActuales + puntos)
    const esCuraduria = referenciaTipo === 'review' || referenciaTipo === 'curaduria'
    const nuevosPuntosCuraduria = esCuraduria
      ? Math.max(0, puntosCuraduriaActuales + puntos)
      : puntosCuraduriaActuales
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

    if (userDoc.exists()) {
      transaction.update(userRef, {
        puntosAntropologicos: nuevosPuntos,
        puntosCuraduria: nuevosPuntosCuraduria,
        rol: nuevoRol,
        updatedAt: serverTimestamp(),
      })
    } else {
      transaction.set(userRef, {
        uid,
        email,
        displayName,
        photoURL,
        rol: nuevoRol,
        puntosAntropologicos: nuevosPuntos,
        puntosCuraduria: nuevosPuntosCuraduria,
        aportesValidados,
        insignias,
        regionesEspecialidad,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

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

  if (data.autorId && data.autorId !== 'anonimo') {
    try {
      await agregarPuntosUsuario(
        data.autorId,
        PUNTOS_VALIDACION_RAICES,
        'Evaluación de receta (Validación de Raíces)',
        'review',
        platilloId
      )
    } catch (error) {
      console.error('Error al otorgar puntos por validación de raíces:', error)
    }
  }

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

// ═══════════════════════════════════════════════════════════════════════════
// SERVICIOS FIRESTORE - RECONCILIACIÓN Y CÁLCULO RETROACTIVO DE XP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Reconcilia de forma idempotente y retroactiva todos los aportes históricos de un usuario
 * (platillos, evaluaciones, puentes y adaptaciones) asignando la experiencia (XP),
 * puntos de curaduría y aportes validados correspondientes sin duplicaciones.
 */
export async function reconciliarPuntosUsuario(uid: string): Promise<{
  puntosSumados: number
  puntosTotales: number
  puntosCuraduria: number
  aportesValidados: number
  nuevoRol: RolUsuario
  nuevosHistoriales: number
}> {
  const db = getFirestoreInstance()
  const userRef = doc(db, 'usuarios', uid)
  const historialColRef = collection(db, 'usuarios', uid, 'historialPuntos')

  // 1. Obtener historial ya registrado para evitar duplicados (idempotencia)
  const snapHistorial = await getDocs(historialColRef)
  const historialExistente = new Set<string>()
  for (const d of snapHistorial.docs) {
    const data = d.data() as HistorialPuntos
    if (data.referenciaTipo && data.referenciaId) {
      historialExistente.add(`${data.referenciaTipo}:${data.referenciaId}`)
    }
  }

  // 2. Obtener platillos accesibles (los creados por el usuario y los publicados)
  const qPlatillosUsuario = query(collection(db, 'platillos'), where('contribuidorId', '==', uid))
  const qPlatillosPublicados = query(
    collection(db, 'platillos'),
    where('estado', '==', 'publicado')
  )

  const [snapPlatillosUsuario, snapPlatillosPublicados] = await Promise.all([
    getDocs(qPlatillosUsuario).catch(() => ({ docs: [] })),
    getDocs(qPlatillosPublicados).catch(() => ({ docs: [] })),
  ])

  const mapaPlatillos = new Map<string, { id: string }>()
  for (const docSnap of [...snapPlatillosUsuario.docs, ...snapPlatillosPublicados.docs]) {
    mapaPlatillos.set(docSnap.id, docSnap)
  }

  // 3. Buscar puentes culinarios creados por el usuario (en raíz y subcolecciones)
  const puentesUsuario: { id: string }[] = []
  try {
    const qPuentes = query(collection(db, 'puentesCulinarios'), where('creadoPorId', '==', uid))
    const snapPuentes = await getDocs(qPuentes)
    for (const d of snapPuentes.docs) {
      puentesUsuario.push({ id: d.id })
    }
  } catch {
    // Si no está en la raíz, se auditará desde las subcolecciones de platillos
  }

  // 4. Buscar validaciones, adaptaciones y puentes en las subcolecciones de platillos accesibles
  const validacionesUsuario: { id: string; platilloId: string }[] = []
  const adaptacionesUsuario: { id: string; platilloId: string }[] = []

  await Promise.all(
    Array.from(mapaPlatillos.keys()).map(async (platilloId) => {
      // Validaciones de raíces
      try {
        const subSnap = await getDocs(
          query(
            collection(db, 'platillos', platilloId, 'validacionesRaices'),
            where('autorId', '==', uid)
          )
        )
        for (const vDoc of subSnap.docs) {
          validacionesUsuario.push({ id: vDoc.id, platilloId })
        }
      } catch {}

      // Adaptaciones locales
      try {
        const subSnap = await getDocs(
          query(
            collection(db, 'platillos', platilloId, 'adaptacionesLocales'),
            where('autorId', '==', uid)
          )
        )
        for (const aDoc of subSnap.docs) {
          adaptacionesUsuario.push({ id: aDoc.id, platilloId })
        }
      } catch {}

      // Puentes en subcolección (si existieran)
      try {
        const subSnap = await getDocs(
          query(
            collection(db, 'platillos', platilloId, 'puentesCulinarios'),
            where('creadoPorId', '==', uid)
          )
        )
        for (const pDoc of subSnap.docs) {
          if (!puentesUsuario.some((p) => p.id === pDoc.id)) {
            puentesUsuario.push({ id: pDoc.id })
          }
        }
      } catch {}
    })
  )

  // 6. Preparar nuevos registros
  const nuevosRegistros: HistorialPuntos[] = []
  let puntosASumar = 0
  let curaduriaASumar = 0

  // Procesar platillos
  for (const pDoc of snapPlatillosUsuario.docs) {
    const key = `platillo:${pDoc.id}`
    if (!historialExistente.has(key)) {
      historialExistente.add(key)
      puntosASumar += PUNTOS_APORTE_PLATILLO
      nuevosRegistros.push({
        id: doc(historialColRef).id,
        usuarioId: uid,
        puntos: PUNTOS_APORTE_PLATILLO,
        motivo: 'Aporte de receta tradicional a la cartografía',
        referenciaTipo: 'platillo',
        referenciaId: pDoc.id,
        createdAt: new Date(),
      })
    }
  }

  // Procesar validaciones
  for (const v of validacionesUsuario) {
    const key = `review:${v.platilloId}`
    const keyReviewId = `review:${v.id}`
    if (!historialExistente.has(key) && !historialExistente.has(keyReviewId)) {
      historialExistente.add(key)
      puntosASumar += PUNTOS_VALIDACION_RAICES
      curaduriaASumar += PUNTOS_VALIDACION_RAICES
      nuevosRegistros.push({
        id: doc(historialColRef).id,
        usuarioId: uid,
        puntos: PUNTOS_VALIDACION_RAICES,
        motivo: 'Evaluación antropológica de receta (Validación de Raíces)',
        referenciaTipo: 'review',
        referenciaId: v.platilloId,
        createdAt: new Date(),
      })
    }
  }

  // Procesar puentes
  for (const puente of puentesUsuario) {
    const key = `puente:${puente.id}`
    if (!historialExistente.has(key)) {
      historialExistente.add(key)
      puntosASumar += PUNTOS_PUENTE_CULINARIO
      nuevosRegistros.push({
        id: doc(historialColRef).id,
        usuarioId: uid,
        puntos: PUNTOS_PUENTE_CULINARIO,
        motivo: 'Propuesta de puente culinario interregional',
        referenciaTipo: 'puente',
        referenciaId: puente.id,
        createdAt: new Date(),
      })
    }
  }

  // Procesar adaptaciones
  for (const a of adaptacionesUsuario) {
    const key = `adaptacion:${a.id}`
    if (!historialExistente.has(key)) {
      historialExistente.add(key)
      puntosASumar += PUNTOS_ADAPTACION_LOCAL
      nuevosRegistros.push({
        id: doc(historialColRef).id,
        usuarioId: uid,
        puntos: PUNTOS_ADAPTACION_LOCAL,
        motivo: 'Propuesta de adaptación local o variante',
        referenciaTipo: 'adaptacion',
        referenciaId: a.id,
        createdAt: new Date(),
      })
    }
  }

  // 7. Persistir en Firestore mediante transacción atómica
  return await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef)
    let puntosActuales = 0
    let curaduriaActual = 0
    let aportesActuales = snapPlatillosUsuario.docs.length
    let displayName = 'Explorador Culinario'
    let email = ''
    let photoURL: string | undefined = undefined
    let insignias: InsigniaOtorgada[] = []
    let regionesEspecialidad: string[] = []

    if (userDoc.exists()) {
      const data = userDoc.data()
      puntosActuales = (data.puntosAntropologicos as number) || 0
      curaduriaActual = (data.puntosCuraduria as number) || 0
      aportesActuales = Math.max(
        snapPlatillosUsuario.docs.length,
        (data.aportesValidados as number) || 0
      )
      displayName = (data.displayName as string) || displayName
      email = (data.email as string) || email
      photoURL = (data.photoURL as string) || undefined
      insignias = (data.insignias as InsigniaOtorgada[]) || []
      regionesEspecialidad = (data.regionesEspecialidad as string[]) || []
    }

    const puntosTotales = puntosActuales + puntosASumar
    const curaduriaTotal = curaduriaActual + curaduriaASumar
    const nuevoRol = calcularRolUsuario(puntosTotales, aportesActuales)

    for (const reg of nuevosRegistros) {
      const hRef = doc(collection(db, 'usuarios', uid, 'historialPuntos'), reg.id)
      transaction.set(hRef, {
        ...reg,
        createdAt: serverTimestamp(),
      })
    }

    if (userDoc.exists()) {
      transaction.update(userRef, {
        puntosAntropologicos: puntosTotales,
        puntosCuraduria: curaduriaTotal,
        aportesValidados: aportesActuales,
        rol: nuevoRol,
        updatedAt: serverTimestamp(),
      })
    } else {
      transaction.set(userRef, {
        uid,
        email,
        displayName,
        photoURL,
        rol: nuevoRol,
        puntosAntropologicos: puntosTotales,
        puntosCuraduria: curaduriaTotal,
        aportesValidados: aportesActuales,
        insignias,
        regionesEspecialidad,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    return {
      puntosSumados: puntosASumar,
      puntosTotales,
      puntosCuraduria: curaduriaTotal,
      aportesValidados: aportesActuales,
      nuevoRol,
      nuevosHistoriales: nuevosRegistros.length,
    }
  })
}
