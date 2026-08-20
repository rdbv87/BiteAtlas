import type { Pais, Region, Ingrediente, Platillo } from '@/types'

export const colombia: Pais = {
  id: 'colombia-001',
  nombre: 'Colombia',
  codigoISO: 'CO',
  continente: 'america',
  descripcion:
    'País andino-caribeño con una cocina vibrante que mezcla tradiciones indígenas, africanas y españolas. Sus platos son una celebración de contraste entre montaña, costa y selva.',
}

export const regiones: Region[] = [
  {
    id: 'region-antioquia-001',
    paisId: 'colombia-001',
    nombre: 'Antioquia',
    descripcion:
      'Región montañosa del noroeste de Colombia, con una cocina de platos contundentes y sabores ahumados. Medellín es su capital cultural y gastronómica.',
    lat: 6.2442,
    lng: -75.5812,
  },
  {
    id: 'region-cundinamarca-001',
    paisId: 'colombia-001',
    nombre: 'Cundinamarca',
    descripcion:
      'Valle central donde Bogotá marca el ritmo de una cocina mestiza, con sopas y guisos que calientan el alma durante las horas frías.',
    lat: 4.711,
    lng: -74.0721,
  },
  {
    id: 'region-caribe-colombia-001',
    paisId: 'colombia-001',
    nombre: 'Caribe colombiano',
    descripcion:
      'Costa caribeña de Colombia, rica en sabores de mar, plátano y aromas de tierra caliente. Es la puerta a la herencia afrocolombiana y latina.',
    lat: 10.391,
    lng: -75.4794,
  },
]

export const ingredientes: Ingrediente[] = [
  { id: 'ing-arroz', nombre: 'Arroz', categoria: 'grano' },
  { id: 'ing-frijol-rojo', nombre: 'Frijol rojo', categoria: 'grano' },
  { id: 'ing-chicharron', nombre: 'Chicharrón', categoria: 'proteina' },
  { id: 'ing-chorizo', nombre: 'Chorizo', categoria: 'proteina' },
  { id: 'ing-carne-molida', nombre: 'Carne molida de res', categoria: 'proteina' },
  { id: 'ing-platano-maduro', nombre: 'Plátano maduro', categoria: 'vegetal' },
  { id: 'ing-aguacate', nombre: 'Aguacate', categoria: 'fruta' },
  { id: 'ing-papa-criolla', nombre: 'Papa criolla', categoria: 'vegetal' },
  { id: 'ing-pollo', nombre: 'Pollo', categoria: 'proteina' },
  { id: 'ing-mazorca', nombre: 'Mazorca de maíz', categoria: 'grano' },
  { id: 'ing-culantro', nombre: 'Culantro', categoria: 'especia' },
  { id: 'ing-ajo', nombre: 'Ajo', categoria: 'especia' },
  { id: 'ing-queso-fresco', nombre: 'Queso fresco', categoria: 'lacteo' },
  { id: 'ing-mantequilla-rallada', nombre: 'Mantequilla rallada', categoria: 'lacteo' },
  { id: 'ing-huevo', nombre: 'Huevo', categoria: 'proteina' },
  { id: 'ing-azucar', nombre: 'Azúcar', categoria: 'otro' },
]

export const platillos: Platillo[] = [
  {
    id: 'platillo-bandeja-paisa-001',
    paisId: 'colombia-001',
    regionId: 'region-antioquia-001',
    nombre: 'Bandeja paisa',
    descripcion:
      'Plato icónico de Antioquia: una generosa mezcla de frijoles, arroz, carne, chicharrón, plátano maduro y aguacate que habla de abundancia y tradición.',
    instrucciones: [
      'Cocinar los frijoles rojos con cebolla, ajo y especias hasta que estén suaves y el caldo esté espeso.',
      'Preparar el arroz blanco al vapor por separado.',
      'Freír el chicharrón hasta que esté dorado y crujiente.',
      'Cocinar el chorizo y la carne molida con condimentos básicos.',
      'Freír las rodajas de plátano maduro hasta que estén doradas.',
      'Servir en un plato grande con arroz, frijoles, chicharrón, chorizo, carne molida, plátano maduro y una tajada de aguacate.',
    ],
    ingredientes: [
      { ingredienteId: 'ing-arroz', cantidad: '1', unidad: 'taza' },
      { ingredienteId: 'ing-frijol-rojo', cantidad: '2', unidad: 'tazas' },
      { ingredienteId: 'ing-chicharron', cantidad: '150', unidad: 'gramos' },
      { ingredienteId: 'ing-chorizo', cantidad: '2', unidad: 'unidades' },
      { ingredienteId: 'ing-carne-molida', cantidad: '200', unidad: 'gramos' },
      { ingredienteId: 'ing-platano-maduro', cantidad: '1', unidad: 'unidad' },
      { ingredienteId: 'ing-aguacate', cantidad: '1/2', unidad: 'unidad' },
    ],
    tiempoPreparacion: 75,
    dificultad: 'medio',
    porciones: 2,
    imagenes: ['https://images.unsplash.com/photo-1551218808-94e220e084d2'],
    contextoHistorico:
      'La bandeja paisa nació como plato de comida campesina en el departamento de Antioquia. Su composición variada estaba pensada para alimentar a jornaleros y hoy es símbolo de generosidad colombiana.',
    festividades: ['Día de la Antioqueñidad', 'Fiestas de la Independencia'],
    estado: 'publicado',
    createdAt: new Date('2026-08-20'),
  },
  {
    id: 'platillo-ajiaco-bogotano-001',
    paisId: 'colombia-001',
    regionId: 'region-cundinamarca-001',
    nombre: 'Ajiaco bogotano',
    descripcion:
      'Sopa espesa de Bogotá elaborada con pollo, papas criollas, mazorca y el aromático culantro, servida con crema agria y alcaparras.',
    instrucciones: [
      'Cocer el pollo en agua con ajo y sal hasta que esté tierno.',
      'Agregar las papas criollas y la mazorca al caldo de pollo.',
      'Cocinar hasta que las papas se deshagan ligeramente y la sopa tenga textura cremosa.',
      'Agregar culantro al final y rectificar sazón.',
      'Servir caliente con crema agria y aguacate al lado.',
    ],
    ingredientes: [
      { ingredienteId: 'ing-pollo', cantidad: '500', unidad: 'gramos' },
      { ingredienteId: 'ing-papa-criolla', cantidad: '4', unidad: 'unidades' },
      { ingredienteId: 'ing-mazorca', cantidad: '2', unidad: 'unidades' },
      { ingredienteId: 'ing-culantro', cantidad: '1/2', unidad: 'taza' },
      { ingredienteId: 'ing-ajo', cantidad: '2', unidad: 'dientes' },
      { ingredienteId: 'ing-crema-agria', cantidad: '1/2', unidad: 'taza' },
      { ingredienteId: 'ing-aguacate', cantidad: '1/2', unidad: 'unidad' },
    ],
    tiempoPreparacion: 90,
    dificultad: 'medio',
    porciones: 4,
    imagenes: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c'],
    contextoHistorico:
      'El ajiaco es una sopa emblemática de la sabana bogotana. Sus distintas variedades reflejan el cruce de influencias indígenas y coloniales en la región andina.',
    festividades: ['Día de la Independencia', 'Festival del Ajiaco'],
    estado: 'publicado',
    createdAt: new Date('2026-08-20'),
  },
  {
    id: 'platillo-arepa-choclo-001',
    paisId: 'colombia-001',
    regionId: 'region-caribe-colombia-001',
    nombre: 'Arepa de choclo',
    descripcion:
      'Torta dulce y suave de maíz tierno, queso fresco y mantequilla. Un clásico del Caribe colombiano para desayunos y meriendas.',
    instrucciones: [
      'Moler el maíz tierno hasta obtener una masa ligera.',
      'Mezclar el maíz con queso fresco rallado, huevo, mantequilla y azúcar.',
      'Formar arepas con la masa y dorarlas en una sartén ligeramente engrasada.',
      'Cocinar por ambos lados hasta que estén doradas y cocidas por dentro.',
      'Servir tibias como acompañamiento o postre.',
    ],
    ingredientes: [
      { ingredienteId: 'ing-mazorca', cantidad: '2', unidad: 'unidades' },
      { ingredienteId: 'ing-queso-fresco', cantidad: '100', unidad: 'gramos' },
      { ingredienteId: 'ing-mantequilla-rallada', cantidad: '2', unidad: 'cucharadas' },
      { ingredienteId: 'ing-huevo', cantidad: '1', unidad: 'unidad' },
      { ingredienteId: 'ing-azucar', cantidad: '1', unidad: 'cucharada' },
    ],
    tiempoPreparacion: 35,
    dificultad: 'facil',
    porciones: 4,
    imagenes: ['https://images.unsplash.com/photo-1525755662778-989d0524087e'],
    contextoHistorico:
      'La arepa de choclo es una expresión dulce de la cocina caribeña colombiana. Se prepara con maíz tierno, un ingrediente que cruza las mesas desde la época prehispánica.',
    festividades: ['Fiesta de la Cosecha', 'Carnaval de Barranquilla'],
    estado: 'publicado',
    createdAt: new Date('2026-08-20'),
  },
]
