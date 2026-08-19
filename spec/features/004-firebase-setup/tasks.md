# Tasks · 004 Firebase Setup

## Tareas

### Instalación

- [x] Instalar `firebase` con `npm install firebase`
- [x] Instalar `firebase-admin` con `npm install firebase-admin`
- [x] Verificar que las dependencias se instalan correctamente

### Cliente Firestore

- [x] Crear `src/services/firebase.ts`
- [x] Configurar inicialización de Firebase App
- [x] Configurar cliente Firestore
- [x] Manejar hot reload (evitar duplicados)
- [x] Exportar `firebaseApp` y `firestore` para uso en la app

### Variables de Entorno

- [x] Actualizar `.env.example` con variables Firebase
- [ ] Crear `.env.local` con credenciales reales (no commitear)
- [x] Verificar que `.env.local` está en `.gitignore`

### Reglas de Seguridad

- [x] Crear `firestore.rules`
- [x] Definir reglas de lectura pública para países
- [x] Definir reglas de lectura pública para regiones
- [x] Definir reglas de lectura pública para platillos
- [x] Definir reglas de escritura restringida
- [x] Agregar reglas para aportes futuros
- [ ] Documentar cómo deployar reglas

### Estructura de Colecciones

- [x] Documentar estructura en firestore.rules
- [x] Verificar que coincide con el modelo de datos (feature 003)

### Tests

- [x] Crear `src/services/__tests__/firebase.test.ts`
- [x] Test de estructura de archivos
- [x] Test de variables de entorno documentadas
- [x] Test de estructura de colecciones
- [x] Verificar que los tests pasan

### Documentación

- [ ] Documentar configuración de Firebase
- [ ] Documentar estructura de colecciones
- [ ] Documentar reglas de seguridad
- [ ] Documentar cómo ejecutar ingesta

### Verificación Final

- [x] Ejecutar `npm run test:run` → pasa (32 tests)
- [x] Ejecutar `npm run build` → compila
- [x] Ejecutar `npm run lint` → sin errores
