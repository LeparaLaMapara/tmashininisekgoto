export function VideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <figure className="not-prose my-8">
      <div className="aspect-video w-full border-2 border-ivory bg-surface">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        <a className="text-synapse-ink underline underline-offset-4" href={`https://youtu.be/${encodeURIComponent(videoId)}`}>
          {title}
        </a>
      </figcaption>
    </figure>
  )
}
