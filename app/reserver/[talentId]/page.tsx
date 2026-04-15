'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { getCaseBySlug } from '@/lib/utils'
import { Info, Coins } from 'lucide-react'
import { useAuth } from '@/components/layout/AuthProvider'

// ─── Mock talent data ─────────────────────────────────────────────────────────

const MOCK_TALENT = {
  id: '1',
  name: 'Aminata Diallo',
  avatar_url: null as string | null,
  city: 'Paris',
  case_slug: 'beaute',
  status: 'parraine' as const,
  sub_services: [
    'Coiffure (braids, locks, perruques)',
    'Onglerie (gel, résine, nail art)',
    'Épilation',
  ],
  bio: 'Coiffeuse professionnelle spécialisée dans les tresses africaines et les locks. 8 ans d\'expérience.',
  review_count: 47,
  trust_score: 4.8,
}

// ─── Time slots ───────────────────────────────────────────────────────────────

function generateTimeSlots(): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = []
  for (let h = 8; h <= 21; h++) {
    for (const m of [0, 30]) {
      if (h === 21 && m === 30) continue
      const hStr = h.toString().padStart(2, '0')
      const mStr = m.toString().padStart(2, '0')
      const value = `${hStr}:${mStr}`
      slots.push({ value, label: value })
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

// ─── Today's date as min ──────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReserverPage({
  params,
}: {
  params: Promise<{ talentId: string }>
}) {
  // In Next.js 16 App Router, params is a Promise for both Server and Client Components.
  // For Client Components, use React.use() to unwrap it.
  const { talentId } = React.use(params)
  void talentId

  const { user, loading } = useAuth()
  const router = useRouter()
  const talent = MOCK_TALENT
  const caseData = getCaseBySlug(talent.case_slug)

  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return (
    <div className="min-h-screen adinkra-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="font-playfair text-2xl font-bold text-brown mb-2">Connexion requise</h2>
        <p className="text-gray-600 mb-6">Pour faire une demande à un talent, vous devez être connecté.</p>
        <div className="flex flex-col gap-3">
          <Button href={`/connexion?redirect=/reserver/${talentId}`} variant="primary" className="w-full">
            Se connecter
          </Button>
          <Button href="/inscription" variant="outline" className="w-full">
            Créer un compte
          </Button>
        </div>
      </div>
    </div>
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-brown/10">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-brown font-playfair mb-2">
            Demande envoyée !
          </h2>
          <p className="text-brown/60 mb-6">
            Votre demande a bien été transmise à{' '}
            <span className="font-medium text-brown">{talent.name}</span>. Vous
            recevrez une notification dès qu&apos;elle aura répondu.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="primary" fullWidth href="/dashboard">
              Voir mes réservations
            </Button>
            <Button variant="ghost" fullWidth href="/">
              Retour à l&apos;accueil
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Talent summary */}
        <div className="bg-white rounded-2xl border border-brown/10 p-5 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={talent.avatar_url}
              name={talent.name}
              size="lg"
              ring="primary"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-brown font-playfair">
                {talent.name}
              </h1>
              <p className="text-sm text-brown/60">{talent.city}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge
                  variant={talent.status === 'parraine' ? 'parraine' : 'observation'}
                  size="sm"
                />
                {caseData && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border ${caseData.color}`}
                  >
                    {caseData.icon} {caseData.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          {talent.bio && (
            <p className="mt-3 text-sm text-brown/60 border-t border-brown/8 pt-3">
              {talent.bio}
            </p>
          )}
        </div>

        {/* Info boxes */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Votre demande sera envoyée à{' '}
              <strong>{talent.name}</strong>. Une fois acceptée, vous recevrez
              ses coordonnées pour organiser la prestation.
            </p>
          </div>
          <div className="flex gap-3 bg-kory/8 border border-kory/20 rounded-xl p-4">
            <Coins className="w-5 h-5 text-kory-700 shrink-0 mt-0.5" />
            <p className="text-sm text-brown/70">
              <strong>Aucun Kory débité</strong> de votre part. L&apos;acceptation
              de votre demande coûte{' '}
              <strong>1 Kory au talent</strong> (les 5 premières acceptations
              sont offertes).
            </p>
          </div>
        </div>

        {/* Reservation form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-brown/10 p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-brown mb-5">
            Votre demande
          </h2>

          <div className="flex flex-col gap-5">
            <Select
              label="Service souhaité"
              required
              placeholder="Choisissez un service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              options={talent.sub_services.map((s) => ({
                value: s,
                label: s,
              }))}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date souhaitée"
                type="date"
                required
                min={todayISO()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Select
                label="Heure souhaitée"
                required
                placeholder="Choisissez une heure"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                options={TIME_SLOTS}
              />
            </div>

            <Textarea
              label="Description (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre demande : longueur de cheveux, style désiré, lieu d'intervention..."
              rows={4}
              helper="Ces informations aideront le talent à mieux préparer votre prestation."
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={submitting}
              disabled={!service || !date || !time}
            >
              Envoyer la demande
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
