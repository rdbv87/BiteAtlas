# Plan · 001 Setup del Proyecto Base

## Enfoque técnico

### 1. Inicialización de Next.js

```bash
npx create-next-app@latest biteatlas --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

- App Router habilitado
- Directorio `src/` habilitado
- Import alias `@/*` configurado

### 2. Configuración de TypeScript

Modificar `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 3. Sistema de Testing (Vitest)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Crear `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 4. Calidad de Código (ESLint + Prettier)

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier
```

Crear `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 5. Pre-commit Hooks (Husky + lint-staged)

```bash
npm install -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run lint-staged"
```

Modificar `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### 6. Estructura de Directorios

```
src/
├── components/     ← Componentes de interfaz
├── services/       ← Lógica de comunicación y Firebase
├── types/          ← Tipos TypeScript y esquemas Zod
├── scripts/        ← Scripts de ingesta
├── errors/         ← Clases de error personalizadas
└── tests/          ← Tests y setup de testing
```

### 7. Variables de Entorno

Crear `.env.example`:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Decisiones técnicas

1. **Vitest sobre Jest**: Mejor compatibilidad con Next.js y ESM nativo
2. **Husky sobre lefthook**: Más popular y mejor documentado
3. **Prettier con singleQuote**: Consistencia con el estilo del proyecto
4. **noUncheckedIndexedAccess**: Seguridad estricta al acceder a arrays/objetos

## Riesgos

- **Next.js updates**: Mantener versiones actualizadas
- **Conflictos ESLint/Prettier**: Usar `eslint-config-prettier` para evitarlos
