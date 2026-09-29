import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/json-ld'
import { webPageSchema, breadcrumbSchema } from '@/lib/schema'
import { pageOpenGraph } from '@/lib/site'
import Link from 'next/link'
import { BIO } from '@/lib/data'

/**
 * A /now page: what Thabang is working on at the moment.
 *
 * Rewritten 2026-09-29. The courses list, the latest posts (already on the
 * homepage) and the emoji hobby list came off. What stays is hand written and
 * dated, because a now page without a date cannot say when "now" was.
 * Update LAST_UPDATED whenever the text changes.
 */
const LAST_UPDATED = '2026-09-29'

const BUILDING = [
  {
    name: 'Ubunye Engine',
    href: '/work/ubunye-engine',
    line: 'Proving that the same pipeline runs unchanged on a laptop and on the big clouds, on real data, not demos.',
  },
  {
    name: 'Kasilam Digital Platforms',
    href: 'https://kasilamdigitialplatforms.vercel.app',
    line: 'Websites and digital tools for township businesses, and teaching people to build them themselves.',
  },
]

export const metadata: Metadata = {
  title: 'Now: What I’m Working On',
  description:
    'What Thabang Mashinini-Sekgoto is working on right now: current role, research, projects being built, and what is being taught.',
  alternates: { canonical: '/now' },
  openGraph: pageOpenGraph('/now', 'What Thabang Mashinini-Sekgoto is working on now'),
}

export default function NowPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">

    <JsonLd

      data={[

        webPageSchema({ path: '/now', name: 'Now', description: 'What Thabang Mashinini-Sekgoto is working on right now.' }),

        breadcrumbSchema([

          { name: 'Home', path: '/' },

          { name: 'Now', path: '/now' },

        ]),

      ]}

    />
      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ivory">
        Now
      </h1>
      <p className="mt-4 text-lg text-ivory/85 leading-relaxed">
        A snapshot of what has my attention. If you want the whole picture, the{' '}
        <Link href="/work" className="text-synapse underline underline-offset-2 hover:no-underline">
          work
        </Link>{' '}
        and{' '}
        <Link href="/research" className="text-synapse underline underline-offset-2 hover:no-underline">
          research
        </Link>{' '}
        pages go deeper.
      </p>
      <p className="mt-3 font-mono text-sm text-muted">
        Last updated <time dateTime={LAST_UPDATED}>29 September 2026</time>
      </p>

      {/* Day job */}
      <div className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-ivory">The day job</h2>
        <p className="mt-3 text-muted leading-relaxed">
          {BIO.title}. Based in {BIO.location}.
        </p>
      </div>

      {/* Research */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ivory">Research</h2>
        <p className="mt-3 text-muted leading-relaxed">
          A doctoral research proposal is in preparation at the University of the
          Witwatersrand, building on the MSc work on learning the level set method
          with echo state networks for image segmentation. It is at proposal stage
          and not yet registered. The published papers are on the{' '}
          <Link href="/research#papers" className="text-synapse underline underline-offset-2 hover:no-underline">
            research
          </Link>{' '}
          page.
        </p>
      </div>

      {/* Building */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ivory">Building</h2>
        <ul className="mt-4 space-y-5">
          {BUILDING.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="font-medium text-ivory underline-offset-2 hover:text-synapse hover:underline">
                {item.name}
              </Link>
              <p className="mt-1 text-muted text-[0.9375rem] leading-relaxed">{item.line}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Away from the screen, in his words from the about page. */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ivory">
          Away from the screen
        </h2>
        <p className="mt-3 text-muted leading-relaxed">
          Learning to rest. Sleeping, travelling, taking photographs, watching anime,
          spending time with people. Occasionally doing nothing at all.
        </p>
      </div>

      <p className="mt-16 border-t border-border pt-8 text-muted">
        Want to work together?{' '}
        <Link href="/ai" className="text-synapse underline underline-offset-2 hover:no-underline">
          Ask LeparaLaMapara
        </Link>{' '}
        or reach out from there.
      </p>
    </section>
  )
}
