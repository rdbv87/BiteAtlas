# Plan · 005 Motor de Ingesta Antropológica

## Enfoque técnico

### 1. Estructura del Script

```
src/scripts/
├── seed-atlas.ts         ← Siembra el catálogo geográfico
├── purge-seed-data.ts    ← Retira los datos de la etapa piloto
└── data/
    └── paises-mundo.ts   ← Catálogo de países y regiones
```

### 2. Catálogo geográfico

`src/scripts/data/paises-mundo.ts` es la única fuente del catálogo. Cada país declara su
`nombre`, `codigoISO`, `continente` y tres regiones; el encuadre de mapa (`lat`, `lng`, `zoom`)
se resuelve por código ISO y se adjunta al documento del país.

El catálogo no contiene platillos ni ingredientes: las recetas llegan únicamente desde los
aportes de la comunidad y se publican tras moderación.

### 3. Script de ingesta

`npm run seed` ejecuta `src/scripts/seed-atlas.ts`:

1. Inicializa Firebase Admin con `FIREBASE_SERVICE_ACCOUNT` o credenciales por defecto.
2. Valida cada país con `PaisSchema` y cada región con `RegionSchema`; si algo falla lanza
   `ValidationError` antes de escribir.
3. Escribe `paises/{paisId}` y `paises/{paisId}/regiones/{regionId}` con `set({ merge: true })`
   en lotes de 450 operaciones.
4. Verifica el conteo final de países en Firestore.

### 4. Limpieza de datos piloto

`npm run purge:seed` ejecuta `src/scripts/purge-seed-data.ts`, que borra la colección
`ingredientes` y los documentos de `platillos` sin `contribuidorId` (los sembrados a mano).
Por defecto solo simula; el borrado real requiere `--confirm`.

## Decisiones técnicas

1. **tsx sobre ts-node**: Mejor compatibilidad con ESM y Next.js
2. **Validación Zod**: Garantiza datos limpios antes de insertar
3. **`set` con merge, no `add`**: El seed es idempotente y puede reejecutarse
4. **Coordenadas en el documento del país**: Evita tablas estáticas en el cliente y permite que
   cualquier país aportado se encuadre en el mapa

## Riesgos

- **Costos de Firestore**: Cada país y región cuenta como escritura en cada ejecución
- **Encuadre faltante**: El seed falla si un país nuevo no declara coordenadas, por diseño
- **Borrado accidental**: `purge:seed` exige `--confirm` para tocar la base de datos
