# Tech stack y convenciones

_Cómo está construido el proyecto y las reglas que todo el código debe respetar. Es la referencia técnica que ningún plan de feature debería contradecir._

## Tecnologías

- **Lenguaje:** <TypeScript estricto>
- **Framework / runtime:** <Next.js (App Router) + Node.js 22>
- **Base de datos:** <Firebase Firestore (NoSQL estructurado por países, regiones y platillos)>
- **Tests:** <Vitest + Testing Library>
- **Despliegue:** <Vercel (Plataforma optimizada para despliegues globales de Next.js)>

## Archivos / módulos clave

src/components/ — componentes de interfaz para la cartografía interactiva, mapas y fichas culturales deslizantes.

src/services/ — lógica de comunicación, consultas optimizadas y gestión de colecciones en Firebase Firestore.

src/types/ — definiciones de tipos TypeScript estrictos y esquemas de validación Zod.

src/scripts/ — scripts estructurados y versionados para la ingesta limpia de datos antropológicos y culinarios.

src/errors/ — clases de errores personalizados y manejo centralizado de excepciones en la plataforma.

_Mapa breve de dónde vive cada cosa. Solo lo que un recién llegado necesita para orientarse._

- `<src/components/>` — <qcomponentes de interfaz para la cartografía interactiva, mapas y fichas culturales deslizantes.>.
- `<src/services/>` — <lógica de comunicación, consultas optimizadas y gestión de colecciones en Firebase Firestore.>.
- `<src/types/>` — <definiciones de tipos TypeScript estrictos y esquemas de validación Zod.>.
- `<src/scripts/>` — <scripts estructurados y versionados para la ingesta limpia de datos antropológicos y culinarios.>.
- `<src/errors/>` — <clases de errores personalizados y manejo centralizado de excepciones en la plataforma.>.

## Comandos

- `<npm run dev>` — arranca el entorno local.
- `<npm run test>` — ejecuta los tests.
- `<npm run lint>` — revisa el estilo.
- `<npm run build>` — compila para producción.

## Modelo de datos / dominio

_Las entidades o estructuras centrales y sus campos/reglas. Documenta solo lo no obvio: invariantes, mecánicas especiales, qué campo controla qué. Omite esta sección si no aplica._

país > región > platillo — Jerarquía principal de almacenamiento en NoSQL que organiza la geografía culinaria de forma normalizada.

ingredientes tipificados / metadatos multimedia — Estructuras secundarias sujetas a esquemas estrictos de Zod para garantizar la integridad visual y antropológica de cada ficha.

- `<país > región > platillo>` — <Jerarquía principal de almacenamiento en NoSQL que organiza la geografía culinaria de forma normalizada.>.
- `<ingredientes tipificados / metadatos multimedia>` — <Estructuras secundarias sujetas a esquemas estrictos de Zod para garantizar la integridad visual y antropológica de cada ficha.>.

## Convenciones

_Reglas de estilo y patrones a seguir. Nombres, organización, manejo de errores, validación, idioma del contenido, etc._

- <Estilo de nombres, camelCase para variables, métodos y funciones; PascalCase para componentes de interfaz, clases y tipos/interfaces.>
- <Dónde van los tests, junto al archivo: foo.ts + foo.test.ts.>
- <Manejo de errores / validación de entradas, Clases propias heredadas centralizadas en src/errors/ y validación estricta obligatoria con Zod en todas las fronteras de datos y scripts de ingesta.>
- <Patrón a seguir propio del proyecto.>

## Estilo visual

_Solo si el proyecto tiene interfaz. Tema, colores/tokens, tipografías, responsive. Omite si no aplica._

-Sistema de color / tokens: Paleta cartográfica minimalista basada en fondos neutros oscuros/claros y acentos cálidos inspirados en especias y tradiciones globales.

-Tipografías: Fuentes sans-serif de alta legibilidad para interfaces de mapas combinadas con tipografía editorial para textos antropológicos.

-Reglas de layout / breakpoints: Diseño responsive mobile-first con paneles laterales deslizantes para fichas culturales y transiciones fluidas de zoom cartográfico.

## Límites duros

_Lo que NUNCA se debe hacer. Reglas de seguridad, dependencias prohibidas, zonas congeladas._

-No instalar dependencias de terceros sin justificación técnica previa y aprobación explícita.

-Zona prohibida: no tocar bajo ninguna circunstancia la carpeta de scripts históricos en src/scripts/legacy/.

-Regla de seguridad: no subir claves de Firebase, tokens o archivos .env* al repositorio de código.
