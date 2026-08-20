import type { Pais, Region, Ingrediente, Platillo } from '@/types'

export const suiza: Pais = {
  id: 'suiza-001',
  nombre: 'Suiza',
  codigoISO: 'CH',
  continente: 'europa',
  descripcion:
    'País alpino con una gastronomía marcada por quesos, patatas y salchichas. Sus platos son sencillos y refinados, cosechando tradición en cada mesa de montaña.',
}

export const regiones: Region[] = [
  {
    id: 'region-zurich-001',
    paisId: 'suiza-001',
    nombre: 'Zúrich',
    descripcion:
      'Corazón económico de Suiza. La cocina de Zúrich equilibra platos contundentes con técnicas delicadas inspiradas en los sabores de Suiza alemana.',
    lat: 47.3769,
    lng: 8.5417,
  },
  {
    id: 'region-berna-001',
    paisId: 'suiza-001',
    nombre: 'Berna',
    descripcion:
      'Capital federal rodeada de colinas y prados. Su cocina popular celebra recetas de montaña y productos lácteos locales.',
    lat: 46.948,
    lng: 7.4474,
  },
  {
    id: 'region-valais-001',
    paisId: 'suiza-001',
    nombre: 'Valais',
    descripcion:
      'Región alpina conocida por sus quesos, raclette y platos rústicos que se comparten alrededor del fuego.',
    lat: 46.1957,
    lng: 7.4785,
  },
]

export const ingredientes: Ingrediente[] = [
  { id: 'ing-queso-gruyere', nombre: 'Queso Gruyère', categoria: 'lacteo' },
  { id: 'ing-queso-emmental', nombre: 'Queso Emmental', categoria: 'lacteo' },
  { id: 'ing-vino-blanco', nombre: 'Vino blanco seco', categoria: 'otro' },
  { id: 'ing-pan-rustico', nombre: 'Pan rústico', categoria: 'grano' },
  { id: 'ing-patata', nombre: 'Patata', categoria: 'vegetal' },
  { id: 'ing-cebolla', nombre: 'Cebolla', categoria: 'vegetal' },
  { id: 'ing-aceite', nombre: 'Aceite vegetal', categoria: 'otro' },
  { id: 'ing-huevo', nombre: 'Huevo', categoria: 'proteina' },
  { id: 'ing-crema', nombre: 'Crema fresca', categoria: 'lacteo' },
  { id: 'ing-tomillo', nombre: 'Tomillo', categoria: 'especia' },
  { id: 'ing-ajo', nombre: 'Ajo', categoria: 'especia' },
  { id: 'ing-carne-cerdo', nombre: 'Carne de cerdo', categoria: 'proteina' },
]

export const platillos: Platillo[] = [
  {
    id: 'platillo-fondue-queso-001',
    regionId: 'region-valais-001',
    nombre: 'Fondue de queso',
    descripcion:
      'Mezcla humeante de quesos fundidos que se comparte en torno a la mesa. Tradición suiza que convierte el pan en viaje colectivo.',
    instrucciones: [
      'Rallar el queso Gruyère y el Emmental.',
      'Frotar el interior de una olla pequeña con un diente de ajo.',
      'Calentar el vino blanco hasta que esté casi a punto de hervir.',
      'Agregar los quesos poco a poco mientras se remueve hasta obtener una mezcla homogénea.',
      'Condimentar con una pizca de nuez moscada y servir con cubos de pan rústico para mojar.',
    ],
    ingredientes: [
      { ingredienteId: 'ing-queso-gruyere', cantidad: '150', unidad: 'gramos' },
      { ingredienteId: 'ing-queso-emmental', cantidad: '150', unidad: 'gramos' },
      { ingredienteId: 'ing-vino-blanco', cantidad: '180', unidad: 'ml' },
      { ingredienteId: 'ing-pan-rustico', cantidad: '1', unidad: 'barra' },
      { ingredienteId: 'ing-ajo', cantidad: '1', unidad: 'diente' },
    ],
    tiempoPreparacion: 25,
    dificultad: 'medio',
    porciones: 4,
    imagenes: ['https://images.unsplash.com/photo-1516685018646-549d5d3a6c1e'],
    contextoHistorico:
      'La fondue nació como una forma de aprovechar los quesos duros de la temporada fría. Compartirla desde un mismo recipiente convirtió el plato en un ritual social suizo.',
    festividades: ['Noche de Raclette', 'Reuniones de invierno'],
    estado: 'publicado',
    createdAt: new Date('2026-08-20'),
  },
  {
    id: 'platillo-rosti-001',
    regionId: 'region-berna-001',
    nombre: 'Rösti',
    descripcion:
      'Torta de patata dorada y crujiente que sirve como acompañante clásico suizo. Un plato sencillo de sabor reconfortante.',
    instrucciones: [
      'Rallar las patatas y exprimir el exceso de agua.',
      'Mezclar las patatas ralladas con cebolla picada, huevo y sal.',
      'Calentar aceite en una sartén y colocar la mezcla formando una torta.',
      'Cocinar a fuego medio hasta que esté dorada por ambos lados.',
      'Servir caliente como guarnición o con una ensalada fresca.',
    ],
    ingredientes: [
      { ingredienteId: 'ing-patata', cantidad: '500', unidad: 'gramos' },
      { ingredienteId: 'ing-cebolla', cantidad: '1', unidad: 'unidad' },
      { ingredienteId: 'ing-huevo', cantidad: '1', unidad: 'unidad' },
      { ingredienteId: 'ing-aceite', cantidad: '2', unidad: 'cucharadas' },
      { ingredienteId: 'ing-tomillo', cantidad: '1', unidad: 'ramita' },
    ],
    tiempoPreparacion: 40,
    dificultad: 'facil',
    porciones: 2,
    imagenes: ['https://images.unsplash.com/photo-1562967916-eb82221dfb30'],
    contextoHistorico:
      'Rösti era originalmente un desayuno campesino de patatas en el cantón de Berna. Hoy acompaña carnes, huevos y otros platos como un básico de la mesa suiza.',
    festividades: ['Fiestas de San Nicolás', 'Día de la Mantequilla'],
    estado: 'publicado',
    createdAt: new Date('2026-08-20'),
  },
  {
    id: 'platillo-zurcher-geschnetzeltes-001',
    regionId: 'region-zurich-001',
    nombre: 'Zürcher Geschnetzeltes',
    descripcion:
      'Tiras de carne en salsa cremosa al vino blanco, servidas con rösti. Elegancia alemana-suiza en un plato para las mesas de Zúrich.',
    instrucciones: [
      'Cortar la carne de cerdo en tiras finas y sazonar con sal y pimienta.',
      'Dorar la carne en una sartén caliente con aceite y reservar.',
      'Sofreír cebolla picada en la misma sartén hasta que esté transparente.',
      'Agregar vino blanco y dejar reducir ligeramente.',
      'Incorporar crema fresca y cocinar hasta que la salsa espese.',
      'Regresar la carne a la salsa, calentar brevemente y servir con rösti.',
    ],
    ingredientes: [
      { ingredienteId: 'ing-carne-cerdo', cantidad: '400', unidad: 'gramos' },
      { ingredienteId: 'ing-cebolla', cantidad: '1', unidad: 'unidad' },
      { ingredienteId: 'ing-vino-blanco', cantidad: '150', unidad: 'ml' },
      { ingredienteId: 'ing-crema', cantidad: '150', unidad: 'ml' },
      { ingredienteId: 'ing-aceite', cantidad: '1', unidad: 'cucharada' },
      { ingredienteId: 'ing-tomillo', cantidad: '1', unidad: 'ramita' },
    ],
    tiempoPreparacion: 45,
    dificultad: 'medio',
    porciones: 3,
    imagenes: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836'],
    contextoHistorico:
      'Este platillo refleja la influencia de la cocina europea del norte en la tradición culinaria de Zúrich. Es un ejemplo de cómo el país combina sencillez con técnica.',
    festividades: ['Cena de Año Nuevo', 'Reuniones de otoño'],
    estado: 'publicado',
    createdAt: new Date('2026-08-20'),
  },
]
