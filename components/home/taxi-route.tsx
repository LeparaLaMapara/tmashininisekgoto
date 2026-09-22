import Link from 'next/link'
import { CAREER_TIMELINE } from '@/lib/data'

/**
 * The taxi rank pieces of the signwriter homepage: the amber dot matrix
 * destination board, the livery stripes, and the career drawn as a route.
 *
 * Years are read from CAREER_TIMELINE so the route cannot drift from the CV.
 * Server rendered, no client JavaScript.
 */

const firstYear = (period: string) => period.match(/\d{4}/)?.[0] ?? ''

function stop(shortOrg: string, name: string, href: string, state: 'done' | 'now' | 'next' = 'done') {
  const milestone = CAREER_TIMELINE.find((m) => m.shortOrg === shortOrg)
  return { name, href, state, year: milestone ? firstYear(milestone.period) : '' }
}

const STOPS = [
  stop('ZAR X', 'ZAR X', '/career'),
  stop('CSIR', 'CSIR', '/work/csir-municipal-decision-support'),
  stop('Wits BIS', 'Wits BIS', '/work/wits-student-success'),
  stop('IBM', 'IBM Research', '/work/ibm-geospatial'),
  stop('Vodacom', 'Vodacom', '/work/vodacom-network-intelligence'),
  stop('ABSA', 'ABSA', '/work/insurance-data-science-capability', 'now'),
  // Ubunye Engine is a project, not a timeline milestone; its repository
  // was created in 2025 (PROJECTS in lib/data.ts).
  { name: 'Ubunye Engine', href: '/work/ubunye-engine', state: 'now' as const, year: '2025' },
  stop('Research', 'PhD', '/research', 'next'),
]

export function DestinationBoard() {
  return (
    <div
      className="bg-[#0c0c0c] border-[6px] border-[#2b2b2b] px-4 py-4 sm:px-6 sm:py-5"
      role="img"
      aria-label="Destination board: Soshanguve to production, via research and open source"
    >
      <p
        aria-hidden="true"
        className="font-dot font-black text-[#ffb000] text-[1.55rem] leading-none tracking-wider sm:text-5xl lg:text-6xl [text-shadow:0_0_6px_rgba(255,176,0,0.45)]"
      >
        SOSHANGUVE <span className="whitespace-nowrap">⇄ PRODUCTION</span>
      </p>
      <p aria-hidden="true" className="font-dot font-bold text-[#ffb000]/80 text-xs sm:text-lg tracking-widest mt-2">
        VIA RESEARCH · VIA OPEN SOURCE · ALL STOPS
      </p>
    </div>
  )
}

/** Three painted stripes, slightly raked, like the side of a minibus. */
export function LiveryStripes() {
  return (
    <div
      aria-hidden="true"
      className="h-[46px] -skew-y-1 bg-[linear-gradient(var(--color-void)_0_8px,#e03a1e_8px_20px,var(--color-void)_20px_24px,#1d6fd1_24px_34px,var(--color-void)_34px_38px,#f2b705_38px_46px)]"
    />
  )
}

export function CareerRoute() {
  return (
    <ol className="relative grid gap-0 md:grid-cols-8" aria-label="Career route, from 2017 to the PhD">
      {/* The road: vertical on phones, horizontal from md up. */}
      <span aria-hidden="true" className="absolute left-[11px] top-3 bottom-3 w-[5px] bg-ivory md:left-[6%] md:right-[6%] md:top-[11px] md:bottom-auto md:w-auto md:h-[5px]" />
      {STOPS.map((s) => (
        <li key={s.name} className="relative">
          <Link
            href={s.href}
            className="group flex items-center gap-4 py-2.5 md:flex-col md:gap-2 md:py-0 md:text-center"
          >
            <span
              aria-hidden="true"
              className={[
                'relative z-10 size-7 shrink-0 rounded-full border-[5px] border-ivory transition-transform group-hover:scale-110',
                s.state === 'now' ? 'bg-[#e03a1e]' : s.state === 'next' ? 'bg-[#f2b705] border-dashed' : 'bg-void',
              ].join(' ')}
            />
            <span className="leading-tight">
              <span className="block font-livery font-bold text-lg md:text-base text-ivory group-hover:text-synapse-ink">
                {s.name}
              </span>
              <span className="block font-mono text-xs text-muted tabular-nums">
                {s.year}
                {s.state === 'now' && ' · now'}
                {s.state === 'next' && ' · next stop'}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
