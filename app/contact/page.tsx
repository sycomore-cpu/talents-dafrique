import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'équipe Talents d\'Afrique.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-5xl">✉️</span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brown mt-4 mb-3">
            Nous contacter
          </h1>
          <p className="text-brown/60">
            Une question, un problème, une suggestion ? On est là.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 mb-10">
          <a
            href="mailto:contact@talentsdafrique.com"
            className="bg-white rounded-2xl border border-brown/10 p-6 shadow-sm hover:border-primary/30 transition-colors group"
          >
            <div className="text-2xl mb-3">📧</div>
            <h2 className="font-semibold text-brown mb-1 group-hover:text-primary transition-colors">
              Email
            </h2>
            <p className="text-sm text-brown/60">contact@talentsdafrique.com</p>
          </a>
          <a
            href="https://instagram.com/talentsdafrique"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-brown/10 p-6 shadow-sm hover:border-primary/30 transition-colors group"
          >
            <div className="text-2xl mb-3">📸</div>
            <h2 className="font-semibold text-brown mb-1 group-hover:text-primary transition-colors">
              Instagram
            </h2>
            <p className="text-sm text-brown/60">@talentsdafrique</p>
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-brown/10 p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-brown mb-4">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Comment signaler un problème avec une réservation ?',
                a: 'Rendez-vous dans votre espace → réservation concernée → "Signaler un problème".',
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
