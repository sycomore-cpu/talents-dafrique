import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/supabase/types'
import TalentsGrid from './TalentsGrid'

export const metadata: Metadata = {
  title: "Explorer les talents | Talents d'Afrique",
  description:
    "Découvrez tous les talents de la diaspora africaine : beauté, cuisine, couture, maison et plus encore.",
}

export const revalidate = 60 // ISR — revalidate every minute

async function getAllTalents(): Promise<(Profile & { average_rating?: number })[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_talent', true)
      .neq('status', 'suspendu')
      .order('trust_score', { ascending: false })
      .order('updated_at', { ascending: false })
      .limit(200)

    if (error || !data) return []
    return data as Profile[]
  } catch {
    return []
  }
}

export default async function TalentsPage() {
  const talents = await getAllTalents()

  return (
    <main className="min-h-screen bg-cream pb-24">
      {/* Hero */}
      <div className="bg-white border-b border-brown/10 pt-6 pb-5 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-brown mb-1">
            🌍 Explorer les talents
          </h1>
          <p className="text-brown/60 text-sm">
            {talents.length > 0
              ? `${talents.length} talent${talents.length > 1 ? 's' : ''} de la diaspora`
              : 'Tous les talents de la diaspora africaine'}
          </p>
        </div>
      </div>

      {/* Grid with filters */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Suspense fallback={<div className="text-center text-brown/40 py-16">Chargement…</div>}>
          <TalentsGrid talents={talents} />
        </Suspense>
      </div>
    </main>
  )
}
