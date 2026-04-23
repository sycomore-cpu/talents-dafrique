'use client'

import React, { useState, useMemo } from 'react'
import { CASES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/supabase/types'
import TalentCard from '@/components/talent/TalentCard'

interface Props {
  talents: (Profile & { average_rating?: number })[]
}

const ALL = 'all'

export default function TalentsGrid({ talents }: Props) {
  const [activeCase, setActiveCase] = useState<string>(ALL)
  const [search, setSearch] = useState('')

  // Cases that actually have talents
  const presentCaseSlugs = useMemo(
    () => new Set(talents.map((t) => t.case_slug).filter(Boolean)),
    [talents]
  )

  const filtered = useMemo(() => {
    let list = talents
    if (activeCase !== ALL) {
      list = list.filter((t) => t.case_slug === activeCase)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.city?.toLowerCase().includes(q) ||
          t.bio?.toLowerCase().includes(q) ||
          t.sub_services?.some((s) => s.toLowerCase().includes(q))
      )
    }
    return list
  }, [talents, activeCase, search])

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="search"
          placeholder="Rechercher par nom, ville, service…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brown/20 bg-white text-brown placeholder:text-brown/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Case filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => setActiveCase(ALL)}
          className={cn(
            'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
            activeCase === ALL
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-brown/60 border-brown/20 hover:border-brown/40'
          )}
        >
          Tous
        </button>
        {CASES.filter((c) => presentCaseSlugs.has(c.slug)).map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveCase(c.slug)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap',
              activeCase === c.slug
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-brown/60 border-brown/20 hover:border-brown/40'
            )}
          >
            {c.icon} {c.label.replace('Case ', '')}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center text-brown/40 py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-base">Aucun talent trouvé</p>
          {(search || activeCase !== ALL) && (
            <button
              onClick={() => { setSearch(''); setActiveCase(ALL) }}
              className="mt-3 text-sm text-primary underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-brown/40 mb-4">
            {filtered.length} talent{filtered.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
