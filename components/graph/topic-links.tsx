import Link from 'next/link'
import { topicHref } from '@/lib/graph'
import { getTopicDef } from '@/lib/graph/topics'

/**
 * Topic chips. A topic with a hub page links to it; a topic without one is
 * plain text, because linking to a page that does not exist, or to a thin one,
 * is worse than not linking.
 */
export function TopicLinks({ slugs, className = '' }: { slugs: string[]; className?: string }) {
  const topics = slugs.map((s) => ({ slug: s, def: getTopicDef(s), href: topicHref(s) })).filter((t) => t.def)
  if (!topics.length) return null
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {topics.map(({ slug, def, href }) => (
        <li key={slug}>
          {href ? (
            <Link
              href={href}
              className="inline-block rounded-full border border-border px-2.5 py-0.5 text-xs font-mono text-muted transition-colors hover:border-synapse/40 hover:text-ivory"
            >
              {def!.name}
            </Link>
          ) : (
            <span className="inline-block rounded-full border border-border/60 px-2.5 py-0.5 text-xs font-mono text-muted">
              {def!.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
