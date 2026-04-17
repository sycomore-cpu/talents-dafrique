'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/layout/AuthProvider'

interface NavItem {
  href: string
  label: string
  matchPaths?: string[]
  icon: (active: boolean) => React.ReactNode
  adminOnly?: boolean
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill={active ? '#C8920A' : 'none'}
      stroke={active ? '#C8920A' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12L12 3l9 9" />
      <path d="M9 21V12h6v9" />
      <path d="M3 12v9h5v-9" strokeWidth="0" />
      <path d="M16 21v-9h5v9" strokeWidth="0" />
    </svg>
  )
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill={active ? '#C8920A' : 'none'}
      stroke={active ? '#C8920A' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill={active ? '#C8920A' : 'none'}
      stroke={active ? '#C8920A' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill={active ? '#C8920A' : 'none'}
      stroke={active ? '#C8920A' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function ShieldIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill={active ? '#C8920A' : 'none'}
      stroke={active ? '#C8920A' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3L4 7v5c0 5 4 9 8 10 4-1 8-5 8-10V7l-8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function PlusIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill="none"
      stroke={active ? '#C8920A' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

const staticNavItems: NavItem[] = [
  {
    href: '/',
    label: '🏠 Accueil',
    matchPaths: ['/'],
    icon: (active) => <HomeIcon active={active} />,
  },
  {
    href: '/cases/beaute',
    label: 'Explorer',
    matchPaths: ['/cases'],
    icon: (active) => <GridIcon active={active} />,
  },
  {
    href: '/admin',
    label: 'Admin',
    matchPaths: ['/admin'],
    icon: (active) => <ShieldIcon active={active} />,
    adminOnly: true,
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const { profile } = useAuth()

  // Auth-aware dynamic items
  const proposerHref = profile ? '/dashboard?tab=profil' : '/inscription'
  const proposerLabel = profile ? 'Mon espace' : 'Proposer'

  const profilHref = profile ? '/dashboard' : '/connexion'
  const profilLabel = profile ? (profile.name.split(' ')[0]) : 'Connexion'

  const dynamicItems: NavItem[] = [
    {
      href: proposerHref,
      label: proposerLabel,
      matchPaths: profile ? ['/dashboard'] : ['/inscription'],
      icon: (active) => <PlusIcon active={active} />,
    },
    {
      href: profilHref,
      label: profilLabel,
      matchPaths: profile ? ['/profil', '/dashboard'] : ['/connexion'],
      icon: (active) => <UserIcon active={active} />,
    },
  ]

  const visibleItems = [
    ...staticNavItems.filter((item) => !item.adminOnly || profile?.is_admin),
    ...dynamicItems,
  ]

  function isActive(item: NavItem): boolean {
    if (!pathname) return false
    if (item.matchPaths) {
      return item.matchPaths.some((p) =>
        p === '/' ? pathname === '/' : pathname.startsWith(p)
      )
    }
    return pathname === item.href
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream border-t border-brown/10 shadow-[0_-1px_4px_rgba(26,14,6,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigation mobile"
    >
      {/* Logged-in user identity bar */}
      {profile && (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 border-b border-brown/8 bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <span className="text-xs font-semibold text-primary truncate">
            {profile.name}
          </span>
          <span className="ml-auto text-[10px] text-brown/50 shrink-0">Tableau de bord →</span>
        </Link>
      )}
      <div className="flex items-stretch">
        {visibleItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 px-1 min-w-0 transition-colors',
                active ? 'text-primary' : 'text-brown/50 hover:text-brown/80'
              )}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {item.icon(active)}
              <span
                className={cn(
                  'text-[10px] leading-none font-medium truncate',
                  active ? 'text-primary' : 'text-brown/50'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav
