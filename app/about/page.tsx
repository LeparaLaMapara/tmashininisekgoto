import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { PERSONAL_PHOTOS } from '@/lib/data'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { profileOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { profilePageSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Thabang Mashinini-Sekgoto, from Soshanguve. A curious person who would rather build a thing than use one, is interested in what intelligence actually is and in technology as an equaliser, and teaches whenever he can.',
  alternates: { canonical: '/about' },
  openGraph: profileOpenGraph('/about'),
}

/** A titled block of prose. The page is mostly this, on purpose. */
function Section({
  title,
  children,
  delay = 0,
}: {
  title: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <ScrollReveal delay={delay}>
      <section className="mt-16 sm:mt-20">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ivory mb-5">
          {title}
        </h2>
        <div className="space-y-5 text-lg text-ivory/85 leading-relaxed">{children}</div>
      </section>
    </ScrollReveal>
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
              'Who Thabang Mashinini-Sekgoto is: where he is from, what he is curious about, what he researches, and why he teaches.',
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <div className="mx-auto max-w-2xl">
        {/* Opening */}
        <header>
          <p className="font-mono text-sm text-synapse tracking-widest uppercase mb-4">
            Who I am
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ivory mb-8">
            About
          </h1>
          <div className="space-y-5 text-lg text-ivory/85 leading-relaxed">
            <p>
              I&apos;m Thabang Mashinini-Sekgoto, and I&apos;m from Soshanguve.
            </p>
            <p>
              I&apos;m a curious person. That is probably the most accurate thing
              anyone could say about me. I like understanding how things work,
              taking them apart, asking why they were built this way and not
              some other way, and then, usually, trying to make one myself.
            </p>
          </div>
        </header>

        <Section title="I would rather make something than use something">
          <p>
            When I get interested in something, I do not stay interested from
            the outside for very long. I want to know what is underneath it.
            Then I want to try building it.
          </p>
          <p>
            That is true of software, of research, of photographs, of most
            things I end up caring about.
          </p>
          <p>
            It also matters to me where that instinct points. I want people from
            where I come from to see technology as something we can create, not
            only something made somewhere else for us to use. Not as a slogan.
            Just as something I would like to be more true than it currently is.
          </p>
        </Section>

        <Section title="Questions I find interesting" delay={0.05}>
          <p>
            I love research. Computer vision is the area I keep coming back to.
          </p>
          <p>
            The part I find most interesting is not applying an algorithm that
            already exists. It is the layer underneath. What is intelligence,
            actually? Why do the systems we have built learn the way they do?
            What did we assume when we decided that was the way? Could it be
            done differently?
          </p>
          <p>
            That last question is the one I keep returning to. The way we frame
            artificial intelligence today is one paradigm, arrived at through a
            particular history. I am interested in whether it is the only one,
            or whether it is one option among several that were never followed.
          </p>
          <p>
            I am also curious whether African ways of thinking, the collective
            ones especially, and ideas like ubuntu and ubunye, have something to
            say about how we frame intelligence. I want to be careful here. That
            is a question I find interesting, not a theory I have developed or a
            claim I can defend. I do not know the answer. That is most of the
            appeal.
          </p>
        </Section>

        <Section title="Technology as an equaliser" delay={0.05}>
          <p>
            The other thing I keep coming back to is access. Knowledge, tools
            and opportunity are not evenly distributed, and most of that gap is
            not talent. It is proximity. Who happened to be in the room, who
            knew someone, who could afford the thing.
          </p>
          <p>
            Technology is the cheapest lever I know for closing some of that
            distance. Past papers that open on a phone with no data. A website
            for a business that could never pay an agency. An explanation
            written for someone who was never handed the background.
          </p>
          <p>
            The aim is narrow and I would rather state it plainly than dress it
            up: more people getting the same shot at the same things.
          </p>
        </Section>

        <Section title="Why I teach" delay={0.05}>
          <p>
            I like explaining things. When I finally understand something
            difficult, my first instinct is to find someone to explain it to.
          </p>
          <p>
            A lot of the teaching I do is free, and I am fine with that. Not
            every exchange of knowledge needs to become a transaction.
          </p>
          <p>
            The part I enjoy most is taking something that looks complicated and
            closing the distance between it and someone who was never given
            access to it. Especially people from communities like mine.
          </p>
          <p>
            I am not trying to be the person who builds things for people. I
            would rather someone understood enough to build the next one without
            me.
          </p>
        </Section>

        {/* Photographs. Renders only when there are real ones; see
            PERSONAL_PHOTOS in lib/data.ts. */}
        {PERSONAL_PHOTOS.length > 0 && (
          <ScrollReveal>
            <section className="mt-16 sm:mt-20">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ivory mb-5">
                Some photographs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PERSONAL_PHOTOS.map((photo) => (
                  <div
                    key={photo.src}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* The professional material lives elsewhere. */}
        <ScrollReveal delay={0.05}>
          <section className="mt-20 border-t border-border pt-8">
            <p className="text-muted leading-relaxed">
              Looking for the professional side? The problems I have worked on
              are under{' '}
              <Link href="/work" className="text-synapse hover:underline">
                work
              </Link>
              , the full career detail is on my{' '}
              <Link href="/resume" className="text-synapse hover:underline">
                CV
              </Link>
              , and what I have been thinking about lately is in my{' '}
              <Link href="/blog" className="text-synapse hover:underline">
                writing
              </Link>
              .
            </p>
            <Link
              href="/work"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-synapse hover:gap-2.5 transition-all"
            >
              See the work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
