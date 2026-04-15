import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Talents d'Afrique"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FDF6EC',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#1A0E06',
            marginBottom: 16,
          }}
        >
          Talents d&apos;<span style={{ color: '#C8920A' }}>Afrique</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#555',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Chacun a un talent. La communauté en a besoin.
        </div>
        <div
          style={{
            marginTop: 32,
            padding: '10px 28px',
            borderRadius: 12,
            background: '#C8920A',
            color: '#1A0E06',
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          Partage · Entraide · Confiance
        </div>
      </div>
    ),
    { ...size }
  )
}
