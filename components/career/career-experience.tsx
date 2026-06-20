'use client'

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, GraduationCap, Briefcase, Code, Gamepad2, Loader2, Volume2, VolumeX, Sparkles, MessageCircle, Coins as CoinsIcon, Trophy } from 'lucide-react'
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

// ---- Error boundary: a runtime WebGL crash falls back gracefully ----

class SceneErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

function SceneFallback() {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-void px-6 text-center">
      <h2 className="font-display text-2xl font-bold">The journey hit a snag</h2>
      <p className="max-w-md text-muted">
        The 3D scene couldn&apos;t run on this device. You can explore the same career story on the resume timeline.
      </p>
      <Link href="/resume" className="rounded-full bg-synapse px-6 py-3 text-sm font-medium text-void hover:bg-synapse/90">
        View the resume timeline
      </Link>
    </div>
  )
}

// ---- Celebration confetti ----

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: (i * 37) % 100,
        delay: (i % 12) * 0.07,
        dur: 2.2 + (i % 5) * 0.35,
        color: ['#0ea5e9', '#f59e0b', '#06b6d4', '#ffd43b', '#ff6b6b', '#37b24d'][i % 6],
        rot: (i * 53) % 360,
        size: 7 + (i % 4) * 2,
      })),
    []
  )
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, opacity: 1, rotate: p.rot }}
          animate={{ y: '110vh', opacity: [1, 1, 0.7], rotate: p.rot + 540 }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: 2,
          }}
        />
      ))}
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
  const [coins, setCoins] = useState(0)
  const [coinTotal, setCoinTotal] = useState(0)
  const [banner, setBanner] = useState<number | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const celebrated = useRef(false)

  useEffect(() => {
    setSupported(hasWebGL())
    setCoarse(window.matchMedia('(pointer: coarse)').matches)
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // chapter banner on arrival + one-time celebration at the present-day stop
  useEffect(() => {
    if (active == null) return
    setBanner(active)
    const id = setTimeout(() => setBanner((b) => (b === active ? null : b)), 2800)
    if (active === JOURNEY.length - 1 && !celebrated.current) {
      celebrated.current = true
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 4500)
    }
    return () => clearTimeout(id)
  }, [active])

  function begin() {
    journeyAudio.start()
    setStarted(true)
  }

  function toggleMute() {
    const next = !muted
    setMuted(next)
    journeyAudio.setMuted(next)
  }

  function handleCoin(c: number, t: number) {
    setCoins(c)
    setCoinTotal(t)
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
    <section className="relative h-[100svh] w-full overflow-hidden bg-void" aria-label="Interactive career journey">
      {/* Accessible / crawlable version of the journey (the canvas is invisible to readers & bots) */}
      <div className="sr-only">
        <h1>Career journey of Thabang Mashinini-Sekgoto</h1>
        <ol>
          {JOURNEY.map((m) => (
            <li key={m.shortOrg}>
              <strong>{m.role}</strong>, {m.org} ({m.period}). {m.highlight}. {m.description}
            </li>
          ))}
        </ol>
      </div>

      {supported && (
        <SceneErrorBoundary fallback={<SceneFallback />}>
          <CareerScene
            onActiveChange={setActive}
            onCoin={handleCoin}
            lowPower={coarse}
            reducedMotion={reducedMotion}
          />
        </SceneErrorBoundary>
      )}

      {celebrate && <Confetti />}

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
          {started && coinTotal > 0 && (
            <span
              title="Berries collected"
              className="flex items-center gap-1.5 rounded-full border border-signal/30 bg-surface/70 px-3 py-2 font-mono text-xs text-signal backdrop-blur-md"
            >
              <CoinsIcon className="h-4 w-4" />
              {coins}/{coinTotal}
              <span className="hidden sm:inline">berries</span>
            </span>
          )}
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

      {/* chapter title banner on arrival */}
      <AnimatePresence>
        {started && banner != null && (
          <motion.div
            key={banner}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="pointer-events-none absolute inset-x-0 top-28 z-20 flex justify-center px-4 sm:top-32"
          >
            <div className={`rounded-2xl border ${ACCENT_BORDER[JOURNEY[banner].accent] ?? 'border-border'} bg-void/70 px-6 py-3 text-center backdrop-blur-md`}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Chapter {banner + 1} · {JOURNEY[banner].period}
              </p>
              <p className={`font-display text-xl font-bold ${ACCENT_TEXT[JOURNEY[banner].accent]}`}>
                {JOURNEY[banner].era}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                Sail through my career from 2014 to today. Walk up to each signpost to open its chapter,
                and grab the golden berries along the way.
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
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted">{milestone.period}</span>
                    <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${ACCENT_BORDER[milestone.accent]} ${ACCENT_TEXT[milestone.accent]}`}>
                      {milestone.era}
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-ivory">{milestone.role}</h2>
                  <p className={`mb-2 text-sm ${ACCENT_TEXT[milestone.accent]}`}>{milestone.org}</p>
                  <p className="mb-3 text-sm leading-relaxed text-muted">{milestone.description}</p>

                  {/* standout achievement */}
                  <div className="mb-3 flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2">
                    <Trophy className={`mt-0.5 h-4 w-4 shrink-0 ${ACCENT_TEXT[milestone.accent]}`} />
                    <span className="text-xs leading-snug text-ivory/90">{milestone.highlight}</span>
                  </div>

                  {/* skill chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {milestone.skills.map((s) => (
                      <span key={s} className="rounded-full border border-border bg-white/5 px-2.5 py-1 text-[11px] text-muted">
                        {s}
                      </span>
                    ))}
                  </div>
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
