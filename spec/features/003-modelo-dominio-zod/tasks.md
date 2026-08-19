# Tasks · 003 Modelo de Dominio + Zod

## Tareas

### Instalación

- [x] Instalar Zod con `npm install zod`
- [x] Verificar que Zod funciona en el proyecto

### Esquemas Zod

- [x] Crear `src/types/schemas.ts`
- [x] Definir `ContinenteSchema`
- [x] Definir `DificultadSchema`
- [x] Definir `CategoriaIngredienteSchema`
- [x] Definir `EstadoPlatilloSchema`
- [x] Definir `PaisSchema`
- [x] Definir `RegionSchema`
- [x] Definir `IngredienteSchema`
- [x] Definir `IngredientePlatilloSchema`
- [x] Definir `PlatilloSchema`

### Tipos TypeScript

- [x] Crear `src/types/index.ts`
- [x] Derivar tipos de esquemas Zod con `z.infer`
- [x] Exportar todos los tipos
- [x] Verificar que TypeScript compila

### Clases de Error

- [x] Crear `src/errors/validation-error.ts`
- [x] Implementar `ValidationError` con campos `field` y `issues`
- [x] Implementar `fromZodError` para convertir errores de Zod
- [x] Implementar `toJSON` para serialización
- [x] Crear `src/errors/index.ts` para exportaciones

### Tests de Validación

- [x] Crear `src/types/__tests__/schemas.test.ts`
- [x] Test `ContinenteSchema` con datos válidos e inválidos
- [x] Test `DificultadSchema` con datos válidos e inválidos
- [x] Test `CategoriaIngredienteSchema` con datos válidos e inválidos
- [x] Test `EstadoPlatilloSchema` con datos válidos e inválidos
- [x] Test `PaisSchema` con datos válidos e inválidos
- [x] Test `RegionSchema` con datos válidos e inválidos
- [x] Test `PlatilloSchema` con datos válidos e inválidos
- [x] Test `IngredienteSchema` con datos válidos e inválidos
- [x] Test `ValidationError` se lanza correctamente

### Verificación Final

- [x] Ejecutar `npm run test:run` → pasa (29 tests)
- [x] Ejecutar `npm run build` → compila
- [x] Ejecutar `npm run lint` → sin errores
- [x] Verificar que los tipos son correctos
- [x] Verificar que los esquemas validan correctamente
