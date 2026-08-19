interface VideoPlayerProps {
  url: string
  fallbackImage?: string
  alt?: string
}

export function VideoPlayer({ url, fallbackImage, alt = 'Video del platillo' }: VideoPlayerProps) {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
  const isVimeo = url.includes('vimeo.com')

  if (isYouTube) {
    const videoId = url.includes('youtu.be')
      ? url.split('/').pop()?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0]

    if (videoId) {
      return (
        <div className="relative rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="240"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={alt}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-64"
          />
          {fallbackImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={fallbackImage}
                alt={alt}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      )
    }
  }

  if (isVimeo) {
    const videoId = url.split('/').pop()

    if (videoId) {
      return (
        <div className="relative rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="240"
            src={`https://player.vimeo.com/video/${videoId}?autoplay=1&background=0`}
            title={alt}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-64"
          />
          {fallbackImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={fallbackImage}
                alt={alt}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      )
    }
  }

  // URL genérica o no reconocida
  return fallbackImage ? (
    <div className="relative rounded-lg overflow-hidden">
      <img src={fallbackImage} alt={alt} className="w-full h-64 object-cover" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-center">Video no disponible</p>
      </div>
    </div>
  ) : (
    <div className="relative rounded-lg h-64 bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">URL de video no válida</p>
    </div>
  )
}
