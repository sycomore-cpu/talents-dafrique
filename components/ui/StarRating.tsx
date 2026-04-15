'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type StarSize = 'sm' | 'md'

interface StarRatingProps {
  rating: number
  size?: StarSize
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
  showValue?: boolean
}

const sizeConfig: Record<StarSize, { starClass: string; textClass: string }> = {
  sm: { starClass: 'w-3.5 h-3.5', textClass: 'text-xs' },
  md: { starClass: 'w-5 h-5', textClass: 'text-sm' },
}

function StarIcon({
  filled,
  half,
  className,
}: {
  filled: boolean
  half?: boolean
  className?: string
}) {
  if (half) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="#E8B820" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#half-fill)"
          stroke="#E8B820"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? '#E8B820' : 'none'}
        stroke={filled ? '#E8B820' : '#E8B820'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity={filled ? 1 : 0.35}
      />
    </svg>
  )
}

export function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  className,
  showValue = false,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const config = sizeConfig[size]
  const displayRating = hovered !== null ? hovered : rating
  const clampedRating = Math.min(5, Math.max(0, displayRating))

  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1
    const filled = clampedRating >= starValue
    const half = !filled && clampedRating >= starValue - 0.5 && clampedRating > i
    return { filled, half, value: starValue }
  })

  if (interactive) {
    return (
      <div
        className={cn('inline-flex items-center gap-0.5', className)}
        role="radiogroup"
        aria-label="Note"
      >
        {stars.map(({ value }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={Math.round(rating) === value}
            aria-label={`${value} étoile${value > 1 ? 's' : ''}`}
            className={cn(
              'cursor-pointer transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-kory rounded',
              config.starClass
            )}
            onClick={() => onChange?.(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(null)}
          >
            <StarIcon
              filled={(hovered !== null ? hovered : rating) >= value}
              className="w-full h-full"
            />
          </button>
        ))}
        {showValue && (
          <span className={cn('ml-1 text-brown/60 font-medium', config.textClass)}>
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${rating} étoiles sur 5`}>
      {stars.map(({ filled, half, value }) => (
        <StarIcon
          key={value}
          filled={filled}
          half={half}
          className={config.starClass}
        />
      ))}
      {showValue && (
        <span className={cn('ml-1 text-brown/60 font-medium', config.textClass)}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating
