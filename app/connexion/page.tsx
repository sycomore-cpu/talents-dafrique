'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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

// ─── Google button ────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConnexionPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGoogle = async () => {
    setLoadingGoogle(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
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
      setSuccess(true)
      setTimeout(() => router.push('/'), 1500)
    }
    setLoadingOtp(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-4xl">
              ✓
            </div>
          </div>
          <h2 className="text-xl font-bold font-heading text-brown">Connecté !</h2>
          <p className="text-sm text-brown/60">Redirection en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brown hover:text-primary transition-colors"
          >
            <span className="text-2xl">🌍</span>
            <span className="font-heading font-bold text-xl">Talents d'Afrique</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brown/10 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brown mb-2">
              Bon retour !
            </h1>
            <p className="text-brown/60 text-sm">
              Content de vous revoir sur Talents d'Afrique.
            </p>
          </div>

          {/* Google */}
          <GoogleButton onClick={handleGoogle} isLoading={loadingGoogle} />

          <Divider label="ou" />

          {/* Email OTP */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Adresse e-mail"
                type="email"
                placeholder="vous@exemple.fr"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                required
                id="email"
              />

              {error && (
                <p
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                isLoading={loadingEmail}
                disabled={!email}
              >
                Recevoir un code de connexion
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Email sent notice */}
              <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-xl border border-secondary/15">
                <svg
                  className="w-5 h-5 text-secondary shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-brown/70">
                  Code envoyé à{' '}
                  <span className="font-semibold text-brown">{email}</span>.
                  Vérifiez vos spams si besoin.
                </p>
              </div>

              <Input
                label="Code à 6 chiffres"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ''))
                  setError(null)
                }}
                required
                id="otp"
              />

              {error && (
                <p
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                isLoading={loadingOtp}
                disabled={otp.length !== 6}
              >
                Me connecter
              </Button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false)
                  setOtp('')
                  setError(null)
                }}
                className="w-full text-sm text-brown/50 hover:text-primary transition-colors"
              >
                ← Utiliser une autre adresse e-mail
              </button>
            </form>
          )}

          {/* Footer links */}
          <div className="pt-2 border-t border-brown/8 text-center space-y-2">
            <p className="text-sm text-brown/50">
              Pas encore de compte ?{' '}
              <Link
                href="/inscription"
                className="text-primary hover:underline font-medium"
              >
                Créer un compte
              </Link>
            </p>
            <p className="text-sm text-brown/50">
              <Link
                href="/"
                className="text-brown/40 hover:text-primary transition-colors text-xs"
              >
                ← Retour à l'accueil
              </Link>
            </p>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-brown/40">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Connexion sécurisée
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Données protégées
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Communauté vérifiée
          </span>
        </div>
      </div>
    </div>
  )
}
