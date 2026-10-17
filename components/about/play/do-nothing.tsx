'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * "I am also learning to rest." Do nothing for ten seconds. The page dims to a
 * slow breathing circle and counts down; scroll, tap or press a key and it
 * notices. Close it any time with the button or Escape.
 */
const SECONDS = 10

type Phase = 'idle' | 'resting' | 'moved' | 'done'

export function DoNothing() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [left, setLeft] = useState(SECONDS)
  const timer = useRef<number | undefined>(undefined)
  const startedAt = useRef(0)

  const stop = useCallback(() => window.clearInterval(timer.current), [])

  const start = () => {
    setPhase('resting')
    setLeft(SECONDS)
    startedAt.current = Date.now()
    stop()
    timer.current = window.setInterval(() => {
      const remaining = SECONDS - Math.floor((Date.now() - startedAt.current) / 1000)
      if (remaining <= 0) {
        stop()
        setPhase('done')
        setLeft(0)
      } else setLeft(remaining)
    }, 200)
  }

  useEffect(() => {
    if (phase !== 'resting') return
    // Ignore the first moment, so the click that started it does not count.
    const armed = window.setTimeout(() => {
      const moved = (e: Event) => {
        if (e instanceof KeyboardEvent && e.key === 'Escape') return
        stop()
        setPhase('moved')
      }
      window.addEventListener('wheel', moved, { once: true })
      window.addEventListener('touchstart', moved, { once: true })
      window.addEventListener('keydown', moved, { once: true })
      window.addEventListener('pointerdown', moved, { once: true })
      cleanup = () => {
        window.removeEventListener('wheel', moved)
        window.removeEventListener('touchstart', moved)
        window.removeEventListener('keydown', moved)
        window.removeEventListener('pointerdown', moved)
      }
    }, 600)
    let cleanup = () => {}
    return () => {
      window.clearTimeout(armed)
      cleanup()
    }
  }, [phase, stop])

  useEffect(() => {
    if (phase === 'idle') return
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stop()
        setPhase('idle')
      }
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [phase, stop])

  useEffect(() => stop, [stop])

  const message =
    phase === 'resting'
      ? 'Do nothing.'
      : phase === 'moved'
        ? 'You moved. That is fine. It takes practice.'
        : 'Ten seconds of nothing. That counts.'

  return (
    <>
      <div className="not-prose mt-6">
        <button type="button" onClick={start} className="btn-sign-outline">
          Do nothing for {SECONDS} seconds
        </button>
      </div>
      {phase !== 'idle' &&
        createPortal(
          <div className="rest-overlay" role="dialog" aria-modal="true" aria-label="Do nothing for ten seconds">
            <div className={`rest-breath ${phase === 'resting' ? 'is-on' : ''}`} aria-hidden="true" />
            <p className="rest-count" aria-live="polite">
              {phase === 'resting' ? left : ''}
            </p>
            <p className="rest-msg">{message}</p>
            {phase !== 'resting' && (
              <div className="flex gap-3">
                <button type="button" onClick={start} className="rest-btn">
                  Again
                </button>
                <button type="button" onClick={() => setPhase('idle')} className="rest-btn">
                  Back to the page
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  )
}
