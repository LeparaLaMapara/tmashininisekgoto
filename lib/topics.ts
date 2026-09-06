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
  engineering: {
    heading: 'Engineering',
    intro:
      'The craft underneath the models. Architecture choices, the boring work that makes systems reliable, continuous integration, and the tradeoffs you only discover when something has to run every day without you watching it.',
    description:
      'On the engineering craft behind AI systems: architecture, reliability, CI, and the tradeoffs that only show up in production.',
  },
  'ubunye-series': {
    heading: 'The Ubunye Engine series',
    intro:
      'A six-part walkthrough of building the Ubunye Engine, an open-source, convention-driven machine learning framework. It starts with why convention beats configuration, works through the model registry and the unglamorous reliability work, covers going from a Kaggle-shaped notebook to production, and ends with building alongside an AI agent and putting the whole thing to use.',
    description:
      'A six-part series on building the Ubunye Engine: convention over configuration, model registries, CI, and production ML.',
  },
  'agentic-ai': {
    heading: 'Agentic AI',
    intro:
      'Working with AI agents as engineering collaborators rather than demos: what it is actually like to build software alongside one, where the leverage is real, and where the hype outruns what the tools can currently do.',
    description:
      'Building with AI agents as engineering collaborators: real leverage, real limits, and what changes in how you work.',
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
  career: {
    heading: 'Career',
    intro:
      'How the path actually looks, written for people walking it in South Africa: what to learn, in what order, and which skills earn trust with production systems rather than only with recruiters.',
    description:
      'A practical view of the data science and AI career path in South Africa: what to learn, in what order, and why.',
  },
  architecture: {
    heading: 'Architecture',
    intro:
      'Design decisions with consequences. How a model registry should be shaped, where to put the boundaries in an ML framework, and how those choices constrain everything built on top of them later.',
    description:
      'System design for machine learning: registries, framework boundaries, and choices that constrain everything built later.',
  },
  'ci-cd': {
    heading: 'CI/CD',
    intro:
      'Continuous integration for machine learning, which is mostly the boring work: tests that catch real regressions, pipelines that fail loudly, and automation that means a release is not an event.',
    description:
      'Continuous integration and delivery for ML: meaningful tests, loud failures, and releases that stop being events.',
  },
  systems: {
    heading: 'Systems',
    intro:
      'Thinking in systems rather than scripts: what happens at the seams between components, and how libraries, pipelines and services fit together into something maintainable.',
    description:
      'Systems thinking for ML and software: the seams between components, and how the pieces fit into something maintainable.',
  },
  'south-africa': {
    heading: 'Building in South Africa',
    intro:
      'Technology work grounded in South African conditions: the local job market, what enterprises here actually need, and building for people in townships like Soshanguve rather than for a Silicon Valley user who does not exist here.',
    description:
      'Technology and AI work grounded in South African conditions: the local market, real constraints, and who it is built for.',
  },
  ai: {
    heading: 'AI',
    intro:
      'Applied artificial intelligence, kept close to practice: what these systems do well, where they break, and how to build with them so the result works outside a demo.',
    description:
      'Applied AI kept close to practice: what these systems do well, where they break, and how to build things that hold up.',
  },
  'claude-code': {
    heading: 'Claude Code',
    intro:
      'Building real software with Claude Code, including this site. What the workflow looks like day to day, where an agent genuinely accelerates the work, and the places you still have to think for yourself.',
    description:
      'Building real software with Claude Code: the day-to-day workflow, where it accelerates work, and where it does not.',
  },
  'web-development': {
    heading: 'Web development',
    intro:
      'Shipping the web side of things, mostly Next.js: how this site is put together, and what building it with an AI agent changed about the process.',
    description:
      'Web development with Next.js, including how this site was built and what an AI agent changed about the process.',
  },
  'ai-agents': {
    heading: 'AI agents',
    intro:
      'Agents as part of a working toolkit: what they add to a data science career, how they fit into real engineering workflows, and how to judge them honestly.',
    description:
      'AI agents in real workflows: what they add to engineering and data science practice, judged honestly.',
  },
  'behind-the-scenes': {
    heading: 'Behind the scenes',
    intro:
      'How the work actually got made, including the false starts. Written up so the process is visible rather than only the finished result.',
    description:
      'How the work actually got made, false starts included, with the process visible rather than only the result.',
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
