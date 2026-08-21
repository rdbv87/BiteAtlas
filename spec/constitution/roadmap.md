# Roadmap

_Orden y estado de las features. Es la vista de "qué hay hecho, qué toca ahora y qué viene". Cada entrada apunta a su carpeta en `features/`._

## Hecho ✅

_Features completadas, en orden de implementación._

001 · Setup del Proyecto Base — Configuración inicial de Next.js App Router, TypeScript estricto, Vitest, ESLint, Prettier, Husky y estructura de directorios core.

002 · UI Foundation — Tailwind CSS + shadcn/ui + Radix UI con tokens de diseño (paleta cartográfica, tipografías, breakpoints responsive).

003 · Modelo de Dominio + Zod — Definición del modelo de datos (País > Región > Platillo) y esquemas de validación estrictos.

004 · Firebase Setup — Configuración de Firebase Firestore, credenciales, reglas de seguridad y estructura de colecciones.

005 · Motor de Ingesta Antropológica — Script versionado para poblar Firestore con el catálogo geográfico mundial.

## Siguiente 🔜

003 · Modelo de Dominio + Zod — Definición del modelo de datos (País > Región > Platillo) y esquemas de validación estrictos.

004 · Firebase Setup — Configuración de Firebase Firestore, credenciales, reglas de seguridad y estructura de colecciones.

005 · Motor de Ingesta Antropológica — Script versionado para poblar Firestore con el catálogo geográfico mundial.

## Hecho ✅

006 · Navegación Cartográfica Interactiva — Mapa interactivo con Leaflet/React-Leaflet, navegación por teclado, ARIA labels y panel de información lateral.

## Hecho ✅

007 · Fichas Culturales Inmersivas — Componente FichaCultural con panel deslizante, tabs de navegación (Receta/Historia/Festividades), header informativo, videos YouTube/Vimeo y galería de imágenes. Usa el tipo Platillo completo.

## Hecho ✅

008 · Ecosistema de Aportes Comunales — Módulo completo para que chefs locales y guardianes de tradiciones aporten patrimonio culinario. Incluye formulario de 4 pasos (básico, ingredientes, receta, cultural) con validación Zod y pasos progresivos.

## Backlog / ideas 💡

> Cada feature nueva se crea como `features/NNN-nombre-feature/` con `spec.md`, `plan.md` y `tasks.md` antes de tocar código.
