import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'Thabang Mashinini-Sekgoto'
  const subtitle = searchParams.get('subtitle') ?? 'Lead Data Scientist · AI & Analytics Engineering Leader'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          backgroundColor: '#0a0a0f',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0d1b2a 0%, transparent 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#f5f0eb',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#8b8b9e',
              maxWidth: '800px',
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#00e5a0',
            }}
          />
          <div style={{ fontSize: 20, color: '#00e5a0' }}>
            tmashininisekgoto.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
