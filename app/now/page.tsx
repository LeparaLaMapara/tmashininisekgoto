import type { Metadata } from 'next'
import Link from 'next/link'
import { BIO, COURSES, PROJECTS } from '@/lib/data'
import { getAllPosts } from '@/lib/blog'
import { formatDate } from '@/lib/utils'

/**
 * A /now page: what Thabang is working on at the moment.
 *
 * Deliberately data-driven. The lists below read from lib/data.ts and the blog,
 * so this page stays current when those change instead of quietly going stale,
 * which is the usual fate of a hand-written now page.
 *
 * TODO(thabang): two things here cannot be derived from this repo, so they are
 * stated only as far as the repo supports them:
 *   1. The PhD research area is not recorded in lib/data.ts. Tell me the public
 *      one-line description and I will name it here, since "PhD candidate" alone
 *      leaves the most searchable part of your research invisible.
 *   2. There is no "last reviewed" date. If you would rather show one, add a
 *      constant and I will render it.
 */

export const metadata: Metadata = {
  title: 'Now: What I’m Working On',
  description:
    'What Thabang Mashinini-Sekgoto is working on right now: current role, PhD research, projects being built, and what is being taught.',
  alternates: { canonical: '/now' },
}

export default function NowPage() {
  const buildingNow = PROJECTS.filter(
    (project) => project.building || project.category === 'building-now',
  )
  const upcomingCourses = COURSES.filter((course) => course.status === 'coming-soon')
  const latestPosts = getAllPosts().slice(0, 3)

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-ivory">
        Now
      </h1>
      <p className="mt-4 text-lg text-ivory/85 leading-relaxed">
        A snapshot of what has my attention. If you want the whole picture, the{' '}
        <Link href="/work" className="text-synapse hover:underline">
          work
        </Link>{' '}
        and{' '}
        <Link href="/publications" className="text-synapse hover:underline">
          publications
        </Link>{' '}
        pages go deeper.
      </p>

      {/* Day job */}
      <div className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-ivory">The day job</h2>
        <p className="mt-3 text-muted leading-relaxed">
          {BIO.shortBio} Based in {BIO.location}.
        </p>
      </div>

      {/* Research */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ivory">Research</h2>
        <p className="mt-3 text-muted leading-relaxed">
          PhD candidate at the University of the Witwatersrand, building on the MSc
          work on learning the level set method with echo state networks for image
          segmentation. The published papers are on the{' '}
          <Link href="/publications" className="text-synapse hover:underline">
            publications
          </Link>{' '}
          page.
        </p>
      </div>

      {/* Building */}
      {buildingNow.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ivory">Building</h2>
          <ul className="mt-4 space-y-5">
            {buildingNow.map((project) => (
              <li key={project.slug}>
                <span className="font-medium text-ivory">{project.title}</span>
                <p className="mt-1 text-muted text-[0.9375rem] leading-relaxed">
                  {project.problem}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Teaching */}
      {upcomingCourses.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ivory">Teaching</h2>
          <p className="mt-3 text-muted leading-relaxed">
            {upcomingCourses.length} courses in preparation, from zero-code AI agents
            through to agentic engineering and production ML. Details and waitlists on
            the{' '}
            <Link href="/courses" className="text-synapse hover:underline">
              courses
            </Link>{' '}
            page.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {upcomingCourses.map((course) => (
              <li
                key={course.slug}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-mono text-muted"
              >
                {course.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Writing */}
      {latestPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ivory">Writing</h2>
          <ul className="mt-4 space-y-4">
            {latestPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <span className="font-medium text-ivory transition-colors group-hover:text-synapse">
                    {post.title}
                  </span>
                  <time
                    dateTime={post.date}
                    className="ml-2 text-sm font-mono text-muted"
                  >
                    {formatDate(post.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Away from the screen */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ivory">
          Away from the screen
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {BIO.hobbies.map((hobby) => (
            <li
              key={hobby.label}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-muted"
            >
              <span aria-hidden="true">{hobby.emoji}</span> {hobby.label}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-16 border-t border-border pt-8 text-muted">
        Want to work together?{' '}
        <Link href="/ai" className="text-synapse hover:underline">
          Ask Thabang AI Assist
        </Link>{' '}
        or reach out from there.
      </p>
    </section>
  )
}
