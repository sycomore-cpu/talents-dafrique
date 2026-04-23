import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Politique de confidentialité et de protection des données personnelles de Talents d\'Afrique, conforme au RGPD.',
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
  { id: 'responsable', label: 'Responsable du traitement' },
  { id: 'donnees', label: 'Données collectées' },
  { id: 'finalites', label: 'Finalités du traitement' },
  { id: 'base-legale', label: 'Base légale' },
  { id: 'conservation', label: 'Durée de conservation' },
  { id: 'droits', label: 'Vos droits' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'hebergeur', label: 'Hébergeur et sous-traitants' },
  { id: 'securite', label: 'Sécurité des données' },
  { id: 'modifications', label: 'Modifications de la politique' },
]

export default function ConfidentialitePage() {
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
            Politique de confidentialité
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            Dernière mise à jour : 23 avril 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex gap-10">
          {/* Table of contents (desktop) */}
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
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              Cette politique de confidentialité a été rédigée conformément au Règlement Général
              sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi
              française Informatique et Libertés du 6 janvier 1978 modifiée.
            </div>

            <Section id="responsable" title="1. Responsable du traitement">
              <p>
                Le responsable du traitement des données personnelles collectées via la
                plateforme Talents d&apos;Afrique est :
              </p>
              <div className="bg-white rounded-xl border border-brown/10 p-4">
                <p className="font-medium text-brown">Talents d&apos;Afrique</p>
                <p>Site web : <a href="https://talentsdafrique.fr" className="text-primary hover:underline">talentsdafrique.fr</a></p>
                <p>
                  Adresse e-mail :{' '}
                  <a href="mailto:contact@talentsdafrique.fr" className="text-primary hover:underline">
                    contact@talentsdafrique.fr
                  </a>
                </p>
              </div>
            </Section>

            <Section id="donnees" title="2. Données collectées">
              <p>
                Dans le cadre de l&apos;utilisation de la plateforme, nous collectons les
                données personnelles suivantes :
              </p>
              <p className="font-medium text-brown mt-2">Données d&apos;identification :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Ville de résidence</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Numéro WhatsApp (optionnel)</li>
                <li>Photos de profil et photos de réalisations</li>
              </ul>
              <p className="font-medium text-brown mt-3">Données d&apos;utilisation :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Historique des réservations (en tant que client et/ou talent)</li>
                <li>Avis et évaluations</li>
                <li>Solde de Korys et historique des transactions</li>
                <li>Code parrain et parrainages effectués</li>
                <li>Statut de certification sur la plateforme</li>
              </ul>
              <p className="font-medium text-brown mt-3">Données techniques :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Adresse IP (collectée par notre hébergeur)</li>
                <li>Type de navigateur et système d&apos;exploitation</li>
                <li>Données de connexion et d&apos;authentification</li>
              </ul>
            </Section>

            <Section id="finalites" title="3. Finalités du traitement">
              <p>
                Nous utilisons vos données personnelles pour les finalités suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-brown">Mise en relation</strong> : permettre
                  aux clients de trouver des talents et de leur envoyer des demandes de
                  prestation.
                </li>
                <li>
                  <strong className="text-brown">Gestion des comptes</strong> :
                  création, maintien et suppression des comptes utilisateurs.
                </li>
                <li>
                  <strong className="text-brown">Communications</strong> : envoi de
                  notifications relatives à vos réservations, avis et activité sur la
                  plateforme.
                </li>
                <li>
                  <strong className="text-brown">Système de confiance</strong> :
                  gestion des statuts (En observation, Certifié), des parrainages et
                  des signalements.
                </li>
                <li>
                  <strong className="text-brown">Gestion des Korys</strong> : suivi des
                  transactions de la monnaie virtuelle communautaire.
                </li>
                <li>
                  <strong className="text-brown">Amélioration du service</strong> :
                  analyse anonymisée de l&apos;utilisation de la plateforme pour
                  améliorer nos fonctionnalités.
                </li>
                <li>
                  <strong className="text-brown">Conformité légale</strong> : respect
                  de nos obligations légales en vigueur.
                </li>
              </ul>
            </Section>

            <Section id="base-legale" title="4. Base légale du traitement">
              <p>
                Conformément à l&apos;article 6 du RGPD, nos traitements de données
                reposent sur les bases légales suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-brown">Consentement (Art. 6.1.a)</strong> :
                  pour la création de votre compte, le dépôt de photos de profil et
                  l&apos;envoi de communications marketing éventuelles.
                </li>
                <li>
                  <strong className="text-brown">Exécution d&apos;un contrat (Art. 6.1.b)</strong> :
                  pour la gestion des réservations et des mises en relation.
                </li>
                <li>
                  <strong className="text-brown">Intérêt légitime (Art. 6.1.f)</strong> :
                  pour la sécurité de la plateforme, la lutte contre les abus et
                  l&apos;amélioration de nos services.
                </li>
              </ul>
            </Section>

            <Section id="conservation" title="5. Durée de conservation">
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire
                pour atteindre les finalités pour lesquelles elles ont été collectées :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-brown">Données de compte</strong> : conservées
                  pendant toute la durée d&apos;utilisation du compte, puis pendant
                  3 ans après la dernière connexion ou la suppression du compte.
                </li>
                <li>
                  <strong className="text-brown">Données de réservation</strong> :
                  conservées 5 ans à compter de la date de la prestation, conformément
                  aux obligations légales en matière de preuve.
                </li>
                <li>
                  <strong className="text-brown">Données de connexion</strong> :
                  conservées 12 mois conformément aux obligations légales.
                </li>
                <li>
                  <strong className="text-brown">Avis et évaluations</strong> :
                  conservés tant que le compte du talent évalué est actif.
                </li>
              </ul>
              <p>
                À l&apos;expiration de ces délais, vos données sont supprimées ou
                anonymisées de façon irréversible.
              </p>
            </Section>

            <Section id="droits" title="6. Vos droits">
              <p>
                Conformément au RGPD, vous disposez des droits suivants concernant vos
                données personnelles :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-brown">Droit d&apos;accès</strong> : obtenir
                  confirmation du traitement de vos données et en obtenir une copie.
                </li>
                <li>
                  <strong className="text-brown">Droit de rectification</strong> :
                  faire corriger des données inexactes vous concernant.
                </li>
                <li>
                  <strong className="text-brown">Droit à l&apos;effacement</strong> (&quot;droit
                  à l&apos;oubli&quot;) : demander la suppression de vos données dans les
                  conditions prévues par le RGPD.
                </li>
                <li>
                  <strong className="text-brown">Droit à la portabilité</strong> :
                  recevoir vos données dans un format structuré et lisible par machine.
                </li>
                <li>
                  <strong className="text-brown">Droit d&apos;opposition</strong> :
                  vous opposer à certains traitements, notamment à des fins de
                  prospection.
                </li>
                <li>
                  <strong className="text-brown">Droit à la limitation</strong> :
                  demander la suspension temporaire d&apos;un traitement.
                </li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à{' '}
                <a href="mailto:contact@talentsdafrique.fr" className="text-primary hover:underline">
                  contact@talentsdafrique.fr
                </a>
                . Nous nous engageons à répondre dans un délai d&apos;un mois.
              </p>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez
                introduire une réclamation auprès de la{' '}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  CNIL
                </a>{' '}
                (Commission Nationale de l&apos;Informatique et des Libertés).
              </p>
            </Section>

            <Section id="cookies" title="7. Cookies">
              <p>
                Talents d&apos;Afrique utilise uniquement des cookies techniques
                strictement nécessaires au fonctionnement de la plateforme :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-brown">Cookie de session</strong> : maintient
                  votre connexion pendant votre visite.
                </li>
                <li>
                  <strong className="text-brown">Cookie d&apos;authentification</strong> :
                  nécessaire pour sécuriser votre compte (géré par Supabase).
                </li>
              </ul>
              <p>
                Nous n&apos;utilisons pas de cookies publicitaires, de traceurs tiers ou
                d&apos;outils d&apos;analyse comportementale. Aucun consentement
                préalable n&apos;est donc requis pour ces cookies techniques.
              </p>
            </Section>

            <Section id="hebergeur" title="8. Hébergeur et sous-traitants">
              <p>
                Vos données sont hébergées et traitées par les sous-traitants suivants,
                avec lesquels nous avons conclu des contrats de traitement conformes au
                RGPD :
              </p>
              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-brown/10 p-4">
                  <p className="font-medium text-brown">Vercel Inc.</p>
                  <p className="text-sm">
                    Hébergeur de l&apos;application web — infrastructure cloud (CDN mondial).
                  </p>
                  <p className="text-xs text-brown/50 mt-1">
                    340 Pine Street, Suite 1200, San Francisco, CA 94104, USA
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-brown/10 p-4">
                  <p className="font-medium text-brown">Supabase Inc.</p>
                  <p className="text-sm">
                    Base de données et authentification. Vos données de compte,
                    réservations et transactions sont stockées sur leurs serveurs.
                  </p>
                  <p className="text-xs text-brown/50 mt-1">
                    970 Toa Payoh North, #07-04, Singapore 318992
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-brown/10 p-4">
                  <p className="font-medium text-brown">Cloudinary Ltd.</p>
                  <p className="text-sm">
                    Hébergement et optimisation des images (photos de profil, galeries
                    de talents).
                  </p>
                  <p className="text-xs text-brown/50 mt-1">
                    3400 Central Expressway, Suite 110, Santa Clara, CA 95051, USA
                  </p>
                </div>
              </div>
              <p>
                Ces prestataires sont susceptibles de transférer vos données hors de
                l&apos;Union Européenne. Ces transferts sont encadrés par des clauses
                contractuelles types approuvées par la Commission Européenne.
              </p>
            </Section>

            <Section id="securite" title="9. Sécurité des données">
              <p>
                Nous mettons en œuvre les mesures techniques et organisationnelles
                appropriées pour protéger vos données contre tout accès non autorisé,
                perte, destruction ou divulgation :
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Chiffrement des communications (HTTPS/TLS)</li>
                <li>Authentification sécurisée via Supabase Auth</li>
                <li>Accès aux données limité aux seuls employés qui en ont besoin</li>
                <li>Journalisation des accès aux données sensibles</li>
                <li>Mises à jour régulières des systèmes</li>
              </ul>
            </Section>

            <Section id="modifications" title="10. Modifications de la politique">
              <p>
                Nous nous réservons le droit de modifier la présente politique de
                confidentialité à tout moment, notamment pour nous conformer à de
                nouvelles obligations légales ou pour refléter des évolutions de nos
                pratiques.
              </p>
              <p>
                En cas de modification substantielle, nous vous en informerons par
                e-mail ou via une notification sur la plateforme au moins 30 jours
                avant l&apos;entrée en vigueur des modifications.
              </p>
              <p>
                La date de la dernière mise à jour est indiquée en haut de cette page.
                Votre utilisation continue de la plateforme après notification des
                modifications vaut acceptation de la nouvelle politique.
              </p>
            </Section>

            <div className="bg-brown/5 rounded-xl p-5 text-sm text-brown/60">
              <p>
                Pour toute question relative à cette politique ou à la protection de
                vos données personnelles, contactez-nous :{' '}
                <a href="mailto:contact@talentsdafrique.fr" className="text-primary hover:underline">
                  contact@talentsdafrique.fr
                </a>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
