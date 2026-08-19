# Tasks · 002 UI Foundation

## Tareas

### Tailwind CSS

- [x] Verificar que Tailwind ya está configurado (create-next-app)
- [x] Configurar tokens personalizados en `globals.css` (Tailwind v4 usa CSS, no config file)
- [x] Agregar paleta de colores BiteAtlas (terracota/naranja como primary)
- [x] Agregar fuentes personalizadas (Inter, Merriweather)
- [x] Verificar que los tokens funcionan en componentes

### shadcn/ui + Radix

- [x] Inicializar shadcn/ui con `npx shadcn@latest init`
- [x] Instalar componente Button (incluido en init)
- [x] Instalar componente Card
- [x] Instalar componente Input
- [x] Verificar que los componentes renderizan correctamente

### CSS Global

- [x] Configurar `src/app/globals.css` con variables CSS (oklch)
- [x] Configurar modo claro/oscuro con `@custom-variant dark`
- [x] Importar CSS global en `src/app/layout.tsx`
- [x] Verificar que los estilos se aplican

### Tipografías

- [x] Instalar fuentes Inter y Merriweather de Google Fonts
- [x] Configurar variables de fuentes en `layout.tsx`
- [x] Aplicar fuentes a elementos base via `--font-sans` y `--font-editorial`
- [x] Verificar legibilidad

### Componentes Base

- [x] Componente Button (shadcn/ui)
- [x] Componente Card (shadcn/ui)
- [x] Componente Input (shadcn/ui)
- [ ] Documentar uso de componentes

### Responsive

- [ ] Verificar mobile-first en todos los breakpoints
- [ ] Probar en 320px, 768px, 1024px, 1280px
- [ ] Ajustar espaciados si es necesario

### Tests

- [ ] Crear test de renderizado para Button
- [ ] Crear test de renderizado para Card
- [ ] Crear test de renderizado para Input
- [ ] Verificar que los tests pasan

### Documentación

- [ ] Actualizar README con tokens de diseño
- [ ] Documentar uso de shadcn/ui
- [ ] Documentar sistema de colores
