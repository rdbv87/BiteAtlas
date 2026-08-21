'use client'

import { useEffect, useState, useCallback } from 'react'
import { FirebaseError } from 'firebase/app'
import {
  type User,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
} from 'firebase/auth'
import { firebaseAuth } from '@/services/firebase'

// Convierte errores de Firebase Auth a mensajes en espanol amigables para el usuario.
// Mapea codigos de error especificos a mensajes contextuales.
// Si el error no esta en el mapa, devuelve un mensaje generico con el codigo original.
function getFriendlyAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    const messages: Record<string, string> = {
      'auth/invalid-email': 'El correo electronico no es valido.',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
      'auth/user-not-found': 'No existe una cuenta con ese correo.',
      'auth/wrong-password': 'La contrasena es incorrecta.',
      'auth/invalid-credential': 'Correo o contrasena incorrectos.',
      'auth/invalid-login-credentials': 'Correo o contrasena incorrectos.',
      'auth/email-already-in-use': 'Este correo ya esta registrado.',
      'auth/weak-password': 'La contrasena debe tener al menos 6 caracteres.',
      'auth/operation-not-allowed': 'Este metodo de inicio no esta habilitado.',
      'auth/too-many-requests': 'Demasiados intentos. Intenta nuevamente en unos minutos.',
      'auth/popup-blocked':
        'El navegador bloqueo la ventana de Google. Habilita popups e intenta de nuevo.',
      'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de completar el inicio.',
      'auth/network-request-failed': 'No se pudo conectar. Revisa tu internet e intenta de nuevo.',
      'auth/unauthorized-domain': 'Este dominio no esta autorizado para iniciar sesion con Google.',
      'auth/cancelled-popup-request': 'Se cancelo el intento anterior de inicio con Google.',
      'auth/invalid-api-key':
        'La configuracion de Firebase no es valida. Revisa la clave de la aplicacion.',
      'auth/app-not-authorized': 'Esta aplicacion no esta autorizada en el proyecto de Firebase.',
      'auth/configuration-not-found':
        'Firebase Auth no tiene una configuracion activa para este proyecto.',
      'auth/operation-not-supported-in-this-environment':
        'Este metodo de inicio no esta disponible en este entorno.',
    }

    return messages[error.code] ?? `Error de autenticacion (${error.code}). Intenta de nuevo.`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrio un error inesperado. Intenta de nuevo.'
}

interface UseAuthResult {
  user: User | null
  isLoading: boolean
  error: string | null
  register: (email: string, password: string, displayName?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

// Hook de autenticacion que gestiona el estado del usuario y operaciones de auth.
// Caracteristicas:
// - Escucha cambios de estado de autenticacion en tiempo real (onAuthStateChanged)
// - Maneja resultados de redirecciones de Google Sign-In
// - Provee metodos para registro, login, login con Google, y logout
// - Todos los errores se convierten a mensajes en espanol amigables
// - Usa cleanup flag para evitar memory leaks en unmounted components
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!firebaseAuth) {
      setTimeout(() => {
        if (!isMounted) return
        setIsLoading(false)
        setError('Firebase Auth no está inicializado')
      }, 0)

      return () => {
        isMounted = false
      }
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (!isMounted) return
      setUser(firebaseUser)
      if (firebaseUser) {
        setError(null)
      }
      setIsLoading(false)
    })

    void getRedirectResult(firebaseAuth)
      .then((result) => {
        if (!isMounted || !result?.user) return
        setUser(result.user)
      })
      .catch((redirectError) => {
        if (!isMounted) return
        setError(getFriendlyAuthError(redirectError))
      })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    setError(null)
    if (!firebaseAuth) {
      const message = 'Firebase Auth no esta disponible'
      setError(message)
      throw new Error(message)
    }

    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)

      if (displayName) {
        await updateProfile(credential.user, { displayName })
        setUser({ ...credential.user, displayName } as User)
      } else {
        setUser(credential.user)
      }
    } catch (registerError) {
      const message = getFriendlyAuthError(registerError)
      setError(message)
      throw new Error(message)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    if (!firebaseAuth) {
      const message = 'Firebase Auth no esta disponible'
      setError(message)
      throw new Error(message)
    }

    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      setUser(credential.user)
    } catch (loginError) {
      const message = getFriendlyAuthError(loginError)
      setError(message)
      throw new Error(message)
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setError(null)
    if (!firebaseAuth) {
      const message = 'Firebase Auth no esta disponible'
      setError(message)
      throw new Error(message)
    }

    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      const credential = await signInWithPopup(firebaseAuth, provider)
      setUser(credential.user)
    } catch (googleError) {
      const message = getFriendlyAuthError(googleError)
      setError(message)
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    if (!firebaseAuth) {
      const message = 'Firebase Auth no esta disponible'
      setError(message)
      throw new Error(message)
    }

    try {
      await signOut(firebaseAuth)
      setUser(null)
    } catch (logoutError) {
      const message = getFriendlyAuthError(logoutError)
      setError(message)
      throw new Error(message)
    }
  }, [])

  return {
    user,
    isLoading,
    error,
    register,
    login,
    signInWithGoogle,
    logout,
  }
}
