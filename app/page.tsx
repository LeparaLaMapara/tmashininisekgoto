import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { personSchema, organizationsSchema } from '@/lib/schema'
import { getAllPosts } from '@/lib/blog'
import { SOCIAL_LINKS } from '@/lib/data'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { DestinationBoard, LiveryStripes } from '@/components/home/taxi-route'
import { LevelSetPlay } from '@/components/about/play/level-set'

// Title and description come from the root layout's defaults; this only pins the
// canonical so the homepage points at itself rather than inheriting anything.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: pageOpenGraph('/', 'Thabang Mashinini-Sekgoto: hard problems, made simple'),
}

/**
 * The homepage, rewritten on 2026-11-17 when Thabang asked the site to stop
 * trying to prove a point. One sign, two lines about who he is, the questions
 * he is working on, the latest writing, and an invitation. No figures here:
 * the numbers live on the CV, where someone who wants them will look.
 *
 * 2026-11-18: he found it too boring. Life came back without proof: the amber
 * board rolls through what he is curious about, each question is its own
 * painted board in a livery colour, his MSc is playable here, and a strip of
 * his own photographs closes the page.
 */
const QUESTIONS: { question: string; answer: string; href: string; color: string }[] = [
  {
    question: 'Can a learner with a cheap phone get the help a private school gives?',
    answer: 'Sekhoto · free school help, Grade R to 12',
    href: 'https://sekhotomultiversity.com',
    color: '#e03a1e',
  },
  {
    question: 'Why rewrite a data pipeline for every machine it runs on?',
    answer: 'Ubunye Engine · open source',
    href: '/work/ubunye-engine',
    color: '#1d6fd1',
  },
  {
    question: 'What is my municipality actually doing?',
    answer: 'Masepala · plain facts on every ward',
    href: 'https://masepala.vercel.app',
    color: '#1b7f3b',
  },
  {
    question: 'Can we see a flood from space, through the clouds?',
    answer: 'Flood mapping · satellite radar',
    href: 'https://github.com/ubunye-ai-ecosystems/flood-extent-mapping',
    color: '#f2b705',
  },
]

/** A few of his own photographs, from /public/vision. */
const PHOTOS = [
  { n: '07', alt: 'Johannesburg against an orange sunset' },
  { n: '01', alt: 'Clouds and land seen from a plane window' },
  { n: '13', alt: 'A tower block with yellow balconies' },
  { n: '36', alt: 'A silhouette on a wall against bright yellow' },
  { n: '21', alt: 'Curved black arches against a white sky' },
  { n: '46', alt: 'The Wits Great Hall in the snow' },
]

/** A question as its own painted board: a thick livery-coloured edge and a hard shadow. */
function QuestionBoard({ question, answer, href, color }: (typeof QUESTIONS)[number]) {
  const external = href.startsWith('http')
  const cls =
    'group flex h-full flex-col justify-between gap-4 border-2 border-ivory/80 bg-surface p-5 shadow-[6px_6px_0_var(--color-ivory)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5'
  const inner = (
    <>
      <span className="block h-2 -mx-5 -mt-5 mb-1" style={{ background: color }} aria-hidden="true" />
      <span className="font-display text-lg sm:text-xl font-semibold leading-snug text-ivory text-balance">{question}</span>
      <span className="flex items-center justify-between gap-3 text-sm text-muted">
        {answer}
        {external ? (
          <ArrowUpRight className="w-5 h-5 shrink-0 text-synapse-ink" aria-hidden="true" />
        ) : (
          <ArrowRight className="w-5 h-5 shrink-0 text-synapse-ink" aria-hidden="true" />
        )}
      </span>
    </>
  )
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  )
}

const LINK = 'inline-flex items-center gap-2 font-semibold text-synapse-ink hover:underline underline-offset-4'

function Label({ children }: { children: React.ReactNode }) {
  return <h2 className="font-mono text-sm uppercase tracking-widest text-synapse-ink mb-4">{children}</h2>
}

function Row({ title, sub, href }: { title: string; sub: string; href: string }) {
  const external = href.startsWith('http')
  const inner = (
    <>
      <span>
        <span className="block font-display text-xl font-semibold text-ivory group-hover:text-synapse-ink transition-colors">
          {title}
        </span>
        <span className="block mt-1 text-sm text-muted">{sub}</span>
      </span>
      {external ? (
        <ArrowUpRight className="w-5 h-5 shrink-0 text-synapse-ink" aria-hidden="true" />
      ) : (
        <ArrowRight className="w-5 h-5 shrink-0 text-synapse-ink" aria-hidden="true" />
      )}
    </>
  )
  const cls = 'group flex items-center justify-between gap-6 py-5'
  return (
    <li className="border-t-2 border-border last:border-b-2">
      {external ? (
        <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{inner}</a>
      ) : (
        <Link href={href} className={cls}>{inner}</Link>
      )}
    </li>
  )
}

export default function Home() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <>
      <JsonLd data={[personSchema(), ...organizationsSchema()]} />

      {/* No reveal animation anywhere on this page: everything paints on load,
          so crawlers, link previews and fast scrollers all see the same page. */}
      <div className="px-6 pt-32 sm:pt-40 pb-24">
        <div className="mx-auto max-w-3xl">
          <DestinationBoard />
          <div className="my-8 -mx-6 sm:mx-0">
            <LiveryStripes />
          </div>
          <p className="font-mono text-sm text-muted mb-4">Thabang Mashinini-Sekgoto</p>
          <div className="sign-board px-6 py-7 sm:px-8 sm:py-8">
            <h1 className="font-sign uppercase text-[1.9rem] leading-[1.05] sm:text-5xl text-balance">
              Give me the hardest problem. I&apos;ll make it simple.
            </h1>
          </div>

          <div className="mt-10 space-y-4 text-lg sm:text-xl leading-relaxed text-ivory/90">
            <p>
              I&apos;ve always wanted to be a scientist. I go towards difficult things, work them out, and then
              explain them so anyone can use them.
            </p>
            <p>I build because I enjoy building. I write because I love the moment someone understands.</p>
          </div>

          <section className="mt-20">
            <Label>Questions I&apos;m working on</Label>
            <ul className="grid gap-6 sm:grid-cols-2">
              {QUESTIONS.map((q) => (
                <li key={q.href}>
                  <QuestionBoard {...q} />
                </li>
              ))}
            </ul>
            <Link href="/work" className={`mt-8 ${LINK}`}>
              Everything I&apos;ve built
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>

          <section className="mt-20">
            <Label>Try one</Label>
            <p className="mb-5 text-lg text-ivory/85 leading-relaxed">
              My Masters asked how you teach a computer to understand how a shape moves. Here is the idea, running
              on my own photographs.
            </p>
            <LevelSetPlay />
          </section>

          {posts.length > 0 && (
            <section className="mt-20">
              <Label>Made simple</Label>
              <ul>
                {posts.map((post) => (
                  <Row key={post.slug} title={post.title} sub={post.readingTime} href={`/blog/${post.slug}`} />
                ))}
              </ul>
              <Link href="/blog" className={`mt-5 ${LINK}`}>
                All writing
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </section>
          )}

          <section className="mt-20">
            <Label>What I see</Label>
            <Link href="/about#outside" className="contact-sheet grid grid-cols-3 sm:grid-cols-6 gap-2" aria-label="More about me and my photographs">
              {PHOTOS.map((p) => (
                <span key={p.n} className="contact-frame relative aspect-square overflow-hidden border-2 border-ivory">
                  <Image src={`/vision/v${p.n}.jpg`} alt={p.alt} fill sizes="(min-width: 640px) 120px, 33vw" className="object-cover" />
                </span>
              ))}
            </Link>
          </section>

          <section className="mt-24 border-t-2 border-border pt-10">
            <p className="text-xl sm:text-2xl leading-relaxed text-ivory">
              Got a difficult question?{' '}
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="inline-block bg-[#ffd23f] px-2 font-semibold text-[#111111] hover:underline">
                Email me.
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
