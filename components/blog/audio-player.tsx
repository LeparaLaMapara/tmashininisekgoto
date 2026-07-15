'use client'

import { useRef, useState } from 'react'
import { Play, Pause, Headphones } from 'lucide-react'

interface AudioPlayerProps {
  src: string
}

function fmt(seconds: number): string {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const SPEEDS = [1, 1.25, 1.5, 2]

export function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      a.play()
    } else {
      a.pause()
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const a = audioRef.current
    if (!a) return
    a.currentTime = Number(e.target.value)
    setCurrent(a.currentTime)
  }

  function cycleSpeed() {
    const a = audioRef.current
    if (!a) return
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]
    a.playbackRate = next
    setSpeed(next)
  }

  return (
    <div className="mb-10 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause narration' : 'Listen to this post'}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-synapse text-void hover:opacity-90 transition-opacity"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted mb-1.5">
            <Headphones className="h-3.5 w-3.5" />
            <span className="truncate">Listen to this post</span>
            <span className="ml-auto font-mono text-xs">
              {fmt(current)} / {fmt(duration)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={current}
            onChange={seek}
            aria-label="Seek"
            className="w-full h-1.5 cursor-pointer appearance-none rounded-full bg-synapse-dim accent-[var(--color-synapse)]"
          />
        </div>

        <button
          onClick={cycleSpeed}
          aria-label="Playback speed"
          className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs font-mono text-muted hover:text-synapse hover:border-synapse/40 transition-colors"
        >
          {speed}x
        </button>
      </div>
    </div>
  )
}
