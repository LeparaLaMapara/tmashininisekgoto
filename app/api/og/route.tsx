import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

/*
 * The share card, in the signwriter identity: the amber dot matrix
 * destination board, the minibus livery stripes, and a yellow sign board
 * carrying the page title.
 *
 * Fonts are bundled static TTFs (satori cannot read woff2 or variable fonts).
 * Bungee has no lowercase, so it only sets the short logo; titles of any
 * length use Work Sans. Doto has no arrow glyphs, hence ">" on the board.
 */
const bungee = fetch(new URL('./fonts/Bungee-Regular.ttf', import.meta.url)).then((r) => r.arrayBuffer())
const workSans = fetch(new URL('./fonts/WorkSans-SemiBold.ttf', import.meta.url)).then((r) => r.arrayBuffer())
const doto = fetch(new URL('./fonts/Doto-Black.ttf', import.meta.url)).then((r) => r.arrayBuffer())

const INK = '#111111'
const WALL = '#ffffff'
const BOARD = '#ffd23f'
const AMBER = '#ffb000'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'Thabang Mashinini-Sekgoto'
  const subtitle =
    searchParams.get('subtitle') ?? 'I build AI systems that work in the real world.'

  // Long blog titles step down so they still fit the board in three lines.
  const titleSize = title.length > 80 ? 40 : title.length > 50 ? 48 : 58

  const [bungeeData, workSansData, dotoData] = await Promise.all([bungee, workSans, doto])

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: WALL,
          padding: '40px 56px 36px',
          fontFamily: 'Work Sans',
        }}
      >
        {/* Destination board */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0c0c0c',
            border: '6px solid #2b2b2b',
            padding: '10px 22px',
            fontFamily: 'Doto',
            fontSize: 38,
            letterSpacing: 3,
            color: AMBER,
          }}
        >
          SOSHANGUVE &gt; PRODUCTION
        </div>

        {/* Livery stripes */}
        <div style={{ display: 'flex', flexDirection: 'column', margin: '18px -56px 22px' }}>
          <div style={{ height: 12, backgroundColor: '#e03a1e' }} />
          <div style={{ height: 4 }} />
          <div style={{ height: 10, backgroundColor: '#1d6fd1' }} />
          <div style={{ height: 4 }} />
          <div style={{ height: 8, backgroundColor: '#f2b705' }} />
        </div>

        {/* Sign board with the title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            backgroundColor: BOARD,
            border: `6px solid ${INK}`,
            boxShadow: `10px 10px 0 ${INK}`,
            padding: '24px 34px',
            marginRight: 10,
          }}
        >
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 600,
              color: INK,
              lineHeight: 1.08,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 24, color: '#2b2b2b', marginTop: 14, lineHeight: 1.35 }}>
            {subtitle}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 26,
          }}
        >
          <div style={{ display: 'flex', fontFamily: 'Bungee', fontSize: 34, color: INK }}>
            THABANG<span style={{ color: '#d62828' }}>.</span>
          </div>
          <div style={{ fontSize: 22, color: INK }}>www.tmashininisekgoto.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Bungee', data: bungeeData, weight: 400, style: 'normal' },
        { name: 'Work Sans', data: workSansData, weight: 600, style: 'normal' },
        { name: 'Doto', data: dotoData, weight: 900, style: 'normal' },
      ],
    },
  )
}
