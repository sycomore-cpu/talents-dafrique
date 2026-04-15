import * as React from 'react'
import { cn } from '@/lib/utils'
import { AVAILABILITY_DAYS } from '@/lib/constants'

interface AvailabilityBadgesProps {
  availability: Record<string, { start: string; end: string }>
  className?: string
  compact?: boolean
}

const DAY_ABBR: Record<string, string> = {
  Lundi: 'Lun',
  Mardi: 'Mar',
  Mercredi: 'Mer',
  Jeudi: 'Jeu',
  Vendredi: 'Ven',
  Samedi: 'Sam',
  Dimanche: 'Dim',
}

export function AvailabilityBadges({
  availability,
  className,
  compact = false,
}: AvailabilityBadgesProps) {
  return (
    <div className={cn('flex flex-wrap gap-1', className)} aria-label="Disponibilités">
      {AVAILABILITY_DAYS.map((day) => {
        const slot = availability[day]
        const isAvailable = Boolean(slot?.start && slot?.end)
        const abbr = compact ? DAY_ABBR[day] ?? day.slice(0, 3) : day

        return (
          <span
            key={day}
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
              isAvailable
                ? 'bg-secondary/10 text-secondary border border-secondary/20'
                : 'bg-brown/5 text-brown/30 border border-brown/10'
            )}
            title={
              isAvailable
                ? `${day}: ${slot.start} – ${slot.end}`
                : `${day}: Indisponible`
            }
            aria-label={`${day}: ${isAvailable ? `disponible de ${slot.start} à ${slot.end}` : 'indisponible'}`}
          >
            {isAvailable && (
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1 shrink-0" aria-hidden="true" />
            )}
            {abbr}
          </span>
        )
      })}
    </div>
  )
}

export default AvailabilityBadges
