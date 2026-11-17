import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { profileOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { profilePageSchema, breadcrumbSchema } from '@/lib/schema'
import { LevelSetPlay } from '@/components/about/play/level-set'
import { SOCIAL_LINKS } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Thabang Mashinini-Sekgoto: a scientist at heart who goes towards hard problems and makes them simple. How he learned, what each place taught him, and what he does when nobody is paying.',
  alternates: { canonical: '/about' },
  openGraph: profileOpenGraph('/about'),
}

/**
 * The about page, rewritten on 2026-11-17 in Thabang's own words, when he asked
 * the site to stop trying to prove a point. It tells what each place taught
 * him, in order, with no figures: the numbers and dates live on /resume.
 * Do not name his current employer until he says so.
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


const LINKCLS = 'inline-flex items-center gap-1.5 font-semibold text-synapse-ink underline underline-offset-4 hover:no-underline'

/** What each place taught him, oldest first. His words, set on 2026-11-17. */
const PLACES: { place: string; text: string[] }[] = [
  {
    place: 'My Honours and Masters at Wits',
    text: [
      'I finished Honours without really knowing how to program. My Masters changed that. I chose my own topic: how do you teach a computer to understand how a shape moves? It meant teaching a machine to see and to understand time, all at once. It pulled in the mathematics of change (differential equations), computer vision, and the memory networks of the time (LSTMs and GRUs). This was before transformers. I built everything from scratch, with nothing but basic NumPy. That is where I learned to think like a programmer, and to think in systems.',
    ],
  },
  {
    place: 'CSIR',
    text: [
      'I arrived as a vacation student and left knowing what data science was for. We used data to help municipalities understand youth unemployment and service delivery: what drives it, what to look for, what to fix. That is when I saw that numbers and algorithms can help people directly.',
    ],
  },
  {
    place: 'Wits',
    text: [
      'In the university’s planning office I used data to show faculties where students needed support. I learned that when more students pass, the university earns more subsidy, so helping one struggling student helps everyone. It was the first time something I built touched a whole university. I also trained vacation students and institutional researchers in AI and machine learning, and found out how much I love explaining things.',
    ],
  },
  {
    place: 'IBM Research',
    text: [
      'I worked with scientists in the USA, Brazil, China and Japan, on petabytes of satellite and climate data: mixing images with tables, and classic models with neural networks. I watched a research idea become a paper, then become part of IBM PAIRS, a platform that lets anyone ask questions of data tied to a place and a time (satellites, weather, sensors). Insurers and food security teams around the world used it. When COVID hit, I helped build the Gauteng risk dashboard the health department planned with. That is where I learned how everything connects.',
    ],
  },
  {
    place: 'Vodacom',
    text: [
      'Here I learned that a cell tower is not just a tower. Each one has a profile: the customers it serves, the money it makes, whether it needs backup power, and who depends on it, from families to hospitals to banks. The data arrived live and noisy, with no answer key, so ordinary machine learning was not enough. I needed filters and probability to measure the uncertainty, mathematical optimisation, and streaming systems I built myself (Kafka and PyFlink) to join live feeds with the data we already had.',
      'At the same time I led more than ten graduates: giving them the right work, teaching them machine learning and software, and helping them present their ideas. No leadership course. I learned it on the job.',
    ],
  },
  {
    place: 'Absa',
    text: [
      'I arrived knowing how to lead and how to engineer, and saw that the biggest gap was not data science. It was how the team worked. So first came the habits: write things down so knowledge does not live in one person’s head, plan in the open, check progress. Then the engineering underneath: automated tests, code reviews, shared standards for building and running models, and pipelines that check the work every time it changes. Ubunye Engine, which grew out of my own research, became the base all of it ran on. I trained and onboarded the team until everyone worked that way.',
      'The hardest lesson there was not technical. It was people: difficult conversations, resistance to change, and politics.',
    ],
  },
]

function Section({ id, label, children }: { id?: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 sm:mt-20 scroll-mt-28">
      <h2 className="font-mono text-sm text-synapse-ink tracking-widest uppercase mb-5">{label}</h2>
      <div className="space-y-5 text-lg text-ivory/85 leading-relaxed">{children}</div>
    </section>
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
              'Thabang Mashinini-Sekgoto: a scientist at heart who goes towards hard problems and makes them simple.',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <div className="mx-auto max-w-2xl">
        <header>
          <p className="font-mono text-sm text-muted mb-4">About</p>
          <div className="sign-board px-6 py-7 sm:px-8 sm:py-8">
            <h1 className="font-sign uppercase text-[1.9rem] leading-[1.05] sm:text-5xl text-balance">
              I&apos;ve always wanted to be a scientist.
            </h1>
          </div>
          <p className="mt-10 text-lg sm:text-xl text-ivory/90 leading-relaxed">
            I go towards the hardest problem in the room. I work it out. Then I make it simple enough for
            anyone to use. That&apos;s most of who I am.
          </p>
        </header>

        <Section id="learned" label="How I learned">
          <p>
            I studied physics, chemistry, astronomy, and pure and applied mathematics, then found my way into
            data, machine learning and big computers. My degrees are from Wits. Most of what I know, I taught
            myself. I believe anyone can learn anything if they want to.
          </p>
        </Section>

        <Section id="places" label="What each place taught me">
          <dl className="divide-y-2 divide-border border-y-2 border-border">
            {PLACES.map((p) => (
              <div key={p.place} className="py-6">
                <dt className="font-display text-xl font-bold text-ivory mb-3">{p.place}</dt>
                <dd className="space-y-4">
                  {p.text.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
                  {p.place.startsWith('My Honours') && <LevelSetPlay />}
                </dd>
              </div>
            ))}
          </dl>
          <p>
            Through all of it, one habit has stayed with me since the CSIR: sit with the people who have the
            problem, understand what they really need, and solve it as well as I can. Nobody handed me a
            programme for any of this. I taught myself as I went.
          </p>
        </Section>

        <Section id="explain" label="Why I explain things">
          <p>
            I don&apos;t talk much. I&apos;d rather do the thing. But when I understand something difficult, I
            want to share it, simply enough that even my own mother could follow it. Seeing someone understand an
            idea and realise what it could mean for their life is my favourite part of the work. That is what my{' '}
            <Link href="/blog" className={LINKCLS}>writing</Link> and{' '}
            <Link href="/talks" className={LINKCLS}>talks</Link> are for.
          </p>
        </Section>

        <Section id="outside" label="When nobody is paying">
          <p>
            On weekends I build engines for fun: data, maps, whatever question has caught me. What I can share,
            I release through{' '}
            <a href={UBUNYE} target="_blank" rel="noopener noreferrer" className={LINKCLS}>Ubunye AI Ecosystems</a>,
            the open source lab I started.
          </p>
          <p>
            Outside of that I take photos of buildings, people, clouds and anything unfamiliar. And I watch a lot
            of anime, then think too hard about what it says about real life.
          </p>
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
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={LINKCLS}>
              More of my photographs
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </p>
        </Section>

        <section className="mt-24 border-t-2 border-border pt-10">
          <p className="text-xl sm:text-2xl leading-relaxed text-ivory">
            Got a difficult question?{' '}
            <a href={`mailto:${SOCIAL_LINKS.email}`} className="inline-block bg-[#ffd23f] px-2 font-semibold text-[#111111] hover:underline">
              Email me.
            </a>
          </p>
          <p className="mt-4 text-muted">
            The dates and details are on my <Link href="/resume" className={LINKCLS}>CV</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
