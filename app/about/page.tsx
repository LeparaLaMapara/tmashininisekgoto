import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { profileOpenGraph } from '@/lib/site'
import { JsonLd } from '@/components/seo/json-ld'
import { profilePageSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Thabang Mashinini-Sekgoto, from Soshanguve. A curious person who builds things to understand them, cares about access to capability, teaches so knowledge becomes transferable, and is still asking what intelligence is.',
  alternates: { canonical: '/about' },
  openGraph: profileOpenGraph('/about'),
}

/**
 * The about page, rewritten on 2026-09-25 from Thabang's own brief.
 *
 * This page is not a CV. It explains how he thinks, what he cares about, why he
 * builds, and how the parts connect. Employers, metrics and chronology live on
 * /work and /resume; keep them out of here. Where he is exploring an idea, the
 * page says so as a question, never as a conclusion.
 *
 * Nothing on this page waits for a scroll animation: it paints at rest.
 */

const INSTAGRAM = 'https://www.instagram.com/thabanglukhetho/'

/** A few of his own photographs, from the ThabangVision tiles in /public/vision. */
const PHOTOS = [
  { n: '01', alt: 'Clouds and land seen from a plane window' },
  { n: '05', alt: 'The Union Buildings under a deep blue sky' },
  { n: '07', alt: 'Johannesburg against an orange sunset' },
  { n: '31', alt: 'Green hills in the Drakensberg' },
  { n: '38', alt: 'A road at golden hour' },
  { n: '46', alt: 'The Wits Great Hall in the snow' },
]

const ROUTES = [
  { ask: 'Want the professional version?', label: 'Work and CV', href: '/work', also: { label: 'CV', href: '/resume' } },
  { ask: 'Interested in the questions?', label: 'Research', href: '/research' },
  { ask: 'Want to see what I am building?', label: 'Builds', href: '/work' },
  { ask: 'Want the opinionated version?', label: 'Writing', href: '/blog' },
  { ask: 'Want tutorials and conversations?', label: 'Talks', href: '/talks' },
  { ask: 'Want cameras and stories?', label: 'Photography', href: INSTAGRAM, external: true },
]

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 sm:mt-20 scroll-mt-28">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ivory mb-5 text-balance">{title}</h2>
      <div className="space-y-5 text-lg text-ivory/85 leading-relaxed">{children}</div>
    </section>
  )
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h3 className="font-display text-xl font-bold text-ivory mb-3">{title}</h3>
      <div className="space-y-4 text-lg text-ivory/85 leading-relaxed">{children}</div>
    </div>
  )
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="about-pull my-12 border-l-[6px] border-synapse pl-6 font-display text-2xl sm:text-3xl font-bold leading-snug text-ivory text-balance">
      {children}
    </blockquote>
  )
}

/** A small chain of steps, read left to right. */
function Chain({ steps, label }: { steps: string[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-wrap items-center gap-x-2 gap-y-2 not-prose">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className="about-chip rounded-sm border-2 border-ivory px-2.5 py-0.5 font-mono text-sm text-ivory">{s}</span>
          {i < steps.length - 1 && <span aria-hidden="true" className="text-muted">→</span>}
        </li>
      ))}
    </ol>
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
              'How Thabang Mashinini-Sekgoto thinks: curiosity, access, teaching, the move from models to systems, open questions about intelligence, and the things he builds and photographs.',
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
            <p>I&apos;m Thabang Mashinini-Sekgoto, and I&apos;m from Soshanguve, South Africa.</p>
            <p>
              The most accurate thing anyone could say about me is probably this: I am curious.
            </p>
          </div>
        </header>

        {/* 2 and 3. Curiosity, and building rather than only using */}
        <Section title="My grandfather called me Why">
          <p>
            I have been asking &ldquo;why?&rdquo; for as long as I can remember. I asked it so often
            that my grandfather started calling me Why.
          </p>
          <p>
            These days the question just has more places to go: computer science, mathematics,
            physics, astrophysics, machine learning, distributed systems, hardware, psychology,
            markets, cameras, storytelling. The pattern underneath is the same every time.
          </p>
          <Chain
            label="How I get into something"
            steps={['understand how it works', 'take it apart', 'build my own version', 'ask if it could work differently']}
          />
          <p>
            I would rather build a thing than only use it. Using something tells me what it does.
            Building it tells me why it was made that way, and whether it had to be.
          </p>
        </Section>

        <PullQuote>Why does the world work this way, and could we build it differently?</PullQuote>

        {/* 4. Where I come from */}
        <Section title="What does this mean where I come from?">
          <p>
            I have been lucky to study and work around a lot of powerful ideas: pure and applied
            mathematics, physics, machine learning, computer vision, distributed and high performance
            computing, cloud infrastructure, large production systems. Most of them live inside
            universities, laboratories and big companies.
          </p>
          <p>So the question I keep carrying home is what these ideas mean in Soshanguve.</p>
          <ul className="list-none space-y-3 border-l-2 border-border pl-5">
            <li>What does distributed computing mean to someone in a township who wants to start a farm but does not have the capital?</li>
            <li>What is a directed acyclic graph when the nodes are people, suppliers, taxis, money, land, skills and information?</li>
            <li>What does optimisation mean when someone only has R500?</li>
            <li>What does AI mean when your main computer is a phone, and data costs real money?</li>
            <li>How much of what a bank or a telecoms company can do could a small community rebuild with open source and cheap compute?</li>
          </ul>
          <p>
            I have not answered these. They are not rhetorical. They are the questions that drive
            most of my work.
          </p>
        </Section>

        {/* 5. Access */}
        <Section title="Access">
          <p>
            Knowledge, technology, networks and opportunity are not spread evenly, and most of the
            gap is not talent. It is who had internet early. Who knew the words. Who knew the right
            person, went to the right school, could afford the software, or happened to be near the
            opportunity.
          </p>
          <p>
            Technology will not fix inequality on its own, and I do not believe anyone who says it
            will. My interest is narrower and more practical: can technology give more people a
            comparable starting point?
          </p>
          <p>
            Sometimes that looks like education that opens on a phone, free learning material, an AI
            tutor, open source software, a website for a small township business, or a system that
            runs on ordinary hardware. Sometimes it is just an explanation written for someone who was
            never handed the background.
          </p>
        </Section>

        <PullQuote>Capability should not belong only to people who already have resources.</PullQuote>

        {/* 6 and 7. The mother test, and teaching */}
        <Section title="Can I explain it to my mother?">
          <p>
            This is one of my most important tests. If I cannot explain something to my mother, my
            father, my grandfather, or anyone outside my field without breaking the idea, I probably do
            not understand it well enough yet. That is not about dumbing things down. It is
            translation.
          </p>
          <p>
            The second half of the test matters more: can I help them use it? I care about the moment
            someone goes from &ldquo;I don&apos;t understand this&rdquo; to &ldquo;I can actually do
            this myself.&rdquo;
          </p>
          <p>
            That is why I teach: talks, tutorials, workshops, practical sessions, online
            conversations, projects, informal lessons with family and friends, and collaborations with
            academics and other practitioners. Some of it is free, on purpose. Not as charity. I just
            enjoy sharing what I learn, and not every exchange of knowledge needs to become a
            transaction.
          </p>
          <p>
            I do not want to be the person who builds everything for everybody forever. I would rather
            help someone understand enough to build the next thing without me.
          </p>
        </Section>

        {/* 8 and 9. Large organisations, and models to systems */}
        <Section title="What big organisations taught me">
          <p>
            My day job has shown me how large organisations solve problems: big datasets, cloud
            infrastructure, specialised teams, production platforms, governance, vendors, distributed
            systems moving millions of events, and real money behind all of it. I value that
            education.
          </p>
          <p>
            It also left me with a question I cannot put down: what does the same capability look like
            when almost none of those resources are there? That is a big part of why open source pulls
            at me. Learn from the well resourced systems, then ask which principles survive the move to
            something smaller, cheaper and easier to reach.
          </p>
          <p>
            Professionally I am a Lead Data Scientist, but the work has kept pulling me deeper, into
            engineering, infrastructure, architecture and systems. The lesson that did it:
          </p>
          <p className="font-display text-2xl font-bold text-ivory">A model sitting in a notebook is not impact.</p>
          <p>
            Anyone can train a model. The interesting problem is everything after. Can people reach it?
            Can it scale? Does it survive failure, real data, and someone else maintaining it? Does it
            actually improve a decision?
          </p>
          <Chain label="The full path I care about" steps={['idea', 'model', 'system', 'user', 'impact']} />
        </Section>

        {/* 10. Intelligence */}
        <Section title="What is intelligence, actually?">
          <p>
            I love modern AI. I build with agents and intelligent systems every week. But I keep
            wondering whether the current way of framing intelligence is the only useful one, or just
            the one we happened to arrive at.
          </p>
          <p>
            People coordinated, survived, passed on knowledge and managed uncertainty for generations
            before computers existed. I am curious whether African collective philosophies, ubuntu and
            ubunye especially, have anything to say about how intelligent systems could work. Could
            agents coordinate differently? Are there useful models of intelligence we ignored? What
            would a system look like if some of its design principles came from communities, not only
            from corporations and computer architecture?
          </p>
          <p>
            I want to be careful here. This is a question I am exploring, not a theory I have
            developed or a claim I can defend. I do not know the answer. That is why I find it
            interesting.
          </p>
        </Section>

        {/* 11 to 15. What I build */}
        <Section id="builds" title="What I build">
          <p>
            My projects are laboratories for these questions. They are not a portfolio of startups.
          </p>

          <Sub title="Kasilam Digital Platforms">
            <p>
              Helping people digitise their lives and small businesses: simple websites, digital
              tools, a bit of AI and automation, an online presence, and teaching people how to use all
              of it. Some of it is free. The website is not the interesting part. The interesting part
              is the moment someone realises technology is something they can build with, not only
              something other people make for them.
            </p>
          </Sub>

          <Sub title="Ubunye AI Ecosystems">
            <p>
              Tools for people with small budgets and big problems: open source infrastructure,
              distributed systems, reusable software, research infrastructure, and systems that can
              move between a laptop, a cluster and the cloud. The question behind it is how much of what
              once needed a large institution a small team, or even one person, can now build.
            </p>
            <p>
              This is not about rejecting the rest of the world&apos;s technology. Take the best ideas
              wherever they come from. Learn them properly. Then ask what we should build for ourselves.
            </p>
          </Sub>

          <Sub title="A fundamental scientific research engine">
            <p>
              This one grew straight out of the questions about intelligence. If I have an unusual idea
              about learning, collective systems or computation, I need a faster way to turn it into
              something that can be proven wrong.
            </p>
            <Chain
              label="How the research engine moves"
              steps={['idea', 'literature', 'hypothesis', 'experiment', 'evidence', 'critique', 'next experiment']}
            />
            <p>
              It helps find prior work, design experiments, implement them, run benchmarks, challenge
              assumptions and turn what survives into working code. The experiment matters more than the
              paper.
            </p>
          </Sub>

          <PullQuote>
            I don&apos;t want a machine that agrees with me faster. I want one that helps me discover
            when I&apos;m wrong faster.
          </PullQuote>

          <Sub title="A global market research engine">
            <p>
              Markets pull together economics, companies, currencies, commodities, geopolitics, interest
              rates, supply chains, information, psychology and incentives, all moving at once. That
              makes them one of the hardest real world laboratories I know, where ideas meet reality
              very quickly.
            </p>
            <p>
              The engine is a research environment on real data: how markets interact, how information
              spreads, which strategy hypotheses hold up, how execution and uncertainty change the
              answer. I am also experimenting with intelligent systems that observe, run parts of the
              research, test strategies and act for me under strict controls. The point is not that
              markets are easy to predict. It is the opposite. And I like sharing what I learn so other
              people can experiment too.
            </p>
          </Sub>
        </Section>

        {/* 16. Hardware */}
        <Section title="Where software reaches physics">
          <p>
            Lately I am learning hardware, and it is the same curiosity going one layer down. Software
            eventually reaches physics. The cloud is someone&apos;s machines. AI depends on chips.
            Memory, networks, energy, latency and heat all have limits, and cameras depend on sensors
            and glass.
          </p>
          <p>
            So I am learning GPUs, local compute, clusters, networking, electronics, sensors and
            embedded systems. Mostly because I dislike the point where my understanding stops at
            &ldquo;someone else handles that.&rdquo;
          </p>
        </Section>

        {/* 17. Photography */}
        <Section id="photography" title="Photography and storytelling">
          <p>
            Photography is not a side note for me. Cameras, old cameras, lenses, drones, lighting,
            film, street photography, architecture, landscapes, people, documentary work, music
            production, and travelling to document places. Cameras are where physics, optics,
            electronics, computation, art and memory all meet in one object.
          </p>
          <p className="font-display text-2xl font-bold text-ivory">
            A camera is an extremely technical machine built to do something deeply human: remember
            this.
          </p>
          <p>
            Storytelling matters to me more every year. Technology can create capability, but stories
            are how ideas travel.
          </p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="about-photos group mt-2 grid grid-cols-3 sm:grid-cols-6 gap-2"
            aria-label="See my photography on Instagram"
          >
            {PHOTOS.map((p) => (
              <span key={p.n} className="relative aspect-square overflow-hidden border-2 border-ivory">
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

        {/* 18. Anime and psychology */}
        <Section title="Anime, and other people's heads">
          <p>
            I love Naruto, Dragon Ball Z and One Punch Man. Part of the appeal is getting to live inside
            someone else&apos;s model of the world for a while: what drives them, what they are afraid
            of, what they do when they lose.
          </p>
          <p>
            That is the same thing I find fascinating about psychology. Why do people think the way they
            do? Why do groups behave differently from the people in them? How do incentives change
            behaviour? How can two people live through the same thing and come away with completely
            different stories? Also, sometimes a man just punches things very hard, and that is
            enough.
          </p>
        </Section>

        {/* 19. How I work */}
        <Section title="How I work">
          <p>
            I like to share, teach, build, and work alongside people, especially people who know things
            I do not. I would rather build a team, or a system, where people can run on their own than
            hover over anyone. I do not micromanage.
          </p>
          <p>
            Meetings are not my favourite part of any job. I show up, I contribute, and I collaborate
            a lot. I just prefer useful work and useful conversations over process for its own sake.
          </p>
        </Section>

        {/* 20 and 21. Learning for no reason, and rest */}
        <Section title="Learning for no reason">
          <p>
            Not everything I do fits the story above, and I am fine with that. Not every project needs
            a business case. Not every interest has to become a startup or make money. I read about
            astrophysics, dynamical systems, optics, strange algorithms, music production, and whatever
            catches my attention next, simply because I want to know.
          </p>
          <p>
            I am also learning to rest. Sleeping. Travelling. Taking photographs. Watching anime.
            Spending time with people. Occasionally doing nothing at all. It turns out constant
            productivity is not a requirement. I am still getting used to that.
          </p>
        </Section>

        {/* 22. The thread */}
        <Section title="The thread through all of it">
          <p>
            Understand how something works. Take it apart. Build my own version. Ask whether it could
            work differently. Then share it, so the next person has less distance to cover.
          </p>
          <p>I am still figuring most of it out. That is the fun part.</p>
        </Section>

        {/* 23. Routes deeper into the site */}
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
