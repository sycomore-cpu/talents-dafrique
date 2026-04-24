import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Fetch review aggregates (average_rating + review_count) for a list of talent IDs.
 * Returns a map keyed by talent_id.
 */
export async function getReviewsAggregate(
  supabase: SupabaseClient,
  talentIds: string[]
): Promise<Record<string, { average_rating: number; review_count: number }>> {
  if (talentIds.length === 0) return {}
  const { data, error } = await supabase
    .from('reviews')
    .select('talent_id, rating')
    .in('talent_id', talentIds)

  if (error || !data) return {}

  const acc: Record<string, { sum: number; count: number }> = {}
  for (const row of data as { talent_id: string; rating: number }[]) {
    const e = acc[row.talent_id] ?? { sum: 0, count: 0 }
    e.sum += row.rating
    e.count += 1
    acc[row.talent_id] = e
  }

  const out: Record<string, { average_rating: number; review_count: number }> = {}
  for (const id of Object.keys(acc)) {
    out[id] = {
      average_rating: acc[id].count > 0 ? acc[id].sum / acc[id].count : 0,
      review_count: acc[id].count,
    }
  }
  return out
}

export function enrichWithAggregate<T extends { id: string }>(
  talents: T[],
  aggregate: Record<string, { average_rating: number; review_count: number }>
): (T & { average_rating: number; review_count: number })[] {
  return talents.map((t) => {
    const a = aggregate[t.id]
    return {
      ...t,
      average_rating: a?.average_rating ?? 0,
      review_count: a?.review_count ?? 0,
    }
  })
}
