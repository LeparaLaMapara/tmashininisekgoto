import Image from 'next/image'
import { slugify } from '@/lib/utils'
import { CopyButton } from './copy-button'
import type { MDXComponents } from 'mdx/types'
import type { DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes, AnchorHTMLAttributes, BlockquoteHTMLAttributes } from 'react'

function HeadingWithAnchor({
  as: Tag,
  children,
  ...props
}: {
  as: 'h2' | 'h3'
  children?: React.ReactNode
} & DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  const text = typeof children === 'string' ? children : ''
  const id = slugify(text)

  return (
    <Tag id={id} className="group relative scroll-mt-24" {...props}>
      {children}
      <a
        href={`#${id}`}
        aria-label={`Link to ${text}`}
        className="ml-2 text-synapse/0 transition-colors group-hover:text-synapse/60"
      >
        #
      </a>
    </Tag>
  )
}

function Pre({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>) {
  // Extract raw text from code children for copy button
  let codeText = ''
  let language = ''

  if (
    children &&
    typeof children === 'object' &&
    'props' in (children as React.ReactElement)
  ) {
    const codeEl = children as React.ReactElement<{
      children?: string
      className?: string
    }>
    codeText = typeof codeEl.props.children === 'string' ? codeEl.props.children : ''
    const match = codeEl.props.className?.match(/language-(\w+)/)
    language = match?.[1] ?? ''
  }

  return (
    <div className="group relative">
      {language && (
        <span className="absolute left-4 top-2 text-[11px] font-mono uppercase tracking-wider text-muted/60">
          {language}
        </span>
      )}
      <CopyButton text={codeText} />
      <pre {...props} className="!mt-0 pt-8">
        {children}
      </pre>
    </div>
  )
}

function InlineCode({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  return (
    <code
      className="rounded-md bg-surface px-1.5 py-0.5 text-sm font-mono text-accent before:content-none after:content-none"
      {...props}
    >
      {children}
    </code>
  )
}

function MdxImage({
  src,
  alt,
}: ImgHTMLAttributes<HTMLImageElement>) {
  if (!src || typeof src !== 'string') return null

  return (
    <span className="block my-8">
      <Image
        src={src}
        alt={alt ?? ''}
        width={800}
        height={450}
        className="rounded-xl border border-border w-full h-auto"
        sizes="(max-width: 768px) 100vw, 800px"
      />
    </span>
  )
}

function MdxLink({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http')

  return (
    <a
      href={href}
      className="text-synapse underline decoration-synapse/30 underline-offset-4 transition-colors hover:decoration-synapse"
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  )
}

function Blockquote({
  children,
  ...props
}: DetailedHTMLProps<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) {
  return (
    <blockquote
      className="border-l-4 border-synapse/50 bg-surface/50 pl-6 py-4 italic text-muted not-italic [&>p]:text-ivory/80"
      {...props}
    >
      {children}
    </blockquote>
  )
}

export const mdxComponents: MDXComponents = {
  h2: (props) => <HeadingWithAnchor as="h2" {...props} />,
  h3: (props) => <HeadingWithAnchor as="h3" {...props} />,
  pre: Pre,
  code: InlineCode,
  img: MdxImage as MDXComponents['img'],
  a: MdxLink as MDXComponents['a'],
  blockquote: Blockquote as MDXComponents['blockquote'],
}
