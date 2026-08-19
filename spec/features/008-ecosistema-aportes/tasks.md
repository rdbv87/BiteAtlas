# Tasks · 008 Ecosistema de Aportes Comunales

## Tareas

### Modelo de Datos

- [ ] Actualizar `PlatilloSchema` con campo `estado`
- [ ] Agregar tipos `EstadoPlatillo`
- [ ] Actualizar esquemas Zod
- [ ] Crear migración de datos (si es necesario)

### Formulario Multi-Paso

- [ ] Instalar `react-hook-form` y `@hookform/resolvers`
- [ ] Crear `src/components/Aportes/FormularioAporte.tsx`
- [ ] Implementar Stepper visual
- [ ] Implementar navegación entre pasos
- [ ] Implementar validación por paso

### Paso 1: Datos Básicos

- [ ] Crear `src/components/Aportes/PasoDatosBasicos.tsx`
- [ ] Campo: Nombre del platillo
- [ ] Campo: Descripción
- [ ] Campo: Selección de país
- [ ] Campo: Selección de región
- [ ] Campo: Dificultad
- [ ] Campo: Tiempo de preparación

### Paso 2: Ingredientes

- [ ] Crear `src/components/Aportes/PasoIngredientes.tsx`
- [ ] Lista dinámica de ingredientes
- [ ] Campo: Nombre del ingrediente
- [ ] Campo: Cantidad
- [ ] Campo: Unidad
- [ ] Botón: Agregar/eliminar ingrediente

### Paso 3: Instrucciones

- [ ] Crear `src/components/Aportes/PasoInstrucciones.tsx`
- [ ] Lista dinámica de pasos
- [ ] Campo: Texto del paso
- [ ] Botón: Agregar/eliminar paso
- [ ] Drag & drop para reordenar

### Paso 4: Media

- [ ] Crear `src/components/Aportes/PasoMedia.tsx`
- [ ] Crear `src/components/Aportes/UploadImagen.tsx`
- [ ] Upload de imágenes con preview
- [ ] Campo: URL de video (opcional)
- [ ] Validar tamaño y formato

### Paso 5: Resumen

- [ ] Crear `src/components/Aportes/PasoResumen.tsx`
- [ ] Mostrar preview de todos los datos
- [ ] Botón de enviar
- [ ] Loading state durante envío

### Firebase Storage

- [ ] Configurar Firebase Storage
- [ ] Crear servicio de upload
- [ ] Implementar generación de nombres únicos
- [ ] Manejar errores de upload

### Panel de Administración

- [ ] Crear `src/components/Admin/PanelRevision.tsx`
- [ ] Crear `src/components/Admin/TarjetaAporte.tsx`
- [ ] Crear `src/components/Admin/ModalRevision.tsx`
- [ ] Implementar lista de pendientes
- [ ] Implementar botones de aprobar/rechazar
- [ ] Implementar campo de motivo de rechazo

### Hooks

- [ ] Crear `src/services/hooks/useAportes.ts`
- [ ] Crear `src/services/hooks/useAportesPendientes.ts`
- [ ] Implementar CRUD de aportes
- [ ] Implementar filtros por estado

### Rate Limiting

- [ ] Implementar contador de aportes por usuario
- [ ] Limitar a 5 aportes por día
- [ ] Limitar imágenes a 10 por aporte
- [ ] Limitar tamaño a 5MB por imagen

### Tests

- [ ] Test de formulario multi-paso
- [ ] Test de validación por paso
- [ ] Test de upload de imágenes
- [ ] Test de panel de administración
- [ ] Test de rate limiting

### Accesibilidad

- [ ] ARIA labels en formulario
- [ ] Focus management entre pasos
- [ ] Mensajes de error accesibles
- [ ] Navegación por teclado

### Documentación

- [ ] Documentar flujo de contribución
- [ ] Documentar flujo de curación
- [ ] Documentar límites de rate limiting
- [ ] Ejemplos de uso
