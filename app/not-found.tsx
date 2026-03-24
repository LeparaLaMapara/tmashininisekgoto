import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-synapse/10 border border-synapse/20">
          <span className="font-display text-2xl font-bold text-synapse">404</span>
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">Page not found</h1>
        <p className="text-muted mb-8">
          This page doesn&apos;t exist. Maybe the neural network hasn&apos;t grown this
          connection yet.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-ivory text-sm font-medium hover:bg-surface transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go home
          </Link>
          <Link
            href="/ai"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-synapse/10 text-synapse text-sm font-medium border border-synapse/20 hover:bg-synapse/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Ask Thabang AI
          </Link>
        </div>
      </div>
    </div>
  )
}
