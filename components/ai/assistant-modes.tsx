'use client'

import { useState } from 'react'
import { Phone, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CallMode } from '@/components/ai/call-mode'
import { ChatInterface } from '@/components/ai/chat-interface'

/** Call or type: the same assistant, two ways in. Call is the default. */
export function AssistantModes() {
  const [mode, setMode] = useState<'call' | 'type'>('call')
  const tab = (m: 'call' | 'type', label: string, Icon: typeof Phone) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => setMode(m)}
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold transition-colors',
        mode === m ? 'border-synapse/40 bg-synapse/15 text-synapse' : 'border-border text-muted hover:text-ivory'
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  )
  return (
    <div>
      <div role="tablist" aria-label="How to talk to the assistant" className="mb-8 flex justify-center gap-2">
        {tab('call', 'Call', Phone)}
        {tab('type', 'Type', MessageSquare)}
      </div>
      {mode === 'call' ? <CallMode /> : <ChatInterface />}
    </div>
  )
}
