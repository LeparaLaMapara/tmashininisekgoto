import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'Thabang Mashinini-Sekgoto'
  const subtitle =
    searchParams.get('subtitle') ?? 'I build AI systems that work in the real world.'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          backgroundColor: '#faf6ee',
        }}
      >
        {/* Blanket stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '14px',
            display: 'flex',
          }}
        >
          <div style={{ flex: 4, backgroundColor: '#b5501e' }} />
          <div style={{ flex: 1.5, backgroundColor: '#a8742a' }} />
          <div style={{ flex: 2.5, backgroundColor: '#1f5c3a' }} />
          <div style={{ flex: 2, backgroundColor: '#201911' }} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: '#201911',
              lineHeight: 1.15,
              maxWidth: '980px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: '#6e6353',
              maxWidth: '860px',
              lineHeight: 1.4,
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
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#b5501e',
            }}
          />
          <div style={{ fontSize: 22, color: '#b5501e', fontWeight: 600 }}>
            tmashininisekgoto.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
