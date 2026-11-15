import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { profileOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { profilePageSchema, breadcrumbSchema } from '@/lib/schema'
import { RouteChain } from '@/components/about/play/route-chain'
import { LevelSetPlay } from '@/components/about/play/level-set'
import { RepoRoute } from '@/components/about/play/repo-route'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Thabang Mashinini-Sekgoto: data scientist and AI engineer, founder of Ubunye AI Ecosystems. What he values, what he builds, and what he researches.',
  alternates: { canonical: '/about' },
  openGraph: profileOpenGraph('/about'),
}

/**
 * The about page, made strictly professional on 2026-11-15 at Thabang's
 * request: who he is, what he values, what he builds, his research, his
 * interests, and how he works. No family stories or personal asides; those
 * belong in his writing, not here. Employers, figures and dates live on /work
 * and /resume. His title for Ubunye AI Ecosystems is Founder.
 */

const UBUNYE = 'https://uaie.vercel.app'
const INSTAGRAM = 'https://www.instagram.com/thabanglukhetho/'

/** A few of his own photographs, from the ThabangVision tiles in /public/vision. */
const PHOTOS = [
  { n: '01', alt: 'Clouds and land seen from a plane window' },
  { n: '05', alt: 'The Union Buildings under a deep blue sky' },
  { n: '07', alt: 'Johannesburg against an orange sunset' },
  { n: '13', alt: 'A tower block with yellow balconies' },
  { n: '15', alt: 'A white lighthouse under clouds' },
  { n: '21', alt: 'Curved black arches against a white sky' },
  { n: '31', alt: 'Green hills in the Drakensberg' },
  { n: '34', alt: 'An empty city street with a white centre line' },
  { n: '36', alt: 'A silhouette on a wall against bright yellow' },
  { n: '38', alt: 'A road at golden hour' },
  { n: '42', alt: 'A palm tree under a stormy sky' },
  { n: '46', alt: 'The Wits Great Hall in the snow' },
]

const VALUES = [
  {
    title: 'Access',
    text: 'Knowledge, technology and opportunity are not spread evenly, and most of the gap is not talent. I work on whether software, data and AI can give more people a comparable starting point.',
  },
  {
    title: 'Evidence over claims',
    text: 'A model in a notebook is not impact. What matters is whether people can reach it, whether it scales and survives real data, and whether it improves a decision. I define the test before I see the result.',
  },
  {
    title: 'Clarity',
    text: 'If an idea cannot be explained plainly to someone outside the field, it is not yet understood well enough. I teach, write and give talks so that others can use what I build.',
  },
  {
    title: 'Build, then share',
    text: 'I build systems to understand them, then release what I can as open source so the next team starts further ahead.',
  },
]

const BUILDS = [
  {
    title: 'Ubunye AI Ecosystems',
    href: UBUNYE,
    external: true,
    text: 'An open source research lab I founded. We build software, data platforms and AI for businesses, government and creatives, and we release the tools we make. Ubunye Engine, our data engine, runs the same work identically on a laptop or any cloud and powers production work at a large financial services company. TFiltersPy recovers the real signal from noisy measurements.',
  },
  {
    title: 'Kasilam Digital Platforms',
    href: '/work',
    external: false,
    text: 'A community programme that gets township businesses online. We teach owners to build their own websites with AI tools, ready-made templates, talks and hands-on training.',
  },
]

const QUESTIONS = [
  'How much of what once needed a large institution can a small team, or one person, now build with open source and cheap compute?',
  'What does AI mean when your main computer is a phone and data costs real money?',
  'What can free satellite data tell Africa about where to farm, build, insure and plan? It is the direction of the PhD I plan to begin at Wits in 2027; the proposal is still in preparation.',
  'Is the current way of framing intelligence the only useful one? I am curious whether African collective philosophies, ubuntu and ubunye especially, have anything to say about how agents could coordinate. This is a question I am exploring, not a claim I can defend.',
]

const OUTSIDE = [
  {
    title: 'Photography and film',
    text: 'Street, architecture, landscape and documentary photography, and short films. Cameras are where optics, electronics and computation meet.',
  },
  {
    title: 'Hardware',
    text: 'GPUs, local compute, networking, electronics, sensors and embedded systems: the layer where software meets physics.',
  },
  {
    title: 'Sport',
    text: 'Muay Thai, running and cycling.',
  },
]

const ROUTES = [
  { ask: 'Want the professional version?', label: 'Work and CV', href: '/work', also: { label: 'CV', href: '/resume' } },
  { ask: 'Interested in the questions?', label: 'Research', href: '/research' },
  { ask: 'Want the lab?', label: 'Ubunye AI Ecosystems', href: UBUNYE, external: true },
  { ask: 'Want the opinionated version?', label: 'Writing', href: '/blog' },
  { ask: 'Want tutorials and conversations?', label: 'Talks', href: '/talks' },
  { ask: 'Want cameras and stories?', label: 'Photography', href: INSTAGRAM, external: true },
]

function Section({ id, label, title, children }: { id?: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 sm:mt-20 scroll-mt-28">
      <p className="font-mono text-sm text-synapse tracking-widest uppercase mb-3">{label}</p>
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ivory mb-6 text-balance">{title}</h2>
      <div className="space-y-5 text-lg text-ivory/85 leading-relaxed">{children}</div>
    </section>
  )
}

function Items({ items }: { items: { title: string; text: string }[] }) {
  return (
    <dl className="divide-y-2 divide-border border-y-2 border-border">
      {items.map((it) => (
        <div key={it.title} className="py-5">
          <dt className="font-display text-xl font-bold text-ivory mb-2">{it.title}</dt>
          <dd className="text-lg text-ivory/85 leading-relaxed">{it.text}</dd>
        </div>
      ))}
    </dl>
  )
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="about-pull my-12 border-l-[6px] border-synapse pl-6 font-display text-2xl sm:text-3xl font-bold leading-snug text-ivory text-balance">
      <span className="about-marker">{children}</span>
    </blockquote>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-24 md:py-32">
      <JsonLd
        data={[
          profilePageSchema({
            path: '/about',
            name: 'About Thabang Mashinini-Sekgoto',
            description:
              'Thabang Mashinini-Sekgoto, data scientist, AI engineer and founder of Ubunye AI Ecosystems: what he values, what he builds, and what he researches.',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <div className="mx-auto max-w-2xl">
        {/* 1. Who I am */}
        <header>
          <p className="font-mono text-sm text-synapse tracking-widest uppercase mb-4">Who I am</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ivory mb-8">About</h1>
          <div className="space-y-5 text-lg text-ivory/85 leading-relaxed">
            <p>
              I&apos;m Thabang Mashinini-Sekgoto, a data scientist and AI engineer from Soshanguve,
              South Africa, and the founder of{' '}
              <a href={UBUNYE} target="_blank" rel="noopener noreferrer" className="font-semibold text-synapse-ink underline underline-offset-4 hover:no-underline">
                Ubunye AI Ecosystems
              </a>
              , an open source research lab.
            </p>
            <p>
              For nine years I have built and run data and AI systems in banking, telecommunications,
              applied research and higher education. My focus is getting data science out of
              experiments and into systems that run reliably, across data science, AI engineering,
              applied research and open source infrastructure.
            </p>
          </div>
        </header>

        {/* 2. What I value */}
        <Section id="values" label="What I value" title="Four things I hold to.">
          <Items items={VALUES} />
          <RouteChain
            label="The thread through all of it"
            steps={['understand how it works', 'take it apart', 'build my own version', 'share it']}
          />
        </Section>

        <PullQuote>Capability should not belong only to people who already have resources.</PullQuote>

        {/* 3. What I build */}
        <Section id="builds" label="What I build" title="Laboratories for those questions.">
          <Items items={BUILDS} />
          <p>
            <a href={UBUNYE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-synapse-ink underline underline-offset-4 hover:no-underline">
              Everything the lab works on, and where each piece stands
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </p>
          <RepoRoute />
        </Section>

        {/* 4. Research */}
        <Section id="research" label="Research" title="The questions I work on.">
          <p>
            I have studied and worked across mathematics, physics, machine
            learning, computer vision, distributed computing, large production systems. Most of them
            live inside universities, laboratories and big companies. My research asks what they make
            possible where resources are scarce.
          </p>
          <ul className="list-none space-y-3 border-l-2 border-border pl-5">
            {QUESTIONS.map((q) => <li key={q}>{q}</li>)}
          </ul>
          <RouteChain label="The full path I care about" steps={['idea', 'model', 'system', 'user', 'impact']} />
          <LevelSetPlay />
        </Section>

        {/* 5. Outside work */}
        <Section id="outside" label="Interests" title="Outside the day job.">
          <Items items={OUTSIDE} />
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="about-photos contact-sheet group mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2"
            aria-label="See my photography on Instagram"
          >
            {PHOTOS.map((p) => (
              <span key={p.n} className="contact-frame relative aspect-square overflow-hidden border-2 border-ivory">
                <Image src={`/vision/v${p.n}.jpg`} alt={p.alt} fill sizes="120px" className="object-cover" />
              </span>
            ))}
          </a>
          <p>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-synapse-ink underline underline-offset-4 hover:no-underline">
              More of my photographs on Instagram
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </p>
        </Section>

        {/* 6. How I work */}
        <Section id="how" label="How I work" title="Build the team, then trust it.">
          <p>
            I build teams and systems that can run without me: clear goals, trust, and room for
            people to do their best work. I collaborate widely, especially with people who know things
            I do not, and I prefer useful work over process for its own sake.
          </p>
        </Section>

        {/* 7. Routes deeper into the site */}
        <nav aria-label="Where to go next" className="mt-20 border-t-2 border-border pt-10">
          <ul className="grid gap-3 sm:grid-cols-2">
            {ROUTES.map((r) => (
              <li key={r.ask} className="about-route border-2 border-border p-4">
                <p className="text-sm text-muted mb-1">{r.ask}</p>
                {r.external ? (
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-display font-bold text-ivory hover:text-synapse-ink">
                    {r.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : r.also ? (
                  <span className="inline-flex flex-wrap items-center gap-x-4 font-display font-bold text-ivory">
                    <Link href={r.href} className="inline-flex items-center gap-1.5 hover:text-synapse-ink">
                      Work <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link href={r.also.href} className="inline-flex items-center gap-1.5 hover:text-synapse-ink">
                      {r.also.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </span>
                ) : (
                  <Link href={r.href} className="inline-flex items-center gap-1.5 font-display font-bold text-ivory hover:text-synapse-ink">
                    {r.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
