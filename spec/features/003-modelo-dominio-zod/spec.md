# 003 · Modelo de Dominio + Zod

## Qué hace

Definición del modelo de datos completo del proyecto (País > Región > Platillo > Ingrediente) con esquemas de validación Zod estrictos para garantizar integridad en todas las fronteras de datos.

## Por qué

Establece los contratos de datos que toda la plataforma respetará. La constitución requiere "validación estricta obligatoria con Zod en todas las fronteras de datos y scripts de ingesta".

## Criterios de aceptación

- [ ] Interfaces TypeScript definidas para todas las entidades
- [ ] Esquemas Zod creados para validación
- [ ] Tipos derivados de esquemas Zod (fuente única de verdad)
- [ ] Clases de error personalizadas en `src/errors/`
- [ ] Tests de validación para cada esquema
- [ ] Documentación del modelo de datos
- [ ] Exportaciones organizadas desde `src/types/`
