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
  'ubunye-engine': {
    intro:
      'Ubunye Engine is an open source tool I built so that a small data team can build data and machine learning pipelines one shared way, and run the same work on a laptop or in the cloud. This series introduces it in plain words: why it exists, how it works, what it can do, how long it takes to learn, how far you can trust it and how far it scales, what it took to build, and where it is used today.',
    description:
      'Ubunye Engine in plain words: what it is, why it exists, how it works, how reliable it is, how far it scales and where it is used.',
  },
  'career-development-in-data-and-ai': {
    slug: 'career-development',
    intro:
      'A career in data and AI has stops, like a route. First you become one: what to learn, in what order, and what has changed now that AI agents can write code. Later you build one: a team and a capability inside a real organisation, with a small budget and no map. Each part is written from where I have actually been, for wherever you are on the road.',
    description:
      'Career development in data science and AI: becoming a data scientist, then building and leading a team. Practical, from real experience in South Africa.',
  },
  'our-version': {
    intro:
      'The rich world builds something big: computers in space, giant data centres, networks that cost billions. Each post in this series asks one simple question. What is our version? It starts from what our communities already have, uses methods from work I have actually done, says the hard parts out loud, does the sums in the open, and ends with a small first step that could prove the idea wrong.',
    description:
      'Big ideas from the rich world, rebuilt from what our communities already have. Plain words, honest limits, sums in the open, a small first step.',
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
