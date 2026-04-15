import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CaseGrid } from '@/components/cases/CaseGrid'

// ─── Stats Bar ───────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      value: 'Des talents',
      label: 'près de chez vous',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      value: '7',
      label: 'espaces de partage',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      value: '✓',
      label: 'Réseau de confiance',
    },
  ]

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-brown font-heading">{stat.value}</p>
            <p className="text-sm text-brown/60">{stat.label}</p>
          </div>
          {i < stats.length - 1 && (
            <div className="hidden sm:block w-px h-10 bg-brown/10 ml-6" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── How it works — Deux colonnes ────────────────────────────────────────────

function HowItWorks() {
  const chercher = [
    {
      emoji: '🔍',
      title: 'Explorez les Espaces',
      description: "Parcourez nos 7 espaces thématiques et trouvez le talent qu'il vous faut.",
    },
    {
      emoji: '👤',
      title: 'Choisissez un profil',
      description: 'Lisez les avis, vérifiez les disponibilités et découvrez les réalisations.',
    },
    {
      emoji: '📅',
      title: 'Faites une demande',
      description: 'Décrivez votre besoin en quelques mots et envoyez votre demande.',
    },
    {
      emoji: '🤝',
      title: 'La rencontre',
      description: "Les coordonnées sont partagées à l'acceptation. Vous organisez le reste.",
    },
  ]

  const proposer = [
    {
      emoji: '✨',
      title: 'Créez votre profil en 3 minutes',
      description: 'Inscription rapide et gratuite. Décrivez ce que vous savez faire.',
    },
    {
      emoji: '🤝',
      title: 'Rejoignez le réseau',
      description: 'Faites-vous parrainer par un membre ou attendez la validation communautaire.',
    },
    {
      emoji: '📬',
      title: 'Recevez des demandes',
      description: 'Des gens près de chez vous ont besoin de vous. Acceptez selon vos disponibilités.',
    },
    {
      emoji: '💛',
      title: 'Arrondissez vos fins de mois',
      description: 'Vous fixez vos propres tarifs. Vous êtes libre.',
    },
  ]

  return (
    <section className="py-20 bg-white" aria-labelledby="how-it-works-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl font-bold font-heading text-brown mb-4"
          >
            Comment ça marche
          </h2>
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
              <Button href="/cases/beaute" variant="primary">
                Découvrir les talents
              </Button>
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
              <Button href="/inscription" variant="kory">
                Partager mon talent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Kory Section ─────────────────────────────────────────────────────────────

function KorySection() {
  const cards = [
    {
      icon: '🎁',
      title: "10 Korys offerts à l'inscription",
      description: 'Dès votre arrivée, vous recevez 10 Korys pour commencer à être mis en relation avec des membres.',
    },
    {
      icon: '🤝',
      title: '3 Korys gagnés par parrainage',
      description: 'Chaque membre que vous parrainez vous rapporte 3 Korys. Faites grandir le réseau.',
    },
    {
      icon: '💫',
      title: 'Utilisez vos Korys pour être mis en relation',
      description: 'Les Korys permettent de recevoir des demandes de mise en relation sur la plateforme.',
    },
  ]

  return (
    <section className="py-20 bg-kory/5 border-y border-kory/10" aria-labelledby="kory-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-kory/20">
              <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="#E8B820" />
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="#a37408" strokeWidth="0.8" />
                <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1A0E06" fontFamily="serif">K</text>
              </svg>
            </div>
          </div>

          <h2
            id="kory-title"
            className="text-3xl sm:text-4xl font-bold font-heading text-brown mb-4"
          >
            Vos crédits Kory
          </h2>
          <p className="text-brown/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Les Korys sont des crédits offerts à chaque talent inscrit. Ils permettent de recevoir des mises en relation.
            Gratuits au départ, ils récompensent votre engagement dans la communauté.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-7 rounded-2xl bg-white border border-kory/20 shadow-sm hover:shadow-md hover:border-kory/40 transition-all duration-200"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="font-semibold text-brown text-base mb-2">{card.title}</h3>
              <p className="text-sm text-brown/60 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Trust Section ─────────────────────────────────────────────────────────────

function TrustSection() {
  return (
    <section className="py-20 bg-secondary/5 border-y border-secondary/10" aria-labelledby="trust-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="trust-title"
            className="text-3xl sm:text-4xl font-bold font-heading text-brown mb-4"
          >
            Un réseau qui se construit
          </h2>
          <p className="text-brown/70 text-lg max-w-xl mx-auto">
            Sur Talents d&apos;Afrique, la confiance se construit progressivement au sein de la communauté.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Nouveau membre */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
                ⏳
              </div>
              <div>
                <p className="font-bold text-brown font-heading">Nouveau membre</p>
                <p className="text-xs text-amber-600 font-medium">Statut initial</p>
              </div>
            </div>
            <p className="text-sm text-brown/65 leading-relaxed">
              Vous venez de rejoindre. Proposez vos services et attendez la validation de la communauté ou faites-vous parrainer.
            </p>
          </div>

          {/* Profil Parrainé */}
          <div className="bg-white rounded-2xl border border-secondary/30 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-2xl">
                🤝
              </div>
              <div>
                <p className="font-bold text-brown font-heading">Profil Parrainé</p>
                <p className="text-xs text-secondary font-medium">Statut validé</p>
              </div>
            </div>
            <p className="text-sm text-brown/65 leading-relaxed">
              Un ou plusieurs membres ont recommandé votre profil. Chaque parrainage renforce votre crédibilité dans la communauté.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-brown/50 mb-8 italic">
          Ouvert à toute personne partageant les valeurs d&apos;entraide et de respect mutuel.
        </p>

        <div className="text-center">
          <Button href="/inscription" size="lg">
            Rejoindre la communauté
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────

function FooterCTA() {
  return (
    <section
      className="py-20 bg-brown text-white text-center"
      aria-labelledby="footer-cta-title"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-5xl mb-6">✨</div>
        <h2
          id="footer-cta-title"
          className="text-3xl sm:text-4xl font-bold font-heading mb-4"
        >
          Vous avez un talent ?
        </h2>
        <p className="text-white/70 text-lg mb-8 leading-relaxed">
          Rejoignez une communauté fondée sur l&apos;entraide et la confiance.
          Partagez ce que vous savez faire avec ceux qui en ont besoin.
        </p>
        <Button href="/inscription" variant="kory" size="lg">
          Partager mon talent
        </Button>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden adinkra-bg py-20 sm:py-28"
        aria-labelledby="hero-title"
      >
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-kory/8 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/8 rounded-full px-4 py-1.5 mb-6">
            <span>🌱</span>
            Partage · Entraide · Confiance
          </p>

          <h1
            id="hero-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-brown leading-tight mb-6"
          >
            <span>Chacun a un talent.</span>
            <br />
            <span className="text-primary">La communauté en a besoin.</span>
          </h1>

          <p className="text-lg sm:text-xl text-brown/70 leading-relaxed max-w-2xl mx-auto mb-10">
            Partagez ce que vous savez faire, découvrez les talents de vos voisins.
            Arrondir ses fins de mois, rendre service, tisser des liens — tout commence ici.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/cases/beaute" size="lg">
              Découvrir les talents
            </Button>
            <Button href="/inscription" variant="outline" size="lg">
              Partager le mien
            </Button>
          </div>

          <StatsBar />
        </div>
      </section>

      <div className="kente-divider my-0" aria-hidden="true" />

      {/* Cases Section */}
      <section className="py-20 bg-white" aria-labelledby="cases-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              id="cases-title"
              className="text-3xl sm:text-4xl font-bold font-heading text-brown mb-4"
            >
              Nos Espaces
            </h2>
            <p className="text-brown/60 text-lg max-w-xl mx-auto">
              7 espaces où chaque talent trouve sa place.
            </p>
          </div>
          <CaseGrid />
        </div>
      </section>

      <div className="kente-divider my-0" aria-hidden="true" />

      {/* How it works */}
      <HowItWorks />

      <div className="kente-divider my-0" aria-hidden="true" />

      {/* Kory system */}
      <KorySection />

      <div className="kente-divider my-0" aria-hidden="true" />

      {/* Trust + parrainage */}
      <TrustSection />

      <div className="kente-divider my-0" aria-hidden="true" />

      {/* Footer CTA */}
      <FooterCTA />
    </>
  )
}
