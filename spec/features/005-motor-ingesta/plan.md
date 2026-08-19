# Plan · 005 Motor de Ingesta Antropológica

## Enfoque técnico

### 1. Estructura del Script

```
src/scripts/
├── ingest-honduras.ts    ← Script principal
├── data/
│   └── honduras.ts       ← Datos de Honduras
└── utils/
    └── firestore.ts      ← Helpers para Firestore
```

### 2. Datos de Honduras

Crear `src/scripts/data/honduras.ts`:

```typescript
import { Pais, Region, Platillo, Ingrediente } from '@/types'

export const hondurasData: Pais = {
  id: 'honduras-001',
  nombre: 'Honduras',
  codigoISO: 'HN',
  continente: 'america',
  descripcion: 'País centroamericano con rica tradición gastronómica mesoamericana y caribeña.',
  imagen: 'https://...',
}

export const regionesHonduras: Region[] = [
  {
    id: 'region-copan-001',
    paisId: 'honduras-001',
    nombre: 'Copán',
    descripcion: 'Región occidental con influencias mayas y tradiciones ancestrales.',
    imagen: 'https://...',
  },
  {
    id: 'region-14-julio-001',
    paisId: 'honduras-001',
    nombre: 'La Ceiba',
    descripcion: 'Región caribeña con influencia garífuna y afrodescendiente.',
    imagen: 'https://...',
  },
]

export const platillosHonduras: Platillo[] = [
  {
    id: 'platillo-baleada-001',
    regionId: 'region-copan-001',
    nombre: 'Baleada',
    descripcion:
      'Platillo típico hondureño compuesto por tortilla de harina rellena de frijoles refritos, queso crema y crema agria.',
    instrucciones: [
      'Calentar la tortilla de harina en el comal',
      'Untar los frijoles refritos均匀mente',
      'Agregar queso crema y crema agria',
      'Doblar la tortilla por la mitad',
      'Servir caliente',
    ],
    ingredientes: [
      { ingredienteId: 'ing-tortilla-harina', cantidad: '1', unidad: 'tortilla' },
      { ingredienteId: 'ing-frijoles', cantidad: '1/2', unidad: 'taza' },
      { ingredienteId: 'ing-queso-crema', cantidad: '2', unidad: 'cucharadas' },
      { ingredienteId: 'ing-crema-agria', cantidad: '1', unidad: 'cucharada' },
    ],
    tiempoPreparacion: 10,
    dificultad: 'facil',
    porciones: 1,
    imagenes: ['https://...'],
    contextoHistorico:
      'La baleada es el platillo más emblemático de Honduras, originario de la costa norte.',
    festividades: ['Fiestas patrias', 'Día de la raza'],
    createdAt: new Date(),
  },
  {
    id: 'platillo-sopa-caracol-001',
    regionId: 'region-14-julio-001',
    nombre: 'Sopa de Caracol',
    descripcion: 'Sopa tradicional caribeña preparada con caracol, leche de coco y plátano verde.',
    instrucciones: [
      'Cocinar el caracol con limón y sal',
      'Preparar el caldo con leche de coco',
      'Agregar el plátano verde en rodajas',
      'Cocinar hasta que el plátano esté tierno',
      'Agregar el caracol y cocinar 5 minutos más',
      'Servir con arroz blanco',
    ],
    ingredientes: [
      { ingredienteId: 'ing-caracol', cantidad: '500', unidad: 'gramos' },
      { ingredienteId: 'ing-leche-coco', cantidad: '400', unidad: 'ml' },
      { ingredienteId: 'ing-platano-verde', cantidad: '2', unidad: 'unidades' },
      { ingredienteId: 'ing-cilantro', cantidad: '1/2', unidad: 'taza' },
    ],
    tiempoPreparacion: 45,
    dificultad: 'medio',
    porciones: 4,
    imagenes: ['https://...'],
    contextoHistorico:
      'Platillo de origen garífuno, refleja la fusión cultural del Caribe hondureño.',
    festividades: ['Festival de la Ceiba', 'Semana Santa'],
    createdAt: new Date(),
  },
]

export const ingredientesHonduras: Ingrediente[] = [
  { id: 'ing-tortilla-harina', nombre: 'Tortilla de harina', categoria: 'grano' },
  { id: 'ing-frijoles', nombre: 'Frijoles refritos', categoria: 'grano' },
  { id: 'ing-queso-crema', nombre: 'Queso crema', categoria: 'proteina' },
  { id: 'ing-crema-agria', nombre: 'Crema agria', categoria: 'proteina' },
  { id: 'ing-caracol', nombre: 'Caracol', categoria: 'proteina' },
  { id: 'ing-leche-coco', nombre: 'Leche de coco', categoria: 'vegetal' },
  { id: 'ing-platano-verde', nombre: 'Plátano verde', categoria: 'vegetal' },
  { id: 'ing-cilantro', nombre: 'Cilantro', categoria: 'especia' },
]
```

### 3. Script Principal

Crear `src/scripts/ingest-honduras.ts`:

```typescript
import { db } from '@/services/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { PaisSchema, RegionSchema, PlatilloSchema, IngredienteSchema } from '@/types'
import {
  hondurasData,
  regionesHonduras,
  platillosHonduras,
  ingredientesHonduras,
} from './data/honduras'

async function ingestPais(pais: Pais) {
  const validated = PaisSchema.parse(pais)
  await setDoc(doc(db, 'paises', validated.id), validated)
  console.log(`✅ País insertado: ${validated.nombre}`)
}

async function ingestRegion(region: Region) {
  const validated = RegionSchema.parse(region)
  await setDoc(doc(db, 'paises', validated.paisId, 'regiones', validated.id), validated)
  console.log(`✅ Región insertada: ${validated.nombre}`)
}

async function ingestPlatillo(platillo: Platillo) {
  const validated = PlatilloSchema.parse(platillo)
  await setDoc(
    doc(db, 'paises', 'honduras-001', 'regiones', validated.regionId, 'platillos', validated.id),
    validated
  )
  console.log(`✅ Platillo insertado: ${validated.nombre}`)
}

async function ingestIngrediente(ingrediente: Ingrediente) {
  const validated = IngredienteSchema.parse(ingrediente)
  await setDoc(doc(db, 'ingredientes', validated.id), validated)
  console.log(`✅ Ingrediente insertado: ${validated.nombre}`)
}

async function main() {
  console.log('🚀 Iniciando ingesta de Honduras...\n')

  try {
    // País
    await ingestPais(hondurasData)

    // Regiones
    for (const region of regionesHonduras) {
      await ingestRegion(region)
    }

    // Ingredientes
    for (const ingrediente of ingredientesHonduras) {
      await ingestIngrediente(ingrediente)
    }

    // Platillos
    for (const platillo of platillosHonduras) {
      await ingestPlatillo(platillo)
    }

    console.log('\n🎉 Ingesta completada exitosamente!')
  } catch (error) {
    console.error('❌ Error durante la ingesta:', error)
    process.exit(1)
  }
}

main()
```

### 4. Comando en package.json

Agregar a `package.json`:

```json
{
  "scripts": {
    "ingest": "tsx src/scripts/ingest-honduras.ts"
  }
}
```

### 5. Dependencia tsx

```bash
npm install -D tsx
```

## Decisiones técnicas

1. **tsx sobre ts-node**: Mejor compatibilidad con ESM y Next.js
2. **Validación Zod**: Garantiza datos limpios antes de insertar
3. **Datos estáticos**: Separados del script para fácil mantenimiento
4. **Logging detallado**: Para verificar qué se insertó

## Riesgos

- **Datos incorrectos**: Verificar autenticidad de recetas hondureñas
- **Duplicados**: El script puede ejecutarse múltiples veces (usar setDoc, no addDoc)
- **Costos de Firestore**: Cada inserción cuenta como escritura
