import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CASES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    "Conseils, guides et inspirations de la communauté Talents d'Afrique — coiffure, cuisine, maison, couture et plus encore.",
  openGraph: {
    title: "Blog — Talents d'Afrique",
    description: "Conseils, guides et inspirations de la communauté Talents d'Afrique.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blog — Talents d'Afrique",
    description: "Conseils, guides et inspirations de la communauté Talents d'Afrique.",
  },
}

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
}

// ─── Mock blog posts (fallback) ───────────────────────────────────────────────

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'comment-entretenir-ses-locks',
    title: 'Comment entretenir ses locks : le guide complet',
    excerpt:
      "Les locks demandent une attention particulière pour rester belles et saines. De l'hydratation au twist, découvrez toutes nos astuces pour prendre soin de vos locks au quotidien.",
    cover_image: 'https://picsum.photos/seed/locks/800/450',
    tags: ['coiffure', 'locks', 'entretien', 'beauté'],
    case_slug: 'beaute',
    author_name: 'Aminata Diallo',
    published: true,
    published_at: '2026-03-28T10:00:00Z',
  },
  {
    id: '2',
    slug: 'monter-meubles-ikea-paris',
    title: 'Monter ses meubles IKEA : nos talents disponibles ce week-end à Paris',
    excerpt:
      "Vous avez acheté votre nouveau PAX ou votre KALLAX et vous ne savez pas par où commencer ? Nos talents de la Case Maison sont là pour vous aider, disponibles dès ce samedi.",
    cover_image: 'https://picsum.photos/seed/ikea/800/450',
    tags: ['montage', 'IKEA', 'Paris', 'maison'],
    case_slug: 'maison',
    author_name: 'Oumar Keïta',
    published: true,
    published_at: '2026-04-02T09:00:00Z',
  },
  {
    id: '3',
    slug: 'recette-thieboudienne-mme-fatou',
    title: 'Recette du thiéboudienne de Mme Fatou',
    excerpt:
      'Le thiéboudienne, riz au poisson sénégalais, est un plat emblématique de la gastronomie africaine. Mme Fatou, chef de la Case Saveurs à Lyon, partage sa recette familiale.',
    cover_image: 'https://picsum.photos/seed/thieb/800/450',
    tags: ['recette', 'cuisine africaine', 'sénégal', 'riz au poisson'],
    case_slug: 'saveurs',
    author_name: 'Fatou Kouyaté',
    published: true,
    published_at: '2026-04-05T12:00:00Z',
  },
  {
    id: '4',
    slug: 'kory-inspire-cauri-monnaie-africaine',
    title: "Pourquoi le Kory s'inspire du Cauri, l'ancienne monnaie africaine",
    excerpt:
      "Le Cauri a été utilisé comme monnaie d'échange en Afrique pendant des siècles. En créant le Kory, Talents d'Afrique rend hommage à cet héritage tout en construisant une économie communautaire moderne.",
    cover_image: 'https://picsum.photos/seed/cauri/800/450',
    tags: ['kory', 'cauri', 'économie', 'diaspora', 'histoire'],
    case_slug: null,
    author_name: "L'équipe Talents d'Afrique",
    published: true,
    published_at: '2026-04-08T14:00:00Z',
  },
  {
    id: '5',
    slug: 'tresses-domicile-choisir-coiffeuse',
    title: 'Tresses à domicile : comment choisir sa coiffeuse',
    excerpt:
      'Box braids, knotless braids, tresses sénégalaises... Le choix est vaste ! Voici nos conseils pour trouver la coiffeuse qui correspond exactement à ce que vous recherchez.',
    cover_image: 'https://picsum.photos/seed/tresses/800/450',
    tags: ['tresses', 'coiffure', 'braids', 'beauté', 'domicile'],
    case_slug: 'beaute',
    author_name: 'Mariama Bah',
    published: true,
    published_at: '2026-04-09T10:00:00Z',
  },
  {
    id: '6',
    slug: 'diaspora-camerounaise-lyon-talents',
    title: 'La diaspora camerounaise à Lyon : les talents qui cartonnent',
    excerpt:
      "Lyon abrite une communauté camerounaise dynamique et créative. Rencontre avec cinq talents de la ville qui ont transformé leur passion en activité grâce à Talents d'Afrique.",
    cover_image: 'https://picsum.photos/seed/lyon/800/450',
    tags: ['Lyon', 'Cameroun', 'diaspora', 'communauté'],
    case_slug: null,
    author_name: 'Nadia Tchoupo',
    published: true,
    published_at: '2026-04-11T11:00:00Z',
  },
]

const POPULAR_TAGS = [
  'coiffure',
  'tresses',
  'cuisine africaine',
  'locks',
  'kory',
  'diaspora',
  'Paris',
  'Lyon',
  'IKEA',
  'beauté',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function readingTime(excerpt: string | null): string {
  const words = (excerpt ?? '').split(' ').length * 12
  const minutes = Math.ceil(words / 200)
  return `${minutes} min`
}

// ─── Blog Card ────────────────────────────────────────────────────────────────

function BlogCard({ post }: { post: BlogPost }) {
  const caseData = post.case_slug
    ? CASES.find((c) => c.slug === post.case_slug)
    : null

  return (
    <article className="bg-white rounded-2xl border border-brown/10 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
        <div className="aspect-video overflow-hidden bg-brown/5">
          {post.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">{caseData?.icon ?? '📝'}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {caseData && (
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${caseData.color}`}
            >
              {caseData.icon} {caseData.label}
            </span>
          )}
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-brown/5 text-brown/50 border border-brown/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="font-bold text-brown text-lg leading-snug font-playfair mb-2 hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-brown/60 leading-relaxed line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-brown/8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              {post.author_name[0]}
            </div>
            <div>
              <p className="text-xs font-medium text-brown">{post.author_name}</p>
              <p className="text-xs text-brown/40">
                {post.published_at ? formatDate(post.published_at) : ''} ·{' '}
                {readingTime(post.excerpt)}
              </p>
            </div>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Lire →
          </Link>
        </div>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; case?: string }>
}) {
  const { q, case: caseFilter } = await searchParams
  // Fetch from Supabase
  let posts: BlogPost[] = []
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
      .select(
        'id, slug, title, excerpt, cover_image, tags, case_slug, author:profiles!author_id(name), published, published_at'
      )
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(30)

    if (data && data.length > 0) {
      posts = (data as Array<Record<string, unknown>>).map((p) => ({
        ...p,
        author_name:
          (p.author as { name?: string } | null)?.name ?? "Talents d'Afrique",
      })) as unknown as BlogPost[]
    } else {
      posts = MOCK_POSTS
    }
  } catch {
    posts = MOCK_POSTS
  }

  // Client-side filter by search query and case
  const allPosts = posts
  if (q?.trim()) {
    const query = q.trim().toLowerCase()
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt?.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)) ||
        p.author_name.toLowerCase().includes(query)
    )
  }
  if (caseFilter) {
    posts = posts.filter((p) => p.case_slug === caseFilter)
  }

  const caseCounts = CASES.slice(0, 6).map((c) => ({
    ...c,
    count: allPosts.filter((p) => p.case_slug === c.slug).length,
  }))

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-brown text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-kory text-sm font-medium uppercase tracking-widest mb-3">
            Le Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">
            Le Blog de la Communauté
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed mb-6">
            Conseils, recettes, guides et histoires de notre communauté.
            Partageons nos savoirs, nos talents, et notre culture.
          </p>
          {/* Search bar */}
          <form method="GET" className="mt-6 flex gap-2 max-w-md mx-auto w-full">
            <input
              type="search"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Rechercher un article…"
              className="flex-1 px-4 py-2.5 rounded-xl text-brown text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white/10 placeholder:text-white/50 text-white border border-white/20"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              🔍
            </button>
          </form>

          <div className="mt-4 flex gap-2 flex-wrap justify-center">
            <Link
              href="/blog"
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${!caseFilter ? 'bg-white text-brown' : 'text-white/70 hover:text-white bg-white/10'}`}
            >
              Tous
            </Link>
            {CASES.slice(0, 7).map((c) => (
              <Link
                key={c.slug}
                href={`/blog?case=${c.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${caseFilter === c.slug ? 'bg-white text-brown' : 'text-white/70 hover:text-white bg-white/10'}`}
              >
                {c.icon} {c.label.replace('Case ', '')}
              </Link>
            ))}
          </div>

          <Link
            href="/blog/soumettre"
            className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm mt-4"
          >
            ✍️ Proposer un article
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Results count */}
        {(q || caseFilter) && (
          <div className="mb-5 flex items-center gap-3 flex-wrap">
            <p className="text-sm text-brown/60">
              {posts.length} article{posts.length > 1 ? 's' : ''} trouvé{posts.length > 1 ? 's' : ''}
              {q && <> pour &ldquo;<strong className="text-brown">{q}</strong>&rdquo;</>}
            </p>
            <Link href="/blog" className="text-xs text-primary underline">Effacer les filtres</Link>
          </div>
        )}
        <div className="flex gap-8">
          {/* Articles grid */}
          <main className="flex-1 min-w-0">
            {posts.length === 0 ? (
              <div className="text-center py-16 text-brown/40">
                <p className="text-4xl mb-3">📝</p>
                <p className="text-base">Aucun article trouvé.</p>
                <Link href="/blog" className="mt-3 inline-block text-sm text-primary underline">Voir tous les articles</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </main>

          {/* Sidebar (desktop only) */}
          <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-6">
            {/* Propose article CTA */}
            <div className="bg-primary rounded-xl p-5 text-white">
              <p className="font-semibold mb-1 text-sm">
                Partagez votre expertise !
              </p>
              <p className="text-xs text-white/70 mb-3">
                Soumettez un article et gagnez 10 Korys si il est accepté.
              </p>
              <Link
                href="/blog/soumettre"
                className="inline-flex text-xs font-medium bg-white text-primary px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
              >
                Proposer un article →
              </Link>
            </div>

            {/* Popular tags */}
            <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
              <h3 className="font-semibold text-brown mb-4 text-sm uppercase tracking-wide">
                Tags populaires
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full bg-brown/5 text-brown/60 border border-brown/10 cursor-pointer hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Cases */}
            <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
              <h3 className="font-semibold text-brown mb-4 text-sm uppercase tracking-wide">
                Par Case
              </h3>
              <div className="flex flex-col gap-2">
                {caseCounts.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/blog?case=${c.slug}`}
                    className={`flex items-center justify-between py-1.5 rounded-lg px-2 -mx-2 transition-colors hover:bg-brown/5 ${caseFilter === c.slug ? 'bg-primary/5' : ''}`}
                  >
                    <span className={`flex items-center gap-2 text-sm ${caseFilter === c.slug ? 'text-primary font-medium' : 'text-brown/70'}`}>
                      {c.icon} {c.label}
                    </span>
                    <span className="text-xs font-medium text-brown/40 bg-brown/5 px-2 py-0.5 rounded-full">
                      {c.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary/5 rounded-xl border border-primary/10 p-5">
              <p className="text-sm font-semibold text-brown mb-1">
                Vous êtes talent ?
              </p>
              <p className="text-xs text-brown/60 mb-3">
                Partagez votre expertise avec la communauté.
              </p>
              <Link
                href="/inscription"
                className="inline-flex text-xs font-medium text-primary hover:underline"
              >
                Rejoindre la communauté →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
