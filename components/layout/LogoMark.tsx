import React from 'react'
import { cn } from '@/lib/utils'

interface LogoMarkProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeConfig = {
  sm: { logoSize: 28, textClass: 'text-base' },
  md: { logoSize: 36, textClass: 'text-xl' },
  lg: { logoSize: 52, textClass: 'text-2xl' },
}

function LogoSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        {/* Dégradé terracotta → bleu ardoise (fidèle au logo réel) */}
        <linearGradient id="lm-lg" gradientUnits="userSpaceOnUse" x1="15" y1="15" x2="105" y2="105">
          <stop offset="0%" stopColor="#C1440E" />
          <stop offset="45%" stopColor="#9B5E3A" />
          <stop offset="100%" stopColor="#2D4A6B" />
        </linearGradient>
        {/* Pattern chevron dans les bandes */}
        <pattern id="lm-chv" x="0" y="0" width="12" height="8" patternUnits="userSpaceOnUse">
          <polyline points="1,6 6,2 11,6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        </pattern>
        {/* 4 demi-plans pour l'interlacing */}
        <clipPath id="lm-top"><rect x="0" y="0" width="120" height="60" /></clipPath>
        <clipPath id="lm-bot"><rect x="0" y="60" width="120" height="60" /></clipPath>
        <clipPath id="lm-left"><rect x="0" y="0" width="60" height="120" /></clipPath>
        <clipPath id="lm-right"><rect x="60" y="0" width="60" height="120" /></clipPath>
      </defs>

      {/* Loop 1 : ovale horizontal — couche du dessous pour les croisements verticaux */}
      <ellipse cx="60" cy="60" rx="46" ry="18" fill="none" stroke="url(#lm-lg)" strokeWidth="11" clipPath="url(#lm-bot)" />
      <ellipse cx="60" cy="60" rx="46" ry="18" fill="none" stroke="url(#lm-chv)" strokeWidth="11" clipPath="url(#lm-bot)" />

      {/* Loop 2 : ovale vertical */}
      <ellipse cx="60" cy="60" rx="18" ry="46" fill="none" stroke="url(#lm-lg)" strokeWidth="11" />
      <ellipse cx="60" cy="60" rx="18" ry="46" fill="none" stroke="url(#lm-chv)" strokeWidth="11" />

      {/* Loop 1 par-dessus (moitié haute) */}
      <ellipse cx="60" cy="60" rx="46" ry="18" fill="none" stroke="url(#lm-lg)" strokeWidth="11" clipPath="url(#lm-top)" />
      <ellipse cx="60" cy="60" rx="46" ry="18" fill="none" stroke="url(#lm-chv)" strokeWidth="11" clipPath="url(#lm-top)" />

      {/* Loop 3 : ovale diagonal 45° — couche du dessous */}
      <ellipse cx="60" cy="60" rx="46" ry="18" transform="rotate(45,60,60)" fill="none" stroke="url(#lm-lg)" strokeWidth="11" clipPath="url(#lm-right)" />
      <ellipse cx="60" cy="60" rx="46" ry="18" transform="rotate(45,60,60)" fill="none" stroke="url(#lm-chv)" strokeWidth="11" clipPath="url(#lm-right)" />

      {/* Loop 4 : ovale diagonal -45° */}
      <ellipse cx="60" cy="60" rx="46" ry="18" transform="rotate(-45,60,60)" fill="none" stroke="url(#lm-lg)" strokeWidth="11" />
      <ellipse cx="60" cy="60" rx="46" ry="18" transform="rotate(-45,60,60)" fill="none" stroke="url(#lm-chv)" strokeWidth="11" />

      {/* Loop 3 par-dessus (moitié gauche) */}
      <ellipse cx="60" cy="60" rx="46" ry="18" transform="rotate(45,60,60)" fill="none" stroke="url(#lm-lg)" strokeWidth="11" clipPath="url(#lm-left)" />
      <ellipse cx="60" cy="60" rx="46" ry="18" transform="rotate(45,60,60)" fill="none" stroke="url(#lm-chv)" strokeWidth="11" clipPath="url(#lm-left)" />
    </svg>
  )
}

export function LogoMark({
  size = 'md',
  showText = true,
  className,
}: LogoMarkProps) {
  const { logoSize, textClass } = sizeConfig[size]

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoSVG size={logoSize} />
      {showText && (
        <span
          className={cn('font-heading font-bold leading-none', textClass)}
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          <span className="text-brown">Talents d&rsquo;</span>
          <span className="text-primary">Afrique</span>
        </span>
      )}
    </span>
  )
}

export default LogoMark
