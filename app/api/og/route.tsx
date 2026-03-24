import { ImageResponse } from '@vercel/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Thabang Mashinini-Sekgoto'
  const subtitle = searchParams.get('subtitle') || 'AI Systems Architect & Researcher'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          backgroundColor: '#06060a',
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.06) 0%, transparent 50%)',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#0ea5e9',
            }}
          />
          <span
            style={{
              fontSize: '20px',
              color: '#6b7280',
              fontFamily: 'sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
            }}
          >
            The Neural Observatory
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 40 ? '52px' : '64px',
            fontWeight: 700,
            color: '#faf4e8',
            lineHeight: 1.2,
            margin: 0,
            marginBottom: '16px',
            fontFamily: 'sans-serif',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '24px',
            color: '#6b7280',
            margin: 0,
            fontFamily: 'sans-serif',
          }}
        >
          {subtitle}
        </p>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(to right, #0ea5e9, #06b6d4, #f59e0b)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
