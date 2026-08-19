# [Nombre del proyecto]

Bite Atlas
[Plataforma cartográfica interactiva e inmersiva que conecta a los usuarios con las tradiciones, historias antropológicas y recetas auténticas de todo el mundo a través de una experiencia de exploración culinaria global.]

## Stack

-Lenguaje: TypeScript estricto
-Framework / Runtime: Next.js (App Router) + Node.js 22
-Base de Datos: Firebase Firestore (NoSQL estructurado por países, regiones y platillos)
-Validación y Tipado: Zod para esquemas de datos e ingesta
-Tests: Vitest + Testing Library

## Comandos

- `[comando dev]` — arranca el servidor en local
- `[comando test]` — ejecuta los tests (deben pasar antes de cada
  commit)
- `[comando lint]` — revisa el estilo (antes de cada PR)
- `[comando build]` — compila para producción

## Estructura del proyecto

- `[src/components/]/` — [componentes de interfaz para la cartografía interactiva, mapas y fichas culturales deslizantes]
- `[src/services/]/` — [lógica de comunicación, consultas optimizadas y gestión de colecciones en Firebase Firestore]
- `[src/types/]/` — [definiciones de tipos TypeScript estrictos para países, regiones, ingredientes y metadatos multimedia]
- `[src/errors/]/` — [clases de errores personalizados y manejo centralizado de excepciones en la plataforma]

## Convenciones

-Estilo de nombres: camelCase para variables, métodos y funciones; PascalCase para componentes, clases y tipos/interfaces.
-Dónde van los tests: al lado del archivo: foo.ts + foo.test.ts.
-Manejo de errores: clases propias heredadas y centralizadas en src/errors/.
-Patrón a seguir: validar toda entrada de datos mediante esquemas de Zod antes de usarla.

## No hagas

-Límite duro: no instalar dependencias de terceros sin justificación previa y aprobación explícita.
-Zona prohibida: no tocar la carpeta de scripts históricos en src/scripts/legacy/, está congelada.
-Regla de seguridad: no subir claves de Firebase, tokens o archivos .env* al repositorio.
-Antipatrón: no usar any en TypeScript sin justificarlo (emplear tipos estrictos, genéricos o unknown con parseo de Zod).

## Flujo de trabajo

-Antes de una tarea no trivial, propón un plan y espera mi OK.
-Una tarea a la vez; al terminar, dime qué cambiaste para que lo revise.
-Si no estás seguro al 80%, pregunta. No inventes.

## Documentación

-Referencias a más reglas, contexto, documentación y especificaciones en el directorio /docs/specifications/.
