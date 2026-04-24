'use client'

import { useState } from 'react'
import { Flag, Loader2, CheckCircle, X } from 'lucide-react'

const REASONS = [
  'Fausses informations',
  'Comportement inapproprié',
  'Arnaque ou escroquerie',
  'Contenu offensant',
  'Spam ou publicité',
  'Autre',
]

export function ReportProfileButton({ reportedId }: { reportedId: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!reason) {
      setError('Choisissez un motif')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reported_id: reportedId, reason, details }),
      })
      if (!res.ok) {
        const err = await res.json()
        if (res.status === 401) throw new Error('Vous devez être connecté pour signaler un profil')
        throw new Error(err.error ?? 'Erreur')
      }
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setOpen(false)
    setTimeout(() => {
      setReason('')
      setDetails('')
      setDone(false)
      setError(null)
    }, 300)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-brown/40 hover:text-red-600 transition-colors"
      >
        <Flag className="w-3.5 h-3.5" />
        Signaler ce profil
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold font-heading text-brown">Signaler ce profil</h3>
              <button onClick={close} className="text-brown/40 hover:text-brown">
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-brown font-medium mb-1">Signalement envoyé</p>
                <p className="text-sm text-brown/60">Notre équipe va examiner votre signalement.</p>
                <button
                  onClick={close}
                  className="mt-5 px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-brown mb-1.5 block">Motif</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2.5 border border-brown/20 rounded-xl text-sm text-brown bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Choisir un motif…</option>
                    {REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-brown mb-1.5 block">
                    Détails <span className="text-brown/40">(optionnel)</span>
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    placeholder="Décrivez le problème…"
                    className="w-full px-3 py-2.5 border border-brown/20 rounded-xl text-sm text-brown focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={close}
                    className="px-4 py-2 text-sm font-medium text-brown/60 hover:text-brown"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={submit}
                    disabled={loading || !reason}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Signaler
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
