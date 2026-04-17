'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/layout/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pose un cookie court (10 min) pour indiquer où rediriger après OAuth */
function setAuthNextCookie(next: string) {
  document.cookie = `auth_next=${encodeURIComponent(next)}; path=/; max-age=600; SameSite=Lax`
}

// ─── Google button ────────────────────────────────────────────────────────────

function GoogleButton({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border-2 border-brown/15 bg-white text-brown font-medium text-sm hover:border-brown/30 hover:bg-brown/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:pointer-events-none"
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

function Divider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center gap-3" aria-hidden="true">
      <div className="flex-1 h-px bg-brown/10" />
      <span className="text-xs text-brown/40 font-medium">{label}</span>
      <div className="flex-1 h-px bg-brown/10" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConnexionPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect si déjà connecté
  useEffect(() => {
    if (!authLoading && user) {
      const params = new URLSearchParams(window.location.search)
      router.replace(params.get('redirect') ?? '/dashboard')
    }
  }, [authLoading, user, router])

  function getNextUrl(): string {
    if (typeof window === 'undefined') return '/dashboard'
    const params = new URLSearchParams(window.location.search)
    return params.get('redirect') ?? '/dashboard'
  }

  const handleGoogle = async () => {
    setLoadingGoogle(true)
    setError(null)
    const next = getNextUrl()
    // Cookie pour éviter les URL complexes dans redirectTo (Supabase exige des URL enregistrées exactement)
    setAuthNextCookie(next)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // URL simple, enregistrée dans Supabase
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoadingGoogle(false)
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoadingEmail(true)
    setError(null)
    const next = getNextUrl()
    // emailRedirectTo → Supabase envoie un lien magique cliquable (plus fiable qu'OTP selon config projet)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      setEmailSent(true)
    }
    setLoadingEmail(false)
  }

  // Afficher un loader pendant que l'auth se vérifie (évite le flash du form)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  // Déjà connecté → on n'affiche rien (useEffect va rediriger)
  if (user) return null

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
            <span className="font-heading font-bold text-xl">Talents d&apos;Afrique</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brown/10 p-6 sm:p-8 space-y-6">

          {error === 'auth' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              Une erreur est survenue. Veuillez réessayer.
            </div>
          )}

          {emailSent ? (
            /* ── Email envoyé → afficher confirmation ── */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-brown font-heading">Vérifiez vos e-mails !</h2>
                <p className="text-sm text-brown/60 mt-1">
                  Nous avons envoyé un lien de connexion à<br />
                  <span className="font-semibold text-brown">{email}</span>
                </p>
                <p className="text-xs text-brown/40 mt-3">
                  Cliquez sur le lien dans l&apos;e-mail pour vous connecter.<br />
                  Vérifiez vos spams si vous ne le voyez pas.
                </p>
              </div>
              <button
                onClick={() => { setEmailSent(false); setEmail('') }}
                className="text-sm text-primary hover:underline"
              >
                Utiliser une autre adresse
              </button>
            </div>
          ) : (
            /* ── Formulaire de connexion ── */
            <>
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brown mb-2">
                  Bon retour !
                </h1>
                <p className="text-brown/60 text-sm">
                  Content de vous revoir sur Talents d&apos;Afrique.
                </p>
              </div>

              <GoogleButton onClick={handleGoogle} isLoading={loadingGoogle} />

              <Divider label="ou" />

              <form onSubmit={handleSendEmail} className="space-y-4">
                <Input
                  label="Adresse e-mail"
                  type="email"
                  placeholder="vous@exemple.fr"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null) }}
                  required
                  id="email"
                />
                {error && error !== 'auth' && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
                    {error}
                  </p>
                )}
                <Button type="submit" fullWidth isLoading={loadingEmail} disabled={!email}>
                  Recevoir un lien de connexion
                </Button>
              </form>

              <div className="pt-2 border-t border-brown/8 text-center space-y-2">
                <p className="text-sm text-brown/50">
                  Pas encore de compte ?{' '}
                  <Link href="/inscription" className="text-primary hover:underline font-medium">
                    Créer un compte
                  </Link>
                </p>
                <Link href="/" className="text-xs text-brown/40 hover:text-primary transition-colors">
                  ← Retour à l&apos;accueil
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Trust */}
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
        </div>
      </div>
    </div>
  )
}
