import React from 'react'
import Link from 'next/link'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CASES } from '@/lib/constants'
import BlogContent from './BlogContent'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  tags: string[]
  case_slug: string | null
  author_name: string
  published: boolean
  published_at: string | null
  content: string | null
  content_md: string | null
  content_html?: string
}

// ─── Mock data (fallback) ────────────────────────────────────────────────────

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'comment-entretenir-ses-locks',
    title: 'Comment entretenir ses locks : le guide complet',
    excerpt:
      "Les locks demandent une attention particulière pour rester belles et saines. De l'hydratation au twist, découvrez toutes nos astuces pour prendre soin de vos locks au quotidien.",
    cover_image: 'https://picsum.photos/seed/locks/1200/630',
    tags: ['coiffure', 'locks', 'entretien', 'beauté'],
    case_slug: 'beaute',
    author_name: 'Aminata Diallo',
    published: true,
    published_at: '2026-03-28T10:00:00Z',
    content: null,
    content_md: `Les locks, ou dreadlocks, sont bien plus qu'un style de cheveux : elles représentent une histoire, une identité et un héritage culturel profond.

## Comprendre la structure des locks

Avant de parler entretien, il est important de comprendre ce que sont les locks. Ce sont des mèches de cheveux qui ont été entortillées et qui, avec le temps, se sont solidifiées.

## L'hydratation : la règle d'or

Le cheveu en lock a souvent tendance à se dessécher, surtout aux extrémités. L'hydratation est donc votre meilleure alliée :

- **Vaporisez de l'eau** sur vos locks régulièrement
- **Appliquez une huile légère** — huile de ricin, huile de jojoba
- **Évitez les produits trop lourds** qui peuvent s'accumuler

## Le lavage des locks

Contrairement aux idées reçues, les locks doivent être lavées régulièrement. Lavez vos locks avec un shampooing clarifiant une fois par semaine.

## Le retightening

Avec la croissance des cheveux, des repousses apparaissent à la racine des locks. Le retightening consiste à retordre ces nouvelles pousses toutes les quatre à six semaines.

## Faire appel à un talent

Si vous êtes débutant, la communauté Talents d'Afrique regorge de coiffeuses spécialisées dans les locks.`,
  },
  {
    id: '2',
    slug: 'monter-meubles-ikea-paris',
    title: 'Monter ses meubles IKEA : nos talents disponibles ce week-end à Paris',
    excerpt:
      "Vous avez acheté votre nouveau PAX ou votre KALLAX et vous ne savez pas par où commencer ? Nos talents de la Case Maison sont là pour vous aider.",
    cover_image: 'https://picsum.photos/seed/ikea/1200/630',
    tags: ['montage', 'IKEA', 'Paris', 'maison'],
    case_slug: 'maison',
    author_name: 'Oumar Keïta',
    published: true,
    published_at: '2026-04-02T09:00:00Z',
    content: null,
    content_md: `Chaque week-end, des milliers de personnes se retrouvent face à des boîtes plates IKEA. Nos talents de la Case Maison savent résoudre cela avec efficacité.

## Pourquoi faire appel à un talent ?

Monter un meuble IKEA peut sembler simple, mais certains modèles nécessitent deux personnes et plusieurs heures.

## Ce qui est inclus

- Montage complet des meubles
- Fixation murale sécurisée si nécessaire
- Nettoyage de l'espace de travail

## Tarifs pratiqués

Comptez entre 20 et 50 euros de l'heure selon la complexité des meubles.`,
  },
  {
    id: '3',
    slug: 'recette-thieboudienne-mme-fatou',
    title: 'Recette du thiéboudienne de Mme Fatou',
    excerpt:
      'Le thiéboudienne, riz au poisson sénégalais, est un plat emblématique de la gastronomie africaine.',
    cover_image: 'https://picsum.photos/seed/thieb/1200/630',
    tags: ['recette', 'cuisine africaine', 'sénégal', 'riz au poisson'],
    case_slug: 'saveurs',
    author_name: 'Fatou Kouyaté',
    published: true,
    published_at: '2026-04-05T12:00:00Z',
    content: null,
    content_md: `Le thiéboudienne est le plat national du Sénégal. Il se compose de riz cuit dans une sauce à base de tomate, accompagné de poisson et de légumes variés.

## Ingrédients (pour 6 personnes)

- 1 kg de riz brisé sénégalais
- 1,5 kg de poisson frais
- 200g de concentré de tomates
- 3 tomates fraîches, 2 oignons
- Légumes variés (chou, carottes, aubergine)

## Préparation

Commencez par préparer la farce : mélangez du persil haché, de l'ail écrasé et du piment. Faites des incisions dans le poisson et remplissez-les.

## La sauce

Dans l'huile, faites revenir les oignons puis ajoutez le concentré de tomates. Laissez cuire 20 à 25 minutes.`,
  },
  {
    id: '4',
    slug: 'kory-inspire-cauri-monnaie-africaine',
    title: "Pourquoi le Kory s'inspire du Cauri, l'ancienne monnaie africaine",
    excerpt:
      "Le Cauri a été utilisé comme moyen d'échange en Afrique pendant des siècles.",
    cover_image: 'https://picsum.photos/seed/cauri/1200/630',
    tags: ['kory', 'cauri', 'économie', 'diaspora', 'histoire'],
    case_slug: null,
    author_name: "L'équipe Talents d'Afrique",
    published: true,
    published_at: '2026-04-08T14:00:00Z',
    content: null,
    content_md: `Le nom "Kory" n'a pas été choisi au hasard. Il s'inspire directement du Cauri, l'une des plus anciennes monnaies du monde.

## L'histoire du Cauri

Le Cauri est un petit coquillage blanc qui a servi de moyen d'échange en Afrique, en Asie et dans les îles du Pacifique pendant des millénaires.

## Le Kory : un symbole de confiance

Le Kory s'inspire de ces valeurs. Ce n'est pas un crédit que l'on achète avec de l'argent réel — on le gagne en participant à la communauté.

## Comment obtenir des Korys ?

En vous inscrivant sur Talents d'Afrique, vous recevez automatiquement 10 Korys de bienvenue.`,
  },
  {
    id: '5',
    slug: 'tresses-domicile-choisir-coiffeuse',
    title: 'Tresses à domicile : comment choisir sa coiffeuse',
    excerpt:
      'Box braids, knotless braids, tresses sénégalaises... Le choix est vaste !',
    cover_image: 'https://picsum.photos/seed/tresses/1200/630',
    tags: ['tresses', 'coiffure', 'braids', 'beauté', 'domicile'],
    case_slug: 'beaute',
    author_name: 'Mariama Bah',
    published: true,
    published_at: '2026-04-09T10:00:00Z',
    content: null,
    content_md: `Se faire tresser à domicile présente de nombreux avantages. Voici nos conseils pour choisir la bonne coiffeuse.

## Définissez votre style

- **Box braids** : tresses carrées classiques avec extensions
- **Knotless braids** : technique sans nœud à la racine
- **Tresses sénégalaises** : tresses fines et longues
- **Ghana braids / Cornrows** : tresses plaquées sur le crâne

## Regardez les réalisations et les avis

Sur Talents d'Afrique, chaque coiffeuse peut partager des photos de ses réalisations. Vérifiez la régularité et la finesse des tresses.

## Préparez vos cheveux

Arrivez avec vos cheveux propres, légèrement hydratés et démêlés.`,
  },
  {
    id: '6',
    slug: 'diaspora-camerounaise-lyon-talents',
    title: 'La diaspora camerounaise à Lyon : les talents qui cartonnent',
    excerpt:
      "Lyon abrite une communauté camerounaise dynamique et créative.",
    cover_image: 'https://picsum.photos/seed/lyon/1200/630',
    tags: ['Lyon', 'Cameroun', 'diaspora', 'communauté'],
    case_slug: null,
    author_name: 'Nadia Tchoupo',
    published: true,
    published_at: '2026-04-11T11:00:00Z',
    content: null,
    content_md: `Lyon est une ville où la communauté camerounaise s'est fortement implantée. Rencontre avec des talents qui ont transformé leur passion en activité.

## Estelle, reine des perruques sur-mesure

Estelle est arrivée à Lyon il y a sept ans. Elle est aujourd'hui l'une des talents les mieux notées de la Case Beauté dans toute la région lyonnaise.

## Théodore, le bricoleur de la communauté

Théodore est électricien de formation, particulièrement apprécié pour sa ponctualité et son professionnalisme.

## Une communauté qui s'entraide

Ce qui frappe quand on parle à ces talents, c'est le sentiment fort d'appartenance à une communauté.`,
  },
]

// ─── Supabase fetch ───────────────────────────────────────────────────────────

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )
    const { data } = await supabase
      .from('blog_posts')
      .select('*, author:profiles!author_id(name)')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (!data) return null
    const post = {
      ...data,
      author_name:
        (data.author as { name?: string } | null)?.name ?? "Talents d'Afrique",
      // Normalize: expose content as content_md for backward compat
      content_md: data.content ?? null,
    }
    return post as BlogPost
  } catch {
    return null
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>
}

// ─── generateStaticParams ────────────────────────────────────────────────────

export async function generateStaticParams() {
  return MOCK_POSTS.map((post) => ({ slug: post.slug }))
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const dbPost = await getPost(slug)
  const post = dbPost ?? MOCK_POSTS.find((p) => p.slug === slug)

  if (!post) {
    return { title: 'Article introuvable' }
  }

  const previousImages = (await parent).openGraph?.images ?? []

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image
        ? [post.cover_image, ...previousImages]
        : previousImages,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      authors: [post.author_name],
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function readingTime(content: string | null): string {
  const text = (content ?? '').replace(/[#*`>\-]/g, '')
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min de lecture`
}

// ─── Share Buttons ────────────────────────────────────────────────────────────

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://talentsdafrique.fr/blog/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-brown/50 font-medium">Partager :</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-black text-white hover:bg-black/80 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X / Twitter
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params

  const dbPost = await getPost(slug)
  const post = dbPost ?? MOCK_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const caseData = post.case_slug
    ? CASES.find((c) => c.slug === post.case_slug)
    : null

  // Related posts from mock (we don't have DB list here, use mock for related)
  const relatedPosts = MOCK_POSTS.filter(
    (p) => p.id !== post.id && p.case_slug === post.case_slug
  ).slice(0, 2)

  return (
    <div className="min-h-screen bg-cream">
      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-brown/50 mb-6">
          <Link href="/" className="hover:text-brown transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brown transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-brown line-clamp-1">{post.title}</span>
        </nav>

        {/* Cover image */}
        {post.cover_image && (
          <div className="rounded-2xl overflow-hidden aspect-video mb-8 bg-brown/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags + case badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {caseData && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border font-medium ${caseData.color}`}
            >
              {caseData.icon} {caseData.label}
            </span>
          )}
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-brown/5 text-brown/50 border border-brown/10"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-brown font-playfair leading-tight mb-5">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-brown/10">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-base font-bold text-primary shrink-0">
            {post.author_name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-brown">{post.author_name}</p>
            <p className="text-xs text-brown/50">
              {post.published_at ? formatDate(post.published_at) : ''} ·{' '}
              {readingTime(post.content_md ?? post.content_html ?? null)}
            </p>
          </div>
        </div>

        {/* Content — detect HTML vs markdown */}
        {post.content_md ? (
          // If content starts with an HTML tag, render as HTML; otherwise render as markdown
          post.content_md.trimStart().startsWith('<') ? (
            <div
              className="prose prose-brown max-w-none text-brown leading-relaxed
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-playfair [&_h2]:text-brown [&_h2]:mt-8 [&_h2]:mb-3
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brown [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:text-brown/80 [&_p]:mb-4
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:text-brown/80 [&_ul_li]:mb-1.5
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:text-brown/80 [&_ol_li]:mb-1.5
                [&_strong]:text-brown [&_strong]:font-semibold
                [&_em]:text-brown/60 [&_em]:italic
                [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: post.content_md }}
            />
          ) : (
            <BlogContent content={post.content_md} />
          )
        ) : post.content_html ? (
          <div
            className="prose prose-brown max-w-none text-brown leading-relaxed
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-playfair [&_h2]:text-brown [&_h2]:mt-8 [&_h2]:mb-3
              [&_p]:text-brown/80 [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:text-brown/80 [&_ul_li]:mb-1.5
              [&_strong]:text-brown [&_strong]:font-semibold
              [&_em]:text-brown/60 [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        ) : null}

        {/* Share buttons */}
        <div className="mt-10 pt-6 border-t border-brown/10">
          <ShareButtons title={post.title} slug={post.slug} />
        </div>

        {/* Related talents CTA */}
        {caseData && (
          <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-brown text-sm">
                {caseData.icon} {caseData.label}
              </p>
              <p className="text-sm text-brown/60 mt-1">
                Trouvez un talent disponible près de chez vous pour ce service.
              </p>
            </div>
            <Link
              href={`/cases/${caseData.slug}`}
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
            >
              Trouver un talent →
            </Link>
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-brown font-playfair mb-4">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="bg-white rounded-xl border border-brown/10 p-4 hover:shadow-sm transition-shadow group"
                >
                  <p className="font-medium text-brown text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {related.title}
                  </p>
                  <p className="text-xs text-brown/50 mt-2">
                    {related.published_at ? formatDate(related.published_at) : ''}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
