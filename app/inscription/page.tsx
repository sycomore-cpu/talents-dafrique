'use client'

import React, { useState, useCallback, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/layout/AuthProvider'
import { CASES, VILLES, AVAILABILITY_DAYS, KORY_WELCOME } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'

// ─── Progress indicator ────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = [
    { num: 1, label: 'Compte' },
    { num: 2, label: 'Profil' },
    { num: 3, label: 'Talent' },
  ]

  return (
    <nav aria-label="Étapes d'inscription">
      <ol className="flex items-center justify-center gap-0">
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            <li className="flex flex-col items-center gap-1.5">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm transition-all duration-200 ${
                  step > s.num
                    ? 'bg-secondary text-white'
                    : step === s.num
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-brown/10 text-brown/40'
                }`}
                aria-current={step === s.num ? 'step' : undefined}
              >
                {step > s.num ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  step === s.num ? 'text-primary' : step > s.num ? 'text-secondary' : 'text-brown/40'
                }`}
              >
                {s.label}
              </span>
            </li>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                  step > s.num ? 'bg-secondary' : 'bg-brown/10'
                }`}
                aria-hidden="true"
                style={{ minWidth: '2rem' }}
              />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

// ─── Google sign-in button ────────────────────────────────────────────────────

function GoogleButton({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border-2 border-brown/15 bg-white text-brown font-medium text-sm hover:border-brown/30 hover:bg-brown/2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:pointer-events-none"
    >
      {isLoading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      )}
      Continuer avec Google
    </button>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center gap-3" aria-hidden="true">
      <div className="flex-1 h-px bg-brown/10" />
      <span className="text-xs text-brown/40 font-medium">{label}</span>
      <div className="flex-1 h-px bg-brown/10" />
    </div>
  )
}

// ─── Step 1 — Auth ────────────────────────────────────────────────────────────

interface Step1Props {
  onSuccess: (email: string) => void
}

function Step1Auth({ onSuccess }: Step1Props) {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogle = async () => {
    setLoadingGoogle(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/inscription?step=2')}` },
    })
    if (error) {
      setError(error.message)
      setLoadingGoogle(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoadingEmail(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setError(error.message)
    } else {
      setOtpSent(true)
    }
    setLoadingEmail(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) return
    setLoadingOtp(true)
    setError(null)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })
    if (error) {
      setError(error.message)
    } else {
      onSuccess(email)
    }
    setLoadingOtp(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brown mb-2">
          Créer mon compte
        </h1>
        <p className="text-brown/60 text-sm">
          Rejoignez la communauté Talents d'Afrique et recevez{' '}
          <span className="font-semibold text-kory-700">{KORY_WELCOME} Korys</span> à l'inscription.
        </p>
      </div>

      <GoogleButton onClick={handleGoogle} isLoading={loadingGoogle} />

      <Divider label="ou" />

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            label="Adresse e-mail"
            type="email"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="email"
          />
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" fullWidth isLoading={loadingEmail} disabled={!email}>
            Recevoir un code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center p-4 bg-secondary/5 rounded-xl border border-secondary/15">
            <p className="text-sm text-brown/70">
              Un code à 6 chiffres a été envoyé à{' '}
              <span className="font-semibold text-brown">{email}</span>
            </p>
          </div>
          <Input
            label="Code de vérification"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
            id="otp"
            helper="Vérifiez vos spams si vous ne le trouvez pas."
          />
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" fullWidth isLoading={loadingOtp} disabled={otp.length !== 6}>
            Valider mon code
          </Button>
          <button
            type="button"
            onClick={() => { setOtpSent(false); setOtp(''); setError(null) }}
            className="w-full text-sm text-brown/50 hover:text-primary transition-colors"
          >
            Modifier l'adresse e-mail
          </button>
        </form>
      )}

      <p className="text-center text-sm text-brown/50">
        Déjà membre ?{' '}
        <Link href="/connexion" className="text-primary hover:underline font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  )
}

// ─── Step 2 — Profile ─────────────────────────────────────────────────────────

interface ProfileData {
  name: string
  city: string
  phone: string
  bio: string
  photos: File[]
}

interface Step2Props {
  email: string
  onNext: (data: ProfileData) => void
}

function Step2Profile({ email, onNext }: Step2Props) {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - photos.length)
    const newPhotos = [...photos, ...files].slice(0, 3)
    setPhotos(newPhotos)
    const newUrls = newPhotos.map((f) => URL.createObjectURL(f))
    setPreviewUrls(newUrls)
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPreviewUrls(newUrls)
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Le nom est requis.'
    if (!city) errs.city = 'La ville est requise.'
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onNext({ name, city, phone, bio, photos })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-brown mb-2">
          Mon profil
        </h2>
        <p className="text-brown/60 text-sm">
          Connecté en tant que <span className="font-medium text-brown">{email}</span>
        </p>
      </div>

      {/* Name */}
      <Input
        label="Prénom et nom"
        placeholder="Aminata Diallo"
        value={name}
        onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
        required
        error={errors.name}
        id="name"
      />

      {/* City */}
      <Select
        label="Ville"
        placeholder="Choisir une ville"
        value={city}
        onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: '' })) }}
        required
        error={errors.city}
        id="city"
        options={VILLES.map((v) => ({ value: v, label: v }))}
      />

      {/* Phone */}
      <Input
        label="Numéro de téléphone"
        type="tel"
        placeholder="+33 6 12 34 56 78"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        helper="Optionnel. Ne sera visible qu'après acceptation d'une réservation."
        id="phone"
      />

      {/* Bio */}
      <Textarea
        label="Présentation"
        placeholder="Parlez-vous de vous, de votre parcours, de vos passions..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        helper="Optionnel. Aide la communauté à mieux vous connaître."
        id="bio"
        rows={4}
      />

      {/* Photos */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-brown">
          Photos <span className="text-brown/40 font-normal">(optionnel, max 3)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {previewUrls.map((url, i) => (
            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-brown/15 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 rounded-full bg-brown/70 text-white hover:bg-red-600 transition-colors"
                aria-label={`Supprimer la photo ${i + 1}`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {photos.length < 3 && (
            <label className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed border-brown/20 bg-white hover:border-primary/40 hover:bg-primary/2 transition-colors cursor-pointer shrink-0">
              <svg className="w-6 h-6 text-brown/30 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-brown/40">Ajouter</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="sr-only"
                aria-label="Ajouter des photos"
              />
            </label>
          )}
        </div>
        <p className="text-xs text-brown/40">PNG, JPG ou WEBP. 5 Mo max par photo.</p>
      </div>

      <Button type="submit" fullWidth size="lg">
        Continuer
      </Button>
    </form>
  )
}

// ─── Step 3 — Talent ──────────────────────────────────────────────────────────

interface TalentData {
  isTalent: boolean
  caseSlug: string
  subServices: string[]
  availability: Record<string, { start: string; end: string; enabled: boolean }>
  parrainCode: string
}

interface Step3Props {
  profileData: ProfileData
  onFinish: (data: TalentData) => void
  isLoading: boolean
}

function Step3Talent({ profileData, onFinish, isLoading }: Step3Props) {
  const [isTalent, setIsTalent] = useState(false)
  const [caseSlug, setCaseSlug] = useState('')
  const [subServices, setSubServices] = useState<string[]>([])
  const [parrainCode, setParrainCode] = useState('')
  const [parrainValid, setParrainValid] = useState<boolean | null>(null)

  const initialAvailability = AVAILABILITY_DAYS.reduce<Record<string, { start: string; end: string; enabled: boolean }>>(
    (acc, day) => ({ ...acc, [day]: { start: '09:00', end: '18:00', enabled: false } }),
    {}
  )
  const [availability, setAvailability] = useState(initialAvailability)

  const selectedCase = CASES.find((c) => c.slug === caseSlug)

  const toggleService = (service: string) => {
    setSubServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }))
  }

  const setTime = (day: string, field: 'start' | 'end', value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  // Real parrain code validation via Supabase
  const checkParrainCode = useCallback(async (code: string) => {
    if (!code || code.length < 8) { setParrainValid(null); return }
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('parrain_code', code.toUpperCase())
      .single()
    setParrainValid(!!data)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFinish({ isTalent, caseSlug, subServices, availability, parrainCode })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-brown mb-2">
          Mon talent
        </h2>
        <p className="text-brown/60 text-sm">
          Optionnel. Proposez vos services à la communauté.
        </p>
      </div>

      {/* Toggle: is talent? */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-brown/10 hover:border-primary/20 transition-colors">
        <div>
          <p className="font-semibold text-brown text-sm">Proposer mes services</p>
          <p className="text-xs text-brown/50 mt-0.5">
            Devenez prestataire et soyez visible par toute la communauté
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isTalent}
          onClick={() => setIsTalent(!isTalent)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
            isTalent ? 'bg-primary' : 'bg-brown/15'
          }`}
        >
          <span className="sr-only">Proposer mes services</span>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
              isTalent ? 'translate-x-6' : 'translate-x-1'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isTalent && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Case selection */}
          <Select
            label="Ma Case"
            placeholder="Choisir ma catégorie"
            value={caseSlug}
            onChange={(e) => { setCaseSlug(e.target.value); setSubServices([]) }}
            required={isTalent}
            id="case"
            options={CASES.map((c) => ({ value: c.slug, label: `${c.icon} ${c.label}` }))}
            helper="Choisissez la catégorie qui correspond le mieux à vos services."
          />

          {/* Sub-services */}
          {selectedCase && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-brown">
                Services proposés{' '}
                <span className="text-brown/40 font-normal">(choisissez-en au moins un)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCase.services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    aria-pressed={subServices.includes(service)}
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                      subServices.includes(service)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-brown/15 text-brown/70 hover:border-brown/30'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-brown">Mes disponibilités</p>
            <div className="flex flex-col gap-2">
              {AVAILABILITY_DAYS.map((day) => {
                const slot = availability[day]
                return (
                  <div
                    key={day}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      slot.enabled
                        ? 'border-primary/20 bg-primary/3'
                        : 'border-brown/10 bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      role="switch"
                      aria-checked={slot.enabled}
                      onClick={() => toggleDay(day)}
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                        slot.enabled ? 'bg-primary' : 'bg-brown/15'
                      }`}
                    >
                      <span className="sr-only">{day}</span>
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                          slot.enabled ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <span
                      className={`text-sm font-medium w-20 shrink-0 ${
                        slot.enabled ? 'text-brown' : 'text-brown/40'
                      }`}
                    >
                      {day}
                    </span>

                    {slot.enabled && (
                      <div className="flex items-center gap-2 text-sm text-brown/70">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => setTime(day, 'start', e.target.value)}
                          className="rounded-lg border border-brown/15 px-2 py-1 text-sm text-brown bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                          aria-label={`Heure de début ${day}`}
                        />
                        <span aria-hidden="true">→</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => setTime(day, 'end', e.target.value)}
                          className="rounded-lg border border-brown/15 px-2 py-1 text-sm text-brown bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                          aria-label={`Heure de fin ${day}`}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Parrain code */}
          <div className="space-y-2">
            <Input
              label="Code de parrainage"
              placeholder="ex. AMINA001"
              value={parrainCode}
              onChange={(e) => {
                const v = e.target.value.toUpperCase()
                setParrainCode(v)
                checkParrainCode(v)
              }}
              helper="Optionnel. Si un membre vous a invité, saisissez son code pour renforcer votre profil."
              id="parrain_code"
              rightIcon={
                parrainValid === true ? (
                  <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : parrainValid === false ? (
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : undefined
              }
            />
            {parrainValid === true && parrainCode && (
              <div className="flex items-center gap-2 text-sm text-secondary bg-secondary/8 border border-secondary/15 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Code valide ! Votre profil bénéficiera du badge parrainage.
              </div>
            )}
          </div>
        </div>
      )}

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isLoading}
        variant={isTalent ? 'primary' : 'secondary'}
      >
        {isTalent ? 'Terminer l\'inscription' : 'Rejoindre la communauté'}
      </Button>

      <p className="text-center text-xs text-brown/40">
        En créant votre compte, vous acceptez nos{' '}
        <Link href="/mentions-legales" className="text-primary hover:underline">
          CGU
        </Link>{' '}
        et notre{' '}
        <Link href="/confidentialite" className="text-primary hover:underline">
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ isTalent }: { isTalent: boolean }) {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 text-5xl">
          🎉
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold font-heading text-brown mb-2">
          Bienvenue dans la communauté !
        </h2>
        <p className="text-brown/60">
          Votre compte a été créé avec succès.
          Vous recevez <span className="font-semibold text-kory-700">{KORY_WELCOME} Korys</span> de bienvenue.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button href="/" variant="outline">
          Découvrir les talents
        </Button>
        {isTalent && (
          <Button href="/mon-profil">
            Voir mon profil
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Main page (inner) ────────────────────────────────────────────────────────

function InscriptionInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [wasTalent, setWasTalent] = useState(false)

  // Lire le paramètre ?step= et avancer si déjà connecté
  useEffect(() => {
    if (authLoading) return
    const urlStep = parseInt(searchParams.get('step') ?? '1')
    if (user) {
      if (urlStep >= 2) {
        setEmail(user.email ?? '')
        setStep(2)
      } else {
        // Déjà connecté sans step=2 → dashboard
        router.replace('/dashboard')
      }
    }
  }, [user, authLoading, searchParams, router])

  const handleStep1Success = (authEmail: string) => {
    setEmail(authEmail)
    setStep(2)
  }

  const handleStep2Next = (data: ProfileData) => {
    setProfileData(data)
    setStep(3)
  }

  const handleStep3Finish = async (talentData: TalentData) => {
    if (!user) return
    setIsLoading(true)

    // Construire la mise à jour du profil
    const profileUpdate: Record<string, unknown> = {
      name: profileData?.name,
      city: profileData?.city,
      phone: profileData?.phone || null,
      bio: profileData?.bio || null,
      is_talent: talentData.isTalent,
    }

    if (talentData.isTalent && talentData.caseSlug) {
      profileUpdate.case_slug = talentData.caseSlug
      profileUpdate.sub_services = talentData.subServices
      // Convertir les disponibilités en format DB (seulement les jours activés)
      const avail: Record<string, { start: string; end: string }> = {}
      Object.entries(talentData.availability).forEach(([day, slot]) => {
        if (slot.enabled) avail[day] = { start: slot.start, end: slot.end }
      })
      profileUpdate.availability = avail
    }

    // Valider et appliquer le code parrain
    if (talentData.parrainCode) {
      const { data: parrainProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('parrain_code', talentData.parrainCode.toUpperCase())
        .single()
      if (parrainProfile) {
        profileUpdate.parrain_id = parrainProfile.id
        profileUpdate.status = 'parraine'
        // Créditer le parrain (+3 Korys)
        await supabase.from('kory_transactions').insert({
          user_id: parrainProfile.id,
          amount: 3,
          reason: `Parrainage de ${profileData?.name ?? 'un nouveau membre'}`,
        })
        await supabase
          .from('profiles')
          .update({ kory_balance: supabase.rpc('increment_kory', { uid: parrainProfile.id, delta: 3 }) })
          .eq('id', parrainProfile.id)
      }
    }

    await supabase.from('profiles').update(profileUpdate).eq('id', user.id)

    setWasTalent(talentData.isTalent)
    setIsLoading(false)
    setDone(true)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-brown hover:text-primary transition-colors">
            <span className="text-2xl">🌍</span>
            <span className="font-heading font-bold text-xl">Talents d'Afrique</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brown/10 p-6 sm:p-8">
          {done ? (
            <SuccessScreen isTalent={wasTalent} />
          ) : (
            <>
              {/* Step indicator */}
              <div className="mb-8">
                <StepIndicator step={step} />
              </div>

              {/* Step content */}
              {step === 1 && <Step1Auth onSuccess={handleStep1Success} />}
              {step === 2 && (
                <Step2Profile email={email} onNext={handleStep2Next} />
              )}
              {step === 3 && profileData !== null && (
                <Step3Talent
                  profileData={profileData}
                  onFinish={handleStep3Finish}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Export with Suspense (required for useSearchParams) ──────────────────────

export default function InscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InscriptionInner />
    </Suspense>
  )
}
