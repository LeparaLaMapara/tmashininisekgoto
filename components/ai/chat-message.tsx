'use client'

import { useState } from 'react'
import type { Message } from 'ai'
import ReactMarkdown from 'react-markdown'
import { Copy, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: Message
  isLast: boolean
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className={cn(
            'max-w-[80%] rounded-2xl rounded-tr-sm',
            'bg-synapse/10 border border-synapse/20',
            'px-4 py-3 text-ivory text-sm font-body'
          )}
        >
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 group">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-synapse/20">
        <Sparkles className="h-4 w-4 text-synapse" />
      </div>

      {/* Message bubble */}
      <div className="relative max-w-[85%]">
        <div
          className={cn(
            'rounded-2xl rounded-tl-sm',
            'bg-surface border border-border',
            'px-4 py-3 text-sm font-body text-ivory/90'
          )}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-ivory">{children}</strong>
              ),
              em: ({ children }) => <em className="text-synapse/80">{children}</em>,
              a: ({ href, children }) => {
                const isDownload = href?.endsWith('.pdf')
                const isInternal = href?.startsWith('/')
                return (
                  <a
                    href={href}
                    {...(isDownload ? { download: true } : {})}
                    {...(!isInternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-synapse hover:text-accent underline underline-offset-2 transition-colors"
                  >
                    {children}
                  </a>
                )
              },
              ul: ({ children }) => (
                <ul className="mb-2 ml-4 list-disc space-y-1 text-ivory/80">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-2 ml-4 list-decimal space-y-1 text-ivory/80">{children}</ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              code: ({ children, className }) => {
                const isInline = !className
                if (isInline) {
                  return (
                    <code className="rounded bg-void/60 px-1.5 py-0.5 font-mono text-xs text-synapse">
                      {children}
                    </code>
                  )
                }
                return (
                  <code className="block overflow-x-auto rounded-lg bg-void/60 p-3 font-mono text-xs text-ivory/80">
                    {children}
                  </code>
                )
              },
              pre: ({ children }) => <pre className="mb-2 last:mb-0">{children}</pre>,
              blockquote: ({ children }) => (
                <blockquote className="mb-2 border-l-2 border-synapse/40 pl-3 text-muted italic">
                  {children}
                </blockquote>
              ),
              h3: ({ children }) => (
                <h3 className="mb-1 mt-3 font-display font-semibold text-ivory">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="mb-1 mt-2 font-display font-medium text-ivory/90">{children}</h4>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={cn(
            'absolute -bottom-3 right-2',
            'flex h-6 items-center gap-1 rounded-md px-2',
            'bg-surface border border-border',
            'text-[10px] text-muted hover:text-ivory',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
