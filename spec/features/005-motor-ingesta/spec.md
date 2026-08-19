# 005 · Motor de Ingesta Antropológica

## Qué hace

Script versionado y ejecutable para poblar Firebase Firestore con datos de Honduras como región piloto. Incluye validación Zod antes de insertar y estructura de datos antropológicos verificados.

## Por qué

La constitución requiere "Ingesta Inteligente y Versionada" con "scripts estructurados y estables basados en atributos limpios". Honduras será la primera región en demostrar que el flujo completo funciona.

## Criterios de aceptación

- [ ] Script en `src/scripts/ingest-honduras.ts`
- [ ] Datos de ejemplo: Honduras como país, 2-3 regiones, 3-5 platillos típicos
- [ ] Validación Zod antes de insertar en Firestore
- [ ] Manejo de errores robusto (logging, no crashes)
- [ ] Script ejecutable con `npm run ingest`
- [ ] Datos antropológicos verificados (nombres reales, ingredientes reales)
- [ ] Tests para el script de ingesta
- [ ] Documentación del proceso de ingesta
