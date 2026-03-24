'use client'

import { IMPACT_NUMBERS } from '@/lib/data'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

// Parse values like "R1B", "80-90", "15", "R2M" into displayable formats
function parseImpactValue(value: string) {
  // Handle range like "80-90"
  if (value.includes('-')) {
    return { display: value, numericEnd: parseInt(value.split('-')[1]), isRange: true }
  }
  // Handle currency like "R1B", "R2M"
  const match = value.match(/^R?(\d+)([BMK]?)$/)
  if (match) {
    return {
      display: value,
      numericEnd: parseInt(match[1]),
      prefix: value.startsWith('R') ? 'R' : '',
      unitSuffix: match[2] || '',
      isRange: false,
    }
  }
  return { display: value, numericEnd: parseInt(value) || 0, isRange: false }
}

export function ImpactCounters() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {IMPACT_NUMBERS.map((item, i) => {
        const parsed = parseImpactValue(item.value)
        return (
          <ScrollReveal key={item.label} delay={i * 0.1}>
            <div className="text-center p-6 rounded-2xl bg-surface/50 border border-border hover:border-synapse/20 transition-colors">
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-synapse mb-2">
                {parsed.isRange ? (
                  <span>80-90{item.suffix}</span>
                ) : (
                  <>
                    {parsed.prefix}
                    <AnimatedCounter
                      end={parsed.numericEnd}
                      duration={2.5}
                    />
                    {parsed.unitSuffix}
                    {item.suffix}
                  </>
                )}
              </div>
              <p className="text-base font-medium text-ivory mb-1">{item.label}</p>
              <p className="text-sm text-muted">{item.context}</p>
            </div>
          </ScrollReveal>
        )
      })}
    </div>
  )
}
