import * as React from 'react'
import { cn } from '@/lib/utils'
import { getCaseBySlug } from '@/lib/utils'

type CaseIconSize = 'sm' | 'md' | 'lg'

interface CaseIconProps {
  caseSlug: string
  size?: CaseIconSize
  className?: string
}

const sizeConfig: Record<
  CaseIconSize,
  { container: string; emoji: string; label: string }
> = {
  sm: { container: 'w-8 h-8 rounded-lg', emoji: 'text-lg', label: 'hidden' },
  md: {
    container: 'w-12 h-12 rounded-xl flex-col gap-0.5',
    emoji: 'text-2xl',
    label: 'text-xs font-medium text-brown/70 leading-none',
  },
  lg: {
    container: 'w-full rounded-2xl flex-col gap-2 p-4 border',
    emoji: 'text-5xl',
    label: 'text-base font-semibold text-brown',
  },
}

export function CaseIcon({ caseSlug, size = 'md', className }: CaseIconProps) {
  const caseData = getCaseBySlug(caseSlug)

  if (!caseData) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center bg-gray-100 text-gray-400',
          sizeConfig[size].container,
          className
        )}
        aria-label="Case inconnue"
      >
        <span className={sizeConfig[size].emoji}>?</span>
      </div>
    )
  }

  const config = sizeConfig[size]

  if (size === 'sm') {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center',
          caseData.color,
          config.container,
          className
        )}
        title={caseData.label}
        aria-label={caseData.label}
      >
        <span className={config.emoji} role="img" aria-label={caseData.label}>
          {caseData.icon}
        </span>
      </div>
    )
  }

  if (size === 'md') {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center',
          caseData.color,
          config.container,
          className
        )}
        aria-label={caseData.label}
      >
        <span className={config.emoji} role="img" aria-label={caseData.label}>
          {caseData.icon}
        </span>
        <span className={config.label}>{caseData.label.replace('Case ', '')}</span>
      </div>
    )
  }

  // lg - full card
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        caseData.color,
        config.container,
        className
      )}
      aria-label={caseData.label}
    >
      <span className={config.emoji} role="img" aria-label={caseData.label}>
        {caseData.icon}
      </span>
      <span className={config.label}>{caseData.label}</span>
      <span className="text-sm text-brown/60 mt-1">{caseData.description}</span>
    </div>
  )
}

export default CaseIcon
