'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  Mic,
  Briefcase,
  UserPlus,
  Handshake,
  Network,
  GraduationCap,
  CalendarDays,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { cn } from '@/lib/utils'
import { SOCIAL_LINKS } from '@/lib/data'
import { ContactForm } from '@/components/ai/contact-form'

type Card = {
  icon: LucideIcon
  title: string
  blurb: string
  interest?: string
  href?: string
}

const CARDS: Card[] = [
  { icon: Mic, title: 'AI talks & workshops', blurb: 'Invite me to speak or run practical, no-hype AI training for your team.', interest: 'workshop' },
  { icon: Briefcase, title: 'AI / data science consulting', blurb: 'Production ML, analytics, and AI strategy — from messy data to shipped systems.', interest: 'consulting' },
  { icon: UserPlus, title: 'Recruit or hire me', blurb: 'Lead/principal data science & AI engineering roles. See what I am suited for.', interest: 'recruitment' },
  { icon: Handshake, title: 'Collaborate on applied AI', blurb: 'Research-to-product work, open source, and applied AI projects.', interest: 'collaboration' },
  { icon: Network, title: 'SekhotoMultiversity partnerships', blurb: 'Partner on the AI-powered learning & opportunity platform for African communities.', interest: 'sekhotomultiversity' },
  { icon: GraduationCap, title: 'AI learning & career resources', blurb: 'Courses and guidance to start or level up in AI and data science.', href: '/courses' },
]

export function WorkWithMe() {
  const [interest, setInterest] = useState<string>()
  const formRef = useRef<HTMLDivElement>(null)

  function pick(value: string) {
    setInterest(value)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const cardCls = cn(
    'group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 text-left',
    'transition-all duration-200',
    'hover:-translate-y-1 hover:border-synapse/30 hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.15)]',
    'focus:outline-none focus:ring-1 focus:ring-synapse/40'
  )

  return (
    <>
      <ScrollReveal>
        <p className="font-mono text-xs uppercase tracking-widest text-synapse">Work With Me</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ivory sm:text-4xl">
          Turn this into{' '}
          <span className="bg-gradient-to-r from-synapse via-accent to-signal bg-clip-text text-transparent">
            something real
          </span>
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Pick the path that fits — it pre-fills the form below, or book a call directly.
        </p>
      </ScrollReveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => {
          const Icon = card.icon
          const inner = (
            <>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-synapse/10 text-synapse">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-ivory">{card.title}</h3>
              <p className="mt-2 flex-1 text-[0.9375rem] text-muted">{card.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-synapse">
                {card.href ? 'Explore' : 'Get in touch'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </>
          )
          return (
            <ScrollReveal key={card.title} delay={i * 0.06}>
              {card.href ? (
                <Link href={card.href} className={cardCls}>{inner}</Link>
              ) : (
                <button type="button" onClick={() => pick(card.interest!)} className={cn(cardCls, 'w-full')}>
                  {inner}
                </button>
              )}
            </ScrollReveal>
          )
        })}
      </div>

      {/* High-intent direct CTA */}
      <ScrollReveal>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={SOCIAL_LINKS.booking}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-synapse px-6 py-3 text-sm font-semibold text-void transition-all hover:bg-synapse/90"
          >
            <CalendarDays className="h-4 w-4" />
            Book a call
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-sm text-muted transition-colors hover:text-ivory"
          >
            or email {SOCIAL_LINKS.email}
          </a>
        </div>
      </ScrollReveal>

      {/* Lead form */}
      <ScrollReveal>
        <div ref={formRef} id="contact" className="glass mt-12 scroll-mt-24 rounded-2xl border border-border p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-ivory">Send a message</h3>
          <p className="mt-1.5 mb-6 text-sm text-muted">
            Tell me a little about what you need and I&apos;ll get back to you by email.
          </p>
          <ContactForm interest={interest} />
        </div>
      </ScrollReveal>
    </>
  )
}
