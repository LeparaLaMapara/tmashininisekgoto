'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

// Below this, "join N readers" impresses nobody; the line stays hidden.
const SHOW_COUNT_FROM = 5

export function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/subscribe')
      .then((r) => r.json())
      .then((d) => typeof d.count === 'number' && setCount(d.count))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage("You're in. I'll let you know when something new drops.")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Try again.')
    }
  }

  return (
    <div className="glass rounded-2xl p-8 md:p-10">
      <h3 className="font-display text-xl font-bold text-ivory mb-2">
        Stay in the loop
      </h3>
      <p className="text-[0.9375rem] text-muted mb-6 leading-relaxed">
        New posts on AI systems, engineering craft, and lessons from building in production.
        No spam. Unsubscribe anytime.
        {count !== null && count >= SHOW_COUNT_FROM && (
          <span className="block mt-1.5 text-synapse font-medium">
            Join {count.toLocaleString('en-ZA')} readers who get new posts first.
          </span>
        )}
      </p>

      {status === 'success' ? (
        <div className="flex items-center gap-3 text-synapse">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-[0.9375rem]">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            placeholder="you@example.com"
            className="flex-1 min-w-0 rounded-xl bg-surface border border-border px-4 py-3 text-[0.9375rem] text-ivory placeholder:text-muted/50 focus:outline-none focus:border-synapse/50 transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-synapse text-void font-medium text-[0.9375rem] hover:bg-synapse/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            {status === 'loading' ? 'Sending...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{message}</p>
        </div>
      )}
    </div>
  )
}
