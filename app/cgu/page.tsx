import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description:
    "Conditions Générales d'Utilisation de la plateforme Talents d'Afrique — mise en relation des membres de la communauté en France.",
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-xl font-bold text-brown font-playfair mb-3">{title}</h2>
      <div className="text-brown/75 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

const TABLE_OF_CONTENTS = [
  { id: 'objet', label: 'Objet de la plateforme' },
  { id: 'inscription', label: "Conditions d'inscription" },
  { id: 'parrainage', label: 'Système de parrainage' },
  { id: 'observation', label: "Case d'Observation" },
  { id: 'korys', label: 'Les Korys' },
  { id: 'regles', label: 'Règles de conduite' },
  { id: 'responsabilite', label: 'Responsabilité' },
  { id: 'sanctions', label: 'Sanctions' },
  { id: 'propriete', label: 'Propriété intellectuelle' },
  { id: 'loi', label: 'Loi applicable' },
]

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-brown text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-white/50 text-sm hover:text-white transition-colors mb-4 inline-block"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl font-bold font-playfair">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            Dernière mise à jour : 1er avril 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex gap-10">
          {/* Table of contents */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <div className="sticky top-6">
              <p className="text-xs font-semibold text-brown/40 uppercase tracking-wide mb-3">
                Sommaire
              </p>
              <nav className="flex flex-col gap-1">
                {TABLE_OF_CONTENTS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-sm text-brown/60 hover:text-primary transition-colors py-1 border-l-2 border-transparent hover:border-primary pl-3"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 flex flex-col gap-10">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
              En vous inscrivant sur Talents d&apos;Afrique, vous acceptez les présentes
              Conditions Générales d&apos;Utilisation dans leur intégralité. Veuillez les lire
              attentivement avant de créer votre compte.
            </div>

            <Section id="objet" title="1. Objet de la plateforme">
              <p>
                Talents d&apos;Afrique (ci-après &quot;la Plateforme&quot;) est un service
                de mise en relation entre membres de la communauté partageant les valeurs d&apos;entraide et de respect résidant en
                France. Son objectif est de permettre à des prestataires de services
                (ci-après &quot;les Talents&quot;) et à des clients (ci-après &quot;les
                Membres&quot;) de se rencontrer, d&apos;échanger et d&apos;organiser des
                prestations de services.
              </p>
              <p>
                La Plateforme est éditée par Talents d&apos;Afrique, accessible à
                l&apos;adresse{' '}
                <a href="https://talentsdafrique.fr" className="text-primary hover:underline">
                  talentsdafrique.fr
                </a>
                .
              </p>
              <p>
                Les services proposés par la Plateforme couvrent notamment la beauté
                (coiffure, onglerie, maquillage), la maison (montage de meubles,
                bricolage, déménagement), la couture, la gastronomie africaine, les cours
                et savoirs, le bien-être, et l&apos;assistance administrative. Ces
                catégories sont organisées en &quot;Cases&quot; thématiques.
              </p>
            </Section>

            <Section id="inscription" title="2. Conditions d'inscription">
              <p>
                Pour créer un compte sur la Plateforme, vous devez :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-brown">Être âgé d&apos;au moins 18 ans</strong>.
                  La Plateforme est réservée aux adultes majeurs.
                </li>
                <li>
                  <strong className="text-brown">Disposer d&apos;un compte Google valide
                  ou d&apos;une adresse e-mail vérifiée</strong>, utilisée pour
                  l&apos;authentification.
                </li>
                <li>
                  Fournir des informations exactes, complètes et à jour lors de votre
                  inscription.
                </li>
                <li>
                  Ne pas avoir fait l&apos;objet d&apos;une suspension ou d&apos;un
                  bannissement antérieur de la Plateforme.
                </li>
              </ul>
              <p>
                Chaque Membre est responsable de la confidentialité de ses identifiants
                de connexion. Tout accès à la Plateforme via votre compte est présumé
                effectué par vous.
              </p>
              <p>
                Un seul compte par personne est autorisé. La création de comptes
                multiples est interdite.
              </p>
            </Section>

            <Section id="parrainage" title="3. Système de parrainage et badge Certifié">
              <p>
                La Plateforme dispose d&apos;un système de parrainage communautaire visant
                à renforcer la confiance entre les Membres.
              </p>
              <p>
                Un Talent peut être parrainé par un ou plusieurs Membres disposant du
                statut &quot;Certifié&quot;. Le parrainage est un acte volontaire par lequel un
                Membre certifié atteste de la qualité et du sérieux du Talent.
              </p>
              <p>
                Lorsqu&apos;un Talent reçoit le parrainage d&apos;un Membre certifié, il
                obtient le badge <strong className="text-brown">Certifié par le Cercle</strong>.
                Ce badge :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Améliore la visibilité du Talent dans les résultats de recherche</li>
                <li>Renforce la confiance des clients potentiels</li>
                <li>Permet d&apos;accéder à certaines fonctionnalités réservées</li>
              </ul>
              <p>
                Le Membre qui parraine un Talent engage sa responsabilité communautaire.
                En cas de comportement abusif du Talent parrainé, le Membre parrain peut
                voir son propre statut réévalué par l&apos;équipe de modération.
              </p>
            </Section>

            <Section id="observation" title="4. Case d'Observation">
              <p>
                Tout nouveau Talent qui s&apos;inscrit sur la Plateforme est
                automatiquement placé en <strong className="text-brown">Case d&apos;Observation</strong>.
                Ce statut temporaire indique que le Talent n&apos;a pas encore été validé
                par la communauté.
              </p>
              <p>
                En Case d&apos;Observation, le Talent peut :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Créer et compléter son profil</li>
                <li>Recevoir des demandes de réservation</li>
                <li>Accepter des prestations</li>
              </ul>
              <p>
                La Case d&apos;Observation est levée lorsque :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Le Talent est parrainé par un Membre certifié</li>
                <li>
                  Ou lorsque la modération de la Plateforme décide de lui attribuer le
                  statut &quot;Certifié&quot; sur la base des avis reçus
                </li>
              </ul>
              <p>
                La Case d&apos;Observation ne constitue pas une sanction. Elle est un
                mécanisme de protection de la communauté permettant aux nouveaux Talents
                de faire leurs preuves.
              </p>
            </Section>

            <Section id="korys" title="5. Les Korys">
              <p>
                Le Kory est la monnaie virtuelle communautaire de la Plateforme,
                librement inspirée du Cauri, ancienne monnaie africaine.
              </p>
              <p>
                <strong className="text-brown">Nature du Kory :</strong> le Kory est une
                monnaie virtuelle à usage exclusivement interne à la Plateforme. Il{' '}
                <strong className="text-brown">ne peut en aucun cas</strong> être converti
                en euros, en devises réelles ou en tout autre actif financier. Le Kory
                n&apos;a pas de valeur monétaire légale.
              </p>
              <p>
                <strong className="text-brown">Attribution des Korys :</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>10 Korys offerts à l&apos;inscription</li>
                <li>3 Korys pour chaque parrainage réussi (parrain et filleul)</li>
                <li>Les 5 premières acceptations de demandes sont gratuites</li>
              </ul>
              <p>
                <strong className="text-brown">Utilisation des Korys :</strong> à partir
                de la 6ème acceptation de demande, chaque acceptation coûte 1 Kory au
                Talent. Si un Talent n&apos;a plus de Korys, il ne peut plus accepter
                de nouvelles demandes jusqu&apos;à rechargement de son solde par des
                moyens communautaires.
              </p>
              <p>
                Talents d&apos;Afrique se réserve le droit de modifier les règles
                d&apos;attribution et d&apos;utilisation des Korys, avec notification
                préalable des Membres.
              </p>
            </Section>

            <Section id="regles" title="6. Règles de conduite">
              <p>
                En utilisant la Plateforme, vous vous engagez à respecter les règles
                suivantes :
              </p>
              <p className="font-medium text-brown">Interdictions strictes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-brown">Bypass de la Plateforme</strong> :
                  il est formellement interdit de partager des coordonnées personnelles
                  (numéro de téléphone, email, adresses de réseaux sociaux) dans les
                  descriptions de services, les bios ou les messages hors du cadre
                  d&apos;une réservation acceptée. Le partage de coordonnées n&apos;est
                  autorisé qu&apos;après acceptation formelle d&apos;une demande.
                </li>
                <li>
                  <strong className="text-brown">Contenu offensant</strong> : tout
                  contenu à caractère raciste, sexiste, homophobe, xénophobe ou
                  discriminatoire est strictement interdit.
                </li>
                <li>
                  <strong className="text-brown">Fausses informations</strong> :
                  il est interdit de publier des informations fausses sur soi, ses
                  compétences ou ses réalisations.
                </li>
                <li>
                  <strong className="text-brown">Harcèlement</strong> : tout
                  comportement harcelant envers d&apos;autres Membres est interdit.
                </li>
              </ul>
              <p className="font-medium text-brown">Respect de la communauté :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Traitez chaque Membre avec respect et bienveillance, conformément aux
                  valeurs de la communauté.
                </li>
                <li>
                  Honorez vos engagements : si vous acceptez une demande en tant que
                  Talent, faites votre maximum pour honorer la prestation dans les
                  conditions convenues.
                </li>
                <li>
                  Signalez tout comportement abusif via le bouton de signalement
                  disponible sur chaque profil.
                </li>
              </ul>
            </Section>

            <Section id="responsabilite" title="7. Responsabilité">
              <p>
                Talents d&apos;Afrique agit en qualité d&apos;<strong className="text-brown">
                hébergeur de contenus</strong> au sens de la loi pour la Confiance dans
                l&apos;Économie Numérique (LCEN) du 21 juin 2004 et de la Directive
                2000/31/CE.
              </p>
              <p>
                À ce titre, Talents d&apos;Afrique :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  N&apos;est pas partie aux contrats conclus entre Membres et Talents.
                </li>
                <li>
                  Ne garantit pas la qualité, la conformité ou la légalité des
                  prestations proposées par les Talents.
                </li>
                <li>
                  N&apos;est pas responsable des dommages résultant d&apos;une prestation
                  effectuée entre Membres.
                </li>
                <li>
                  N&apos;est pas responsable des contenus publiés par les Membres
                  (photos, descriptions, avis), sauf si, après signalement, elle a
                  manqué à son obligation de retrait prompte de contenus manifestement
                  illicites.
                </li>
              </ul>
              <p>
                Chaque Talent est seul responsable de la qualité et de la conformité de
                ses prestations, et de son respect de la réglementation applicable
                (obligations fiscales, assurances, etc.).
              </p>
            </Section>

            <Section id="sanctions" title="8. Sanctions">
              <p>
                En cas de violation des présentes CGU, la Plateforme peut prononcer les
                sanctions suivantes, dans l&apos;ordre de gravité :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-brown">Avertissement</strong> : notification
                  du comportement litigieux et rappel des règles.
                </li>
                <li>
                  <strong className="text-brown">Suspension temporaire</strong> :
                  restriction d&apos;accès au compte pour une durée déterminée
                  (généralement 7 à 30 jours).
                </li>
                <li>
                  <strong className="text-brown">Bannissement définitif</strong> :
                  suppression permanente du compte et interdiction de créer un nouveau
                  compte.
                </li>
              </ul>
              <p>
                Ces sanctions peuvent être appliquées immédiatement et sans avertissement
                préalable en cas de violation grave (contenu illégal, harcèlement grave,
                escroquerie, etc.).
              </p>
              <p>
                Tout Membre faisant l&apos;objet d&apos;une suspension peut nous
                contacter à{' '}
                <a href="mailto:contact@talentsdafrique.fr" className="text-primary hover:underline">
                  contact@talentsdafrique.fr
                </a>{' '}
                pour contester la décision dans un délai de 14 jours.
              </p>
            </Section>

            <Section id="propriete" title="9. Propriété intellectuelle">
              <p>
                <strong className="text-brown">Contenus des Membres :</strong> les
                contenus publiés par les Membres sur la Plateforme (photos, textes,
                descriptions) restent la propriété intellectuelle de leurs auteurs.
                En publiant ces contenus, les Membres accordent à Talents d&apos;Afrique
                une licence non exclusive, mondiale et gratuite pour les utiliser dans
                le cadre du service (affichage sur la Plateforme, communications
                promotionnelles de la communauté).
              </p>
              <p>
                <strong className="text-brown">Plateforme :</strong> l&apos;ensemble des
                éléments constitutifs de la Plateforme (interface, logo, charte
                graphique, textes éditoriaux, code source) sont la propriété exclusive
                de Talents d&apos;Afrique et sont protégés par les lois sur la
                propriété intellectuelle. Toute reproduction ou utilisation non
                autorisée est interdite.
              </p>
            </Section>

            <Section id="loi" title="10. Loi applicable et juridiction">
              <p>
                Les présentes CGU sont soumises au droit français.
              </p>
              <p>
                En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution
                des présentes CGU, les parties s&apos;efforceront de trouver une solution
                amiable. À défaut d&apos;accord amiable dans un délai de 30 jours,
                tout litige sera soumis à la compétence exclusive des tribunaux
                de Paris, sauf disposition légale contraire d&apos;ordre public.
              </p>
              <p>
                Pour tout litige de consommation, vous pouvez également recourir à la
                médiation en ligne via la plateforme européenne :{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </Section>

            <div className="bg-brown/5 rounded-xl p-5 text-sm text-brown/60">
              <p>
                Pour toute question relative aux présentes CGU, contactez-nous :{' '}
                <a href="mailto:contact@talentsdafrique.fr" className="text-primary hover:underline">
                  contact@talentsdafrique.fr
                </a>
              </p>
              <p className="mt-2">
                Consultez également notre{' '}
                <Link href="/confidentialite" className="text-primary hover:underline">
                  Politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
