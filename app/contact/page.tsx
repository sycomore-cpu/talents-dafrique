'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle } from 'lucide-react'

const SUBJECTS = [
  'Question générale',
  'Problème avec une réservation',
  'Problème technique',
  'Signaler un abus',
  'Devenir talent',
  'Partenariat',
  'Autre',
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Erreur lors de l\'envoi')
      }
      setSent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de l\'envoi')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-heading text-brown mb-2">Message envoyé !</h1>
          <p className="text-brown/60 mb-6">
            Nous avons bien reçu votre message et vous répondrons dans les 24–48h ouvrées.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-5xl">✉️</span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brown mt-4 mb-3">
            Nous contacter
          </h1>
          <p className="text-brown/60">
            Une question, un problème, une suggestion ? On est là.
          </p>
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-brown">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Votre nom"
                  className="w-full px-3.5 py-2.5 border border-brown/20 rounded-xl text-sm text-brown placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-brown">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="w-full px-3.5 py-2.5 border border-brown/20 rounded-xl text-sm text-brown placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-sm font-medium text-brown">
                Sujet
              </label>
              <select
                id="subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-brown/20 rounded-xl text-sm text-brown bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              >
                <option value="">Choisir un sujet…</option>
                {SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-brown">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="Décrivez votre demande en détail…"
                className="w-full px-3.5 py-2.5 border border-brown/20 rounded-xl text-sm text-brown placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={sending || !name.trim() || !email.trim() || !message.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                'Envoyer le message'
              )}
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-brown/10 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-brown mb-4">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Comment signaler un problème avec une réservation ?',
                a: 'Rendez-vous dans votre espace → réservation concernée → utilisez le formulaire ci-dessus avec le sujet "Problème avec une réservation".',
              },
              {
                q: 'Je ne reçois pas mes Korys de bienvenue ?',
                a: 'Vérifiez votre espace Korys. Si le solde est à 0, contactez-nous avec votre email d\'inscription.',
              },
              {
                q: 'Comment devenir talent sur la plateforme ?',
                a: 'Créez un compte, puis activez "Je suis un talent" dans votre profil ou lors de l\'inscription.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-t border-brown/8 pt-4 first:border-t-0 first:pt-0">
                <p className="font-medium text-brown text-sm mb-1">{q}</p>
                <p className="text-sm text-brown/60">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-brown/40 mt-8">
          Délai de réponse habituel : 24–48h ouvrées.{' '}
          <Link href="/" className="text-primary hover:underline">
            Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  )
}
