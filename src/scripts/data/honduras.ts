import type { Pais, Region, Ingrediente, Platillo } from '@/types'

// ── País ─────────────────────────────────────────────────────────────────────

export const honduras: Pais = {
  id: 'honduras-001',
  nombre: 'Honduras',
  codigoISO: 'HN',
  continente: 'america',
  descripcion:
    'República centroamericana con una rica herencia gastronómica que fusiona influencias mayas, españolas, caribeñas y garífunas. Su cocina refleja la diversidad geográfica del país, desde la costa norte hasta las montañas del interior.',
}

// ── Regiones ─────────────────────────────────────────────────────────────────

export const regiones: Region[] = [
  {
    id: 'region-copan-001',
    paisId: 'honduras-001',
    nombre: 'Copán',
    descripcion:
      'Región occidental de Honduras, cuna de la civilización maya. Su gastronomía combina tradiciones ancestrales con ingredientes locales como el maíz y los frijoles.',
    lat: 14.84,
    lng: -89.15,
  },
  {
    id: 'region-ceiba-001',
    paisId: 'honduras-001',
    nombre: 'La Ceiba',
    descripcion:
      'Capital de la costa norte hondureña. Influencia fuerte de la cultura garífuna y afrocaribeña, con platos basados en coco, mariscos y plátano.',
    lat: 15.77,
    lng: -86.79,
  },
  {
    id: 'region-comayagua-001',
    paisId: 'honduras-001',
    nombre: 'Comayagua',
    descripcion:
      'Región central con tradiciones coloniales. Cocina casera basada en cerdo, maíz y lácteos.',
    lat: 14.45,
    lng: -87.64,
  },
]

// ── Ingredientes ─────────────────────────────────────────────────────────────

export const ingredientes: Ingrediente[] = [
  { id: 'ing-tortilla-harina', nombre: 'Tortilla de harina', categoria: 'grano' },
  { id: 'ing-frijoles-rojos', nombre: 'Frijoles rojos', categoria: 'grano' },
  { id: 'ing-masa-maiz', nombre: 'Masa de maíz', categoria: 'grano' },
  { id: 'ing-arroz', nombre: 'Arroz', categoria: 'grano' },
  { id: 'ing-queso-fresco', nombre: 'Queso fresco', categoria: 'lacteo' },
  { id: 'ing-mantequilla-rallada', nombre: 'Mantequilla rallada', categoria: 'lacteo' },
  { id: 'ing-crema-agria', nombre: 'Crema agria', categoria: 'lacteo' },
  { id: 'ing-carne-molida', nombre: 'Carne molida de res', categoria: 'proteina' },
  { id: 'ing-pollo', nombre: 'Pollo', categoria: 'proteina' },
  { id: 'ing-caracol', nombre: 'Caracol', categoria: 'proteina' },
  { id: 'ing-leche-coco', nombre: 'Leche de coco', categoria: 'vegetal' },
  { id: 'ing-platano-verde', nombre: 'Plátano verde', categoria: 'vegetal' },
  { id: 'ing-platano-maduro', nombre: 'Plátano maduro', categoria: 'vegetal' },
  { id: 'ing-tajadas', nombre: 'Tajadas de plátano verde', categoria: 'vegetal' },
  { id: 'ing-cebolla', nombre: 'Cebolla', categoria: 'vegetal' },
  { id: 'ing-tomate', nombre: 'Tomate', categoria: 'vegetal' },
  { id: 'ing-chile-cabro', nombre: 'Chile cabro', categoria: 'especia' },
  { id: 'ing-cilantro', nombre: 'Cilantro', categoria: 'especia' },
  { id: 'ing-comino', nombre: 'Comino', categoria: 'especia' },
  { id: 'ing-achiote', nombre: 'Achiote', categoria: 'especia' },
]

// ── Platillos ────────────────────────────────────────────────────────────────

export const platillos: Platillo[] = [
  // ── Baleada ──────────────────────────────────────────────────────────────
  {
    id: 'platillo-baleada-001',
    regionId: 'region-copan-001',
    nombre: 'Baleada',
    descripcion:
      'El platillo más emblemático de Honduras. Tortilla de harina rellena de frijoles refritos, queso fresco rallado y crema agria. Originaria de la costa norte, ahora se disfruta en todo el país.',
    instrucciones: [
      'Calentar la tortilla de harina en un comal o plancha hasta que esté suave y ligeramente dorada.',
      'Untar una capa generosa de frijoles rojos refritos sobre la tortilla.',
      'Espolvorear queso fresco rallado sobre los frijoles.',
      'Agregar una cucharada de crema agria.',
      'Doblar la tortilla por la mitad, cubriendo el relleno.',
      'Servir caliente. Opcionalmente, se puede agregar huevo revuelto, carne molida o plátano frito.',
    ],
    ingredientes: [
      { ingredienteId: 'ing-tortilla-harina', cantidad: '1', unidad: 'tortilla grande' },
      { ingredienteId: 'ing-frijoles-rojos', cantidad: '1/2', unidad: 'taza' },
      { ingredienteId: 'ing-queso-fresco', cantidad: '1/4', unidad: 'taza' },
      { ingredienteId: 'ing-crema-agria', cantidad: '2', unidad: 'cucharadas' },
    ],
    tiempoPreparacion: 10,
    dificultad: 'facil',
    porciones: 1,
    imagenes: ['https://images.unsplash.com/photo-1565299585323-38d6b0865b47'],
    videos: [
      {
        id: 'GanmS5sjR7M',
        url: 'https://www.youtube.com/watch?v=GanmS5sjR7M',
        titulo:
          'Con esta receta seguro aprenderá a hacer BALEADAS👌🏼 #hondurasjackyrecetas #shorts #baleadas',
        canal: 'HONDURAS JACKY RECETAS',
        miniatura: 'https://i.ytimg.com/vi/GanmS5sjR7M/hqdefault.jpg',
        tipo: 'short',
        duracionSegundos: 59,
        vistas: 154722,
        consulta: 'receta de Baleada Honduras',
        fuente: 'youtube',
        verificadoEn: new Date('2026-08-20T00:28:52.877Z'),
      },
      {
        id: '19AZHv44PE8',
        url: 'https://www.youtube.com/watch?v=19AZHv44PE8',
        titulo: 'Baleadas hondureñas 🇭🇳👌🏻😋| Antojitos Ktrachos y mas',
        canal: 'Antojitos Ktrachos y Mas',
        miniatura: 'https://i.ytimg.com/vi/19AZHv44PE8/hqdefault.jpg',
        tipo: 'normal',
        duracionSegundos: 807,
        vistas: 756517,
        consulta: 'receta de Baleada Honduras',
        fuente: 'youtube',
        verificadoEn: new Date('2026-08-20T00:28:52.877Z'),
      },
    ],
    contextoHistorico:
      'La baleada se originó en la costa norte de Honduras a principios del siglo XX. Se cree que fue creada por mujeres campesinas que necesitaban un alimento rápido y nutritivo para los trabajadores agrícolas. Su nombre proviene de la acción de "balar" o doblar la tortilla.',
    festividades: ['Fiestas patrias (15 de septiembre)', 'Día de la Raza (12 de octubre)'],
    estado: 'publicado',
    createdAt: new Date('2024-01-15'),
  },

  // ── Sopa de Caracol ──────────────────────────────────────────────────────
  {
    id: 'platillo-sopa-caracol-001',
    regionId: 'region-ceiba-001',
    nombre: 'Sopa de Caracol',
    descripcion:
      'Sopa tradicional caribeña preparada con caracol, leche de coco, plátano verde y verduras. Platillo emblemático de la cultura garífuna en Honduras.',
    instrucciones: [
      'Limpiar el caracol con jugo de limón y sal, enjuagar bien.',
      'En una olla grande, sofreír cebolla, tomate y chile cabro en aceite.',
      'Agregar el caldo de pescado y la leche de coco.',
      'Añadir el plátano verde cortado en rodajas.',
      'Cocinar a fuego medio hasta que el plátano esté tierno (aproximadamente 15 minutos).',
      'Agregar el caracol y cocinar 5 minutos más (no cocinar demasiado para que no quede gomoso).',
      'Sazonar con sal, comino y cilantro fresco.',
      'Servir caliente con arroz blanco deside.',
    ],
    ingredientes: [
      { ingredienteId: 'ing-caracol', cantidad: '500', unidad: 'gramos' },
      { ingredienteId: 'ing-leche-coco', cantidad: '400', unidad: 'ml' },
      { ingredienteId: 'ing-platano-verde', cantidad: '2', unidad: 'unidades' },
      { ingredienteId: 'ing-cilantro', cantidad: '1/2', unidad: 'taza' },
      { ingredienteId: 'ing-cebolla', cantidad: '1', unidad: 'unidad' },
      { ingredienteId: 'ing-tomate', cantidad: '2', unidad: 'unidades' },
    ],
    tiempoPreparacion: 45,
    dificultad: 'medio',
    porciones: 4,
    imagenes: ['https://images.unsplash.com/photo-1547592166-23ac45744acd'],
    videos: [
      {
        id: 'ahGQpUo444c',
        url: 'https://www.youtube.com/watch?v=ahGQpUo444c',
        titulo:
          'Receta de Sopa de Caracol 🇭🇳. Video completo en el canal #receta #food #sopas #recetashondureñas',
        canal: 'Los Aleros HN',
        miniatura: 'https://i.ytimg.com/vi/ahGQpUo444c/hqdefault.jpg',
        tipo: 'short',
        duracionSegundos: 18,
        vistas: 29616,
        consulta: 'receta de Sopa de Caracol Honduras',
        fuente: 'youtube',
        verificadoEn: new Date('2026-08-20T00:28:53.775Z'),
      },
      {
        id: 'REGnQQwlPRk',
        url: 'https://www.youtube.com/watch?v=REGnQQwlPRk',
        titulo: 'Como hacer Sopa de Caracol paso a paso - Cocinando con Pamela - Episodio 26',
        canal: 'Cocinando con Pamela',
        miniatura: 'https://i.ytimg.com/vi/REGnQQwlPRk/hqdefault.jpg',
        tipo: 'normal',
        duracionSegundos: 450,
        vistas: 295507,
        consulta: 'receta de Sopa de Caracol Honduras',
        fuente: 'youtube',
        verificadoEn: new Date('2026-08-20T00:28:53.775Z'),
      },
    ],
    contextoHistorico:
      'La Sopa de Caracol es un platillo de origen garífuna, una etnia afrodescendiente que habita la costa caribeña de Honduras. Los garífunas son descendientes de africanos y amerindios caribeños, y su gastronomía es considerada Patrimonio Inmaterial de la Humanidad por la UNESCO.',
    festividades: ['Festival de la Ceiba (mayo)', 'Día de los Pueblos Indígenas'],
    estado: 'publicado',
    createdAt: new Date('2024-01-20'),
  },

  // ── Nacatamales ──────────────────────────────────────────────────────────
  {
    id: 'platillo-nacatamal-001',
    regionId: 'region-comayagua-001',
    nombre: 'Nacatamal',
    descripcion:
      'Tamal hondureño envuelto en hojas de plátano, relleno de masa de maíz, carne de cerdo, arroz, papas y aceitunas. Plato tradicional de fines de semana y celebraciones.',
    instrucciones: [
      'Preparar la masa mezclando la masa de maíz con achiote, sal y especias.',
      'Cocinar la carne de cerdo con cebolla, tomate y comino hasta que esté tierna.',
      'Hervir el arroz con achiote hasta que esté cocido.',
      'Remojar las hojas de plátano en agua caliente hasta que estén flexibles.',
      'Extender la hoja de plátano y colocar una capa de masa.',
      'Agregar el relleno: carne, arroz, papas en cubos y aceitunas.',
      'Envolver el nacatamal cerrando bien la hoja.',
      'Cocinar al vapor durante 1.5 a 2 horas.',
      'Dejar enfriar 10 minutos antes de servir.',
    ],
    ingredientes: [
      { ingredienteId: 'ing-masa-maiz', cantidad: '2', unidad: 'tazas' },
      { ingredienteId: 'ing-carne-molida', cantidad: '500', unidad: 'gramos' },
      { ingredienteId: 'ing-arroz', cantidad: '1', unidad: 'taza' },
      { ingredienteId: 'ing-achiote', cantidad: '2', unidad: 'cucharadas' },
      { ingredienteId: 'ing-cilantro', cantidad: '1/4', unidad: 'taza' },
    ],
    tiempoPreparacion: 180,
    dificultad: 'dificil',
    porciones: 8,
    imagenes: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836'],
    videos: [
      {
        id: '8ZHSS1Su98s',
        url: 'https://www.youtube.com/watch?v=8ZHSS1Su98s',
        titulo: 'nacatamales hondureños: una delicia culinaria #recetas #shorts',
        canal: 'Nan',
        miniatura: 'https://i.ytimg.com/vi/8ZHSS1Su98s/hqdefault.jpg',
        tipo: 'short',
        duracionSegundos: 58,
        vistas: 3321,
        consulta: 'receta de Nacatamal Honduras',
        fuente: 'youtube',
        verificadoEn: new Date('2026-08-20T00:28:54.405Z'),
      },
      {
        id: '8JiQD95MBeA',
        url: 'https://www.youtube.com/watch?v=8JiQD95MBeA',
        titulo: 'Tamales hondureños (nacatamales) 🇭🇳😋 | Antojitos Ktrachos y mas',
        canal: 'Antojitos Ktrachos y Mas',
        miniatura: 'https://i.ytimg.com/vi/8JiQD95MBeA/hqdefault.jpg',
        tipo: 'normal',
        duracionSegundos: 1233,
        vistas: 214218,
        consulta: 'receta de Nacatamal Honduras',
        fuente: 'youtube',
        verificadoEn: new Date('2026-08-20T00:28:54.405Z'),
      },
    ],
    contextoHistorico:
      'El nacatamal es un platillo con raíces precolombinas que ha evolucionado con la influencia española. En Honduras, es tradición preparar nacatamales los domingos y en celebraciones especiales. Cada familia tiene su receta secreta que se transmite de generación en generación.',
    festividades: ['Navidad', 'Año Nuevo', 'Fiestas patronales'],
    estado: 'publicado',
    createdAt: new Date('2024-02-01'),
  },
]
