# Tasks · 005 Motor de Ingesta Antropológica

## Tareas

### Instalación

- [x] Instalar `tsx` con `npm install -D tsx`
- [x] Verificar que `tsx` funciona

### Datos de Honduras

- [x] Crear `src/scripts/data/honduras.ts`
- [x] Definir datos del país Honduras
- [x] Definir 3 regiones (Copán, La Ceiba, Comayagua)
- [x] Definir 3 platillos típicos (Baleada, Sopa de Caracol, Nacatamal)
- [x] Definir 20 ingredientes correspondientes
- [x] Verificar que los datos son auténticos

### Script de Ingesta

- [x] Crear `src/scripts/ingest-honduras.ts`
- [x] Implementar función `ingestPais`
- [x] Implementar función `ingestRegion`
- [x] Implementar función `ingestPlatillo`
- [x] Implementar función `ingestIngrediente`
- [x] Implementar función `main` con logging
- [x] Agregar manejo de errores con `ValidationError`

### Comando npm

- [x] Agregar script `ingest` a `package.json`
- [ ] Verificar que `npm run ingest` funciona (requiere credenciales Firebase)

### Tests

- [x] Crear `src/scripts/__tests__/honduras.test.ts`
- [x] Test de validación de país Honduras
- [x] Test de validación de regiones
- [x] Test de validación de ingredientes
- [x] Test de validación de platillos
- [x] Test de integridad de referencias
- [x] Verificar que los tests pasan (21 tests)

### Documentación

- [ ] Documentar proceso de ingesta en README
- [ ] Documentar estructura de datos
- [ ] Documentar cómo agregar nuevas regiones/países

### Verificación Final

- [ ] Ejecutar `npm run ingest` → funciona (requiere credenciales Firebase)
- [ ] Verificar datos en Firebase Console
- [x] Ejecutar `npm run test:run` → pasa (53 tests)
- [x] Ejecutar `npm run build` → compila
- [x] Ejecutar `npm run lint` → sin errores
