import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { ImpactCounters } from '@/components/home/impact-counters'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { JsonLd } from '@/components/seo/json-ld'
import { personSchema } from '@/lib/schema'
import { getAllPosts } from '@/lib/blog'
import { BIO, CAREER_TIMELINE, PROJECTS, PUBLICATIONS, TALKS, COURSES, SOCIAL_LINKS } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Sparkles, ArrowRight, Github, BookOpen } from 'lucide-react'

// Title and description come from the root layout's defaults; this only pins the
// canonical so the homepage points at itself rather than inheriting anything.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: pageOpenGraph('/', 'Thabang Mashinini-Sekgoto, applied AI, data science and AI engineering'),
}

/**
 * The three roles that put systems into production at scale.
 *
 * Read from CAREER_TIMELINE rather than restated here, so the homepage cannot
 * drift away from the resume and the 3D career journey. Every figure on this
 * page already existed in the repository before this section did.
 */
const SELECTED = ['ABSA Insurance', 'Vodacom', 'IBM Research']
  .map((org) => CAREER_TIMELINE.find((m) => m.org === org && m.kind === 'work'))
  .filter((m): m is NonNullable<typeof m> => Boolean(m))

const UBUNYE = PROJECTS.find((p) => p.slug === 'ubunye-engine')!
const MSC = CAREER_TIMELINE.find((m) => m.shortOrg === 'MSc')!
const PROPOSAL = CAREER_TIMELINE.find((m) => m.shortOrg === 'Research')!

export default function Home() {
  const posts = getAllPosts().slice(0, 3)
  const upcomingCourses = COURSES.filter((c) => c.status === 'coming-soon').length

  return (
    <>
      <JsonLd data={personSchema()} />

      {/* ---------------- 1. HERO ----------------
          Deliberately NOT wrapped in ScrollReveal. That component starts at
          opacity 0 and waits for the element to scroll into view, but the hero
          is already in view on load, so it only ever delayed the paint of the
          LCP element (this h1) until framer-motion had hydrated. Reveal
          animations start below the fold, where they actually mean something. */}
      <section className="relative min-h-[88vh] flex items-center px-6 pt-28 pb-16">
        <div className="mx-auto max-w-5xl w-full">
          <div>
            <p className="text-sm font-mono text-synapse tracking-widest uppercase mb-6">
              Thabang means rejoice · Ubunye means unity
            </p>
          </div>

          <div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-8">
              I build AI systems that work
              <br />
              in the real world<span className="text-synapse">.</span>
            </h1>
          </div>

          <div>
            <p className="font-mono text-sm sm:text-base text-signal tracking-wide mb-5">
              {BIO.disciplines}
            </p>
            <p className="text-lg sm:text-xl text-ivory/85 leading-relaxed max-w-2xl mb-10">
              I design and build production AI and data systems, the reusable
              infrastructure underneath them, and applied research grounded in real
              problems.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ivory text-void font-medium text-base hover:opacity-90 transition-all glow-synapse"
              >
                See the proof
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-synapse/40 text-synapse font-medium text-base hover:bg-synapse/10 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Talk to Thabang AI Assist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. SELECTED WORK ---------------- */}
      <section className="py-24 px-6 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-center mb-4">
              Real impact, real numbers
            </h2>
            <p className="text-muted text-lg text-center max-w-2xl mx-auto mb-16">
              Not demos. Not proofs of concept. Production systems that survive noisy data,
              organizational constraints, and real human use.
            </p>
          </ScrollReveal>
          <ImpactCounters />

          <ScrollReveal>
            <div className="mt-20 grid gap-6 md:grid-cols-3">
              {SELECTED.map((role) => (
                <div
                  key={role.org}
                  className="glass border border-border rounded-2xl p-7 flex flex-col"
                >
                  <p className="font-mono text-xs text-synapse tracking-wider uppercase mb-3">
                    {role.org}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-ivory mb-3">
                    {role.role}
                  </h3>
                  <p className="text-sm text-ivory/70 leading-relaxed mb-4 flex-1">
                    {role.description}
                  </p>
                  <p className="text-sm font-medium text-signal leading-snug">
                    {role.highlight}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mt-10 text-center">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-synapse hover:underline font-medium"
              >
                All work and projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- 3. UBUNYE ENGINE ----------------
          The clearest example of the throughline: patterns learned in
          production, turned into infrastructure other teams can use. It gets a
          full section rather than a card because a card cannot state a problem.

          TODO(thabang): the six part Ubunye Engine series in content/blog is
          still `published: false`. When it goes live, add the link here, since
          the brief for this section asks for GitHub, docs and the writing. */}
      <section className="py-24 px-6 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="font-mono text-sm text-signal tracking-widest uppercase mb-4">
              Open source infrastructure
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ivory mb-6">
              Ubunye Engine
            </h2>

            <p className="text-lg text-ivory/85 leading-relaxed mb-5">
              Small data science teams are usually good at building models. What stops
              them is everything around the model: ingestion, configuration,
              reproducibility, deployment, orchestration, observability, and the fact
              that a pipeline written for one platform rarely survives a move to
              another.
            </p>
            <p className="text-lg text-ivory/85 leading-relaxed mb-8">
              Ubunye Engine is where I test how much of that engineering complexity can
              be packaged into reusable abstractions. You describe a pipeline once, as a
              small folder of configuration and Python, and run that exact folder
              wherever it needs to run.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="glass border border-border rounded-2xl p-7 mb-8">
              <p className="font-mono text-xs text-synapse tracking-wider uppercase mb-3">
                Where it stands
              </p>
              <p className="text-ivory/80 leading-relaxed">{UBUNYE.impact}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {UBUNYE.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-mono text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex items-center gap-4 flex-wrap">
              <a
                href={UBUNYE.ghLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ivory text-void font-medium text-sm hover:opacity-90 transition-all"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={UBUNYE.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-synapse/40 text-synapse font-medium text-sm hover:bg-synapse/10 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Documentation
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- 4. RESEARCH ---------------- */}
      <section className="py-24 px-6 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="font-mono text-sm text-signal tracking-widest uppercase mb-4">
              Research
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ivory mb-6">
              The research feeds the systems, and the systems feed the research
            </h2>
            <p className="text-lg text-ivory/85 leading-relaxed mb-10">
              Two years as a machine learning research scientist at IBM Research, an MSc
              by dissertation at the University of the Witwatersrand, and published work
              in remote sensing, occupational health and forecasting. The questions that
              interest me now come from problems I met in production.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass border border-border rounded-2xl p-7">
                <p className="font-mono text-xs text-synapse tracking-wider uppercase mb-3">
                  {MSC.period} · Completed
                </p>
                <h3 className="font-display text-lg font-semibold text-ivory mb-3">
                  {MSC.role}
                </h3>
                <p className="text-sm text-ivory/70 leading-relaxed">{MSC.description}</p>
              </div>
              <div className="glass border border-border rounded-2xl p-7">
                <p className="font-mono text-xs text-signal tracking-wider uppercase mb-3">
                  {PROPOSAL.period}
                </p>
                <h3 className="font-display text-lg font-semibold text-ivory mb-3">
                  {PROPOSAL.role}
                </h3>
                <p className="text-sm text-ivory/70 leading-relaxed">
                  {PROPOSAL.description}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-10">
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 text-synapse hover:underline font-medium"
              >
                {PUBLICATIONS.length} publications
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- 5. WRITING ---------------- */}
      {posts.length > 0 && (
        <section className="py-24 px-6 border-t border-border">
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <p className="font-mono text-sm text-signal tracking-widest uppercase mb-4">
                Writing
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ivory mb-6">
                Notes from inside the build
              </h2>
              <p className="text-lg text-ivory/85 leading-relaxed mb-10">
                I write down what I learn while building: what the engineering actually
                costs, where the received wisdom fails, and what I would do differently.
                Every example comes from a system that exists.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <ul className="space-y-6">
                {posts.map((post) => (
                  <li key={post.slug} className="border-t border-border pt-6">
                    <Link href={`/blog/${post.slug}`} className="group">
                      <p className="font-mono text-xs text-muted mb-2">
                        {formatDate(post.date)} · {post.readingTime}
                      </p>
                      <h3 className="font-display text-xl font-semibold text-ivory group-hover:text-synapse transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-muted leading-relaxed">{post.summary}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-10">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-synapse hover:underline font-medium"
                >
                  All writing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ---------------- 6. TALKS AND TEACHING ---------------- */}
      <section className="py-24 px-6 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="font-mono text-sm text-signal tracking-widest uppercase mb-4">
              Talks and teaching
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ivory mb-6">
              Explaining the work in public
            </h2>
            <p className="text-lg text-ivory/85 leading-relaxed mb-8">
              {TALKS.length} recorded talks, sessions and interviews on building with AI,
              and {upcomingCourses} practical courses in preparation, from working with
              AI agents without writing code through to production machine learning.
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <Link
                href="/talks"
                className="inline-flex items-center gap-2 text-synapse hover:underline font-medium"
              >
                Talks and press
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-synapse hover:underline font-medium"
              >
                Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- 7. ABOUT AND CONTACT ----------------
          The Soshanguve thread lives here rather than in the hero. It is who he
          is, not a fourth audience competing with the production work. */}
      <section className="py-24 px-6 border-t border-border">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <p className="font-display text-2xl sm:text-3xl text-ivory leading-snug">
              I am the founder of{' '}
              <span className="text-synapse">Ubunye AI Ecosystems</span> and I am from{' '}
              <span className="text-signal">Soshanguve</span>.
            </p>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Ubunye means unity in isiZulu, and it is the thread through everything I
              make. The same hands that build machine learning platforms for banks build
              websites for schools and small businesses back home. Serious engineering,
              shared with everyone.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="mt-10 flex items-center justify-center gap-6 text-base text-muted flex-wrap">
              <span>Vodacom</span>
              <span className="w-1 h-1 rounded-full bg-synapse" />
              <span>ABSA</span>
              <span className="w-1 h-1 rounded-full bg-synapse" />
              <span>IBM Research</span>
              <span className="w-1 h-1 rounded-full bg-synapse" />
              <span>Wits University</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-synapse/40 text-synapse font-medium text-base hover:bg-synapse/10 transition-all"
              >
                More about me
              </Link>
              <a
                href={SOCIAL_LINKS.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ivory text-void font-medium text-base hover:opacity-90 transition-all glow-synapse"
              >
                Book a conversation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
