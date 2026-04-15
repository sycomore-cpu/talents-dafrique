import * as React from 'react'
import { cn } from '@/lib/utils'
import { formatKory } from '@/lib/utils'

type KoryVariant = 'compact' | 'full'

interface KoryBalanceProps {
  balance: number
  variant?: KoryVariant
  className?: string
}

function CoinSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="#E8B820" />
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="#a37408" strokeWidth="0.8" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#1A0E06"
        fontFamily="serif"
      >
        K
      </text>
    </svg>
  )
}

export function KoryBalance({
  balance,
  variant = 'compact',
  className,
}: KoryBalanceProps) {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 rounded-full bg-kory/10 text-brown',
          className
        )}
        title={`${formatKory(balance)}`}
      >
        <CoinSVG className="w-4 h-4 shrink-0" />
        <span className="text-sm font-semibold text-kory-700">
          {balance}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl bg-kory/10 border border-kory/20',
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-kory/20">
        <CoinSVG className="w-7 h-7" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-brown/50 uppercase tracking-wide font-medium">
          Solde Kory
        </span>
        <span className="text-2xl font-bold text-kory-700">
          {formatKory(balance)}
        </span>
      </div>
    </div>
  )
}

export default KoryBalance
