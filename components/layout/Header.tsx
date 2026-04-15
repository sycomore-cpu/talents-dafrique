'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CASES } from '@/lib/constants'
import { useAuth } from '@/components/layout/AuthProvider'
import Avatar from '@/components/ui/Avatar'
import KoryBalance from '@/components/ui/KoryBalance'
import Button from '@/components/ui/Button'
import { LogoMark } from '@/components/layout/LogoMark'

function CasesDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-brown/80 hover:text-brown transition-colors px-2 py-1.5 rounded-md hover:bg-brown/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Nos Espaces
        <svg
          className={cn('w-4 h-4 transition-transform', open && 'rotate-180')}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-brown/10 bg-cream shadow-lg z-50 py-2">
          {CASES.map((c) => (
            <Link
              key={c.slug}
              href={`/cases/${c.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-brown/5 transition-colors"
            >
              <span className="text-xl" role="img" aria-label={c.label}>
                {c.icon}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-brown">{c.label}</div>
                <div className="text-xs text-brown/50 truncate">{c.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const { user, profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  if (!user || !profile) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" href="/connexion">
          Mon espace
        </Button>
        <Button variant="primary" size="sm" href="/inscription">
          Partager mon talent
        </Button>
      </div>
    )
  }

  return (
    <div className="relative flex items-center gap-3" ref={ref}>
      <KoryBalance balance={profile.kory_balance} variant="compact" />

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-expanded={open}
        aria-label="Menu utilisateur"
      >
        <Avatar
          src={profile.avatar_url}
          name={profile.name}
          size="sm"
          ring={profile.status === 'parraine' ? 'kory' : 'none'}
        />
        <span className="text-sm font-medium text-brown max-w-[120px] truncate">
          {profile.name.split(' ')[0]}
        </span>
        <svg
          className={cn('w-4 h-4 text-brown/50 transition-transform', open && 'rotate-180')}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-brown/10 bg-cream shadow-lg z-50 py-2">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-brown hover:bg-brown/5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zM11 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" />
            </svg>
            Mon tableau de bord
          </Link>
          <Link
            href="/profil"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-brown hover:bg-brown/5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Mon profil
          </Link>
          {profile.is_admin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-brown hover:bg-brown/5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Administration
            </Link>
          )}
          <div className="my-1 border-t border-brown/10" />
          <button
            onClick={() => { setOpen(false); signOut() }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 hidden md:block bg-cream border-b border-brown/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md"
          aria-label="Talents d'Afrique - Accueil"
        >
          <LogoMark size="sm" />
        </Link>

        {/* Center nav */}
        <nav className="flex items-center gap-1" aria-label="Navigation principale">
          <CasesDropdown />
          <Link
            href="/blog"
            className={cn(
              'text-sm font-medium px-2 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              pathname?.startsWith('/blog')
                ? 'text-primary bg-primary/5'
                : 'text-brown/80 hover:text-brown hover:bg-brown/5'
            )}
          >
            Blog
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
