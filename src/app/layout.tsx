import type { Metadata } from 'next'
import { Inter, Merriweather, Geist } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '700'],
})

export const metadata: Metadata = {
  title: 'BiteAtlas — Expedición Culinaria Global',
  description:
    'Plataforma de expedición culinaria y puente de intercambio cultural. Conecta tradiciones, historias antropológicas y recetas auténticas de todo el mundo.',
}

import { I18nProvider } from '@/i18n/context'

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={cn(
        'h-full',
        'antialiased',
        inter.variable,
        merriweather.variable,
        'font-sans',
        geist.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}
