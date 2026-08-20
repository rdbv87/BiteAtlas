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

### Preselección automatizada

La preselección reproducible usa la API de [Openverse](https://api.openverse.org/),
que indexa imágenes con licencia Creative Commons verificable (no scraping de HTML
ni de buscadores de imágenes):

1. Busca `[plato] Honduras plato` filtrando por `license_type=commercial,modification`.
2. Descarta resultados sin licencia compatible (`cc0`, `pdm`, `by`, `by-sa`).
3. Descarta títulos o etiquetas que no contengan todos los términos relevantes del
   plato, o que mencionen otro país centroamericano (posible plato similar pero
   distinto).
4. Devuelve cada candidato con `estado: 'pendiente'`: la automatización nunca marca
   una imagen como `aprobada`.

Ejecutar:

```bash
npm run curate:images
```

El comando falla si no hay ningún candidato verificable para un plato. Una imagen
solo pasa a `aprobada` después de que una persona confirme visualmente que
corresponde al plato correcto.

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
