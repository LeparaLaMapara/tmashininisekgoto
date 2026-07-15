import Link from 'next/link'
import { Github, Youtube, Linkedin, Instagram, Twitter, Mail, GraduationCap, Sparkles } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/data'

const socialIcons = [
  { href: SOCIAL_LINKS.github, icon: Github, label: 'GitHub' },
  { href: SOCIAL_LINKS.youtube, icon: Youtube, label: 'YouTube' },
  { href: SOCIAL_LINKS.linkedin, icon: Linkedin, label: 'LinkedIn' },
  { href: SOCIAL_LINKS.instagram, icon: Instagram, label: 'Instagram' },
  { href: SOCIAL_LINKS.twitter, icon: Twitter, label: 'X / Twitter' },
  { href: `mailto:${SOCIAL_LINKS.email}`, icon: Mail, label: 'Email' },
  { href: SOCIAL_LINKS.scholar, icon: GraduationCap, label: 'Google Scholar' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-void/80">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Top row: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand */}
          <div>
            <p className="font-display text-xl font-semibold">
              Thabang<span className="text-synapse">.</span>
            </p>
            <p className="text-muted text-sm mt-1">
              AI systems that work in the real world. Built in South Africa, shared with
              everyone.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted mb-3">Quick Links</h4>
            <nav className="flex flex-col">
              {[
                { href: '/about', label: 'About' },
                { href: '/work', label: 'Work' },
                { href: '/blog', label: 'Blog' },
                { href: '/publications', label: 'Publications' },
                { href: '/talks', label: 'Talks' },
                { href: '/courses', label: 'Teaching' },
                { href: '/career', label: 'Journey' },
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
            <h4 className="text-xs uppercase tracking-wider text-muted mb-3">Get in Touch</h4>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-synapse/10 text-synapse text-sm border border-synapse/20 hover:bg-synapse/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Talk to Thabang AI Assist
            </Link>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-5 mt-10 border-t border-border pt-8">
          {socialIcons.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-3 rounded-full text-muted hover:text-synapse hover:bg-synapse/10 transition-all duration-200"
            >
              <Icon className="w-5.5 h-5.5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted/60">
            &copy; {new Date().getFullYear()} Thabang Mashinini-Sekgoto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
