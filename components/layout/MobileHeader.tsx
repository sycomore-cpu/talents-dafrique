'use client'

import React from 'react'
import Link from 'next/link'
import { LogoMark } from './LogoMark'
import { NotificationBell } from './NotificationBell'
import { KoryBalance } from '@/components/ui/KoryBalance'
import { useAuth } from './AuthProvider'

/**
 * Compact top bar visible only on mobile (md:hidden).
 * Shows brand logo + Kory balance (if logged in) + notification bell.
 */
export function MobileHeader() {
  const { profile } = useAuth()

  return (
    <header
      className="md:hidden sticky top-0 z-40 bg-cream border-b border-brown/10 shadow-sm"
      role="banner"
    >
      <div className="h-14 px-4 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md"
          aria-label="Talents d'Afrique — Accueil"
        >
          <LogoMark size="sm" />
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {profile && (
            <KoryBalance balance={profile.kory_balance} variant="compact" />
          )}
          <NotificationBell />
          {!profile && (
            <Link
              href="/connexion"
              className="text-xs font-semibold text-primary border border-primary/30 rounded-full px-3 py-1.5 hover:bg-primary/5 active:scale-95 transition-all"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default MobileHeader
