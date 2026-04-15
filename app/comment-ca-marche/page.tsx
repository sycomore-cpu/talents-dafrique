import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comment ça marche',
  description:
    "Découvrez comment fonctionne Talents d'Afrique : trouvez un talent, partagez le vôtre, et explorez le système de confiance et de crédits Kory.",
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: "Est-ce que Talents d'Afrique est gratuit ?",
    answer:
      "L'inscription et la recherche de talents sont totalement gratuites. En tant que client, vous ne payez rien sur la plateforme : vous organisez le paiement directement avec le talent, selon les modalités convenues entre vous. En tant que talent, les 5 premières mises en relation sont offertes, puis chaque mise en relation coûte 1 crédit Kory.",
  },
  {
    question: 'Comment sont vérifiés les talents ?',
    answer:
      "Les talents commencent comme nouveaux membres. Ils peuvent être parrainés par un ou plusieurs membres déjà présents dans la communauté, ce qui leur confère le statut de profil parrainé. L'équipe de modération peut également valider un profil sur la base de ses avis.",
  },
  {
    question: "Que se passe-t-il si un talent annule ?",
    answer:
      "Si un talent accepte une demande puis ne se présente pas ou annule sans raison valable, vous pouvez le signaler via notre système de signalement. La modération examinera le cas et pourra prendre des mesures contre le talent.",
  },
  {
    question: 'Comment obtenir le statut Parrainé ?',
    answer:
      "Le statut Parrainé s'obtient en étant recommandé par un ou plusieurs membres déjà présents dans la communauté. Chaque parrainage renforce votre crédibilité. Il n'y a pas de nombre exact requis — la qualité de votre profil et la confiance accordée par vos parrains comptent.",
  },
  {
    question: 'Les coordonnées des talents sont-elles publiques ?',
    answer:
      "Non. Les coordonnées (téléphone, WhatsApp) ne sont révélées qu'après l'acceptation d'une demande. Cette protection garantit que les échanges restent dans le cadre de la plateforme et protège les talents des sollicitations non désirées.",
  },
  {
    question: "Puis-je m'inscrire si je ne suis pas de la diaspora africaine ?",
    answer:
      "Talents d'Afrique est ouvert à tous en tant que client. En tant que talent, la plateforme est ouverte à toute personne partageant nos valeurs d'entraide et de respect mutuel. L'important, c'est l'esprit de la communauté.",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-brown/2 transition-colors">
        <span className="font-medium text-brown text-sm pr-4">{question}</span>
        <span className="shrink-0 w-6 h-6 rounded-full bg-brown/5 flex items-center justify-center text-brown/40 group-open:rotate-45 transition-transform">
          +
        </span>
      </summary>
      <div className="px-6 pb-5 pt-1 text-sm text-brown/65 leading-relaxed border-t border-brown/8">
        {answer}
      </div>
    </details>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommentCaMarchePage() {
  const chercher = [
    {
      emoji: '🔍',
      title: 'Explorez les Espaces',
      description: 'Parcourez nos 7 espaces thématiques : Beauté, Maison, Couture, Saveurs, Savoir, Zen et Assistance.',
    },
    {
      emoji: '👤',
      title: 'Choisissez un profil',
      description: 'Lisez les avis, vérifiez les disponibilités et consultez les réalisations du talent.',
    },
    {
      emoji: '📅',
      title: 'Faites une demande',
      description: 'Décrivez votre besoin, choisissez une date. Le talent reçoit une notification instantanée.',
    },
    {
      emoji: '🤝',
      title: 'La rencontre',
      description: "Les coordonnées sont partagées à l'acceptation. Vous organisez le reste directement avec lui.",
    },
  ]

  const proposer = [
    {
      emoji: '✨',
      title: 'Créez votre profil en 3 minutes',
      description: 'Inscription rapide et gratuite. Décrivez vos services, vos disponibilités, ajoutez des photos.',
    },
    {
      emoji: '🤝',
      title: 'Rejoignez le réseau',
      description: 'Faites-vous parrainer par un membre ou attendez la validation communautaire.',
    },
    {
      emoji: '📬',
      title: 'Recevez des demandes',
      description: 'Des gens près de chez vous ont besoin de vous. Acceptez ou refusez selon vos disponibilités.',
    },
    {
      emoji: '💛',
      title: 'Arrondissez vos fins de mois',
      description: 'Vous fixez vos propres tarifs. Vous êtes libre de choisir vos clients.',
    },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-brown text-white py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-kory text-sm font-medium uppercase tracking-widest mb-3">
            La plateforme
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">
            Comment ça marche ?
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Talents d&apos;Afrique, c&apos;est simple et communautaire.
            Découvrez comment trouver un talent ou partager vos services.
          </p>
        </div>
      </section>

      <div className="kente-divider" />

      {/* Section 1 & 2 : Deux colonnes */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brown font-playfair">
              Deux façons d&apos;utiliser la plateforme
            </h2>
            <p className="text-brown/60 mt-2">Que vous cherchiez ou que vous proposiez, c&apos;est simple.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche — Je cherche */}
            <div className="rounded-2xl border border-brown/10 bg-cream border-l-4 border-l-primary p-8 shadow-sm">
              <h3 className="font-heading font-bold text-xl text-brown mb-6 flex items-center gap-2">
                <span>🔍</span> Je cherche un talent
              </h3>
              <ol className="flex flex-col gap-5">
                {chercher.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-brown text-sm mb-0.5">
                        {step.emoji} {step.title}
                      </p>
                      <p className="text-sm text-brown/60 leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Link
                  href="/cases"
                  className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Explorer les Espaces →
                </Link>
              </div>
            </div>

            {/* Colonne droite — Je propose */}
            <div className="rounded-2xl bg-secondary text-white p-8 shadow-sm">
              <h3 className="font-heading font-bold text-xl text-white mb-6 flex items-center gap-2">
                <span>✨</span> Je propose mon talent
              </h3>
              <ol className="flex flex-col gap-5">
                {proposer.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 text-white text-sm font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm mb-0.5">
                        {step.emoji} {step.title}
                      </p>
                      <p className="text-sm text-white/70 leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-2 bg-kory text-brown font-medium px-6 py-3 rounded-xl hover:bg-kory/90 transition-colors"
                >
                  Partager mon talent →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="kente-divider" />

      {/* Section 3 : Les crédits Kory */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-kory/20 text-brown text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                Le système Kory
              </span>
              <h2 className="text-3xl font-bold text-brown font-playfair mb-4">
                Vos crédits Kory
              </h2>
              <p className="text-brown/65 leading-relaxed mb-4">
                Les Korys sont des crédits offerts à chaque talent inscrit sur Talents d&apos;Afrique.
                Ils permettent de recevoir des mises en relation avec des clients.
              </p>
              <p className="text-brown/65 leading-relaxed mb-6">
                Gratuits au départ, les Korys récompensent votre engagement dans la communauté.
                Plus vous participez, plus vous en gagnez.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'À l\'inscription', value: '+10 Korys', icon: '🎉' },
                  { label: 'Par parrainage', value: '+3 Korys', icon: '🤝' },
                  { label: '5 premières mises en relation', value: 'Gratuites', icon: '🎁' },
                  { label: 'Chaque mise en relation suivante', value: '-1 Kory', icon: '🔄' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-kory/8 rounded-xl p-3 border border-kory/15"
                  >
                    <div className="text-xl mb-1">{item.icon}</div>
                    <p className="text-xs text-brown/50">{item.label}</p>
                    <p className="font-bold text-brown">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brown rounded-2xl p-8 text-white text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                <svg viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="38" fill="#E8B820" />
                  <circle cx="40" cy="40" r="33" fill="none" stroke="#a37408" strokeWidth="2" />
                  <text
                    x="40"
                    y="52"
                    textAnchor="middle"
                    fontSize="32"
                    fontWeight="700"
                    fill="#1A0E06"
                    fontFamily="serif"
                  >
                    K
                  </text>
                </svg>
              </div>
              <h3 className="text-xl font-bold font-playfair mb-2">Le Kory</h3>
              <p className="text-white/60 text-sm mb-6">
                Les crédits de la confiance communautaire
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-white/70">Non-monnayable</span>
                  <span className="text-kory font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-white/70">Gagné par la communauté</span>
                  <span className="text-kory font-semibold">✓</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-white/70">Protège contre le spam</span>
                  <span className="text-kory font-semibold">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="kente-divider" />

      {/* Section 4 : Système de confiance */}
      <section className="py-14 px-4 bg-secondary/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
              Système de confiance
            </span>
            <h2 className="text-3xl font-bold text-brown font-playfair mb-4">
              Un réseau qui se construit
            </h2>
            <p className="text-brown/60 max-w-xl mx-auto">
              Un système progressif qui garantit la qualité et la confiance au sein de notre communauté.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Nouveau membre */}
            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl">
                  ⏳
                </div>
                <div>
                  <p className="font-bold text-brown">Nouveau membre</p>
                  <p className="text-xs text-amber-600 font-medium">Statut initial</p>
                </div>
              </div>
              <ul className="text-sm text-brown/65 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Statut attribué automatiquement à tous les nouveaux talents
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Peut recevoir des demandes et effectuer des prestations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Visible dans les résultats de recherche
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Peut recevoir des avis clients
                </li>
              </ul>
            </div>

            {/* Profil Parrainé */}
            <div className="bg-white rounded-2xl border border-secondary/30 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-xl">
                  🤝
                </div>
                <div>
                  <p className="font-bold text-brown">Profil Parrainé</p>
                  <p className="text-xs text-secondary font-medium">Statut validé</p>
                </div>
              </div>
              <ul className="text-sm text-brown/65 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  Obtenu après parrainage d&apos;un ou plusieurs membres
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  Badge visible sur le profil et dans les résultats
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  Meilleur classement dans les recherches
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  Peut parrainer d&apos;autres talents à son tour
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center mt-6 text-center max-w-lg mx-auto">
            <p className="text-sm text-brown/55 leading-relaxed">
              La progression se fait naturellement au fil des prestations et des avis reçus.
              Le parrainage par un membre de la communauté est la voie principale, mais la modération
              peut aussi valider un talent particulièrement bien évalué.
            </p>
          </div>
        </div>
      </section>

      <div className="kente-divider" />

      {/* Section 5 : FAQ */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brown font-playfair mb-3">
              Questions fréquentes
            </h2>
            <p className="text-brown/60">
              Vous avez une question ? La réponse est peut-être ici.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>

          <div className="mt-10 text-center bg-primary/5 rounded-2xl border border-primary/10 p-8">
            <p className="font-bold text-brown text-lg font-playfair mb-2">
              Vous avez d&apos;autres questions ?
            </p>
            <p className="text-brown/60 text-sm mb-4">
              Notre équipe est disponible pour vous répondre.
            </p>
            <a
              href="mailto:contact@talentsdafrique.fr"
              className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
