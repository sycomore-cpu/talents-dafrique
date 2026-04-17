import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Se connecter — Talents d\'Afrique',
  description: 'Connectez-vous à votre espace Talents d\'Afrique.',
  robots: 'noindex',
}

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
