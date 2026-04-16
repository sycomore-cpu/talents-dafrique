import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { slugify, getCaseBySlug } from '@/lib/utils'
import type { Profile } from '@/lib/supabase/types'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import AvailabilityBadges from '@/components/talent/AvailabilityBadges'

interface TalentCardProps {
  talent: Profile & { average_rating?: number }
  className?: string
}

function getTalentSlug(talent: Profile): string {
  return `${slugify(talent.name)}-${talent.id.slice(0, 6)}`
}

function getAvailableDays(
  availability: Record<string, { start: string; end: string }>
): string[] {
  return Object.entries(availability)
    .filter(([, slot]) => slot?.start && slot?.end)
    .map(([day]) => day)
}

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

export function TalentCard({ talent, className }: TalentCardProps) {
  const caseData = talent.case_slug ? getCaseBySlug(talent.case_slug) : null
  const talentSlug = getTalentSlug(talent)
  // Les IDs mock (ex: "mock-beaute-1") n'ont pas de vraie page — on désactive
  const isMock = talent.id.startsWith('mock-')
  const profileHref = isMock
    ? null
    : caseData
    ? `/cases/${caseData.slug}/${talentSlug}`
    : `/talent/${talentSlug}`

  const availableDays = getAvailableDays(talent.availability ?? {})
  const weekendDays = availableDays.filter(
    (d) => d === 'Samedi' || d === 'Dimanche'
  )
  const weekDays = availableDays.filter(
    (d) => d !== 'Samedi' && d !== 'Dimanche'
  )

  const rating = talent.average_rating ?? 0
  const reviewCount = talent.review_count ?? 0
  const coverPhoto = talent.photos?.[0] ?? null

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl border border-brown/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200',
        talent.status === 'parraine' && 'border-t-2 border-t-primary/30',
        className
      )}
    >
      {/* Card header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        {/* Avatar */}
        {profileHref ? (
          <Link
            href={profileHref}
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-full"
            tabIndex={-1}
            aria-hidden="true"
          >
            <Avatar
              src={talent.avatar_url}
              name={talent.name}
              size="lg"
              ring={talent.status === 'parraine' ? 'kory' : 'none'}
            />
          </Link>
        ) : (
          <Avatar
            src={talent.avatar_url}
            name={talent.name}
            size="lg"
            ring={talent.status === 'parraine' ? 'kory' : 'none'}
          />
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {profileHref ? (
              <Link
                href={profileHref}
                className="font-semibold text-brown hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded truncate"
              >
                {talent.name}
              </Link>
            ) : (
              <span className="font-semibold text-brown truncate">{talent.name}</span>
            )}
            <Badge
              variant={
                talent.status === 'parraine'
                  ? 'parraine'
                  : talent.status === 'suspendu'
                  ? 'suspendu'
                  : 'observation'
              }
              size="sm"
              count={
                talent.status === 'parraine'
                  ? Math.abs(parseInt(talent.id.replace(/\D/g, '').slice(-2) || '3')) % 4 + 1
                  : undefined
              }
            />
          </div>

          {/* Case + city */}
          <p className="text-sm text-brown/60 mt-0.5 truncate">
            {caseData && (
              <>
                <span role="img" aria-label={caseData.label} className="mr-1">
                  {caseData.icon}
                </span>
                {caseData.label}
              </>
            )}
            {talent.city && (
              <>
                {caseData && <span className="mx-1">·</span>}
                {talent.city}
              </>
            )}
          </p>

          {/* Star rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={rating} size="sm" showValue />
              <span className="text-xs text-brown/40">({reviewCount} avis)</span>
            </div>
          )}
        </div>
      </div>

      {/* Photo thumbnail */}
      {coverPhoto && (
        <div className="mx-4 rounded-xl overflow-hidden h-32 shrink-0">
          <Image
            src={coverPhoto}
            alt={`Photo de ${talent.name}`}
            width={400}
            height={128}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Bio */}
      {talent.bio && (
        <div className={cn('px-4 pt-3', !coverPhoto && 'pt-0')}>
          <p className="text-sm text-brown/70 leading-relaxed line-clamp-2">
            {talent.bio}
          </p>
        </div>
      )}

      {/* Availability */}
      {availableDays.length > 0 && (
        <div className="px-4 pt-3">
          <p className="text-xs text-brown/40 mb-1 font-medium">Disponible&nbsp;:</p>
          <div className="flex flex-wrap gap-1">
            {weekDays.length > 0 && (
              <span className="text-xs text-brown/60 bg-brown/5 rounded-full px-2 py-0.5">
                Semaine
              </span>
            )}
            {weekendDays.map((d) => (
              <span
                key={d}
                className="text-xs text-secondary bg-secondary/10 rounded-full px-2 py-0.5 font-medium"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-auto px-4 py-3 flex justify-end">
        {profileHref ? (
          <Link
            href={profileHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded"
            aria-label={`Voir le profil de ${talent.name}`}
          >
            Voir le profil
            <ArrowRightIcon />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-brown/30 cursor-not-allowed">
            Voir le profil
            <ArrowRightIcon />
          </span>
        )}
      </div>
    </article>
  )
}

export default TalentCard
