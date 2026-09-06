/**
 * Topic landing pages.
 *
 * A tag page with nothing but a list of links is a weak landing page. Each entry
 * here gives its topic a real heading, an intro paragraph and its own meta
 * description, so /tags/<topic> can rank for the topic rather than only for the
 * post titles it happens to contain.
 *
 * Every intro below describes posts that actually exist. Tags with no entry
 * still render, just without an intro, so adding a tag never breaks a build.
 * When you write about a new area, add it here.
 */

export interface Topic {
  /** Heading shown on the page. */
  heading: string
  /** Intro paragraph. Plain prose, no keyword stuffing. */
  intro: string
  /** Meta description, kept under 155 characters. */
  description: string
}

/** Keyed by the slug, i.e. the tag lowercased with non-alphanumerics hyphenated. */
export const TOPICS: Record<string, Topic> = {
  mlops: {
    heading: 'MLOps',
    intro:
      'Notes from running machine learning in production inside a large, regulated enterprise: model registries, reproducible pipelines, the unglamorous plumbing that decides whether a model survives contact with real data, and why convention beats configuration when a team has to maintain what you built.',
    description:
      'Writing on MLOps from production practice: model registries, reproducible pipelines, and what it takes for ML to survive in a regulated enterprise.',
  },
  'open-source': {
    heading: 'Open source',
    intro:
      'Building tools in public, mostly in Python. The Ubunye Engine series covers the design decisions behind a convention-driven ML framework, and there is a walkthrough of taking a library from idea to something other people can install and rely on.',
    description:
      'Building open-source Python tools in public: framework design, packaging, and the decisions behind the Ubunye Engine.',
  },
  python: {
    heading: 'Python',
    intro:
      'Python as an engineering language rather than a scripting one: packaging libraries properly, structuring projects that outlive their authors, and the patterns that hold up once more than one person depends on your code.',
    description:
      'Python for engineering: packaging libraries, structuring maintainable projects, and patterns that survive a growing team.',
  },
  'software-engineering': {
    heading: 'Software engineering',
    intro:
      'The craft underneath the models. Architecture choices, the boring work that makes systems reliable, continuous integration, deployment patterns, and the tradeoffs you only discover when something has to run every day without you watching it.',
    description:
      'On the software engineering craft behind AI systems: architecture, reliability, CI, deployment, and the tradeoffs that only show up in production.',
  },
  'data-engineering': {
    heading: 'Data engineering',
    intro:
      'The layer everything else stands on: schemas that survive a migration, pipelines that move real volume, and the difference between a platform built for hosting applications and one built for distributed data work.',
    description:
      'Data engineering in practice: schema design, migrations, pipelines at volume, and platforms shaped for distributed data work.',
  },
  'ubunye-series': {
    heading: 'The Ubunye Engine series',
    intro:
      'A six-part walkthrough of building the Ubunye Engine, an open-source, convention-driven machine learning framework. It starts with why convention beats configuration, works through the model registry and the unglamorous reliability work, covers going from a Kaggle-shaped notebook to production, and ends with building alongside an AI agent and putting the whole thing to use.',
    description:
      'A six-part series on building the Ubunye Engine: convention over configuration, model registries, CI, and production ML.',
  },
  'data-science': {
    heading: 'Data science',
    intro:
      'The parts of data science that are not modelling: inheriting a function and modernising it, deciding what to build, and the roadmap from analyst to someone trusted with production systems. Written from inside a large South African enterprise.',
    description:
      'Data science beyond modelling: leading teams, choosing what to build, and the path to owning production systems.',
  },
  leadership: {
    heading: 'Leadership',
    intro:
      'Modernising a data science capability from the inside: inheriting a function with capable people and an incomplete system around them, deciding what to own and what to federate, and the belief that carried it, which is to build systems that outlive the people who built them.',
    description:
      'Modernising a data science capability inside a regulated enterprise: the operating model, the capability mix, and what actually changed.',
  },
  architecture: {
    heading: 'Architecture',
    intro:
      'Design decisions with consequences. How a model registry should be shaped, where to put the boundaries in an ML framework, and how those choices constrain everything built on top of them later.',
    description:
      'System design for machine learning: registries, framework boundaries, and choices that constrain everything built later.',
  },
  ai: {
    heading: 'AI',
    intro:
      'Applied artificial intelligence, kept close to practice: what these systems do well, where they break, and how to build with them so the result works outside a demo.',
    description:
      'Applied AI kept close to practice: what these systems do well, where they break, and how to build things that hold up.',
  },
  'ai-agents': {
    heading: 'AI agents',
    intro:
      'Agents as part of a working toolkit: what they add to a data science career, how they fit into real engineering workflows, and how to judge them honestly.',
    description:
      'AI agents in real workflows: what they add to engineering and data science practice, judged honestly.',
  },
}

/**
 * URL-safe slug for a tag. `"open source"` -> `"open-source"`, `"ci/cd"` -> `"ci-cd"`.
 *
 * Tag pages used to be addressed by the raw tag, which produced URLs like
 * `/tags/open%20source` and `/tags/ci%2Fcd`. Percent-encoded spaces read badly
 * and an encoded slash is fragile across hosts, so tags are slugified now.
 */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Topic copy for a tag, if we have written any. */
export function getTopic(tag: string): Topic | undefined {
  return TOPICS[slugifyTag(tag)]
}
