import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Créer un compte — Talents d\'Afrique',
  description: 'Rejoignez la communauté Talents d\'Afrique. Inscription gratuite en quelques minutes.',
}

export default function InscriptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
