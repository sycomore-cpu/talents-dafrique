import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Talents d'Afrique",
    short_name: 'TdA',
    description: "La communauté des talents — partage, entraide, confiance",
    start_url: '/',
    display: 'standalone',
    background_color: '#FDF6EC',
    theme_color: '#C8920A',
    icons: [
      { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  }
}
