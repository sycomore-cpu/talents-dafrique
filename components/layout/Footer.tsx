import React from 'react'
import Link from 'next/link'
import { LogoMark } from '@/components/layout/LogoMark'

const footerLinks = [
  {
    title: 'Navigation',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Nos Espaces', href: '/cases' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { label: 'Partager mon talent', href: '/inscription' },
      { label: 'Comment ça marche', href: '/comment-ca-marche' },
      { label: 'Parrainage', href: '/parrainage' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'CGU', href: '/cgu' },
      { label: 'Confidentialité', href: '/confidentialite' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-cream border-t border-brown/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md"
              aria-label="Talents d'Afrique - Accueil"
            >
              <LogoMark size="md" />
            </Link>
            <p className="text-sm text-brown/60 max-w-[240px] leading-relaxed italic">
              &ldquo;Le partage est en nous, la confiance est entre nous.&rdquo;
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-brown/40 uppercase tracking-wider">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-brown/70 hover:text-brown transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Kente divider */}
        <div className="kente-divider mt-10" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brown/40">
          <span>© 2025 Talents d&apos;Afrique. Tous droits réservés.</span>
          <span>Fait avec ❤️ pour ceux qui partagent</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
