import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Talents d'Afrique"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #3D2B1F 0%, #5C3D2E 50%, #C8920A 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
        }}
      >
        <div style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(200,146,10,0.15)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(200,146,10,0.10)',
          display: 'flex',
        }} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          padding: '0 60px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-1px',
            lineHeight: 1.1,
          }}>
            Talents d&apos;Afrique
          </div>
          <div style={{
            fontSize: 26,
            color: '#C8920A',
            fontWeight: 500,
          }}>
            🌍 La communauté des talents de la diaspora africaine
          </div>
          <div style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 700,
            lineHeight: 1.5,
          }}>
            Beauté · Maison · Couture · Saveurs · Savoir · Bien-être · Assistance
          </div>
        </div>
        <div style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(200,146,10,0.2)',
          border: '1px solid rgba(200,146,10,0.4)',
          borderRadius: 999,
          padding: '8px 20px',
          color: '#C8920A',
          fontSize: 16,
          fontWeight: 600,
        }}>
          talentsdafrique.com
        </div>
      </div>
    ),
    { ...size }
  )
}
