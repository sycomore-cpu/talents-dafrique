import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mon tableau de bord',
  description: 'Gérez vos réservations, votre profil et vos Korys sur Talents d\'Afrique.',
  robots: 'noindex',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
