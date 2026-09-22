import Link from 'next/link'
import { Github, Youtube, Linkedin, GraduationCap } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/data'

const socialIcons = [
  { href: SOCIAL_LINKS.github, icon: Github, label: 'GitHub' },
  { href: SOCIAL_LINKS.youtube, icon: Youtube, label: 'YouTube' },
  { href: SOCIAL_LINKS.linkedin, icon: Linkedin, label: 'LinkedIn' },
  { href: SOCIAL_LINKS.scholar, icon: GraduationCap, label: 'Google Scholar' },
]

export function Footer() {
  return (
    <footer className="border-t-4 border-ivory bg-void">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Top row: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand */}
          <div>
            <p className="font-sign text-xl">
              Thabang<span className="text-synapse">.</span>
            </p>
            <p className="text-muted text-sm mt-1">
              AI systems that work in the real world. Built in South Africa, shared with
              everyone.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            {/* h2, not h4: pages go h1 -> h2, so an h4 here skipped two levels
                and broke the heading outline for screen readers. Styling is
                unchanged. */}
            <h2 className="text-xs uppercase tracking-wider text-muted mb-3">Quick Links</h2>
            <nav className="flex flex-col">
              {[
                { href: '/about', label: 'About' },
                { href: '/work', label: 'Work' },
                { href: '/research', label: 'Research' },
                { href: '/blog', label: 'Writing' },
                { href: '/publications', label: 'Publications' },
                { href: '/topics', label: 'Topics' },
                { href: '/talks', label: 'Talks' },
                { href: '/courses', label: 'Teaching' },
                { href: '/career', label: 'Journey' },
                { href: '/now', label: 'Now' },
                { href: '/resume', label: 'CV' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm text-muted hover:text-synapse transition-colors py-1"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Get in Touch */}
          <div>
            <h2 className="text-xs uppercase tracking-wider text-muted mb-3">Get in Touch</h2>
            <Link
              href="/ai"
              className="inline-flex items-center px-4 py-2 bg-sign-board text-sign-ink text-sm font-semibold border-[3px] border-sign-ink transition-transform hover:translate-x-px hover:translate-y-px"
            >
              Talk to Thabang AI Assist
            </Link>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-4 mt-10 border-t border-border pt-8">
          {socialIcons.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={label}
              className="p-2.5 sm:p-3 rounded-full text-muted hover:text-synapse hover:bg-synapse/10 transition-all duration-200"
            >
              <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center mt-6">
          {/* Full-strength muted, not /60: the faded version composited to
              #a69e91 on paper, a 2.45:1 contrast ratio. This measures 5.45:1. */}
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Thabang Mashinini-Sekgoto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
