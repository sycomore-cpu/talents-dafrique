'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/layout/AuthProvider'
import { createClient } from '@/lib/supabase/client'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://talents-dafrique.vercel.app'

function StaticPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-5xl">🤝</span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brown mt-4 mb-3">
            Le parrainage Talents d&apos;Afrique
          </h1>
          <p className="text-brown/60 text-lg">
            Invitez vos proches et gagnez des Korys ensemble.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          {[
            { icon: '🎁', title: '+10 Korys', desc: 'À l\'inscription pour vous' },
            { icon: '👥', title: '+3 Korys', desc: 'Pour vous quand vous parrainez' },
            { icon: '✨', title: '+3 Korys', desc: 'Pour votre filleul·e également' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-brown/10 p-6 text-center shadow-sm">
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="text-xl font-bold text-primary font-heading">{item.title}</p>
              <p className="text-sm text-brown/60 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-brown/10 p-8 shadow-sm mb-8">
          <h2 className="text-xl font-bold font-heading text-brown mb-4">Comment ça marche ?</h2>
          <ol className="space-y-4">
            {[
              'Créez votre compte et récupérez votre code parrain dans votre espace personnel.',
              'Partagez votre code unique à vos amis, famille ou collègues.',
              'Quand ils s\'inscrivent avec votre code, vous recevez chacun 3 Korys.',
              'Utilisez vos Korys pour accepter des demandes de réservation.',
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-brown/70 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="text-center">
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Créer mon compte et parrainer
          </Link>
        </div>
      </div>
    </div>
  )
}

function LiveDashboard() {
  const { user, profile } = useAuth()
  const supabase = createClient()
  const [filleulCount, setFilleulCount] = useState<number | null>(null)
  const [koryFromParrainage, setKoryFromParrainage] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const parrainCode = profile?.parrain_code ?? ''
  const shareUrl = `${SITE_URL}/inscription?ref=${parrainCode}`

  useEffect(() => {
    if (!user) return

    async function fetchStats() {
      // Count filleuls
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('parrain_id', user!.id)
      setFilleulCount(count ?? 0)

      // Sum kory earned from parrainage
      const { data: txs } = await supabase
        .from('kory_transactions')
        .select('amount')
        .eq('user_id', user!.id)
        .ilike('reason', '%Parrainage%')
      const total = (txs ?? []).reduce((acc, t) => acc + (t.amount ?? 0), 0)
      setKoryFromParrainage(total)
    }

    fetchStats()
  }, [user, supabase])

  const handleCopy = () => {
    if (!parrainCode) return
    navigator.clipboard.writeText(parrainCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Rejoins Talents d\'Afrique',
        text: `Inscris-toi avec mon code parrain ${parrainCode} et reçois 3 Korys !`,
        url: shareUrl,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="text-5xl">🤝</span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brown mt-4 mb-2">
            Mon parrainage
          </h1>
          <p className="text-brown/60">
            Partagez votre code et gagnez des Korys ensemble.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="bg-white rounded-2xl border border-brown/10 p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-primary font-heading">
              {filleulCount ?? '—'}
            </p>
            <p className="text-sm text-brown/60 mt-1">Filleul·e·s parrainé·e·s</p>
          </div>
          <div className="bg-white rounded-2xl border border-brown/10 p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-kory font-heading">
              {koryFromParrainage ?? '—'} K
            </p>
            <p className="text-sm text-brown/60 mt-1">Korys gagnés via parrainage</p>
          </div>
          <div className="bg-white rounded-2xl border border-brown/10 p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-secondary font-heading">
              {profile?.kory_balance ?? '—'} K
            </p>
            <p className="text-sm text-brown/60 mt-1">Solde total Korys</p>
          </div>
        </div>

        {/* Code + share */}
        <div className="bg-white rounded-2xl border border-brown/10 p-8 shadow-sm mb-8">
          <h2 className="text-lg font-bold font-heading text-brown mb-4">Mon code parrain</h2>

          {parrainCode ? (
            <>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 mb-4">
                <span className="font-mono text-2xl font-bold text-primary tracking-widest flex-1 text-center">
                  {parrainCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {copied ? '✓ Copié' : 'Copier'}
                </button>
              </div>

              <p className="text-xs text-brown/50 mb-4 text-center break-all">
                Lien d&apos;invitation : <span className="text-primary">{shareUrl}</span>
              </p>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary/90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Partager mon lien d&apos;invitation
              </button>
            </>
          ) : (
            <p className="text-brown/60 text-sm">
              Votre code parrain n&apos;est pas encore généré. Complétez votre profil dans{' '}
              <Link href="/dashboard" className="text-primary hover:underline">votre espace</Link>.
            </p>
          )}
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-brown/10 p-8 shadow-sm">
          <h2 className="text-lg font-bold font-heading text-brown mb-4">Comment ça marche ?</h2>
          <ol className="space-y-3">
            {[
              'Partagez votre code ou lien d\'invitation à vos proches.',
              'Quand ils s\'inscrivent avec votre code, vous recevez chacun 3 Korys.',
              'Utilisez vos Korys pour accepter des demandes de réservation.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-brown/70 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default function ParrainagePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return <LiveDashboard />
  }

  return <StaticPage />
}
