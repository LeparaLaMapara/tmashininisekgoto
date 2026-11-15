'use client'

/**
 * A voice call with LeparaLaMapara, Thabang's AI assistant.
 *
 * The visitor taps Call, hears a greeting, speaks, and hears the answer. It
 * runs on the browser's own speech recognition and speech output, so it costs
 * nothing extra. The natural open source voice (Kokoro, Apache 2.0) is the
 * default: it starts downloading (about 90 MB, once) when the call starts, the
 * browser voice covers the greeting meanwhile, and the call switches over as
 * soon as Kokoro is ready. A visitor can pick the standard voice instead.
 *
 * Answers come from the same grounded /api/chat route as the text chat, in a
 * voice mode that keeps replies short and speakable. The transcript keeps the
 * cited sources. Typing still works inside a call, for browsers with no
 * microphone support and for visitors who would rather not speak.
 */

import { useChat } from 'ai/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Phone, PhoneOff, Mic, Square, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/components/ai/chat-message'

type Phase = 'idle' | 'greeting' | 'listening' | 'paused' | 'thinking' | 'speaking' | 'ended'
type VoiceKind = 'standard' | 'natural'

const GREETING =
  "Hi, I'm LeparaLaMapara, Thabang's AI assistant. I know his public work and writing, and I'll tell you when I don't know something. What would you like to know?"

const KOKORO_URL = 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm'
const KOKORO_MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX'
const KOKORO_VOICE = 'am_michael'

const STATUS: Record<Phase, string> = {
  idle: 'Ready when you are',
  greeting: 'Connected',
  listening: 'Listening',
  paused: 'Tap the mic to talk',
  thinking: 'Thinking',
  speaking: 'Speaking',
  ended: 'Call ended',
}

interface Speaker {
  speak: (text: string) => Promise<void>
  cancel: () => void
}

/** Plain text for the ear: no markdown symbols, no links. */
function forSpeech(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_#`>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function browserSpeaker(): Speaker {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
  function pickVoice() {
    const voices = synth?.getVoices() ?? []
    return (
      voices.find((v) => v.lang === 'en-ZA') ??
      voices.find((v) => v.lang === 'en-GB' && /male|daniel|google/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith('en')) ??
      null
    )
  }
  return {
    speak: (text) =>
      new Promise((resolve) => {
        if (!synth || !text) return resolve()
        const u = new SpeechSynthesisUtterance(text)
        const v = pickVoice()
        if (v) u.voice = v
        u.rate = 1.02
        u.onend = () => resolve()
        u.onerror = () => resolve()
        synth.speak(u)
      }),
    cancel: () => synth?.cancel(),
  }
}

type KokoroTTS = { generate: (text: string, o: { voice: string }) => Promise<{ toBlob: () => Blob }> }

async function loadKokoro(onProgress: (pct: number) => void): Promise<Speaker> {
  const url = KOKORO_URL
  const mod = await import(/* webpackIgnore: true */ url)
  const files: Record<string, number> = {}
  const tts: KokoroTTS = await mod.KokoroTTS.from_pretrained(KOKORO_MODEL, {
    dtype: 'q8',
    device: 'wasm',
    progress_callback: (p: { file?: string; loaded?: number; total?: number }) => {
      if (p.file && p.total) {
        files[p.file] = (p.loaded ?? 0) / p.total
        const vals = Object.values(files)
        onProgress(Math.round((100 * vals.reduce((a, b) => a + b, 0)) / vals.length))
      }
    },
  })
  let current: HTMLAudioElement | null = null
  let cancelled = false
  return {
    speak: async (text) => {
      if (!text) return
      cancelled = false
      const audio = await tts.generate(text, { voice: KOKORO_VOICE })
      if (cancelled) return
      const src = URL.createObjectURL(audio.toBlob())
      await new Promise<void>((resolve) => {
        current = new Audio(src)
        current.onended = () => resolve()
        current.onerror = () => resolve()
        current.onpause = () => resolve()
        current.play().catch(() => resolve())
      })
      URL.revokeObjectURL(src)
    },
    cancel: () => {
      cancelled = true
      current?.pause()
    },
  }
}

// The Web Speech API is not in the TypeScript DOM library yet.
type Recognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

function makeRecognition(): Recognition | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }
  const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition
  return SR ? new SR() : null
}

export function CallMode() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [voiceKind, setVoiceKind] = useState<VoiceKind>('natural')
  const [natural, setNatural] = useState<{ state: 'off' | 'loading' | 'ready' | 'failed'; pct: number }>({ state: 'off', pct: 0 })
  const [heard, setHeard] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [canListen, setCanListen] = useState(true)

  const phaseRef = useRef<Phase>('idle')
  const speakerRef = useRef<Speaker | null>(null)
  const naturalRef = useRef<Speaker | null>(null)
  const recRef = useRef<Recognition | null>(null)
  const queueRef = useRef<string[]>([])
  const drainingRef = useRef(false)
  const spokenRef = useRef(0)
  const streamDoneRef = useRef(true)
  const silentRestartsRef = useRef(0)
  const endingRef = useRef(false)
  const interruptedRef = useRef(false)
  const endRef = useRef<HTMLDivElement>(null)

  const go = useCallback((p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }, [])

  const { messages, append, isLoading } = useChat({
    id: 'call',
    api: '/api/chat',
    body: { mode: 'voice' },
    onResponse: (response) => {
      if (response.status === 429 || response.status === 413) {
        endingRef.current = true
        response
          .json()
          .then((d) => endWithNotice(d.error ?? 'We have reached the limit for today.'))
          .catch(() => endWithNotice('We have reached the limit for today.'))
      }
    },
    onError: () => {
      if (endingRef.current) return
      if (phaseRef.current !== 'ended') {
        setNotice('The assistant is unavailable right now. Please try again later.')
        listen()
      }
    },
  })

  useEffect(() => {
    setCanListen(makeRecognition() !== null)
    speakerRef.current = browserSpeaker()
    // Some browsers load their voice list late; ask once so it is ready.
    window.speechSynthesis?.getVoices()
    return () => {
      recRef.current?.abort()
      speakerRef.current?.cancel()
      naturalRef.current?.cancel()
    }
  }, [])

  useEffect(() => {
    if (phase === 'idle' || phase === 'ended') return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages])

  function speaker(): Speaker {
    return (voiceKind === 'natural' && naturalRef.current) || speakerRef.current || browserSpeaker()
  }

  function stopListening() {
    const r = recRef.current
    recRef.current = null
    if (r) {
      r.onend = null
      r.abort()
    }
  }

  function listen() {
    if (phaseRef.current === 'ended') return
    stopListening()
    const rec = makeRecognition()
    if (!rec) {
      go('paused')
      return
    }
    setHeard('')
    let final = ''
    rec.lang = 'en-ZA'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) final += r[0].transcript
        else interim += r[0].transcript
      }
      setHeard((final + ' ' + interim).trim())
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setCanListen(false)
        setNotice('The microphone is blocked, so type your question below.')
      }
    }
    rec.onend = () => {
      recRef.current = null
      if (phaseRef.current !== 'listening') return
      const text = final.trim()
      if (text) {
        silentRestartsRef.current = 0
        ask(text)
      } else if (silentRestartsRef.current < 2) {
        silentRestartsRef.current += 1
        listen()
      } else {
        go('paused')
      }
    }
    recRef.current = rec
    go('listening')
    try {
      rec.start()
    } catch {
      go('paused')
    }
  }

  async function drain() {
    if (drainingRef.current) return
    drainingRef.current = true
    while (queueRef.current.length && phaseRef.current !== 'ended') {
      const next = queueRef.current.shift()!
      if (phaseRef.current !== 'speaking') go('speaking')
      await speaker().speak(next)
    }
    drainingRef.current = false
    if (phaseRef.current === 'ended') return
    if (endingRef.current) {
      endingRef.current = false
      go('ended')
      return
    }
    if (streamDoneRef.current && !queueRef.current.length) listen()
  }

  function say(text: string) {
    const clean = forSpeech(text)
    if (clean) queueRef.current.push(clean)
    void drain()
  }

  function ask(text: string) {
    stopListening()
    setHeard('')
    setNotice(null)
    spokenRef.current = 0
    interruptedRef.current = false
    streamDoneRef.current = false
    go('thinking')
    void append({ role: 'user', content: text })
  }

  // Speak the answer sentence by sentence while it streams in.
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'assistant' || phaseRef.current === 'ended') return
    if (interruptedRef.current) {
      spokenRef.current = last.content.length
      return
    }
    const rest = last.content.slice(spokenRef.current)
    // Lazy, so dots inside a sentence (0.9.3, web addresses) stay in it; a
    // sentence only ends at punctuation followed by a space or the end.
    const re = /[\s\S]*?[.!?]+["')\]]*(\s+|$)/g
    let m: RegExpExecArray | null
    let used = 0
    while ((m = re.exec(rest)) && m[0].length) {
      if (!isLoading || /\s$/.test(m[0])) {
        say(m[0])
        used = re.lastIndex
      }
    }
    spokenRef.current += used
    if (!isLoading) {
      const tail = last.content.slice(spokenRef.current)
      spokenRef.current = last.content.length
      streamDoneRef.current = true
      if (tail.trim()) say(tail)
      else if (phaseRef.current === 'speaking' || phaseRef.current === 'thinking') void drain()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading])

  function endWithNotice(text: string) {
    setNotice(text)
    queueRef.current = []
    speaker().cancel()
    stopListening()
    streamDoneRef.current = true
    queueRef.current.push(forSpeech(text))
    endingRef.current = true
    void drain()
  }

  function start() {
    if (voiceKind === 'natural') void chooseNatural()
    endingRef.current = false
    interruptedRef.current = false
    setNotice(null)
    setSeconds(0)
    silentRestartsRef.current = 0
    streamDoneRef.current = true
    go('greeting')
    say(GREETING)
  }

  function end() {
    go('ended')
    stopListening()
    queueRef.current = []
    speakerRef.current?.cancel()
    naturalRef.current?.cancel()
  }

  function interrupt() {
    interruptedRef.current = true
    queueRef.current = []
    speaker().cancel()
    streamDoneRef.current = true
    silentRestartsRef.current = 0
    listen()
  }

  function submitTyped(e: React.FormEvent) {
    e.preventDefault()
    const text = typed.trim()
    if (!text || isLoading) return
    setTyped('')
    queueRef.current = []
    speaker().cancel()
    if (phaseRef.current === 'idle' || phaseRef.current === 'ended') {
      setSeconds(0)
    }
    ask(text)
  }

  async function chooseNatural() {
    setVoiceKind('natural')
    if (naturalRef.current || natural.state === 'loading') return
    setNatural({ state: 'loading', pct: 0 })
    try {
      naturalRef.current = await loadKokoro((pct) => setNatural({ state: 'loading', pct }))
      setNatural({ state: 'ready', pct: 100 })
    } catch {
      setNatural({ state: 'failed', pct: 0 })
      setVoiceKind('standard')
    }
  }

  const inCall = phase !== 'idle' && phase !== 'ended'
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center">
      {/* The caller */}
      <div className="relative mt-4 flex h-44 w-44 items-center justify-center">
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-0 rounded-full border-4 border-synapse/40',
            phase === 'speaking' && 'animate-ping',
            phase === 'listening' && 'animate-pulse'
          )}
        />
        <span className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-ivory bg-surface">
          <Image src="/avatar.svg" alt="LeparaLaMapara, Thabang's AI assistant" fill sizes="144px" className="object-cover" />
        </span>
      </div>

      <p className="mt-6 font-display text-2xl font-bold text-ivory" aria-live="polite">
        {STATUS[phase]}
        {(phase === 'thinking') && <span className="think-dots" aria-hidden="true">...</span>}
      </p>
      <p className="mt-1 font-mono text-sm text-muted">{inCall ? clock : 'Voice call with my AI assistant'}</p>

      {phase === 'listening' && heard && (
        <p className="mt-4 max-w-md text-center text-lg italic text-ivory/80">&ldquo;{heard}&rdquo;</p>
      )}

      {/* Controls */}
      <div className="mt-8 flex items-center gap-5">
        {!inCall ? (
          <button
            type="button"
            onClick={start}
            className="inline-flex h-16 items-center gap-3 rounded-full bg-[#1b7f3b] px-8 font-display text-lg font-bold text-white shadow-[4px_4px_0_#111] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-synapse"
          >
            <Phone className="h-6 w-6" aria-hidden="true" />
            {phase === 'ended' ? 'Call again' : 'Start the call'}
          </button>
        ) : (
          <>
            {phase === 'speaking' || phase === 'greeting' ? (
              <button type="button" onClick={interrupt} className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ivory bg-surface text-ivory hover:bg-surface-hover" aria-label="Stop talking and let me speak">
                <Square className="h-5 w-5" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { silentRestartsRef.current = 0; listen() }}
                disabled={!canListen || phase === 'thinking'}
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full border-2 border-ivory text-ivory disabled:opacity-40',
                  phase === 'listening' ? 'bg-synapse/20' : 'bg-surface hover:bg-surface-hover'
                )}
                aria-label="Talk"
              >
                <Mic className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={end}
              className="inline-flex h-16 items-center gap-3 rounded-full bg-[#d62828] px-7 font-display text-lg font-bold text-white shadow-[4px_4px_0_#111] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-ivory"
            >
              <PhoneOff className="h-6 w-6" aria-hidden="true" />
              End
            </button>
          </>
        )}
      </div>

      {notice && (
        <p className="mt-6 max-w-md rounded-xl border border-synapse/30 bg-synapse/5 px-4 py-3 text-center text-sm text-ivory" role="status">
          {notice}
        </p>
      )}

      {!canListen && (
        <p className="mt-4 max-w-md text-center text-sm text-muted">
          This browser cannot listen. You will still hear the answers. Type your questions below.
        </p>
      )}

      {/* Voice choice */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs" role="group" aria-label="Voice">
        <span className="text-muted">Voice:</span>
        <button
          type="button"
          onClick={() => setVoiceKind('standard')}
          className={cn('rounded-sm border px-3 py-1.5', voiceKind === 'standard' ? 'border-synapse/40 bg-synapse/15 text-synapse' : 'border-border text-muted hover:text-ivory')}
        >
          Standard (built into your browser)
        </button>
        <button
          type="button"
          onClick={chooseNatural}
          className={cn('rounded-sm border px-3 py-1.5', voiceKind === 'natural' ? 'border-synapse/40 bg-synapse/15 text-synapse' : 'border-border text-muted hover:text-ivory')}
        >
          {natural.state === 'loading'
            ? `Natural voice: downloading ${natural.pct}%`
            : natural.state === 'failed'
              ? 'Natural voice failed to load'
              : natural.state === 'ready'
                ? 'Natural (open source)'
                : 'Natural (open source, downloads about 90 MB once)'}
        </button>
      </div>

      {/* Typing works in a call too */}
      <form onSubmit={submitTyped} className="relative mt-8 w-full">
        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Or type your question"
          className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3.5 pr-12 font-body text-sm text-ivory placeholder:text-muted focus:border-synapse/40 focus:outline-none focus:ring-1 focus:ring-synapse/40"
          disabled={isLoading}
          aria-label="Type your question"
        />
        <button
          type="submit"
          disabled={!typed.trim() || isLoading}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-synapse disabled:opacity-30"
          aria-label="Send"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      {/* Transcript, with sources */}
      {messages.length > 0 && (
        <div className="mt-10 w-full">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Transcript</p>
          <div className="space-y-4">
            {messages.map((m, i) => (
              <ChatMessage key={m.id} message={m} isLast={i === messages.length - 1} />
            ))}
          </div>
          <div ref={endRef} />
        </div>
      )}
    </div>
  )
}
