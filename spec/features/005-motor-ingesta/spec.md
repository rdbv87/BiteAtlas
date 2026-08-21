# 005 · Motor de Ingesta Antropológica

## Qué hace

Script versionado y ejecutable para poblar Firebase Firestore con el catálogo geográfico del atlas: todos los países del mundo y sus regiones, cada uno con su encuadre de mapa. Incluye validación Zod antes de insertar.

Las recetas no se siembran: provienen exclusivamente de los aportes de la comunidad y se publican tras moderación.

## Por qué

La constitución requiere "Ingesta Inteligente y Versionada" con "scripts estructurados y estables basados en atributos limpios". El catálogo geográfico es la base sobre la que la comunidad ubica sus recetas.

## Criterios de aceptación

- [ ] Script en `src/scripts/seed-atlas.ts`
- [ ] Catálogo completo de países con `codigoISO`, `continente`, `lat`, `lng` y `zoom`
- [ ] Regiones por país como subcolección de `paises/{paisId}/regiones`
- [ ] Sin platillos ni ingredientes sembrados
- [ ] Validación Zod antes de insertar en Firestore
- [ ] Manejo de errores robusto (logging, no crashes)
- [ ] Script ejecutable con `npm run seed`
- [ ] Script de limpieza `npm run purge:seed` para retirar datos de la etapa piloto
- [ ] Tests para el catálogo geográfico
- [ ] Documentación del proceso de ingesta
