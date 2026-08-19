'use client'

import { FormularioAporte, type FormData } from '@/components/aportes/FormularioAporte'

export default function AportesPage() {
  const onSubmit = (data: FormData) => {
    console.log('Aporte enviado:', data)
    // TODO: Implementar envío a Firestore
  }

  const onCancel = () => {
    // Cancelar y volver al inicio
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Aporta tu Platillo Tradicional</h1>

      <p className="text-muted-foreground mb-6">
        Comparte tu receta tradicional con la comunidad BiteAtlas. Ayuda a preservar el patrimonio
        culinario de tu región y celebra la diversidad gastronómica mundial.
      </p>

      <FormularioAporte onSubmit={onSubmit} onCancel={onCancel} />

      <p className="mt-6 text-sm text-muted-foreground">
        Al aportar, aceptas que tu receta será revisada y potentially publicada para que otros
        puedan disfrutar de tu tradición culinaria.
      </p>
    </div>
  )
}
