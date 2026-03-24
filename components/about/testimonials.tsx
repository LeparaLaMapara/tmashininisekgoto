'use client'

import { TESTIMONIALS } from '@/lib/data'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Quote } from 'lucide-react'

const contextColors = {
  impact: 'text-synapse border-synapse/20 bg-synapse/10',
  teaching: 'text-signal border-signal/20 bg-signal/10',
  engineering: 'text-accent border-accent/20 bg-accent/10',
}

const contextLabels = {
  impact: 'Impact',
  teaching: 'Teaching',
  engineering: 'Engineering',
}

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
      {TESTIMONIALS.map((t, i) => (
        <ScrollReveal key={i} delay={i * 0.1}>
          <div className="glass border border-border rounded-2xl p-8 h-full flex flex-col">
            <Quote className="w-8 h-8 text-synapse/30 mb-4 flex-shrink-0" />
            <blockquote className="text-[0.9375rem] text-ivory/80 leading-relaxed mb-6 flex-1">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="mt-auto pt-4 border-t border-border">
              <p className="font-display font-semibold text-ivory text-sm">
                {t.name}
              </p>
              <p className="text-xs text-muted mt-0.5">{t.role}</p>
              <span
                className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[0.6875rem] font-mono border ${contextColors[t.context]}`}
              >
                {contextLabels[t.context]}
              </span>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}
