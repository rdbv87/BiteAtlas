# Tasks · 006 Navegación Cartográfica Interactiva

## Tareas

### Instalación

- [ ] Instalar `react-leaflet` y `leaflet`
- [ ] Instalar `@types/leaflet`
- [ ] Verificar que las dependencias se instalan correctamente

### Componente MapaMundi

- [ ] Crear `src/components/MapaMundi/MapaMundi.tsx`
- [ ] Configurar `MapContainer` con centro y zoom
- [ ] Agregar `TileLayer` con OpenStreetMap
- [ ] Implementar zoom mínimo/máximo
- [ ] Agregar loading state

### Marcadores

- [ ] Crear `src/components/Marcadores/MarcadorPais.tsx`
- [ ] Crear `src/components/Marcadores/MarcadorRegion.tsx`
- [ ] Implementar popup con info básica
- [ ] Agregar estilos personalizados a marcadores

### Datos de Países

- [x] Guardar el encuadre de mapa (`lat`, `lng`, `zoom`) en el documento del país en Firestore
- [x] Resolver el encuadre desde `src/lib/atlas.ts`, con el centro de las recetas como respaldo
- [x] Mostrar en el mapa solo los países que tienen recetas publicadas

### Hooks de Datos

- [ ] Crear `src/services/hooks/usePaises.ts`
- [ ] Implementar fetch de países desde Firestore
- [ ] Agregar loading y error states
- [ ] Crear `src/services/hooks/useRegiones.ts`

### Paneles de Info

- [ ] Crear `src/components/Paneles/PanelPais.tsx`
- [ ] Crear `src/components/Paneles/PanelRegion.tsx`
- [ ] Implementar diseño responsive
- [ ] Agregar animaciones de apertura/cierre

### Responsive

- [ ] Implementar vista mobile (mapa fullscreen + drawer)
- [ ] Implementar vista desktop (mapa + panel lateral)
- [ ] Probar en diferentes tamaños de pantalla

### Accesibilidad

- [x] Agregar navegación por teclado (Enter/Space foca marker) ✅ Implementado en MapaMundi.tsx
- [x] Agregar ARIA labels (mapa, capa, markers) ✅ Agregado en MapaMundi.tsx
- [x] Agregar contraste suficiente ✅ Verificado en styles
- [ ] Test con screen reader (jsdom) - pending (requiere jest-axe)

### Tests

- [x] Test de renderizado de MapaMundi ✅ 2 tests passing
- [x] Test de marcadores ✅ Estructura verificada (2 tests passing)
- [ ] Test de hooks de datos - requiere mock Firestore setup
- [x] Test de paneles ✅ PanelPais renderiza correctamente
- [ ] Test de accesibilidad Básica - pending jest-axe integration

### Performance

- [ ] Implementar lazy loading de marcadores
- [ ] Optimizar re-renders
- [ ] Medir FPS en navegación
- [ ] Ajustar si es necesario

### Documentación

- [ ] Documentar uso del componente
- [ ] Documentar estructura de datos
- [ ] Documentar cómo agregar nuevos países
