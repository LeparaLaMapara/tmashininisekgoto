'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

interface Comment {
  id: string
  name: string
  message: string
  created_at: string
}

interface CommentsProps {
  slug: string
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function Comments({ slug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loaded, setLoaded] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot, hidden from people
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [slug])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, message, website }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not post your comment. Try again.')
      } else if (data.comment) {
        setComments((prev) => [...prev, data.comment])
        setMessage('')
      }
    } catch {
      setError('Could not post your comment. Check your connection and try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mt-16 pt-10 border-t border-border">
      <h2 className="font-display text-2xl font-semibold text-ivory mb-2">Comments</h2>
      <p className="text-muted mb-8">
        No account needed. Just your name and what you think.
      </p>

      {/* Existing comments */}
      {loaded && comments.length === 0 && (
        <p className="text-muted mb-8">Nothing here yet. Be the first.</p>
      )}
      <ul className="space-y-6 mb-10">
        {comments.map((c) => (
          <li key={c.id} className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="font-medium text-ivory">{c.name}</span>
              <span className="text-sm text-muted">{timeAgo(c.created_at)}</span>
            </div>
            <p className="text-ivory/85 leading-relaxed whitespace-pre-wrap">{c.message}</p>
          </li>
        ))}
      </ul>

      {/* Form */}
      <form onSubmit={submit} className="bg-surface border border-border rounded-2xl p-6">
        <div className="mb-4">
          <label htmlFor="comment-name" className="block text-sm font-medium text-ivory mb-1.5">
            Your name
          </label>
          <input
            id="comment-name"
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-border text-ivory placeholder:text-muted focus:border-synapse focus:outline-none"
            placeholder="Thabo from Sosh"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="comment-message" className="block text-sm font-medium text-ivory mb-1.5">
            Your comment
          </label>
          <textarea
            id="comment-message"
            required
            minLength={2}
            maxLength={2000}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-border text-ivory placeholder:text-muted focus:border-synapse focus:outline-none resize-y"
            placeholder="Say what you think, ask a question, or point out where I am wrong."
          />
        </div>

        {/* Honeypot: hidden from people, bots fill it in */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          name="website"
        />

        {error && <p className="text-sm text-synapse mb-3">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ivory text-void font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <MessageCircle className="w-4 h-4" />
          {sending ? 'Posting…' : 'Post comment'}
        </button>
      </form>
    </div>
  )
}
