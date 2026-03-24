'use client'

import GitHubCalendar from 'react-github-calendar'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

const theme = {
  dark: ['#111118', '#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9'],
}

export function GithubCalendar() {
  return (
    <ScrollReveal>
      <div className="glass border border-border rounded-2xl p-6 md:p-8 overflow-x-auto">
        <GitHubCalendar
          username="LeparaLaMapara"
          theme={theme}
          colorScheme="dark"
          blockSize={13}
          blockMargin={4}
          fontSize={13}
          style={{ width: '100%' }}
          labels={{
            totalCount: '{{count}} contributions in the last year',
          }}
        />
      </div>
    </ScrollReveal>
  )
}
