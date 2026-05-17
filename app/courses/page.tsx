import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { COURSES } from '@/lib/data'
import { CourseCard } from '@/components/courses/course-card'

export const metadata: Metadata = {
  title: 'Courses',
  description:
    'Practitioner-first AI and data science courses by Thabang Mashinini-Sekgoto. From zero-code AI agents to agentic engineering with Claude Code, MCP, and Codex.',
}

// Re-fetch waitlist counts from Supabase every 60 seconds (ISR)
export const revalidate = 60

async function getWaitlistCounts(): Promise<Record<string, number>> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
    if (!supabaseUrl || !supabaseServiceKey) return {}

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data, error } = await supabase
      .from('course_registrations')
      .select('course_slug')

    if (error || !data) return {}

    const counts: Record<string, number> = {}
    for (const row of data) {
      counts[row.course_slug] = (counts[row.course_slug] || 0) + 1
    }
    return counts
  } catch {
    return {}
  }
}

export default async function CoursesPage() {
  const waitlistCounts = await getWaitlistCounts()

  const courses = COURSES.map((c) => ({
    ...c,
    waitlistCount: waitlistCounts[c.slug] || c.waitlistCount,
  }))

  const zeroCodeCourses = courses.filter((c) => c.tier === 'zero-code')
  const specializedCourses = courses.filter((c) => c.tier === 'specialized')

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Learn with{' '}
            <span className="bg-gradient-to-r from-synapse via-accent to-signal bg-clip-text text-transparent">
              Thabang
            </span>
          </h1>
          <p className="text-muted text-xl max-w-2xl mb-6 leading-relaxed">
            Practitioner-first courses built from real experience, not recycled
            textbook theory. From zero-code AI tools to advanced agentic engineering.
          </p>
          <p className="text-[0.9375rem] text-ivory/60 max-w-2xl mb-16 leading-relaxed">
            These courses are based on what I&apos;ve built across Vodacom, ABSA, IBM,
            and Wits, and what I demonstrated on FabAcademic with Prof Phakeng.
            Join the waitlist to get notified first and secure early access.
          </p>
        </ScrollReveal>

        {/* Zero Code Tier */}
        <ScrollReveal>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                No Code Required
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ivory mb-2">
              Zero Code Courses
            </h2>
            <p className="text-[0.9375rem] text-muted max-w-xl leading-relaxed">
              Start using AI today, no programming experience needed. Perfect for
              students, professionals, and business owners.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 mb-20">
          {zeroCodeCourses.map((course, i) => (
            <ScrollReveal key={course.slug} delay={i * 0.1}>
              <CourseCard course={course} />
            </ScrollReveal>
          ))}
        </div>

        {/* Specialized Tier */}
        <ScrollReveal>
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-synapse/10 text-synapse border border-synapse/20">
                For Developers
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ivory mb-2">
              Specialized Courses
            </h2>
            <p className="text-[0.9375rem] text-muted max-w-xl leading-relaxed">
              Deep dives into agentic engineering, MCP infrastructure, multi-agent
              workflows, and production ML systems.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8">
          {specializedCourses.map((course, i) => (
            <ScrollReveal key={course.slug} delay={i * 0.1}>
              <CourseCard course={course} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
