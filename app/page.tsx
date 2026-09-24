import type { Metadata } from 'next'
import { pageOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { personSchema, organizationsSchema } from '@/lib/schema'
import { getAllPosts } from '@/lib/blog'
import { SOCIAL_LINKS } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DestinationBoard, LiveryStripes } from '@/components/home/taxi-route'
import { ShortVersion } from '@/components/home/short-version'

// Title and description come from the root layout's defaults; this only pins the
// canonical so the homepage points at itself rather than inheriting anything.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: pageOpenGraph('/', 'Thabang Mashinini-Sekgoto, applied AI, data science and AI engineering'),
}

/**
 * The homepage, rewritten on 2026-09-24 in Thabang's own words.
 *
 * It says who he is and what he is curious about, and stops there. It does not
 * argue a case: the figures, the roles and the career route moved to the CV
 * (components/resume/the-record.tsx), and research, talks and Ubunye Engine each
 * have their own pages. Keep it short. If a section starts to prove something,
 * it belongs somewhere else.
 */
const BUILDING = [
  {
    name: 'Kasilam Digital Platforms',
    href: 'https://kasilamdigitialplatforms.vercel.app',
    text: 'I teach people how to digitise their lives, and I build websites for township businesses for free. I do it because I enjoy it, and because I believe everyone in my community deserves the same access to information. I learn more there than almost anywhere else.',
  },
  {
    name: 'Ubunye AI Ecosystems',
    href: 'https://uaie.vercel.app',
    text: 'Open source tools for people with small budgets and big problems: people in townships, people without the luxuries big corporations have had for decades. We can build our own things now instead of only consuming what others made. Take the best from out there, then build from scratch.',
  },
  {
    name: 'A research engine',
    text: 'Honestly, I am a bit lazy, especially now that agents exist. So I am building an engine that takes research from an idea to an experiment to a paper to a finished product, and I just check its work. It also tells me when I am wrong, which is humbling.',
  },
  {
    name: 'A trading bot',
    text: 'I wanted to know whether the people who say they make money trading are telling the truth or telling a joke. So far it is humbling me, and teaching me a lot.',
  },
]

const LINK = 'inline-flex items-center gap-2 font-semibold text-synapse-ink hover:underline underline-offset-4'

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ivory mb-5">{children}</h2>
}

export default function Home() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <>
      <JsonLd data={[personSchema(), ...organizationsSchema()]} />

      {/* No reveal animation anywhere on this page: everything paints on load,
          so crawlers, link previews and fast scrollers all see the same page. */}
      <div className="px-6 pt-32 sm:pt-36 pb-24">
        <div className="mx-auto max-w-3xl">
          <DestinationBoard />
          <div className="my-8 -mx-6 sm:mx-0">
            <LiveryStripes />
          </div>
          <p className="font-mono text-sm text-muted mb-4">Thabang Mashinini-Sekgoto · Soshanguve</p>
          <div className="sign-board px-6 py-7 sm:px-8 sm:py-8">
            <h1 className="font-sign uppercase text-[1.9rem] leading-[1] sm:text-5xl text-balance">
              I build things, try them, see what breaks, and share what I find.
            </h1>
          </div>

          <div className="mt-10 space-y-5 text-lg sm:text-xl leading-relaxed text-ivory/90">
            <p>
              I am a data scientist from Soshanguve. The question I keep coming back to is
              simple: what does science mean where I come from?
            </p>
            <p>
              What does distributed computing mean to someone who wants to start a farm but
              has no capital? What is a directed acyclic graph in a township? Why do the
              problems here look the way they do, and who gets to solve them? That is the
              part I find most interesting.
            </p>
          </div>

          <ShortVersion />

          <section className="mt-16">
            <Heading>What I am building</Heading>
            <ul className="space-y-8">
              {BUILDING.map((b) => (
                <li key={b.name}>
                  <h3 className="font-display text-xl font-bold text-ivory mb-2">
                    {b.href ? (
                      <a href={b.href} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                        {b.name}
                      </a>
                    ) : (
                      b.name
                    )}
                  </h3>
                  <p className="text-lg leading-relaxed text-ivory/85">{b.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-lg leading-relaxed text-ivory/85">
              And I learn things for no reason at all. That is its own category.
            </p>
          </section>

          <section className="mt-16">
            <Heading>How I like to work</Heading>
            <p className="text-lg leading-relaxed text-ivory/85">
              I like sharing, teaching, building capability in people and working alongside
              them. I do not micromanage; I hate it. Meetings are my least favourite part of
              any job, but I show up when they matter.
            </p>
          </section>

          <section className="mt-16">
            <Heading>Outside the work</Heading>
            <div className="space-y-5 text-lg leading-relaxed text-ivory/85">
              <p>
                Photography is where my heart is. Cameras, drones, GoPros, film, music
                production, that whole creative world. I love travelling and documenting what
                I see: streets, architecture, landscapes, people.
              </p>
              <p>
                I grew up on Naruto, Dragon Ball Z and One Punch Man. I am deep into agentic
                AI and follow the people building it. And lately I am learning to enjoy rest.
              </p>
            </div>
          </section>

          {posts.length > 0 && (
            <section className="mt-16">
              <Heading>Latest writing</Heading>
              <ul>
                {posts.map((post) => (
                  <li key={post.slug} className="border-t-2 border-border py-5">
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <p className="font-mono text-xs text-muted mb-2">
                        {formatDate(post.date)} · {post.readingTime}
                      </p>
                      <h3 className="font-display text-xl font-bold text-ivory group-hover:text-synapse-ink transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/blog" className={`mt-4 ${LINK}`}>
                All writing
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </section>
          )}

          <section className="mt-16 border-t-2 border-border pt-8">
            <p className="text-lg leading-relaxed text-ivory/85">
              Say hello at{' '}
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="font-semibold underline underline-offset-4">
                {SOCIAL_LINKS.email}
              </a>
              . The longer story is on the{' '}
              <Link href="/about" className="font-semibold underline underline-offset-4">about page</Link>, the work is
              under <Link href="/work" className="font-semibold underline underline-offset-4">work</Link>, and the
              career detail is on my <Link href="/resume" className="font-semibold underline underline-offset-4">CV</Link>.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
