import { BIO, CAREER_TIMELINE, IMPACT_NUMBERS, TALKS } from '@/lib/data'

/**
 * The short version: who he is and what he worked hard for, shown the way
 * sjnarmstrong.com does it. One short statement, a row of tools, four small
 * boards with a number and a caption. Little text on purpose.
 *
 * Every figure is read from lib/data.ts, which only holds what the public CV
 * states, so this can never drift from the CV.
 */
const PILLS = ['Python', 'PySpark', 'Databricks', 'MLflow', 'Kafka', 'Kubernetes', 'TensorFlow', 'Geospatial ML', 'MLOps']

const vodacom = IMPACT_NUMBERS.find((n) => n.context.startsWith('Vodacom'))!
const absa = IMPACT_NUMBERS.find((n) => n.context.startsWith('ABSA'))!
const reach = IMPACT_NUMBERS.find((n) => n.label.startsWith('Audience'))!
const msc = CAREER_TIMELINE.find((m) => m.shortOrg === 'MSc')!

const STATS = [
  { value: `${vodacom.value}${vodacom.suffix}`, caption: 'a year saved at Vodacom' },
  { value: `${absa.value}${absa.suffix}`, caption: 'insured properties risk modelled at ABSA' },
  { value: 'MSc', caption: `with ${msc.highlight.split(' · ')[0].toLowerCase()}, Wits` },
  { value: String(TALKS.length), caption: `talks, and ${reach.value}${reach.suffix} people reached` },
]

export function ShortVersion() {
  const [role, org] = BIO.title.split(', ')
  return (
    <section className="short-version mt-14" aria-label="The short version">
      <div className="hl-board hl-statement">
        <p className="hl-lead">
          {role} at {org}.
        </p>
        <p className="hl-sub">Nine years making data and AI work in the real world.</p>
      </div>

      <ul className="hl-pills" aria-label="Tools I use most">
        {PILLS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

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
