'use client'

import { useEffect, useRef } from 'react'

/**
 * Dug up from his GitHub: the route from his first repository to now, as taxi
 * stops on a road you scroll sideways. The minibus drives along as you scroll.
 *
 * A snapshot taken from the GitHub API on 2026-10-17 (public repositories of
 * LeparaLaMapara that are not forks). Words come from each repository's own
 * description. Update by hand; it never calls GitHub at runtime.
 */
const GH = 'https://github.com/LeparaLaMapara/'

const STOPS = [
  { year: '2019', repo: 'Personal-website', what: 'My first repository: a personal website' },
  { year: '2019', repo: 'Recommendation-Systems', what: 'An anime recommendation system, with nearest neighbours' },
  { year: '2020', repo: 'learn-web-dev', what: 'Teaching myself web development' },
  { year: '2020', repo: 'ESNIterativeSegmentation', what: 'My MSc: echo state networks for level set segmentation' },
  { year: '2021', repo: 'KasiLam', what: 'Digitising township businesses, where Kasilam started' },
  { year: '2021', repo: 'photography-website', what: 'A website for my photography' },
  { year: '2022', repo: 'ml_from_scratch', what: 'Machine learning methods, written from scratch' },
  { year: '2025', repo: 'tmashininisekgoto', what: 'This website' },
  { year: '2026', repo: 'thabangvisionaistudios', what: 'ThabangVision: book South African creators and gear' },
  { year: '2026', repo: 'esn-levelset-study', what: 'Rerunning my MSc, six years later' },
  { year: '2026', repo: 'agent-roadmap-kit', what: 'A free, hands on kit for building with AI agents' },
]

export function RepoRoute() {
  const strip = useRef<HTMLDivElement>(null)
  const taxi = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const s = strip.current
    const t = taxi.current
    if (!s || !t) return
    const move = () => {
      const max = s.scrollWidth - s.clientWidth
      const p = max > 0 ? s.scrollLeft / max : 0
      t.style.setProperty('--p', String(p))
    }
    move()
    s.addEventListener('scroll', move, { passive: true })
    window.addEventListener('resize', move)
    return () => {
      s.removeEventListener('scroll', move)
      window.removeEventListener('resize', move)
    }
  }, [])

  return (
    <div className="play-card not-prose">
      <p className="play-kicker">Dug up from my GitHub</p>
      <p className="text-base text-ivory/85 mb-4">
        On GitHub since December 2018. A few stops on the way, oldest first. Scroll sideways.
      </p>
      <div className="repo-road">
        <div ref={strip} className="repo-strip" tabIndex={0} aria-label="My GitHub repositories, oldest first">
          <ol className="repo-stops">
            {STOPS.map((s) => (
              <li key={s.repo}>
                <a href={GH + s.repo} target="_blank" rel="noopener noreferrer" className="repo-ticket">
                  <span className="repo-year">{s.year}</span>
                  <span className="repo-what">{s.what}</span>
                  <span className="repo-name">{s.repo}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div className="repo-lane" aria-hidden="true">
          <span ref={taxi} className="repo-taxi">
            <svg viewBox="0 0 112 50" width="56" height="25">
              <path d="M2,40 L2,16 Q4,6 16,4 L80,2 Q98,2 106,18 L110,32 L110,40 Z" fill="#f7f7f2" stroke="#111" strokeWidth="3" />
              <path d="M20,8 L66,7 L66,20 L18,21 Z" fill="#1d2a36" />
              <rect x="4" y="26" width="104" height="4" fill="#e03a1e" />
              <rect x="4" y="31" width="104" height="4" fill="#1f6fd6" />
              <circle cx="26" cy="42" r="7" fill="#111" />
              <circle cx="88" cy="42" r="7" fill="#111" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}
