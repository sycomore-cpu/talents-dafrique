import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CASES } from '@/lib/constants'

function ArrowRightIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

interface CaseGridProps {
  className?: string
}

export function CaseGrid({ className }: CaseGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4',
        className
      )}
      role="list"
      aria-label="Les Cases"
    >
      {CASES.map((c) => (
        <div key={c.slug} role="listitem">
          <Link
            href={`/cases/${c.slug}`}
            className={cn(
              'flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-200 group',
              'hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              c.color
            )}
            aria-label={`${c.label} - ${c.description}`}
          >
            {/* Emoji icon */}
            <span
              className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-200"
              role="img"
              aria-label={c.label}
            >
              {c.icon}
            </span>

            {/* Label */}
            <h3 className="font-semibold text-brown text-sm leading-snug mb-1">
              {c.label}
            </h3>

            {/* Description */}
            <p className="text-xs text-brown/60 leading-relaxed mb-3 line-clamp-2">
              {c.description}
            </p>

            {/* CTA */}
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
              Voir les talents
              <ArrowRightIcon />
            </span>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default CaseGrid
