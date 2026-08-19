# Plan · 006 Navegación Cartográfica Interactiva

## Enfoque técnico

### 1. Evaluación de Librerías de Mapas

| Librería          | Pros                                  | Contras                     | Recomendación   |
| ----------------- | ------------------------------------- | --------------------------- | --------------- |
| **Leaflet**       | Ligero, open-source, gran ecosistema  | Menos features 3D           | ✅ Buena opción |
| **Mapbox GL JS**  | Alto rendimiento, 3D, personalización | API key, costos             | ⚠️ Opcional     |
| **React Leaflet** | Wrapper React para Leaflet            | Depende de Leaflet          | ✅ Buena opción |
| **Deck.gl**       | Visualización de datos geoespaciales  | Complejo para mapas simples | ❌ Overkill     |

**Decisión:** React Leaflet (ligero, open-source, buena integración con React)

### 2. Instalación

```bash
npm install react-leaflet leaflet
npm install -D @types/leaflet
```

### 3. Estructura de Componentes

```
src/components/
├── MapaMundi/
│   ├── MapaMundi.tsx          ← Componente principal
│   ├── MapaMundi.test.tsx     ← Tests
│   ├── styles.ts              ← Estilos del mapa
│   └── index.ts               ← Exportaciones
├── Marcadores/
│   ├── MarcadorPais.tsx       ← Marcador por país
│   ├── MarcadorRegion.tsx     ← Marcador por región
│   └── index.ts
└── Paneles/
    ├── PanelPais.tsx          ← Info del país seleccionado
    ├── PanelRegion.tsx        ← Info de la región
    └── index.ts
```

### 4. Componente Principal

Crear `src/components/MapaMundi/MapaMundi.tsx`:

```typescript
'use client'

import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { MarcadorPais } from '../Marcadores/MarcadorPais'
import { usePaises } from '@/services/hooks/usePaises'
import 'leaflet/dist/leaflet.css'

interface MapaMundiProps {
  onPaisClick?: (paisId: string) => void
  onRegionClick?: (regionId: string) => void
}

export function MapaMundi({ onPaisClick, onRegionClick }: MapaMundiProps) {
  const { paises, isLoading } = usePaises()

  if (isLoading) return <div>Cargando mapa...</div>

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={10}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {paises.map((pais) => (
        <MarcadorPais
          key={pais.id}
          pais={pais}
          onClick={() => onPaisClick?.(pais.id)}
        />
      ))}
    </MapContainer>
  )
}
```

### 5. Hook de Datos

Crear `src/services/hooks/usePaises.ts`:

```typescript
import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { Pais } from '@/types'

export function usePaises() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchPaises() {
      try {
        const snapshot = await getDocs(collection(db, 'paises'))
        const data = snapshot.docs.map((doc) => doc.data() as Pais)
        setPaises(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaises()
  }, [])

  return { paises, isLoading, error }
}
```

### 6. Coordenadas de Países

Necesario para posicionar marcadores. Opciones:

- Usar API de geocoding (OpenStreetMap Nominatim)
- Hardcodear coordenadas principales
- Usar dataset predefinido

**Decisión:** Dataset estático para países (mejor rendimiento)

### 7. Responsive

- **Mobile:** Mapa a pantalla completa, panel info como drawer
- **Desktop:** Mapa con panel lateral para info

## Decisiones técnicas

1. **React Leaflet:** Más ligero que Mapbox, open-source
2. **OpenStreetMap:** Tiles gratuitos, sin API key
3. **Dataset estático:** Mejor performance que geocoding en tiempo real
4. **Panel lateral:** Mejor UX que popups flotantes

## Riesgos

- **Performance:** Vigilar con muchos marcadores
- **Mobile:** Touch interactions pueden ser tricky
- **Offline:**考虑 implementar fallback sin mapa
