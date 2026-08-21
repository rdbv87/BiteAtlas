import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combina clases CSS Tailwind de forma segura, evitando conflictos de especificidad.
// Usa clsx para logica condicional y twMerge para resolver conflictos de Tailwind.
// Patrones: cn('bg-blue-500', condition && 'text-white') -> classes seguras
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Recorta un texto a un máximo de palabras, agregando '…' si es necesario.
// Util para previsualizaciones de descripciones largas sin quebrar la UI.
export function summarizeWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return text.trim()
  return `${words.slice(0, maxWords).join(' ')}…`
}

// Optimiza URLs de Unsplash agregando parametros de recorte y compresion.
// Si la URL ya tiene query params (?) o no es de Unsplash, devuelve sin cambios.
// Parametros default: auto=format&fit=crop&w=900&q=85 (formato auto, recorte, ancho 900px, calidad 85)
export function optimizeUnsplashUrl(
  url: string,
  params = 'auto=format&fit=crop&w=900&q=85'
): string {
  if (!url.includes('images.unsplash.com')) return url
  return url.includes('?') ? url : `${url}?${params}`
}
