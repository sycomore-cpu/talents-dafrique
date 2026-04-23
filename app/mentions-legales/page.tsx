import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Mentions légales | Talents d'Afrique",
  description: "Mentions légales de la plateforme Talents d'Afrique.",
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-brown/50 hover:text-primary transition-colors mb-6"
          >
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl font-bold font-heading text-brown">
            Mentions légales
          </h1>
          <p className="text-sm text-brown/50 mt-2">
            Dernière mise à jour : 23 avril 2026
          </p>
        </div>

        <div className="space-y-8 text-brown/80 leading-relaxed">

          {/* Éditeur */}
          <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brown mb-4">1. Éditeur du site</h2>
            <div className="space-y-1 text-sm">
              <p><strong>Nom du site :</strong> Talents d&apos;Afrique</p>
              <p><strong>URL :</strong> <a href="https://talentsdafrique.com" className="text-primary underline underline-offset-2">https://talentsdafrique.com</a></p>
              <p><strong>Responsable de la publication :</strong> Sycomore CPU</p>
              <p><strong>Adresse e-mail :</strong>{' '}
                <a href="mailto:contact@talentsdafrique.com" className="text-primary underline underline-offset-2">
                  contact@talentsdafrique.com
                </a>
              </p>
              <p><strong>Forme juridique :</strong> Entreprise individuelle / Association (en cours de création)</p>
            </div>
          </section>

          {/* Hébergeur */}
          <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brown mb-4">2. Hébergement</h2>
            <div className="space-y-1 text-sm">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p><strong>Site web :</strong>{' '}
                <a href="https://vercel.com" className="text-primary underline underline-offset-2" rel="noopener noreferrer" target="_blank">
                  https://vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* Base de données */}
          <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brown mb-4">3. Infrastructure technique</h2>
            <div className="space-y-2 text-sm">
              <p>La plateforme utilise les services suivants :</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>Supabase</strong> (base de données et authentification) — Supabase Inc., San Francisco, États-Unis</li>
                <li><strong>Cloudinary</strong> (hébergement des médias) — Cloudinary Ltd., Petah Tikva, Israël</li>
                <li><strong>Resend</strong> (envoi d&apos;e-mails transactionnels) — Resend Inc., San Francisco, États-Unis</li>
              </ul>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brown mb-4">4. Propriété intellectuelle</h2>
            <p className="text-sm">
              L&apos;ensemble des contenus présents sur le site Talents d&apos;Afrique (textes, images, logotypes, éléments graphiques) est protégé par le droit de la propriété intellectuelle et reste la propriété exclusive de ses auteurs. Toute reproduction, représentation, modification ou diffusion, totale ou partielle, sans autorisation préalable écrite est interdite et constitue une contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </p>
            <p className="text-sm mt-3">
              Les contenus publiés par les talents (photos, descriptions, avis) restent la propriété de leurs auteurs. En les publiant sur la plateforme, ils accordent à Talents d&apos;Afrique une licence non exclusive d&apos;utilisation à des fins de promotion du service.
            </p>
          </section>

          {/* Données personnelles */}
          <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brown mb-4">5. Données personnelles</h2>
            <p className="text-sm">
              Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés n° 78-17 du 6 janvier 1978 modifiée, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de portabilité et d&apos;opposition concernant vos données personnelles.
            </p>
            <p className="text-sm mt-3">
              Pour exercer ces droits, contactez-nous à :{' '}
              <a href="mailto:contact@talentsdafrique.com" className="text-primary underline underline-offset-2">
                contact@talentsdafrique.com
              </a>
            </p>
            <p className="text-sm mt-3">
              Pour plus d&apos;informations sur la gestion de vos données, consultez notre{' '}
              <Link href="/confidentialite" className="text-primary underline underline-offset-2">
                Politique de confidentialité
              </Link>.
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brown mb-4">6. Cookies</h2>
            <p className="text-sm">
              Le site utilise des cookies strictement nécessaires au bon fonctionnement de la plateforme (session d&apos;authentification, préférences). Aucun cookie publicitaire ou de traçage tiers n&apos;est utilisé. En continuant à naviguer sur le site, vous acceptez l&apos;utilisation de ces cookies fonctionnels.
            </p>
          </section>

          {/* Limitation de responsabilité */}
          <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brown mb-4">7. Limitation de responsabilité</h2>
            <p className="text-sm">
              Talents d&apos;Afrique est une plateforme de mise en relation entre particuliers. Elle n&apos;est pas partie aux contrats conclus entre les talents et leurs clients et ne peut en aucun cas être tenue responsable des litiges pouvant survenir entre ces derniers.
            </p>
            <p className="text-sm mt-3">
              La plateforme se réserve le droit de supprimer tout contenu manifestement illicite ou contraire aux{' '}
              <Link href="/cgu" className="text-primary underline underline-offset-2">
                Conditions Générales d&apos;Utilisation
              </Link>.
            </p>
          </section>

          {/* Droit applicable */}
          <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brown mb-4">8. Droit applicable et juridiction compétente</h2>
            <p className="text-sm">
              Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents. Tout différend sera soumis en priorité à une tentative de résolution amiable avant tout recours judiciaire.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brown mb-4">9. Contact</h2>
            <p className="text-sm">
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à :{' '}
              <a href="mailto:contact@talentsdafrique.com" className="text-primary underline underline-offset-2">
                contact@talentsdafrique.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
