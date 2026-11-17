import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { personSchema, organizationsSchema } from '@/lib/schema'
import { getAllPosts } from '@/lib/blog'
import { SOCIAL_LINKS } from '@/lib/data'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

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
 */
const QUESTIONS: { question: string; answer: string; href: string }[] = [
  {
    question: 'Can a learner with a cheap phone get the help a private school gives?',
    answer: 'Sekhoto · free school help, Grade R to 12',
    href: 'https://sekhotomultiversity.com',
  },
  {
    question: 'Why rewrite a data pipeline for every machine it runs on?',
    answer: 'Ubunye Engine · open source',
    href: '/work/ubunye-engine',
  },
  {
    question: 'What is my municipality actually doing?',
    answer: 'Masepala · plain facts on every ward',
    href: 'https://masepala.vercel.app',
  },
  {
    question: 'Can we see a flood from space, through the clouds?',
    answer: 'Flood mapping · satellite radar',
    href: 'https://github.com/ubunye-ai-ecosystems/flood-extent-mapping',
  },
]

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
          <p className="font-mono text-sm text-muted mb-4">Thabang Mashinini-Sekgoto · Soshanguve</p>
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
            <ul>
              {QUESTIONS.map((q) => (
                <Row key={q.href} title={q.question} sub={q.answer} href={q.href} />
              ))}
            </ul>
            <Link href="/work" className={`mt-5 ${LINK}`}>
              Everything I&apos;ve built
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
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
