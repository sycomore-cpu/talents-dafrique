import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'parraine'
  | 'observation'
  | 'suspendu'
  | 'pioneer'
  | 'case'
  | 'kory'

type BadgeSize = 'sm' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  count?: number
  className?: string
  children?: React.ReactNode
}

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 6l3-2 2 2h2l3-2 2 2-2 4-3-1-2 1-3-1L2 6z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.5V8l2.5 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BanIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 1l1.8 4H14l-3.4 2.6 1.3 4L8 9.1 4.1 11.6l1.3-4L2 5h4.2L8 1z" />
    </svg>
  )
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-1.5 py-0.5 gap-0.5',
  default: 'text-xs px-2 py-1 gap-1',
}

const iconSizeClasses: Record<BadgeSize, string> = {
  sm: 'w-2.5 h-2.5',
  default: 'w-3 h-3',
}

export function Badge({
  variant = 'case',
  size = 'default',
  count,
  className,
  children,
}: BadgeProps) {
  const iconClass = iconSizeClasses[size]
  const sizeClass = sizeClasses[size]

  if (variant === 'parraine') {
    const label =
      children ??
      (count && count > 0 ? `Parrainé · ${count}` : 'Parrainé')
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          'bg-[#1B4332] text-white',
          sizeClass,
          className
        )}
      >
        <HandshakeIcon className={iconClass} />
        {label}
      </span>
    )
  }

  if (variant === 'observation') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          'bg-amber-50 text-amber-700 border border-amber-200',
          sizeClass,
          className
        )}
      >
        <ClockIcon className={iconClass} />
        {children ?? 'Nouveau membre'}
      </span>
    )
  }

  if (variant === 'suspendu') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          'bg-red-50 text-red-700 border border-red-200',
          sizeClass,
          className
        )}
      >
        <BanIcon className={iconClass} />
        {children ?? 'Suspendu'}
      </span>
    )
  }

  if (variant === 'pioneer') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          'bg-kory/10 text-kory-700 border border-kory/30',
          sizeClass,
          className
        )}
      >
        <StarIcon className={iconClass} />
        {children ?? 'Pionnier'}
      </span>
    )
  }

  if (variant === 'case') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          'bg-gray-100 text-gray-600 border border-gray-200',
          sizeClass,
          className
        )}
      >
        {children ?? 'Case'}
      </span>
    )
  }

  if (variant === 'kory') {
    return (
      <span
        className={cn(
          'kory-badge',
          sizeClass,
          className
        )}
      >
        {children ?? 'Kory'}
      </span>
    )
  }

  return null
}

export default Badge
