'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/components/layout/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { KoryBalance } from '@/components/ui/KoryBalance'
import { StarRating } from '@/components/ui/StarRating'
import { CASES, AVAILABILITY_DAYS, VILLES } from '@/lib/constants'
import { getCaseBySlug } from '@/lib/utils'
import type { ReservationStatus } from '@/lib/supabase/types'
import {
  Copy,
  Check,
  Phone,
  MessageCircle,
  Star,
  Camera,
  X,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import { usePhotoUpload } from '@/lib/usePhotoUpload'
import { createClient } from '@/lib/supabase/client'

// ─── Status helpers ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ReservationStatus }) {
  const config: Record<ReservationStatus, { label: string; classes: string }> = {
    pending: {
      label: 'En attente',
      classes: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    accepted: {
      label: 'Acceptée',
      classes: 'bg-green-50 text-green-700 border border-green-200',
    },
    refused: {
      label: 'Refusée',
      classes: 'bg-red-50 text-red-700 border border-red-200',
    },
    completed: {
      label: 'Terminée',
      classes: 'bg-gray-100 text-gray-600 border border-gray-200',
    },
    disputed: {
      label: 'En litige',
      classes: 'bg-orange-50 text-orange-700 border border-orange-200',
    },
  }
  const c = config[status]
  return (
    <span
      className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5 ${c.classes}`}
    >
      {c.label}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Reservation Card ─────────────────────────────────────────────────────────

function ReservationCard({
  name,
  avatar,
  service,
  date,
  time,
  status,
  whatsapp,
  hasReview,
  onLeaveReview,
}: {
  name: string
  avatar: string | null
  service: string
  date: string
  time: string
  status: ReservationStatus
  whatsapp: string
  hasReview: boolean
  onLeaveReview: () => void
}) {
  const [contactRevealed, setContactRevealed] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-brown/10 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Avatar src={avatar} name={name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-brown text-sm">{name}</p>
              <p className="text-xs text-brown/60 mt-0.5 line-clamp-1">{service}</p>
            </div>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-brown/50 mt-1.5">
            {formatDate(date)} à {time}
          </p>
        </div>
      </div>

      {status === 'accepted' && (
        <div className="mt-3 pt-3 border-t border-brown/8">
          {contactRevealed ? (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp : +{whatsapp}
            </a>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContactRevealed(true)}
            >
              <Phone className="w-3.5 h-3.5" />
              Contacter
            </Button>
          )}
        </div>
      )}

      {status === 'completed' && !hasReview && (
        <div className="mt-3 pt-3 border-t border-brown/8">
          <Button variant="ghost" size="sm" onClick={onLeaveReview}>
            <Star className="w-3.5 h-3.5" />
            Laisser un avis
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  name,
  onClose,
}: {
  name: string
  onClose: () => void
}) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <p className="font-semibold text-brown">Avis publié !</p>
          <p className="text-sm text-brown/60 mt-1">Merci pour votre retour.</p>
          <Button variant="primary" size="sm" className="mt-4" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-brown">Avis pour {name}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brown/5 transition-colors"
          >
            <X className="w-4 h-4 text-brown/50" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-brown mb-2">Votre note</p>
            <StarRating
              rating={rating}
              interactive
              onChange={setRating}
              size="md"
            />
          </div>
          <Textarea
            label="Votre commentaire"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
            rows={4}
          />
          <Button
            variant="primary"
            fullWidth
            disabled={rating === 0}
            onClick={() => setSubmitted(true)}
          >
            Publier l&apos;avis
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Reservations Tab ─────────────────────────────────────────────────────────

type ReservationRow = {
  id: string
  service: string
  requested_date: string
  requested_time: string
  status: ReservationStatus
  contact_revealed: boolean
  talent?: { name: string; avatar_url: string | null; whatsapp: string | null }
  client?: { name: string; avatar_url: string | null }
}

function ReservationsTab({ userId }: { userId: string }) {
  const supabase = createClient()
  const [subTab, setSubTab] = useState<'client' | 'talent'>('client')
  const [reviewTarget, setReviewTarget] = useState<string | null>(null)
  const [clientReservations, setClientReservations] = useState<ReservationRow[]>([])
  const [talentReservations, setTalentReservations] = useState<ReservationRow[]>([])
  const [loadingRes, setLoadingRes] = useState(true)

  useEffect(() => {
    async function load() {
      const [clientRes, talentRes] = await Promise.all([
        supabase
          .from('reservations')
          .select('id, service, requested_date, requested_time, status, contact_revealed, talent:profiles!talent_id(name, avatar_url, whatsapp)')
          .eq('client_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('reservations')
          .select('id, service, requested_date, requested_time, status, contact_revealed, client:profiles!client_id(name, avatar_url)')
          .eq('talent_id', userId)
          .order('created_at', { ascending: false }),
      ])
      setClientReservations((clientRes.data ?? []) as unknown as ReservationRow[])
      setTalentReservations((talentRes.data ?? []) as unknown as ReservationRow[])
      setLoadingRes(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (loadingRes) return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-brown/5 p-1 rounded-xl w-fit">
        <button
          onClick={() => setSubTab('client')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subTab === 'client'
              ? 'bg-white text-brown shadow-sm'
              : 'text-brown/60 hover:text-brown'
          }`}
        >
          En tant que client
        </button>
        <button
          onClick={() => setSubTab('talent')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subTab === 'talent'
              ? 'bg-white text-brown shadow-sm'
              : 'text-brown/60 hover:text-brown'
          }`}
        >
          En tant que talent
        </button>
      </div>

      {subTab === 'client' && (
        <div className="flex flex-col gap-3">
          {clientReservations.length === 0 ? (
            <p className="text-brown/50 text-sm py-6 text-center">Aucune réservation pour l&apos;instant.</p>
          ) : clientReservations.map((r) => (
            <ReservationCard
              key={r.id}
              name={r.talent?.name ?? '—'}
              avatar={r.talent?.avatar_url ?? null}
              service={r.service}
              date={r.requested_date}
              time={r.requested_time}
              status={r.status}
              whatsapp={r.talent?.whatsapp ?? ''}
              hasReview={false}
              onLeaveReview={() => setReviewTarget(r.talent?.name ?? null)}
            />
          ))}
        </div>
      )}

      {subTab === 'talent' && (
        <div className="flex flex-col gap-3">
          {talentReservations.length === 0 ? (
            <p className="text-brown/50 text-sm py-6 text-center">Aucune demande reçue pour l&apos;instant.</p>
          ) : talentReservations.map((r) => (
            <ReservationCard
              key={r.id}
              name={r.client?.name ?? '—'}
              avatar={r.client?.avatar_url ?? null}
              service={r.service}
              date={r.requested_date}
              time={r.requested_time}
              status={r.status}
              whatsapp=""
              hasReview={false}
              onLeaveReview={() => setReviewTarget(r.client?.name ?? null)}
            />
          ))}
        </div>
      )}

      {reviewTarget && (
        <ReviewModal
          name={reviewTarget}
          onClose={() => setReviewTarget(null)}
        />
      )}
    </div>
  )
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ profile }: { profile: NonNullable<ReturnType<typeof useAuth>['profile']> }) {
  const supabase = createClient()
  const { refreshProfile } = useAuth()
  const [name, setName] = useState(profile.name)
  const [city, setCity] = useState(profile.city)
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<string[]>(profile.photos ?? [])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)
  const [avatarUploading, setAvatarUploading] = useState(false)
  // Talent section state
  const [caseSlug, setCaseSlug] = useState(profile.case_slug ?? '')
  const [subServices, setSubServices] = useState<string[]>(profile.sub_services ?? [])
  const [availability, setAvailability] = useState<Record<string, { start: string; end: string }>>(
    (profile.availability as Record<string, { start: string; end: string }>) ?? {}
  )

  const { upload, remove, uploading, error: uploadError, canAdd, maxPhotos, maxSizeMb } =
    usePhotoUpload(photos, setPhotos)

  function copyCode() {
    navigator.clipboard.writeText(profile.parrain_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleAvatarUpload(file: File) {
    setAvatarUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', 'avatar')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.avatar_url) {
      setAvatarUrl(data.avatar_url)
      await refreshProfile()
    }
    setAvatarUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    const update: Record<string, unknown> = {
      name,
      city,
      phone: phone || null,
      bio: bio || null,
    }
    // Sauvegarder aussi les infos talent si applicable
    if (profile.is_talent) {
      update.case_slug = caseSlug || null
      update.sub_services = subServices
      update.availability = availability
    }
    const { error } = await supabase.from('profiles').update(update).eq('id', profile.id)
    setSaving(false)
    if (error) {
      setSaveError(error.message)
    } else {
      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Avatar & basic info */}
      <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
        <h3 className="font-semibold text-brown mb-4">Informations personnelles</h3>
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <Avatar src={avatarUrl} name={profile.name} size="xl" />
            <label className={`absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm cursor-pointer ${avatarUploading ? 'opacity-60 pointer-events-none' : ''}`}>
              {avatarUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); e.target.value = '' }}
              />
            </label>
          </div>
          <div>
            <p className="font-medium text-brown">{profile.name}</p>
            <p className="text-sm text-brown/50">{profile.city}</p>
            <Badge
              variant={profile.status === 'parraine' ? 'parraine' : 'observation'}
              size="sm"
              className="mt-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            label="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            options={VILLES.map((v) => ({ value: v, label: v }))}
          />
          <Input
            label="Téléphone / WhatsApp"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+33 6 12 34 56 78"
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Présentez-vous en quelques mots..."
            rows={3}
          />
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-brown">Mes photos</h3>
          <span className="text-xs text-brown/40">{photos.length}/{maxPhotos} · max {maxSizeMb} Mo</span>
        </div>
        {uploadError && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3 border border-red-100">
            {uploadError}
          </p>
        )}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {photos.map((photo, i) => (
            <div
              key={photo}
              className="relative aspect-square rounded-lg overflow-hidden bg-brown/5 group"
            >
              <Image
                src={photo}
                alt={`Photo ${i + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => remove(photo)}
                disabled={uploading}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:cursor-not-allowed"
                title="Supprimer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}
          {photos.length < maxPhotos &&
            Array.from({ length: maxPhotos - photos.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square rounded-lg bg-brown/5 border-2 border-dashed border-brown/15 flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-brown/25" />
              </div>
            ))}
        </div>

        {canAdd && (
          <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brown/20 text-sm font-medium text-brown hover:bg-brown/5 transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Upload en cours…
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                Ajouter une photo
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) upload(file)
                e.target.value = '' // reset pour permettre re-select
              }}
            />
          </label>
        )}
      </div>

      {/* Talent section */}
      {profile.is_talent && (
        <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
          <h3 className="font-semibold text-brown mb-4">Mon espace talent</h3>

          {/* Case selector */}
          <div className="mb-4">
            <Select
              label="Ma Case"
              value={caseSlug}
              onChange={(e) => { setCaseSlug(e.target.value); setSubServices([]) }}
              options={CASES.map((c) => ({ value: c.slug, label: `${c.icon} ${c.label}` }))}
              placeholder="Choisir ma catégorie"
            />
          </div>

          {/* Sub-services */}
          {caseSlug && (
            <div className="mb-4">
              <p className="text-sm font-medium text-brown mb-2">Mes services</p>
              <div className="flex flex-wrap gap-2">
                {(CASES.find((c) => c.slug === caseSlug)?.services ?? []).map((svc) => (
                  <button
                    key={svc}
                    type="button"
                    onClick={() =>
                      setSubServices((prev) =>
                        prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
                      )
                    }
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      subServices.includes(svc)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-brown/60 border-brown/20 hover:border-primary/50'
                    }`}
                  >
                    {svc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div>
            <p className="text-sm font-medium text-brown mb-2">Disponibilités</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_DAYS.map((day) => {
                const isAvail = day in availability
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      setAvailability((prev) => {
                        const next = { ...prev }
                        if (isAvail) { delete next[day] }
                        else { next[day] = { start: '09:00', end: '18:00' } }
                        return next
                      })
                    }
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      isAvail
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-brown/60 border-brown/20 hover:border-secondary/50'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Referral code */}
      <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
        <h3 className="font-semibold text-brown mb-1">Code parrain</h3>
        <p className="text-sm text-brown/60 mb-3">
          Partagez ce code pour parrainer de nouveaux membres et gagner des Korys.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-brown/5 rounded-lg px-4 py-2.5 font-mono font-bold text-brown tracking-widest text-lg">
            {profile.parrain_code}
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-brown/15 hover:bg-brown/5 transition-colors text-sm font-medium text-brown"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Copié
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copier
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save */}
      {saveError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {saveError}
        </p>
      )}
      <Button
        variant="primary"
        size="lg"
        className="w-fit"
        onClick={handleSave}
        isLoading={saving}
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" />
            Sauvegardé
          </>
        ) : (
          'Sauvegarder'
        )}
      </Button>
    </div>
  )
}

// ─── Korys Tab ────────────────────────────────────────────────────────────────

function KorysTab({ balance, userId }: { balance: number; userId: string }) {
  const supabase = createClient()
  const [transactions, setTransactions] = useState<{ id: string; created_at: string; reason: string; amount: number }[]>([])
  const [loadingTx, setLoadingTx] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('kory_transactions')
        .select('id, created_at, reason, amount')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      setTransactions(data ?? [])
      setLoadingTx(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Balance */}
      <div className="bg-white rounded-xl border border-brown/10 p-6 shadow-sm">
        <KoryBalance balance={balance} variant="full" className="mb-4" />
        <p className="text-sm text-brown/60">
          Le Kory est la monnaie virtuelle de la communauté Talents d&apos;Afrique.
          Il s&apos;inspire du Cauri, ancien symbole d&apos;échange de notre communauté.
        </p>
      </div>

      {/* How to earn */}
      <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
        <h3 className="font-semibold text-brown mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Comment gagner des Korys
        </h3>
        <ul className="flex flex-col gap-3">
          {[
            { label: 'Inscription sur la plateforme', amount: '+10 Korys' },
            { label: 'Parrainer un nouveau membre', amount: '+3 Korys' },
            { label: "Être parrainé par un membre de confiance", amount: '+3 Korys' },
            {
              label: 'Répondre aux 5 premières demandes (offert)',
              amount: 'Gratuit',
            },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-brown/70">{item.label}</span>
              <span className="font-semibold text-secondary">{item.amount}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-brown/8 text-xs text-brown/50">
          Chaque acceptation de demande coûte 1 Kory au talent (sauf les 5 premières).
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8">
          <h3 className="font-semibold text-brown">Historique des transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brown/3">
                <th className="text-left px-5 py-3 text-xs font-medium text-brown/50 uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-brown/50 uppercase tracking-wide">
                  Motif
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-brown/50 uppercase tracking-wide">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/6">
              {loadingTx ? (
                <tr><td colSpan={3} className="px-5 py-6 text-center text-brown/40 text-sm">Chargement…</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-6 text-center text-brown/40 text-sm">Aucune transaction.</td></tr>
              ) : transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-brown/2 transition-colors">
                  <td className="px-5 py-3 text-brown/50 whitespace-nowrap">
                    {new Date(tx.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="px-5 py-3 text-brown">{tx.reason}</td>
                  <td
                    className={`px-5 py-3 text-right font-semibold whitespace-nowrap ${
                      tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}
                    {tx.amount} K
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'reservations' | 'profil' | 'korys'

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('reservations')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full" />
      </div>
    )
  }

  // Pas d'utilisateur → connexion
  if (!user) {
    router.replace('/connexion')
    return null
  }

  // Utilisateur connecté mais profil encore en chargement → petit spinner
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full" />
      </div>
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'reservations', label: 'Mes réservations' },
    { key: 'profil', label: 'Mon profil' },
    { key: 'korys', label: 'Mes Korys' },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-brown/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Avatar src={profile.avatar_url} name={profile.name} size="lg" ring="primary" />
            <div>
              <h1 className="text-xl font-bold text-brown font-playfair">
                Bonjour, {profile.name.split(' ')[0]}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={profile.status === 'parraine' ? 'parraine' : 'observation'}
                  size="sm"
                />
                <KoryBalance balance={profile.kory_balance} variant="compact" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-0 border-b border-transparent -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-brown/50 hover:text-brown'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'reservations' && <ReservationsTab userId={user.id} />}
        {activeTab === 'profil' && <ProfileTab profile={profile} />}
        {activeTab === 'korys' && <KorysTab balance={profile.kory_balance} userId={user.id} />}
      </div>
    </div>
  )
}
