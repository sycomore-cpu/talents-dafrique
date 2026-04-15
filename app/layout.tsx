import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/layout/AuthProvider'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { Footer } from '@/components/layout/Footer'

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://talentsdafrique.com'
  ),
  title: {
    template: "%s | Talents d'Afrique",
    default: "Talents d'Afrique",
  },
  description:
    "La communauté des talents de la diaspora africaine en France. Trouvez des prestataires pour la beauté, la maison, la couture, les saveurs, le savoir, le bien-être et l'assistance.",
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: "Talents d'Afrique",
    title: "Talents d'Afrique",
    description:
      'La communauté des talents de la diaspora africaine en France.',
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#C8920A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-brown">
        <AuthProvider>
          {/* Desktop header — hidden on mobile */}
          <Header />

          {/* Main content */}
          <main className="flex-1 pb-safe-bottom md:pb-0">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile bottom navigation — hidden on desktop */}
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  )
}
