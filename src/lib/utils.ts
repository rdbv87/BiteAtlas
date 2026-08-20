import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function summarizeWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return text.trim()
  return `${words.slice(0, maxWords).join(' ')}…`
}

// Añade parámetros de recorte/calidad a URLs de Unsplash que no los traen
export function optimizeUnsplashUrl(
  url: string,
  params = 'auto=format&fit=crop&w=900&q=85'
): string {
  if (!url.includes('images.unsplash.com')) return url
  return url.includes('?') ? url : `${url}?${params}`
}
