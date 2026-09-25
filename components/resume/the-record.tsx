import { CAREER_TIMELINE, IMPACT_NUMBERS } from '@/lib/data'
import { CareerRoute } from '@/components/home/taxi-route'

/**
 * The professional record, moved here from the homepage on 2026-09-24.
 *
 * The homepage is now about Thabang, not a case for him; the figures, the three
 * roles and the career route live on the CV, where people who want them look.
 * Figures come from IMPACT_NUMBERS, which only holds what the public CV states,
 * printed as they are with no counting animation.
 */
const SELECTED = ['Absa Group', 'Vodacom', 'IBM Research']
  .map((org) => CAREER_TIMELINE.find((m) => m.org === org && m.kind === 'work'))
  .filter((m): m is NonNullable<typeof m> => Boolean(m))

export function TheRecord() {
  return (
    <section className="mb-16">
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ivory mb-3">
        What the work delivered
      </h2>
      <p className="text-lg text-muted max-w-2xl mb-8">
        Production systems that survive noisy data, organisational constraints and real
        people using them.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {IMPACT_NUMBERS.map((item) => (
          <div key={item.label} className="glass p-5">
            <p className="font-sign text-2xl sm:text-3xl text-synapse leading-none mb-3">
              {item.value}
              {item.suffix}
            </p>
            <p className="font-semibold text-ivory leading-snug">{item.label}</p>
            <p className="text-sm text-muted mt-1">{item.context}</p>
          </div>
        ))}
      </div>

      <ol className="mt-10 border-t-2 border-border">
        {SELECTED.map((role) => (
          <li key={role.org} className="grid gap-2 md:grid-cols-[12rem_1fr] md:gap-8 py-5 border-b border-border">
            <div>
              <p className="font-sign text-sm text-synapse-ink">{role.shortOrg}</p>
              <p className="font-mono text-xs text-muted mt-1">{role.period}</p>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ivory">
                {role.role}, {role.org}
              </h3>
              <p className="mt-2 text-ivory/80 leading-relaxed">{role.highlight}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-16 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ivory mb-3">
        The route so far
      </h2>
      <p className="text-lg text-muted max-w-2xl mb-8">
        From a stock exchange in 2017 to a PhD in 2027. Tap a stop to see the work done there.
      </p>
      <CareerRoute />
    </section>
  )
}
