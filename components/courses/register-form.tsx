'use client'

import { useState, type FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface RegisterFormProps {
  courseSlug: string
  courseTitle: string
  onClose?: () => void
}

export function RegisterForm({ courseSlug, courseTitle, onClose }: RegisterFormProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/courses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || undefined,
          courseSlug,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(`You're registered for ${courseTitle}. I'll be in touch with details soon.`)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl bg-synapse/5 border border-synapse/20 p-6">
        <div className="flex items-start gap-3 text-synapse">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[0.9375rem] font-medium">{message}</p>
            {onClose && (
              <button
                onClick={onClose}
                className="mt-3 text-sm text-muted hover:text-ivory transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={`name-${courseSlug}`} className="block text-sm font-medium text-ivory/70 mb-1.5">
          Full Name *
        </label>
        <input
          id={`name-${courseSlug}`}
          type="text"
          required
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="Your full name"
          className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-[0.9375rem] text-ivory placeholder:text-muted/50 focus:outline-none focus:border-synapse/50 transition-colors"
        />
      </div>

      <div>
        <label htmlFor={`email-${courseSlug}`} className="block text-sm font-medium text-ivory/70 mb-1.5">
          Email *
        </label>
        <input
          id={`email-${courseSlug}`}
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="you@example.com"
          className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-[0.9375rem] text-ivory placeholder:text-muted/50 focus:outline-none focus:border-synapse/50 transition-colors"
        />
      </div>

      <div>
        <label htmlFor={`whatsapp-${courseSlug}`} className="block text-sm font-medium text-ivory/70 mb-1.5">
          WhatsApp Number <span className="text-muted">(optional)</span>
        </label>
        <input
          id={`whatsapp-${courseSlug}`}
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+27 81 234 5678"
          className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-[0.9375rem] text-ivory placeholder:text-muted/50 focus:outline-none focus:border-synapse/50 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-synapse text-void font-medium text-[0.9375rem] hover:bg-synapse/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Registering...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Register Interest
          </>
        )}
      </button>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{message}</p>
        </div>
      )}
    </form>
  )
}
