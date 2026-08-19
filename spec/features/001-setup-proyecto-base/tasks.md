# Tasks · 001 Setup del Proyecto Base

## Tareas

### Inicialización

- [x] Ejecutar `npx create-next-app@latest` con opciones correctas
- [x] Verificar que el proyecto inicia con `npm run dev`

### TypeScript

- [x] Modificar `tsconfig.json` con strict mode
- [x] Verificar que TypeScript compila sin errores

### Testing (Vitest)

- [x] Instalar Vitest + Testing Library
- [x] Crear `vitest.config.ts`
- [x] Crear `src/tests/setup.ts`
- [x] Crear test de ejemplo en `src/components/__tests__/`
- [x] Verificar que `npm run test` funciona

### Calidad de Código

- [x] Instalar ESLint + Prettier
- [x] Crear `.prettierrc`
- [x] Configurar ESLint para usar Prettier
- [x] Verificar que `npm run lint` funciona

### Pre-commit Hooks

- [x] Instalar Husky + lint-staged
- [x] Configurar pre-commit hook
- [x] Configurar lint-staged en package.json
- [x] Probar hook con un commit de prueba

### Estructura de Directorios

- [x] Crear `src/components/`
- [x] Crear `src/services/`
- [x] Crear `src/types/`
- [x] Crear `src/scripts/`
- [x] Crear `src/errors/`
- [x] Crear `src/tests/`

### Variables de Entorno

- [x] Crear `.env.example`
- [x] Agregar `.env.local` a `.gitignore`

### Documentación

- [ ] Actualizar README.md con instrucciones de setup
- [ ] Documentar comandos disponibles

### Verificación Final

- [x] Ejecutar `npm run dev` → funciona
- [x] Ejecutar `npm run test` → pasa
- [x] Ejecutar `npm run lint` → sin errores
- [x] Ejecutar `npm run build` → compila
