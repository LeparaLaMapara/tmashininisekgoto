import { slugifyTag } from '@/lib/topics'

/**
 * Series landing pages.
 *
 * A series is a single argument split across several posts. Without a page of
 * its own the only way to hand someone the whole thing is to send six links,
 * or to send part one and hope they find the rest. This is the copy that lets
 * `/blog/series/<slug>` stand on its own as the thing you share.
 *
 * Keyed by the slugified `series` value in frontmatter, so a series with no
 * entry here still gets a page, just without an intro. Copy is optional;
 * appearing on the site is not.
 */
export interface SeriesCopy {
  /**
   * URL segment, when the series name is too long to be a good link.
   *
   * "The Practical Roadmap to Building With AI Agents" slugifies to
   * fifty characters, which is a link nobody reads before clicking. Set this
   * and the short form is the only URL the site ever emits.
   */
  slug?: string
  /** Intro paragraph on the series page. Plain prose. */
  intro: string
  /** Meta description, kept under 155 characters. */
  description: string
}

/** Keyed by the slugified series name, i.e. `slugifyTag(post.series)`. */
export const SERIES: Record<string, SeriesCopy> = {
  'the-practical-roadmap-to-building-with-ai-agents': {
    slug: 'ai-agents-roadmap',
    intro:
      'Six parts, written while building this site rather than afterwards. It starts at the difference between a chat window and an agent and ends at what an agentic system actually costs to run. Every example comes from this site: the tools it was given, the permissions it should not have had, the retrieval bugs where the model was fine and the information was not, and the checks that now catch all of it.',
    description:
      'A six part practical roadmap to building with AI agents: tools, retrieval, permissions, reliability and orchestration, from a site built that way.',
  },
}

/**
 * The URL segment for a series.
 *
 * Only this form is ever linked or listed, so a series has exactly one
 * address. The natural slugification of the name is the default; an entry in
 * `SERIES` can shorten it.
 */
export function slugifySeries(name: string): string {
  const natural = slugifyTag(name)
  return SERIES[natural]?.slug ?? natural
}

/** Series copy, if any has been written. */
export function getSeriesCopy(name: string): SeriesCopy | undefined {
  return SERIES[slugifyTag(name)]
}
