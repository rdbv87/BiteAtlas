# Tasks · 005 Motor de Ingesta Antropológica

## Tareas

### Instalación

- [x] Instalar `tsx` con `npm install -D tsx`
- [x] Verificar que `tsx` funciona

### Catálogo geográfico

- [x] Mantener `src/scripts/data/paises-mundo.ts` como única fuente del catálogo
- [x] Añadir `lat`, `lng` y `zoom` a cada país
- [x] Generar 3 regiones por país
- [x] Retirar los datos de la etapa piloto (países, recetas e ingredientes sembrados a mano)

### Script de Ingesta

- [x] Crear `src/scripts/seed-atlas.ts`
- [x] Validar países y regiones con Zod antes de escribir
- [x] Escribir en lotes de 450 operaciones
- [x] Verificar el conteo de países tras el seed
- [x] Agregar manejo de errores con `ValidationError`

### Limpieza de datos piloto

- [x] Crear `src/scripts/purge-seed-data.ts`
- [x] Borrar los platillos sin `contribuidorId` y la colección `ingredientes`
- [x] Modo simulación por defecto, borrado real con `--confirm`

### Comando npm

- [x] Agregar scripts `seed` y `purge:seed` a `package.json`
- [ ] Verificar que `npm run seed` funciona (requiere credenciales Firebase)

### Tests

- [x] Crear `src/scripts/__tests__/paises-mundo.test.ts`
- [x] Test de validación de todos los países
- [x] Test de unicidad de identificadores y códigos ISO
- [x] Test de encuadre de mapa por país
- [x] Test de validación de regiones
- [x] Verificar que los tests pasan

### Documentación

- [ ] Documentar proceso de ingesta en README
- [ ] Documentar estructura de datos
- [ ] Documentar cómo agregar nuevas regiones/países

### Verificación Final

- [ ] Ejecutar `npm run seed` → funciona (requiere credenciales Firebase)
- [ ] Verificar datos en Firebase Console
- [x] Ejecutar `npm run test:run` → pasa (47 tests)
- [x] Ejecutar `npm run build` → compila
- [x] Ejecutar `npm run lint` → sin errores
