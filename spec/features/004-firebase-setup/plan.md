# Plan · 004 Firebase Setup

## Enfoque técnico

### 1. Instalación de Dependencias

```bash
npm install firebase firebase-admin
```

- `firebase`: Cliente para la app (Next.js client-side)
- `firebase-admin`: Admin para scripts de ingesta (server-side)

### 2. Estructura de Colecciones

```
firestore/
├── paises/{paisId}
│   ├── nombre: string
│   ├── codigoISO: string
│   ├── continente: string
│   ├── descripcion?: string
│   ├── imagen?: string
│   └── regiones/ (subcollection)
│       └── {regionId}
│           ├── nombre: string
│           ├── descripcion?: string
│           ├── imagen?: string
│           └── platillos/ (subcollection)
│               └── {platilloId}
│                   ├── nombre: string
│                   ├── descripcion: string
│                   ├── instrucciones: string[]
│                   ├── ingredientes: array
│                   ├── tiempoPreparacion?: number
│                   ├── dificultad: string
│                   ├── porciones?: number
│                   ├── imagenes: string[]
│                   ├── video?: string
│                   ├── contextoHistorico?: string
│                   ├── festividades?: string[]
│                   └── createdAt: timestamp
└── ingredientes/{ingredienteId}
    ├── nombre: string
    ├── categoria: string
    └── imagen?: string
```

### 3. Cliente Firestore

Crear `src/services/firebase.ts`:

```typescript
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Inicializar solo si no existe (evita duplicados en hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const db = getFirestore(app)
```

### 4. Reglas de Seguridad

Crear `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Países - lectura pública
    match /paises/{paisId} {
      allow read: if true;
      allow write: if false; // Solo ingesta admin

      // Regiones - lectura pública
      match /regiones/{regionId} {
        allow read: if true;
        allow write: if false;

        // Platillos - lectura pública
        match /platillos/{platilloId} {
          allow read: if true;
          allow write: if false;
        }
      }
    }

    // Ingredientes - lectura pública
    match /ingredientes/{ingredienteId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 5. Variables de Entorno

Actualizar `.env.example`:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 6. Test de Conexión

Crear `src/services/__tests__/firebase.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { db } from '../firebase'

describe('Firebase Connection', () => {
  it('should initialize Firestore', () => {
    expect(db).toBeDefined()
    expect(db.app).toBeDefined()
  })
})
```

## Decisiones técnicas

1. **Subcollections sobre top-level**: Más limpio para la jerarquía País > Región > Platillo
2. **Lectura pública**: La constitución dice "exploración sin fricción"
3. **Escritura restringida**: Preparado para futura autenticación
4. **Ingredientes separados**: Reutilizables entre platillos

## Riesgos

- **Credenciales expuestas**: Nunca subir `.env.local` al repo
- **Reglas de seguridad**: Empezar restrictivo, abrir después
- **Costos de Firestore**: Vigilar lecturas/escrituras en desarrollo
