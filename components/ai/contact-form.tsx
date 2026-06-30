'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export const INTEREST_OPTIONS: { value: string; label: string }[] = [
  { value: 'recruitment', label: 'Recruitment / hiring' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'workshop', label: 'Workshop / training' },
  { value: 'speaking', label: 'Speaking invite' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'sekhotomultiversity', label: 'SekhotoMultiversity' },
  { value: 'learning', label: 'Learning AI' },
  { value: 'other', label: 'Other' },
]

interface ContactFormProps {
  /** Controlled "interested in" value — set when a Work-With-Me card is clicked. */
  interest?: string
}

export function ContactForm({ interest }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [interestVal, setInterestVal] = useState(interest ?? '')
  const [msg, setMsg] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [feedback, setFeedback] = useState('')

  // Sync when a card pre-selects an interest.
  useEffect(() => {
    if (interest) setInterestVal(interest)
  }, [interest])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !interestVal) return

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organisation: organisation.trim() || undefined,
          interest: interestVal,
          message: msg.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setFeedback("Thanks — your message reached me. I'll be in touch by email soon.")
      } else {
        setStatus('error')
        setFeedback(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setFeedback('Network error. Try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-synapse/5 border border-synapse/20 p-6">
        <div className="flex items-start gap-3 text-synapse">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-[0.9375rem] font-medium">{feedback}</p>
        </div>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-xl bg-surface border border-border px-4 py-3 text-[0.9375rem] text-ivory placeholder:text-muted/50 focus:outline-none focus:border-synapse/50 transition-colors'
  const labelCls = 'block text-sm font-medium text-ivory/70 mb-1.5'
  const clearError = () => status === 'error' && setStatus('idle')

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelCls}>Name *</label>
          <input
            id="contact-name" type="text" required value={name}
            onChange={(e) => { setName(e.target.value); clearError() }}
            placeholder="Your name" className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelCls}>Email *</label>
          <input
            id="contact-email" type="email" required value={email}
            onChange={(e) => { setEmail(e.target.value); clearError() }}
            placeholder="you@example.com" className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-org" className={labelCls}>
            Organisation / company <span className="text-muted">(optional)</span>
          </label>
          <input
            id="contact-org" type="text" value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
            placeholder="Where you're reaching out from" className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="contact-interest" className={labelCls}>What are you interested in? *</label>
          <select
            id="contact-interest" required value={interestVal}
            onChange={(e) => { setInterestVal(e.target.value); clearError() }}
            className={inputCls}
          >
            <option value="" disabled>Select one…</option>
            {INTEREST_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelCls}>Message</label>
        <textarea
          id="contact-message" rows={4} value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="A few lines about what you have in mind…"
          className={`${inputCls} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-synapse text-void font-medium text-[0.9375rem] hover:bg-synapse/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {status === 'loading' ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
        ) : (
          <><Send className="w-4 h-4" />Send message</>
        )}
      </button>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{feedback}</p>
        </div>
      )}
    </form>
  )
}
