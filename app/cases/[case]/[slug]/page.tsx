import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCaseBySlug, slugify } from '@/lib/utils'
import { CASES } from '@/lib/constants'
import type { Profile } from '@/lib/supabase/types'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { KoryBalance } from '@/components/ui/KoryBalance'
import { AvailabilityBadges } from '@/components/talent/AvailabilityBadges'

// ─── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  // We can't enumerate all slug combos at build time — let them be dynamic
  return CASES.map((c) => ({ case: c.slug, slug: 'preview' }))
}

// ─── All mock talents (flat list for lookup) ──────────────────────────────────

type MockProfile = Profile & { average_rating: number }

const ALL_MOCK_TALENTS: MockProfile[] = [
  // ── Beauté ──
  {
    id: 'mock-beaute-1', name: 'Aminata Diallo', city: 'Paris',
    bio: 'Coiffeuse spécialisée en tresses africaines depuis 8 ans. Je me déplace à domicile dans tout Paris et la petite couronne. Tresses collées, locks, perruques lace wig — je maîtrise toutes les techniques pour sublimer vos cheveux naturels. Formée en Guinée puis en France, chaque cliente repart avec une coiffure sur-mesure et des conseils d\'entretien adaptés.',
    case_slug: 'beaute', sub_services: ['Coiffure (braids, locks, perruques)', 'Tresses collées', 'Locks', 'Perruque lace wig'],
    availability: { Samedi: { start: '09:00', end: '19:00' }, Dimanche: { start: '10:00', end: '17:00' } },
    photos: ['https://picsum.photos/seed/aminata1/600/400', 'https://picsum.photos/seed/aminata2/600/400', 'https://picsum.photos/seed/aminata3/600/400'],
    status: 'parraine', trust_score: 4.8, review_count: 23, parrain_code: 'AMINA001', kory_balance: 45,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2024-01-15T10:00:00Z', updated_at: '2024-06-01T12:00:00Z', average_rating: 4.8,
  },
  {
    id: 'mock-beaute-2', name: 'Mariama Baldé', city: 'Lyon',
    bio: 'Prothésiste ongulaire diplômée avec 5 ans d\'expérience en salon professionnel et à domicile. Je crée des nail arts afro-inspirés uniques : motifs wax, symboles adinkra, couleurs de la terre. Chaque pose dure entre 2h et 3h avec des produits de qualité professionnelle. Résultats garantis 3 semaines minimum.',
    case_slug: 'beaute', sub_services: ['Onglerie (gel, résine, nail art)', 'Nail art afro'],
    availability: { Lundi: { start: '10:00', end: '18:00' }, Mardi: { start: '10:00', end: '18:00' }, Mercredi: { start: '10:00', end: '18:00' }, Samedi: { start: '09:00', end: '17:00' } },
    photos: ['https://picsum.photos/seed/mariama1/600/400', 'https://picsum.photos/seed/mariama2/600/400'],
    status: 'parraine', trust_score: 4.9, review_count: 41, parrain_code: 'MARIB002', kory_balance: 62,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2024-02-10T10:00:00Z', updated_at: '2024-06-10T12:00:00Z', average_rating: 4.9,
  },
  {
    id: 'mock-beaute-3', name: 'Fatou Camara', city: 'Paris',
    bio: 'Maquilleuse professionnelle passionnée par la mise en valeur des peaux noires, métissées et mates. Mon travail valorise la beauté naturelle africaine avec des techniques et produits adaptés à nos carnations. Spécialiste mariages et événements, je me déplace dans toute l\'Île-de-France. Formations continues à Paris et en ligne.',
    case_slug: 'beaute', sub_services: ['Maquillage (MUA)', 'Épilation', 'Maquillage de mariée'],
    availability: { Vendredi: { start: '14:00', end: '20:00' }, Samedi: { start: '08:00', end: '20:00' }, Dimanche: { start: '10:00', end: '18:00' } },
    photos: ['https://picsum.photos/seed/fatou1/600/400'],
    status: 'parraine', trust_score: 4.7, review_count: 17, parrain_code: 'FATCA003', kory_balance: 28,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2024-03-05T10:00:00Z', updated_at: '2024-06-05T12:00:00Z', average_rating: 4.7,
  },
  {
    id: 'mock-beaute-4', name: 'Binta Kouyaté', city: 'Marseille',
    bio: 'Spécialiste de la coiffure naturelle depuis 6 ans. Je prends soin de vos cheveux afro avec des produits 100% naturels. Twist, vanilles, revers, braid out, wash and go — je maîtrise toutes les techniques pour les cheveux crépus et bouclés. Conseils capillaires personnalisés inclus.',
    case_slug: 'beaute', sub_services: ['Coiffure (braids, locks, perruques)', 'Soins capillaires naturels'],
    availability: { Mercredi: { start: '10:00', end: '19:00' }, Jeudi: { start: '10:00', end: '19:00' }, Samedi: { start: '09:00', end: '18:00' } },
    photos: ['https://picsum.photos/seed/binta1/600/400', 'https://picsum.photos/seed/binta2/600/400'],
    status: 'observation', trust_score: 4.4, review_count: 6, parrain_code: 'BINTK004', kory_balance: 12,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2024-04-20T10:00:00Z', updated_at: '2024-06-15T12:00:00Z', average_rating: 4.4,
  },
  {
    id: 'mock-beaute-5', name: 'Ndeye Sow', city: 'Paris',
    bio: 'Certifiée prothésiste ongulaire avec 6 ans de pratique intensive. Spécialiste de la longévité : mes poses tiennent 4 à 5 semaines sans retouche. Je crée des nail arts inspirés de l\'art africain — masques, tissages, motifs géométriques. Hygiène irréprochable et matériel stérilisé à chaque cliente.',
    case_slug: 'beaute', sub_services: ['Onglerie (gel, résine, nail art)', 'Nail art africain'],
    availability: { Mardi: { start: '09:00', end: '19:00' }, Jeudi: { start: '09:00', end: '19:00' }, Samedi: { start: '10:00', end: '18:00' }, Dimanche: { start: '11:00', end: '17:00' } },
    photos: ['https://picsum.photos/seed/ndeye1/600/400', 'https://picsum.photos/seed/ndeye2/600/400', 'https://picsum.photos/seed/ndeye3/600/400'],
    status: 'parraine', trust_score: 5.0, review_count: 54, parrain_code: 'NDEYS005', kory_balance: 88,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2023-11-01T10:00:00Z', updated_at: '2024-06-20T12:00:00Z', average_rating: 5.0,
  },
  {
    id: 'mock-beaute-6', name: 'Rokhaya Mbaye', city: 'Île-de-France',
    bio: 'Esthéticienne polyvalente, je propose épilation au fil, cire orientale, soins du visage et coiffure afro. Je me déplace chez vous dans toute l\'Île-de-France pour vous offrir un moment de détente et de beauté sans vous déplacer. Des produits naturels issus de l\'artisanat africain.',
    case_slug: 'beaute', sub_services: ['Épilation', 'Maquillage (MUA)', 'Coiffure (braids, locks, perruques)'],
    availability: { Lundi: { start: '09:00', end: '17:00' }, Mercredi: { start: '09:00', end: '17:00' }, Vendredi: { start: '09:00', end: '17:00' } },
    photos: ['https://picsum.photos/seed/rokhaya1/600/400'],
    status: 'observation', trust_score: 4.2, review_count: 3, parrain_code: 'ROKMB006', kory_balance: 10,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2024-05-12T10:00:00Z', updated_at: '2024-06-18T12:00:00Z', average_rating: 4.2,
  },
  // ── Maison ──
  {
    id: 'mock-maison-1', name: 'Moussa Traoré', city: 'Paris',
    bio: 'Artisan polyvalent avec 10 ans d\'expérience dans le bâtiment. Montage IKEA et tout fabricant, petite plomberie, électricité courante, peinture. Je règle vos problèmes rapidement et proprement. Devis gratuit, intervention sous 48h en Île-de-France.',
    case_slug: 'maison', sub_services: ['Montage de meubles (IKEA, etc.)', 'Petit bricolage'],
    availability: { Lundi: { start: '08:00', end: '18:00' }, Mardi: { start: '08:00', end: '18:00' }, Mercredi: { start: '08:00', end: '18:00' }, Jeudi: { start: '08:00', end: '18:00' }, Vendredi: { start: '08:00', end: '18:00' } },
    photos: ['https://picsum.photos/seed/moussa1/600/400', 'https://picsum.photos/seed/moussa2/600/400'],
    status: 'parraine', trust_score: 4.9, review_count: 38, parrain_code: 'MOUTR001', kory_balance: 71,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2023-10-01T10:00:00Z', updated_at: '2024-06-01T12:00:00Z', average_rating: 4.9,
  },
  // ── Couture ──
  {
    id: 'mock-couture-1', name: 'Kadiatou Bah', city: 'Paris',
    bio: 'Couturière créatrice spécialisée dans les tenues africaines sur-mesure. Wax, Bazin, Kente, Bogolan — je crée des pièces uniques qui célèbrent votre héritage. De la robe de soirée au boubou quotidien, chaque vêtement est taillé à la main avec soin. Retouches rapides sous 48h.',
    case_slug: 'couture', sub_services: ['Création sur-mesure (Wax, Bazin, Pagne)', 'Retouches vêtements', 'Couture générale'],
    availability: { Mardi: { start: '10:00', end: '19:00' }, Jeudi: { start: '10:00', end: '19:00' }, Samedi: { start: '09:00', end: '18:00' } },
    photos: ['https://picsum.photos/seed/kadiatou1/600/400', 'https://picsum.photos/seed/kadiatou2/600/400'],
    status: 'parraine', trust_score: 4.9, review_count: 47, parrain_code: 'KADBA001', kory_balance: 78,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2023-09-01T10:00:00Z', updated_at: '2024-06-01T12:00:00Z', average_rating: 4.9,
  },
  // ── Saveurs ──
  {
    id: 'mock-saveurs-1', name: 'Awa Coulibaly', city: 'Paris',
    bio: 'Chef cuisinière professionnelle, je propose des dîners à domicile et du batch cooking africain. Thiéboudienne, mafé, yassa, ndolé, gboma dessi — je cuisine l\'Afrique de l\'Ouest et du Centre avec amour et authenticité. Diplômée de l\'école hôtelière, 7 ans d\'expérience en restauration.',
    case_slug: 'saveurs', sub_services: ['Chef à domicile', 'Batch cooking hebdomadaire', 'Traiteur événementiel'],
    availability: { Mercredi: { start: '10:00', end: '18:00' }, Jeudi: { start: '10:00', end: '18:00' }, Samedi: { start: '09:00', end: '20:00' } },
    photos: ['https://picsum.photos/seed/awa1/600/400', 'https://picsum.photos/seed/awa2/600/400'],
    status: 'parraine', trust_score: 4.9, review_count: 35, parrain_code: 'AWACL001', kory_balance: 66,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2023-11-01T10:00:00Z', updated_at: '2024-06-01T12:00:00Z', average_rating: 4.9,
  },
  // ── Savoir ──
  {
    id: 'mock-savoir-1', name: 'Khouma Diallo', city: 'Paris',
    bio: 'Professeur de wolof, pulaar et français pour allophones. Je transmets les langues africaines de la diaspora avec pédagogie et passion. Cours adaptés enfants et adultes. Sessions en présentiel ou en visio. Programme personnalisé selon vos objectifs : compréhension orale, lecture, écriture.',
    case_slug: 'savoir', sub_services: ['Cours de langues africaines', 'Initiation culturelle'],
    availability: { Mercredi: { start: '14:00', end: '19:00' }, Samedi: { start: '09:00', end: '17:00' }, Dimanche: { start: '10:00', end: '15:00' } },
    photos: ['https://picsum.photos/seed/khouma1/600/400'],
    status: 'parraine', trust_score: 4.9, review_count: 31, parrain_code: 'KHOUDI001', kory_balance: 58,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2023-10-15T10:00:00Z', updated_at: '2024-06-01T12:00:00Z', average_rating: 4.9,
  },
  // ── Zen ──
  {
    id: 'mock-zen-1', name: 'Bineta Ndoye', city: 'Paris',
    bio: 'Masseuse traditionnelle sénégalaise certifiée en massage bien-être. Massage beurre de karité, massage aux huiles essentielles africaines, drainage lymphatique et massage post-partum. Je me déplace à domicile pour vous offrir un vrai moment de détente à l\'africaine. Formation en Sénégal et à Paris.',
    case_slug: 'zen', sub_services: ['Massages traditionnels', 'Soins capillaires naturels', 'Conseils en bien-être'],
    availability: { Mardi: { start: '10:00', end: '19:00' }, Jeudi: { start: '10:00', end: '19:00' }, Samedi: { start: '09:00', end: '18:00' } },
    photos: ['https://picsum.photos/seed/bineta1/600/400', 'https://picsum.photos/seed/bineta2/600/400'],
    status: 'parraine', trust_score: 4.9, review_count: 36, parrain_code: 'BINETND001', kory_balance: 67,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2023-10-01T10:00:00Z', updated_at: '2024-06-01T12:00:00Z', average_rating: 4.9,
  },
  // ── Assistance ──
  {
    id: 'mock-assistance-1', name: 'Ibou Diallo', city: 'Paris',
    bio: 'Juriste et conseiller administratif expérimenté. J\'aide la communauté avec les dossiers CAF, APL, préfecture, titre de séjour, naturalisation, dossiers de logement social. Connaissance approfondie des démarches administratives françaises. Confidentialité garantie, tarifs adaptés à la communauté.',
    case_slug: 'assistance', sub_services: ['Aide aux dossiers administratifs', 'Rédaction de courriers'],
    availability: { Mardi: { start: '18:00', end: '21:00' }, Jeudi: { start: '18:00', end: '21:00' }, Samedi: { start: '09:00', end: '15:00' } },
    photos: ['https://picsum.photos/seed/ibou1/600/400'],
    status: 'parraine', trust_score: 4.9, review_count: 52, parrain_code: 'IBOUDIAL001', kory_balance: 95,
    is_talent: true, is_admin: false, avatar_url: null, phone: null, whatsapp: null, parrain_id: null,
    created_at: '2023-08-01T10:00:00Z', updated_at: '2024-06-01T12:00:00Z', average_rating: 4.9,
  },
]

// ─── Mock reviews ─────────────────────────────────────────────────────────────

const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    reviewer: 'Aicha M.',
    rating: 5,
    comment: 'Absolument parfaite ! Elle est venue à l\'heure, très professionnelle et le résultat est magnifique. Je recommande vivement à toute la communauté, vous ne serez pas déçue.',
    date: '15 mars 2024',
  },
  {
    id: 'rev-2',
    reviewer: 'Coumba S.',
    rating: 5,
    comment: 'Deuxième fois que je fais appel à ses services et encore une fois impeccable. Elle prend le temps d\'écouter vos envies et de conseiller. Rapport qualité-prix excellent.',
    date: '2 février 2024',
  },
  {
    id: 'rev-3',
    reviewer: 'Yaya T.',
    rating: 4,
    comment: 'Très bonne expérience. Légèrement en retard mais elle a prévenu. Travail de qualité et ambiance conviviale. Je reviendrai sans hésiter.',
    date: '18 janvier 2024',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTalentSlug(talent: Profile): string {
  return `${slugify(talent.name)}-${talent.id.slice(0, 6)}`
}

function findTalentBySlug(caseSlug: string, slug: string): MockProfile | null {
  const caseTalents = ALL_MOCK_TALENTS.filter((t) => t.case_slug === caseSlug)
  return caseTalents.find((t) => getTalentSlug(t) === slug) ?? null
}

async function findTalentBySlugFromDb(caseSlug: string, slug: string): Promise<MockProfile | null> {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    // Extract ID prefix from slug (last 6 chars after last dash)
    const parts = slug.split('-')
    const idPrefix = parts[parts.length - 1]
    if (!idPrefix || idPrefix.length < 4) return null
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('case_slug', caseSlug)
      .eq('is_talent', true)
      .ilike('id', `${idPrefix}%`)
      .single()
    if (!data) return null
    return { ...(data as unknown as Profile), average_rating: (data as Record<string, unknown>).trust_score as number ?? 0 } as MockProfile
  } catch {
    return null
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ case: string; slug: string }>
}): Promise<Metadata> {
  const { case: caseSlug, slug } = await params
  const talent = (await findTalentBySlugFromDb(caseSlug, slug)) ?? findTalentBySlug(caseSlug, slug)
  const caseData = getCaseBySlug(caseSlug)

  if (!talent || !caseData) return { title: 'Talent introuvable' }

  return {
    title: `${talent.name} — ${caseData.label} à ${talent.city}`,
    description: talent.bio?.slice(0, 160) ?? `${talent.name}, ${caseData.description} à ${talent.city}.`,
    openGraph: {
      title: `${talent.name} — ${caseData.label} à ${talent.city} | Talents d'Afrique`,
      description: talent.bio?.slice(0, 160) ?? undefined,
      images: talent.photos?.[0] ? [talent.photos[0]] : [],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function TalentProfilePage({
  params,
}: {
  params: Promise<{ case: string; slug: string }>
}) {
  const { case: caseSlug, slug } = await params
  const caseData = getCaseBySlug(caseSlug)

  if (!caseData) notFound()

  const talent = (await findTalentBySlugFromDb(caseSlug, slug)) ?? findTalentBySlug(caseSlug, slug)
  if (!talent) notFound()

  const photoSrcs =
    talent.photos.length > 0
      ? talent.photos.slice(0, 3)
      : [
          `https://picsum.photos/seed/${talent.id}-p1/600/400`,
          `https://picsum.photos/seed/${talent.id}-p2/600/400`,
          `https://picsum.photos/seed/${talent.id}-p3/600/400`,
        ]

  const positiveReviews = talent.review_count > 0
    ? Math.round((talent.trust_score / 5) * talent.review_count)
    : 0

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-brown/10 p-4 safe-pb">
        <Button href={`/reserver/${talent.id}`} fullWidth size="lg">
          Demander ce talent
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-8">
        {/* Back button */}
        <Link
          href={`/cases/${caseSlug}`}
          className="inline-flex items-center gap-1.5 text-sm text-brown/60 hover:text-primary transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à {caseData.label}
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Profile header */}
            <section className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <Avatar
                  src={talent.avatar_url}
                  name={talent.name}
                  size="xl"
                  ring={talent.status === 'parraine' ? 'kory' : 'none'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brown">
                      {talent.name}
                    </h1>
                    <Badge
                      variant={talent.status === 'parraine' ? 'parraine' : 'observation'}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brown/60 mb-3">
                    <span className="flex items-center gap-1">
                      <span role="img" aria-label={caseData.label}>{caseData.icon}</span>
                      {caseData.label}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {talent.city}
                    </span>
                  </div>

                  {talent.review_count > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={talent.average_rating} size="md" showValue />
                      <span className="text-sm text-brown/50">
                        ({talent.review_count} avis)
                      </span>
                    </div>
                  )}

                  <KoryBalance balance={talent.kory_balance} variant="compact" />
                </div>
              </div>
            </section>

            {/* About */}
            {talent.bio && (
              <section
                className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6"
                aria-labelledby="about-title"
              >
                <h2
                  id="about-title"
                  className="text-lg font-semibold text-brown mb-3"
                >
                  À propos
                </h2>
                <p className="text-brown/70 leading-relaxed">{talent.bio}</p>
              </section>
            )}

            {/* Services */}
            {talent.sub_services.length > 0 && (
              <section
                className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6"
                aria-labelledby="services-title"
              >
                <h2
                  id="services-title"
                  className="text-lg font-semibold text-brown mb-4"
                >
                  Services proposés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {talent.sub_services.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium bg-primary/8 text-primary border border-primary/20"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Availability */}
            <section
              className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6"
              aria-labelledby="availability-title"
            >
              <h2
                id="availability-title"
                className="text-lg font-semibold text-brown mb-4"
              >
                Disponibilités
              </h2>
              <AvailabilityBadges
                availability={talent.availability}
                compact={false}
              />
            </section>

            {/* Photos */}
            <section
              className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6"
              aria-labelledby="photos-title"
            >
              <h2
                id="photos-title"
                className="text-lg font-semibold text-brown mb-4"
              >
                Photos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {photoSrcs.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-brown/5"
                  >
                    <Image
                      src={src}
                      alt={`Photo ${i + 1} de ${talent.name}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section
              className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6"
              aria-labelledby="reviews-title"
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="reviews-title"
                  className="text-lg font-semibold text-brown"
                >
                  Avis de la communauté
                </h2>
                {talent.review_count > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={talent.average_rating} size="sm" />
                    <span className="text-sm font-semibold text-brown">
                      {talent.average_rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-brown/40">/ 5</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col divide-y divide-brown/8">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                          {review.reviewer.slice(0, 2)}
                        </div>
                        <span className="font-medium text-sm text-brown">{review.reviewer}</span>
                      </div>
                      <span className="text-xs text-brown/40 shrink-0">{review.date}</span>
                    </div>
                    <StarRating rating={review.rating} size="sm" className="mb-2" />
                    <p className="text-sm text-brown/70 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ── Desktop sidebar ── */}
          <aside className="hidden md:flex flex-col gap-5 w-72 lg:w-80 shrink-0 sticky top-6">
            {/* CTA card */}
            <div className="bg-white rounded-2xl border border-brown/10 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={talent.avatar_url}
                  name={talent.name}
                  size="md"
                  ring={talent.status === 'parraine' ? 'kory' : 'none'}
                />
                <div>
                  <p className="font-semibold text-brown text-sm">{talent.name}</p>
                  <p className="text-xs text-brown/50">{talent.city}</p>
                </div>
              </div>

              {positiveReviews > 0 && (
                <p className="text-sm text-brown/70">
                  <span className="font-semibold text-brown">{positiveReviews}</span> client{positiveReviews > 1 ? 's' : ''} satisfait{positiveReviews > 1 ? 's' : ''}
                </p>
              )}

              <Button href={`/reserver/${talent.id}`} fullWidth size="lg">
                Demander ce talent
              </Button>

              <p className="text-xs text-brown/40 text-center">
                Gratuit · Aucun engagement
              </p>
            </div>

            {/* Kory explanation */}
            <div className="bg-kory/8 rounded-2xl border border-kory/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 shrink-0" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#E8B820" />
                  <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1A0E06" fontFamily="serif">K</text>
                </svg>
                <p className="font-semibold text-brown text-sm">Paiement en Korys</p>
              </div>
              <p className="text-xs text-brown/60 leading-relaxed">
                Certaines réservations consomment des Korys, notre monnaie communautaire.
                Recevez 10 Korys gratuits à l&apos;inscription.
              </p>
            </div>

            {/* Trust badge */}
            <div className="bg-secondary/5 rounded-2xl border border-secondary/15 p-5">
              <div className="flex items-center gap-2 mb-2">
                {talent.status === 'parraine' ? (
                  <Badge variant="parraine" />
                ) : (
                  <Badge variant="observation" />
                )}
              </div>
              <p className="text-xs text-brown/60 leading-relaxed">
                {talent.status === 'parraine'
                  ? 'Ce talent a été validé par la communauté. Profil vérifié et avis confirmés.'
                  : 'Ce talent est en phase d\'intégration dans la communauté. Les premiers avis seront bientôt disponibles.'}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
