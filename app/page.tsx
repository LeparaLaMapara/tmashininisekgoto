import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { personSchema, organizationsSchema } from '@/lib/schema'
import { getAllPosts } from '@/lib/blog'
import { BIO, CAREER_TIMELINE, PROJECTS, PUBLICATIONS, TALKS, COURSES, SOCIAL_LINKS, IMPACT_NUMBERS } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, Github, BookOpen } from 'lucide-react'

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

/**
 * The four things painted on the shop board. Each is a claim the linked page
 * proves, and each sentence stays inside what the public CV says.
 */
const SERVICES = [
  { label: 'Production AI', text: 'Telematics at ABSA, from months to under a day.', href: '/work', tone: 'text-synapse-ink' },
  { label: 'Open source', text: 'Ubunye Engine: describe a pipeline once, run it anywhere.', href: `/work/${UBUNYE.slug}`, tone: 'text-signal' },
  { label: 'Research', text: 'IBM Research, an MSc with distinction, a PhD from 2027.', href: '/research', tone: 'text-synapse-ink' },
  { label: 'Community', text: 'Websites for schools, small businesses and my family.', href: '/about', tone: 'text-signal' },
]

// Borders between the four board cells. One column on phones, two on tablets,
// four on desktop; each cell only draws the edges it shares with a neighbour.
const CELL_BORDERS = [
  '',
  'border-t-4 sm:border-t-0 sm:border-l-4',
  'border-t-4 lg:border-t-0 lg:border-l-4',
  'border-t-4 sm:border-l-4 lg:border-t-0',
]

const TEXT_LINK = 'inline-flex items-center gap-2 font-semibold text-synapse-ink hover:underline underline-offset-4'

/** A short painted label, then a plain heading. */
function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <>
      <p className="sign-label mb-3">{label}</p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ivory mb-6 text-balance">
        {title}
      </h2>
    </>
  )
}

export default function Home() {
  const posts = getAllPosts().slice(0, 3)
  const upcomingCourses = COURSES.filter((c) => c.status === 'coming-soon').length

  return (
    <>
      <JsonLd data={[personSchema(), ...organizationsSchema()]} />

      {/* ---------------- 1. THE SIGN ----------------
          No reveal animation anywhere on this page: everything paints on load,
          so crawlers, link previews and fast scrollers all see the same page. */}
      <section className="px-6 pt-32 sm:pt-36 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="sign-board px-6 py-7 sm:px-10 sm:py-10">
            <p className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase mb-5">
              Thabang means rejoice · Ubunye means unity
            </p>
            <h1 className="font-sign text-[2.4rem] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              AI systems{' '}
              <span className="text-[#c81e1e] whitespace-nowrap">built here.</span>
              <br />
              Open daily.
            </h1>
            <p className="mt-6 inline-block bg-sign-ink text-sign-board font-sign text-xs sm:text-base px-3 py-2 leading-snug">
              Soshanguve · Insurers · Telecoms · Schools · Family
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <p className="font-mono text-sm text-signal font-medium tracking-wide mb-3">
                {BIO.disciplines}
              </p>
              <p className="text-xl sm:text-2xl leading-snug text-ivory max-w-2xl">
                I build AI systems that work in the real world: production AI and data
                systems, the reusable infrastructure underneath them, and applied research
                grounded in real problems.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link href="/work" className="btn-sign">
                See the work
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/ai" className="btn-sign-outline">
                Talk to Thabang AI Assist
              </Link>
            </div>
          </div>

          <ul className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-4 border-ivory">
            {SERVICES.map((s, i) => (
              <li key={s.label} className={`border-ivory ${CELL_BORDERS[i]}`}>
                <Link href={s.href} className="block h-full p-5 hover:bg-surface-hover transition-colors">
                  <span className={`font-sign text-base block mb-2 ${s.tone}`}>{s.label}</span>
                  <span className="block text-[0.975rem] leading-snug text-ivory">{s.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- 2. SELECTED WORK ----------------
          Figures come from IMPACT_NUMBERS, which only holds what the public CV
          states. They are printed as they are, with no counting animation. */}
      <section className="py-20 px-6 border-t-4 border-ivory">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="The work" title="What the work delivered" />
          <p className="text-lg text-muted max-w-2xl mb-12">
            Production systems that survive noisy data, organisational constraints and
            real people using them.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {IMPACT_NUMBERS.map((item) => (
              <div key={item.label} className="glass p-5">
                <p className="font-sign text-3xl sm:text-4xl text-synapse leading-none mb-3">
                  {item.value}
                  {item.suffix}
                </p>
                <p className="font-semibold text-ivory leading-snug">{item.label}</p>
                <p className="text-sm text-muted mt-1">{item.context}</p>
              </div>
            ))}
          </div>

          <ol className="mt-14 border-t-4 border-ivory">
            {SELECTED.map((role) => (
              <li key={role.org} className="grid gap-2 md:grid-cols-[14rem_1fr] md:gap-8 py-6 border-b-2 border-border">
                <div>
                  <p className="font-sign text-base text-synapse-ink">{role.shortOrg}</p>
                  <p className="font-mono text-xs text-muted mt-1">{role.period}</p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ivory">
                    {role.role}, {role.org}
                  </h3>
                  <p className="mt-2 text-ivory/80 leading-relaxed">{role.highlight}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link href="/work" className={`mt-10 ${TEXT_LINK}`}>
            All work and projects
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ---------------- 3. UBUNYE ENGINE ----------------
          TODO(thabang): the six part Ubunye Engine series in content/blog is
          still `published: false`. When it goes live, link it here. */}
      <section className="py-20 px-6 border-t-4 border-ivory bg-surface-hover">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHead label="Open source" title="Ubunye Engine" />
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
            <div className="flex items-center gap-4 flex-wrap">
              <a href={UBUNYE.ghLink} target="_blank" rel="noopener noreferrer" className="btn-sign">
                <Github className="w-4 h-4" aria-hidden="true" />
                GitHub
              </a>
              <a href={UBUNYE.productLink} target="_blank" rel="noopener noreferrer" className="btn-sign-outline">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                Documentation
              </a>
            </div>
          </div>
          <div className="glass p-6 self-start">
            <p className="sign-label mb-3">Where it stands</p>
            <p className="text-ivory/85 leading-relaxed">{UBUNYE.impact}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {UBUNYE.skills.map((skill) => (
                <li key={skill} className="border-2 border-ivory px-3 py-1 text-sm font-mono text-ivory">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- 4. RESEARCH ---------------- */}
      <section className="py-20 px-6 border-t-4 border-ivory">
        <div className="mx-auto max-w-6xl">
          <SectionHead label="Research" title="The research feeds the systems, and the systems feed the research" />
          <p className="text-lg text-ivory/85 leading-relaxed mb-10 max-w-3xl">
            A year and a half as a machine learning research scientist at IBM Research, an
            MSc by dissertation at the University of the Witwatersrand, and published work
            in climate forecasting, occupational health and computer vision. The questions
            that interest me now come from problems I met in production.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass p-6">
              <p className="font-mono text-xs text-signal font-semibold tracking-wider uppercase mb-3">
                {MSC.period} · Completed
              </p>
              <h3 className="font-display text-lg font-bold text-ivory mb-3">
                <Link href="/research/echo-state-networks-level-set-segmentation" className="hover:text-synapse-ink transition-colors">
                  {MSC.role}
                </Link>
              </h3>
              <p className="text-sm text-ivory/75 leading-relaxed">{MSC.description}</p>
            </div>
            <div className="glass p-6">
              <p className="font-mono text-xs text-synapse-ink font-semibold tracking-wider uppercase mb-3">
                {PROPOSAL.period}
              </p>
              <h3 className="font-display text-lg font-bold text-ivory mb-3">{PROPOSAL.role}</h3>
              <p className="text-sm text-ivory/75 leading-relaxed">{PROPOSAL.description}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <Link href="/research" className={TEXT_LINK}>
              The research, line by line
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href="/publications" className={TEXT_LINK}>
              {PUBLICATIONS.length} publications
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 5. WRITING, TALKS AND TEACHING ---------------- */}
      <section className="py-20 px-6 border-t-4 border-ivory">
        <div className="mx-auto max-w-6xl grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          {posts.length > 0 && (
            <div>
              <SectionHead label="Writing" title="Notes from inside the build" />
              <p className="text-lg text-ivory/85 leading-relaxed mb-8">
                What the engineering actually costs, where the received wisdom fails, and
                what I would do differently. Every example comes from a system that exists.
              </p>
              <ul>
                {posts.map((post) => (
                  <li key={post.slug} className="border-t-2 border-ivory py-5">
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <p className="font-mono text-xs text-muted mb-2">
                        {formatDate(post.date)} · {post.readingTime}
                      </p>
                      <h3 className="font-display text-xl font-bold text-ivory group-hover:text-synapse-ink transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-muted leading-relaxed">{post.summary}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/blog" className={`mt-6 ${TEXT_LINK}`}>
                All writing
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="glass p-6 self-start">
            <SectionHead label="Talks and teaching" title="Explaining the work in public" />
            <p className="text-ivory/85 leading-relaxed mb-6">
              {TALKS.length} recorded talks, sessions and interviews on building with AI,
              and {upcomingCourses} practical courses in preparation, from working with AI
              agents without writing code through to production machine learning.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/talks" className={TEXT_LINK}>
                Talks and press
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/courses" className={TEXT_LINK}>
                Courses
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 6. ABOUT AND CONTACT ----------------
          A black board with yellow lettering: the night side of the sign at
          the top of the page. Same colours in both themes. */}
      <section className="py-20 px-6 border-t-4 border-ivory">
        <div className="mx-auto max-w-6xl">
          <div className="night-board bg-sign-ink text-sign-board border-4 border-sign-ink px-6 py-10 sm:px-12 sm:py-14">
            <p className="font-sign text-2xl sm:text-4xl leading-tight">
              Founder of Ubunye AI Ecosystems. From Soshanguve.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/85 max-w-3xl">
              Ubunye means unity in isiZulu, and it is the thread through everything I
              make. The same hands that build machine learning platforms for insurers and
              telecoms build websites for schools and small businesses back home. Serious
              engineering, shared with everyone.
            </p>
            <p className="mt-8 font-mono text-sm text-white/70">
              Vodacom · ABSA · IBM Research · Wits University
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={SOCIAL_LINKS.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 font-semibold bg-sign-board text-sign-ink border-[3px] border-sign-board transition-transform hover:translate-x-px hover:translate-y-px"
              >
                Book a conversation
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-sign-board border-[3px] border-sign-board hover:bg-white/10 transition-colors"
              >
                More about me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
