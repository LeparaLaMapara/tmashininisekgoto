import Image from 'next/image'
import { Play, BookOpen } from 'lucide-react'
import type { Talk, TalkKind } from '@/lib/data'

/** Human label per content type, so an interview never reads as a workshop. */
const KIND_LABEL: Record<TalkKind, string> = {
  episode: 'Episode',
  talk: 'Talk',
  interview: 'Interview',
  archive: 'From the archive',
}

/**
 * The YouTube watch URL and thumbnail for an embed URL.
 *
 * The page used to mount seventeen iframes at once, which is seventeen
 * third-party players, their scripts and their cookies on a single view. A
 * thumbnail that links out costs one image and behaves the same for the reader,
 * and it keeps working when the archive is a hundred items long.
 */
function youtube(embedUrl: string) {
  const id = embedUrl.split('/embed/')[1]?.split(/[?&]/)[0] ?? ''
  return {
    id,
    watch: id ? `https://www.youtube.com/watch?v=${id}` : embedUrl,
    thumb: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null,
  }
}

export function formatTalkDate(date: string) {
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function TalkCard({ talk, compact = false }: { talk: Talk; compact?: boolean }) {
  const { watch, thumb } = youtube(talk.videoUrl)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-synapse/30">
      <a
        href={watch}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden"
        aria-label={`Watch: ${talk.title}`}
      >
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-void/40" />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-void/70 backdrop-blur-sm transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 translate-x-[1px] text-ivory" fill="currentColor" />
          </span>
        </span>
      </a>

      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-synapse-ink">
          {KIND_LABEL[talk.kind]} · {talk.role}
        </span>

        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-ivory">
          <a href={watch} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-synapse">
            {talk.title}
          </a>
        </h3>

        <p className="mt-1 text-sm text-muted">
          {talk.event} · {formatTalkDate(talk.date)}
        </p>

        {!compact && (
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{talk.description}</p>
        )}

        {talk.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {talk.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
          <a
            href={watch}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-synapse"
          >
            <Play className="h-4 w-4" />
            Watch
          </a>
          {talk.slidesUrl && (
            <a
              href={talk.slidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-synapse"
            >
              <BookOpen className="h-4 w-4" />
              {talk.slidesLabel || 'Slides'}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
