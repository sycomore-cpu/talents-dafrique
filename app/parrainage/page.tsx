import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Parrainage',
  description: 'Parrainez vos proches sur Talents d\'Afrique et gagnez des Korys.',
}

export default function ParrainagePage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-5xl">🤝</span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brown mt-4 mb-3">
            Le parrainage Talents d'Afrique
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
