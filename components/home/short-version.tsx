import { IMPACT_NUMBERS, TALKS } from '@/lib/data'

/**
 * The short version: who he is and what he worked hard for, shown the way
 * sjnarmstrong.com does it. One short statement and four small boards with a
 * number and a caption. Little text on purpose.
 *
 * Wording set by Thabang on 2026-09-25: he works at "a bank", not an insurer,
 * and the ABSA properties figure made way for Ubunye Engine's scale (he is
 * updating the CV PDF to match). Vodacom and the reach figure still come from
 * lib/data.ts.
 */
const vodacom = IMPACT_NUMBERS.find((n) => n.context.startsWith('Vodacom'))!
const reach = IMPACT_NUMBERS.find((n) => n.label.startsWith('Audience'))!

const STATS = [
  { value: `${vodacom.value}${vodacom.suffix}`, caption: 'a year saved at Vodacom' },
  { value: '100M+', caption: 'events a day through Ubunye Engine, powering 10+ products across a bank' },
  { value: 'MSc', caption: 'Computer Science, with distinction, Wits' },
  { value: String(TALKS.length), caption: `talks, and ${reach.value}${reach.suffix} people reached` },
]

export function ShortVersion() {
  return (
    <section className="short-version mt-14" aria-label="The short version">
      <div className="hl-board hl-statement">
        <p className="hl-lead">I&apos;m Thabang, from Soshanguve.</p>
        <p className="hl-sub">
          For over nine years, I&apos;ve spent my time learning how things work: physics, mathematics,
          AI, software, hardware engineering, data, and people, and then asking what those ideas mean
          where I come from.
        </p>
        <p className="hl-sub">
          Today, I&apos;m a Lead Data Scientist at a bank, but the question I keep coming back to is
          bigger than my job: how do we take what we learn in universities, research labs and large
          organisations and make it useful to ordinary people?
        </p>
      </div>

      <ul className="hl-stats">
        {STATS.map((s) => (
          <li key={s.value} className="hl-board">
            <span className="hl-value">{s.value}</span>
            <span className="hl-caption">{s.caption}</span>
            {s.value === 'MSc' && (
              <span className="hl-loading" aria-label="PhD: loading, starting in 2027">
                PhD loading<span className="hl-dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
