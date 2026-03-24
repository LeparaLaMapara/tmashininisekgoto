'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/components/ai/chat-message'
import { SuggestedQuestions } from '@/components/ai/suggested-questions'

export function ChatInterface() {
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, append } =
    useChat({
      api: '/api/chat',
      onError: (error) => {
        if (error.message.includes('limit')) {
          setRateLimitError(error.message)
        }
      },
      onResponse: (response) => {
        if (response.status === 429) {
          response.json().then((data) => {
            setRateLimitError(data.error)
          }).catch(() => {
            setRateLimitError('Daily message limit reached. Come back tomorrow!')
          })
        }
      },
    })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSelectQuestion(question: string) {
    append({ role: 'user', content: question })
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-16rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <SuggestedQuestions onSelect={handleSelectQuestion} />
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))
        )}

        {/* Loading indicator */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-synapse/20">
              <div className="h-3 w-3 rounded-full bg-synapse" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-surface border border-border px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-synapse/60 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-synapse/60 animate-pulse [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-synapse/60 animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Rate limit warning */}
      {rateLimitError && (
        <div className="mx-auto max-w-md rounded-xl border border-synapse/20 bg-synapse/5 px-4 py-3 text-center text-sm text-synapse">
          {rateLimitError}
        </div>
      )}

      {/* Input bar */}
      <div className="sticky bottom-0 pt-4 pb-2">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={rateLimitError ? 'Message limit reached' : 'Ask me anything about my work...'}
            className={cn(
              'w-full rounded-xl border border-border bg-surface/80 backdrop-blur-md',
              'px-4 py-3.5 pr-12 text-ivory placeholder:text-muted',
              'font-body text-sm',
              'focus:outline-none focus:ring-1 focus:ring-synapse/40 focus:border-synapse/40',
              'transition-all duration-200'
            )}
            disabled={isLoading || !!rateLimitError}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !!rateLimitError}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'flex h-8 w-8 items-center justify-center rounded-lg',
              'bg-synapse/20 text-synapse',
              'hover:bg-synapse/30 transition-colors duration-200',
              'disabled:opacity-30 disabled:cursor-not-allowed'
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-muted/60">
          AI representation. Responses are based on Thabang&apos;s public work and writing
        </p>
      </div>
    </div>
  )
}
