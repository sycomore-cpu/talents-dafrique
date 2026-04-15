'use client'

import React, { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { VILLES, CASES } from '@/lib/constants'

interface FilterBarProps {
  caseSlug?: string
  totalResults?: number
  className?: string
}

const DAYS_FILTERS = [
  { label: 'Semaine', value: 'semaine', days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] },
  { label: 'Week-end', value: 'weekend', days: ['Samedi', 'Dimanche'] },
]

export function FilterBar({
  caseSlug,
  totalResults,
  className,
}: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentCity = searchParams.get('ville') ?? ''
  const currentAvail = searchParams.getAll('dispo')
  const currentServices = searchParams.getAll('service')

  const caseData = caseSlug ? CASES.find((c) => c.slug === caseSlug) : null
  const availableServices = caseData?.services ?? []

  function buildParams(updates: Record<string, string | string[] | null>): string {
    const params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(updates)) {
      params.delete(key)
      if (value === null) continue
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else if (value) {
        params.set(key, value)
      }
    }
    // Reset page when filters change
    params.delete('page')
    return params.toString()
  }

  const navigate = useCallback(
    (qs: string) => {
      startTransition(() => {
        router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
      })
    },
    [router, pathname]
  )

  function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    navigate(buildParams({ ville: e.target.value || null }))
  }

  function handleAvailToggle(value: string) {
    const next = currentAvail.includes(value)
      ? currentAvail.filter((v) => v !== value)
      : [...currentAvail, value]
    navigate(buildParams({ dispo: next }))
  }

  function handleServiceToggle(service: string) {
    const next = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service]
    navigate(buildParams({ service: next }))
  }

  function handleReset() {
    navigate('')
  }

  const hasActiveFilters =
    currentCity !== '' ||
    currentAvail.length > 0 ||
    currentServices.length > 0

  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-4 rounded-2xl border border-brown/10 bg-white',
        isPending && 'opacity-70 pointer-events-none',
        className
      )}
      aria-label="Filtres"
    >
      {/* Results count + reset */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brown">
          {totalResults !== undefined ? (
            <>
              <span className="text-primary font-bold">{totalResults}</span>{' '}
              résultat{totalResults !== 1 ? 's' : ''}
            </>
          ) : (
            'Filtrer les talents'
          )}
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* City select */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-ville" className="text-xs font-semibold text-brown/50 uppercase tracking-wide">
          Ville
        </label>
        <div className="relative">
          <select
            id="filter-ville"
            value={currentCity}
            onChange={handleCityChange}
            className="w-full appearance-none rounded-lg border border-brown/15 bg-cream px-3 py-2 text-sm text-brown pr-8 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
          >
            <option value="">Toutes les villes</option>
            {VILLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-brown/40">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-brown/50 uppercase tracking-wide">
          Disponibilité
        </span>
        <div className="flex flex-col gap-1.5">
          {DAYS_FILTERS.map((filter) => {
            const checked = currentAvail.includes(filter.value)
            return (
              <label
                key={filter.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleAvailToggle(filter.value)}
                  className="w-4 h-4 rounded border-brown/25 text-primary focus:ring-primary/30 cursor-pointer"
                  aria-label={`Disponible en ${filter.label}`}
                />
                <span className={cn('text-sm transition-colors', checked ? 'text-primary font-medium' : 'text-brown/70 group-hover:text-brown')}>
                  {filter.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Sub-services chips (only if caseData has services) */}
      {availableServices.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-brown/50 uppercase tracking-wide">
            Services
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableServices.map((service) => {
              const active = currentServices.includes(service)
              return (
                <button
                  key={service}
                  onClick={() => handleServiceToggle(service)}
                  className={cn(
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                    active
                      ? 'bg-primary text-white border-primary'
                      : 'bg-transparent border-brown/15 text-brown/70 hover:border-brown/30 hover:text-brown'
                  )}
                  aria-pressed={active}
                >
                  {service}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterBar
