# 004 · Firebase Setup

## Qué hace

Configuración completa de Firebase Firestore para BiteAtlas, incluyendo proyecto Firebase, cliente Firestore, reglas de seguridad y estructura de colecciones basada en el modelo de datos.

## Por qué

Firebase Firestore es la base de datos elegida según la constitución. Una configuración correcta desde el inicio garantiza seguridad, escalabilidad y consistencia con el modelo de datos definido en el feature 003.

## Criterios de aceptación

- [ ] Proyecto Firebase creado (o documentado cómo crearlo)
- [ ] Dependencias Firebase instaladas (`firebase` y `firebase-admin`)
- [ ] Cliente Firestore configurado en `src/services/firebase.ts`
- [ ] Variables de entorno configuradas (`.env.local`)
- [ ] Reglas de seguridad definidas:
  - Lectura pública para países, regiones, platillos
  - Escritura restringida (futura autenticación)
- [ ] Estructura de colecciones documentada
- [ ] Test de conexión a Firestore
- [ ] `.env.example` actualizado con variables Firebase
