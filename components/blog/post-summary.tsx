import { FileText } from 'lucide-react'

/**
 * The summary block that opens every post.
 *
 * Identical markup and identical wording order on all of them, on purpose. A
 * retrieval system that has parsed one post has parsed all of them: the first
 * prose inside `<article>` is always a one-paragraph statement of what the post
 * is about, labelled "Summary", rather than whatever the twelfth paragraph
 * happens to say.
 *
 * It repeats the excerpt shown on /blog. That is the trade: a reader who came
 * from the index reads one sentence twice, and every machine that arrives cold
 * gets the thesis in the first hundred words. The same block, in the same
 * order, is the head of `/blog/<slug>.md`.
 *
 * Rendered statically with no entrance animation, because a block that is
 * server-rendered at `opacity: 0` is invisible to exactly the readers it exists
 * for. See SEO-AUDIT.md section 2.
 */
export function PostSummary({
  slug,
  summary,
}: {
  slug: string
  summary: string
}) {
  if (!summary) return null

  return (
    <section
      aria-labelledby={`summary-${slug}`}
      className="mb-12 rounded-2xl border border-synapse/15 bg-synapse/[0.04] p-5 sm:p-6"
    >
      <h2
        id={`summary-${slug}`}
        className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-synapse-ink"
      >
        Summary
      </h2>
      <p className="text-[1.0625rem] leading-relaxed text-ivory/85">{summary}</p>
      {/* Plain <a>, not next/link: `.md` is served by a rewrite to a route
          handler, so the client router has no matching page for it and would
          404 on a soft navigation. This needs a real document request. */}
      <a
        href={`/blog/${slug}.md`}
        className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-synapse"
      >
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        Read as plain markdown
      </a>
    </section>
  )
}
