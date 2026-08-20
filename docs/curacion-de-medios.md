# Curación de medios

## Imágenes

Una imagen no se publica solo porque la URL responda `200`. Cada foto debe tener:

- `fuenteUrl` y nombre de la fuente.
- Título o descripción de la fuente que identifique el plato.
- Licencia compatible con el uso del proyecto.
- Revisión humana o visual (`estado: aprobada`).

Las búsquedas genéricas y las fotos de stock sin contexto quedan en `pendiente`. La
automatización puede filtrar candidatos por título, descripción y licencia, pero no
puede garantizar por sí sola que una foto sea una baleada y no otro plato parecido.

## YouTube

La selección reproducible usa YouTube Data API v3, no HTML scraping:

1. Busca `receta de [plato] Honduras` con `type=video`, `order=viewCount` y `videoEmbeddable=true`.
2. Consulta los IDs con `videos.list` para obtener duración, estadísticas y miniaturas.
3. Descarta títulos o descripciones que no contengan todos los términos relevantes del plato.
4. Selecciona el candidato con más vistas de cada grupo: Short (hasta 60 segundos o marcado `#shorts`) y normal (más de 60 segundos).
5. Guarda la consulta y la fecha de verificación junto al video para poder auditarlo.

Ejecutar:

```bash
npm run curate:youtube
```

Requiere `YOUTUBE_API_KEY` en `.env.local`. Si no hay un Short y un video normal
verificables, el comando falla y no debe publicarse la receta.
