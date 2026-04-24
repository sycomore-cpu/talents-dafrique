'use client'

import { useEffect, useState } from 'react'
import { Star, Loader2, CheckCircle, X } from 'lucide-react'
import { useAuth } from '@/components/layout/AuthProvider'
import { createClient } from '@/lib/supabase/client'

export function LeaveReviewButton({ talentId }: { talentId: string }) {
  const { user } = useAuth()
  const supabase = createClient()
  const [eligibleReservationId, setEligibleReservationId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    async function check() {
      // Find an accepted/completed reservation with this talent
      const { data: reservations } = await supabase
        .from('reservations')
        .select('id')
        .eq('client_id', user!.id)
        .eq('talent_id', talentId)
        .in('status', ['accepted', 'completed'])
        .limit(5)

      if (!reservations || reservations.length === 0) return

      // Check if user has already reviewed any of them
      const { data: reviews } = await supabase
        .from('reviews')
        .select('reservation_id')
        .eq('reviewer_id', user!.id)
        .eq('talent_id', talentId)

      const reviewedIds = new Set((reviews ?? []).map((r) => r.reservation_id))
      const eligible = reservations.find((r) => !reviewedIds.has(r.id))
      if (eligible) setEligibleReservationId(eligible.id)
    }
    check()
  }, [user, talentId, supabase])

  if (!eligibleReservationId) return null

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservation_id: eligibleReservationId,
          talent_id: talentId,
          rating,
          comment,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Erreur')
      }
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors"
      >
        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
        Laisser un avis sur ce talent
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold font-heading text-brown">Laisser un avis</h3>
              <button onClick={() => setOpen(false)} className="text-brown/40 hover:text-brown">
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-brown font-medium mb-1">Merci pour votre avis !</p>
                <button
                  onClick={() => { setOpen(false); window.location.reload() }}
                  className="mt-4 px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-brown mb-2 block">Note</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className="p-1"
                      >
                        <Star className={`w-7 h-7 ${n <= rating ? 'fill-amber-500 text-amber-500' : 'text-brown/20'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-brown mb-1.5 block">
                    Commentaire <span className="text-brown/40">(optionnel)</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Partagez votre expérience…"
                    className="w-full px-3 py-2.5 border border-brown/20 rounded-xl text-sm text-brown focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}

                <div className="flex justify-end gap-2">
                  <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-brown/60 hover:text-brown">
                    Annuler
                  </button>
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Publier l&apos;avis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
