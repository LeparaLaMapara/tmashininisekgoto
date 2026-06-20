'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, GraduationCap, Briefcase, Code, Gamepad2, Loader2, Volume2, VolumeX, Sparkles, MessageCircle } from 'lucide-react'
import { CAREER_TIMELINE, type MilestoneKind } from '@/lib/data'
import { setJoystick, resetInput } from './input'
import { journeyAudio } from './audio'
import { travelTo } from './nav'

// Reconstruct the walk order WITHOUT importing the 3D module (keeps three.js lazy)
const JOURNEY = [...CAREER_TIMELINE].reverse()

const KIND_ICON: Record<MilestoneKind, typeof GraduationCap> = {
  education: GraduationCap,
  work: Briefcase,
  research: Code,
}
const ACCENT_TEXT: Record<string, string> = {
  synapse: 'text-synapse',
  signal: 'text-signal',
  accent: 'text-accent',
}
const ACCENT_BORDER: Record<string, string> = {
  synapse: 'border-synapse/30',
  signal: 'border-signal/30',
  accent: 'border-accent/30',
}
const ACCENT_BG: Record<string, string> = {
  synapse: 'bg-synapse',
  signal: 'bg-signal',
  accent: 'bg-accent',
}

function Loader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-void">
      <Loader2 className="w-8 h-8 text-synapse animate-spin" />
      <p className="font-mono text-sm text-muted">Building the journey…</p>
    </div>
  )
}

const CareerScene = dynamic(() => import('./career-scene').then((m) => m.CareerScene), {
  ssr: false,
  loading: () => <Loader />,
})

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

// ---- On-screen joystick (touch) ----

function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const active = useRef(false)
  const R = 44 // px radius

  function update(clientX: number, clientY: number) {
    const base = baseRef.current
    if (!base) return
    const rect = base.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let dx = clientX - cx
    let dy = clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > R) {
      dx = (dx / dist) * R
      dy = (dy / dist) * R
    }
    setKnob({ x: dx, y: dy })
    setJoystick(-dy / R, -dx / R) // up = forward, left = turn left
  }

  function end() {
    active.current = false
    setKnob({ x: 0, y: 0 })
    resetInput()
  }

  return (
    <div
      ref={baseRef}
      onPointerDown={(e) => {
        active.current = true
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        update(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => active.current && update(e.clientX, e.clientY)}
      onPointerUp={end}
      onPointerCancel={end}
      className="pointer-events-auto relative h-28 w-28 rounded-full border border-white/15 bg-white/5 backdrop-blur-md touch-none"
      style={{ touchAction: 'none' }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full bg-synapse/40 border border-synapse/60"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  )
}

// ---- Main experience ----

export function CareerExperience() {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [coarse, setCoarse] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    setSupported(hasWebGL())
    setCoarse(window.matchMedia('(pointer: coarse)').matches)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  function begin() {
    journeyAudio.start()
    setStarted(true)
  }

  function toggleMute() {
    const next = !muted
    setMuted(next)
    journeyAudio.setMuted(next)
  }

  if (supported === false) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="font-display text-3xl font-bold">3D not available on this device</h1>
        <p className="max-w-md text-muted">
          Your browser doesn&apos;t support WebGL, so the interactive journey can&apos;t load. You can explore the
          same career story on the resume timeline.
        </p>
        <Link href="/resume" className="rounded-full bg-synapse px-6 py-3 text-sm font-medium text-void hover:bg-synapse/90">
          View the resume timeline
        </Link>
      </div>
    )
  }

  const milestone = active != null ? JOURNEY[active] : null

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-void">
      {supported && (
        <CareerScene onActiveChange={setActive} lowPower={coarse} reducedMotion={reducedMotion} />
      )}

      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        <Link
          href="/resume"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-2 text-sm text-ivory backdrop-blur-md transition-colors hover:bg-surface"
        >
          <ArrowLeft className="h-4 w-4" />
          Resume
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-surface/70 px-4 py-2 font-mono text-xs text-muted backdrop-blur-md">
            {active != null ? `${active + 1} / ${JOURNEY.length}` : `${JOURNEY.length} stops`}
          </span>
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/70 text-ivory backdrop-blur-md transition-colors hover:bg-surface"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* progress timeline / fast-travel */}
      {started && (
        <div className="pointer-events-none absolute inset-x-0 top-16 z-20 flex justify-center px-4 sm:top-20">
          <div className="pointer-events-auto flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-border bg-surface/60 px-3 py-2 backdrop-blur-md">
            {JOURNEY.map((m, i) => {
              const on = active === i
              return (
                <button
                  key={i}
                  onClick={() => travelTo(i)}
                  title={`${m.shortOrg} · ${m.period}`}
                  aria-label={`Travel to ${m.org}`}
                  className="group flex shrink-0 items-center gap-1.5 rounded-full px-1.5 py-1"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      on ? ACCENT_BG[m.accent] : 'bg-white/25 group-hover:bg-white/50'
                    }`}
                  />
                  <span
                    className={`font-mono text-[11px] transition-all ${
                      on ? `${ACCENT_TEXT[m.accent]} max-w-[80px]` : 'max-w-0 overflow-hidden text-muted group-hover:max-w-[80px]'
                    }`}
                  >
                    {m.shortOrg}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* intro overlay */}
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-void/70 px-6 text-center backdrop-blur-sm"
          >
            <Gamepad2 className="h-10 w-10 text-synapse" />
            <div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">Walk through my journey</h1>
              <p className="mx-auto mt-3 max-w-md text-muted">
                Stroll the timeline from 2014 to today. Walk up to a glowing marker to learn about each chapter.
              </p>
            </div>
            <p className="font-mono text-xs text-muted/80">
              {coarse ? 'Use the joystick to move' : 'Move with W A S D or the arrow keys'}
            </p>
            <button
              onClick={begin}
              className="rounded-full bg-synapse px-8 py-3 font-medium text-void transition-all hover:bg-synapse/90"
            >
              Start walking
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* milestone card */}
      <AnimatePresence>
        {started && milestone && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4 sm:p-6"
          >
            <div
              className={`pointer-events-auto w-full max-w-lg rounded-2xl border ${
                ACCENT_BORDER[milestone.accent] ?? 'border-border'
              } bg-surface/85 p-5 backdrop-blur-xl sm:p-6`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 ${ACCENT_TEXT[milestone.accent]}`}>
                  {(() => {
                    const Icon = KIND_ICON[milestone.kind]
                    return <Icon className="h-5 w-5" />
                  })()}
                </div>
                <div>
                  <span className="font-mono text-xs text-muted">{milestone.period}</span>
                  <h2 className="font-display text-lg font-bold text-ivory">{milestone.role}</h2>
                  <p className={`mb-2 text-sm ${ACCENT_TEXT[milestone.accent]}`}>{milestone.org}</p>
                  <p className="text-sm leading-relaxed text-muted">{milestone.description}</p>
                </div>
              </div>

              {/* end-of-journey call to action on the final (present-day) stop */}
              {active === JOURNEY.length - 1 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  <span className="w-full text-xs text-muted">You&apos;ve reached the present. Let&apos;s talk about what&apos;s next.</span>
                  <Link
                    href="/ai"
                    className="inline-flex items-center gap-1.5 rounded-full bg-synapse px-4 py-2 text-sm font-medium text-void transition-all hover:bg-synapse/90"
                  >
                    <Sparkles className="h-4 w-4" />
                    Talk to Thabang AI
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/5 px-4 py-2 text-sm text-ivory transition-colors hover:bg-white/10"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Get in touch
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* controls hint + joystick */}
      {started && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4 sm:p-6">
          {coarse ? (
            <Joystick />
          ) : (
            <span className="rounded-full border border-border bg-surface/60 px-3 py-1.5 font-mono text-[11px] text-muted backdrop-blur-md">
              WASD / arrows to move
            </span>
          )}
          <span aria-hidden className="h-28 w-28" />
        </div>
      )}
    </section>
  )
}
