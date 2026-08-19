# Tasks · 007 Fichas Culturales Inmersivas

## Tareas

### Instalación

- [x] `framer-motion` ya instalado en el proyecto
- [x] Verificar dependencias ✅

### Componente Principal

- [x] `FichaCultural.tsx` ✅ Ya existe en `src/components/fichas/FichaCultural.tsx`
- [x] Panel deslizante con Framer Motion ✅
- [x] Tabs de navegación (Receta, Historia, Festividades) ✅
- [x] Implementar cierre con botón y drag ✅ (onClick en overlay + escape)

### Header

- [x] `Header` info incluida en FichaCultural ✅
- [x] Imagen principal del platillo ✅
- [x] Nombre y región ✅
- [x] Botón de cerrar ✅

### Sección Receta

- [x] `RecetaSection.tsx` ✅ Ya existe en `src/components/fichas/RecetaSection.tsx`
- [x] Listar ingredientes con cantidades ✅
- [x] Mostrar instrucciones paso a paso ✅
- [x] Números de paso con estilo ✅

### Sección Contexto Histórico

- [x] `HistoriaSection.tsx` ✅ Ya existe en `src/components/fichas/HistoriaSection.tsx`
- [x] Mostrar texto con tipografía editorial ✅
- [x] Manejar caso de no tener información ✅

### Sección Festividades

- [x] `FestividadesSection.tsx` ✅ Ya existe en `src/components/fichas/FestividadesSection.tsx`
- [x] Listar festividades asociadas ✅
- [x] Agregar icons o badges ✅ (usando PartyPopper)

### Video

- [x] `VideoPlayer.tsx` ✅ Creado en `src/components/fichas/Secciones/VideoPlayer.tsx`
- [x] Integrar YouTube/Vimeo embed ✅
- [x] Lazy loading del video ✅ (solo renderiza cuando hay URL)
- [x] Responsive ✅

### Galería

- [x] `Galeria.tsx` ✅ Creado en `src/components/fichas/Secciones/Galeria.tsx`
- [x] Carrusel de imágenes ✅
- [x] Lightbox para vista completa ✅ (integrado en carousel)
- [x] Navegación con flechas ✅ (ChevronLeft/Right)

### Footer

- [ ] Crear componente Footer formal
- [ ] Mostrar tiempo de preparación ✅ (ya en header)
- [ ] Mostrar dificultad ✅ (ya en header)
- [ ] Mostrar porciones ✅ (ya en header)

### Animaciones

- [x] Animación de entrada del panel ✅ (Framer Motion)
- [x] Transiciones entre tabs ✅
- [x] Animaciones de pasos de receta ✅
- [ ] Hover effects - pendiente

### Responsive

- [x] Mobile: panel fullscreen con drag ✅
- [x] Desktop: panel lateral ✅ (aunque es fullscreen right)
- [ ] Probar en diferentes tamaños - pendiente

### Accesibilidad

- [ ] ARIA labels en tabs - pendiente
- [ ] Focus management - pendiente
- [ ] Escape para cerrar ✅ (already implemented)
- [ ] Screen reader compatible - pendiente

### Tests

- [ ] Test de renderizado - pendiente
- [ ] Test de navegación entre tabs - pendiente
- [ ] Test de cierre - pendiente
- [ ] Test de animaciones (snapshot) - pendiente

### Documentación

- [ ] Documentar uso del componente
- [ ] Documentar props disponibles
- [ ] Ejemplos de uso
