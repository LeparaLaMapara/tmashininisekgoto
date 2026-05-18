import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Download, MapPin, GraduationCap, Briefcase, Code, Sparkles, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Resume and career timeline of Thabang Mashinini-Sekgoto.',
}

const DOT_STYLES: Record<string, string> = {
  'text-signal': 'border-signal/30 bg-signal/10 hover:shadow-[0_0_12px_-2px] hover:shadow-signal/30 transition-all',
  'text-synapse': 'border-synapse/30 bg-synapse/10 hover:shadow-[0_0_12px_-2px] hover:shadow-synapse/30 transition-all',
  'text-accent': 'border-accent/30 bg-accent/10 hover:shadow-[0_0_12px_-2px] hover:shadow-accent/30 transition-all',
}

const CAREER_TIMELINE = [
  {
    period: '2024 - Present',
    role: 'PhD in Computer Science (In Progress)',
    org: 'University of the Witwatersrand',
    description: 'Distributed AI systems, probabilistic modelling, self-supervised learning, AI operationalisation, and distributed computing systems.',
    icon: GraduationCap,
    color: 'text-signal',
  },
  {
    period: 'Mar 2024 - Present',
    role: 'Lead Data Scientist (Acting Head of Data Science)',
    org: 'ABSA Insurance',
    description: 'Leading enterprise AI, analytics, and data science initiatives. Built scalable ML pipelines on Databricks reducing latency by 80-90%. Led telematics and rewards analytics modernisation, geospatial flood-risk modelling, and AI governance frameworks.',
    icon: Briefcase,
    color: 'text-synapse',
  },
  {
    period: 'Nov 2021 - Mar 2024',
    role: 'Senior Data Scientist',
    org: 'Vodacom',
    description: 'Real-time analytics and optimisation systems for national telecommunications infrastructure. Led the Smart Generator Optimisation platform contributing to ~R1B in annual operational savings. Received Vodacom Star Award.',
    icon: Briefcase,
    color: 'text-synapse',
  },
  {
    period: 'Apr 2020 - Nov 2021',
    role: 'Machine Learning Research Scientist',
    org: 'IBM Research',
    description: 'ML and geospatial analytics for environmental intelligence and climate-risk applications. Built predictive systems with TensorFlow, COVID-19 analytics dashboards, and integrated ML workflows into the IBM PAIRS Geospatial Platform.',
    icon: Briefcase,
    color: 'text-synapse',
  },
  {
    period: 'Jun 2018 - Apr 2020',
    role: 'Data Scientist',
    org: 'Business Intelligence Services - University of the Witwatersrand',
    description: 'Recommendation and analytics systems for institutional planning and student success. Built clustering-based systems generating over R2M annually in government subsidy impact.',
    icon: Briefcase,
    color: 'text-synapse',
  },
  {
    period: 'Nov 2017 - Jan 2018',
    role: 'Data Scientist & Software Engineer',
    org: 'Council for Scientific and Industrial Research (CSIR)',
    description: 'Predictive analytics and decision-support systems for municipalities. Recognised by Mail & Guardian, CSIR, and DST for innovation in predictive modelling.',
    icon: Code,
    color: 'text-accent',
  },
  {
    period: '2018 - 2019',
    role: 'MSc in Computer Science (Distinction)',
    org: 'University of the Witwatersrand',
    description: 'Thesis: Learning Level Set Method by Echo State Network for Image Segmentation. Recurrent neural network approaches for computationally efficient image segmentation.',
    icon: GraduationCap,
    color: 'text-signal',
  },
  {
    period: '2017',
    role: 'BSc Honours in Computer Science',
    org: 'University of the Witwatersrand',
    description: 'Project: Wildfire Estimation Using Kernel Density Estimators.',
    icon: GraduationCap,
    color: 'text-signal',
  },
  {
    period: '2014 - 2016',
    role: 'BSc in Computational & Applied Mathematics and Astronomy',
    org: 'University of the Witwatersrand',
    description: 'Mathematical modelling, astrophysics, simulation, and numerical methods.',
    icon: GraduationCap,
    color: 'text-signal',
  },
]

export default function ResumePage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-synapse via-signal to-accent bg-clip-text text-transparent">Resume</span>
              </h1>
              <div className="flex items-center gap-2 text-muted">
                <MapPin className="w-4 h-4" />
                <span>Johannesburg, South Africa</span>
              </div>
            </div>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-synapse text-void font-medium text-sm hover:bg-synapse/90 transition-all glow-synapse"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-lg text-ivory/80 leading-relaxed mb-8 max-w-2xl">
            Data Science and AI leader with 10+ years of experience delivering enterprise-scale analytics,
            machine learning, and AI solutions across banking, telecommunications, research, and higher education.
          </p>
        </ScrollReveal>

        {/* Talk to AI CTA */}
        <ScrollReveal delay={0.15}>
          <Link
            href="/ai"
            className="mb-16 flex items-center gap-4 rounded-2xl border border-synapse/20 bg-synapse/5 p-5 transition-all hover:bg-synapse/10 hover:border-synapse/30 group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-synapse/10 group-hover:bg-synapse/20 transition-colors">
              <Sparkles className="w-5 h-5 text-synapse" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-ivory text-[0.9375rem]">
                Want to know more? Talk to Thabang AI
              </p>
              <p className="text-sm text-muted mt-0.5">
                Ask about my experience, projects, or download my latest CV, all through a conversation.
              </p>
            </div>
            <MessageCircle className="w-5 h-5 text-synapse/50 group-hover:text-synapse transition-colors shrink-0" />
          </Link>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {CAREER_TIMELINE.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="relative flex gap-6">
                  {/* Dot */}
                  <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center ${DOT_STYLES[item.color] ?? 'bg-surface border-border'}`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>

                  {/* Content */}
                  <div className="pb-2">
                    <span className="text-xs font-mono text-muted">{item.period}</span>
                    <h3 className="font-display font-bold text-lg text-ivory mt-1">
                      {item.role}
                    </h3>
                    <p className="text-sm text-synapse mb-2">{item.org}</p>
                    <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 flex items-center justify-center">
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-synapse/10 text-synapse font-medium text-sm hover:bg-synapse/20 border border-synapse/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Talk to Thabang AI
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
