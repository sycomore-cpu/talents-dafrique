import type { MetadataRoute } from 'next'
import { createServerClient } from '@supabase/ssr'
import { CASES } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://talentsdafrique.com'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/parrainage`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/comment-ca-marche`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/inscription`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/connexion`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const caseRoutes: MetadataRoute.Sitemap = CASES.map((c) => ({
    url: `${base}/cases/${c.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Dynamic blog posts + talents from Supabase
  let blogRoutes: MetadataRoute.Sitemap = []
  let talentRoutes: MetadataRoute.Sitemap = []
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
    if (posts) {
      blogRoutes = posts.map((post) => ({
        url: `${base}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }

    const { data: talents } = await supabase
      .from('profiles')
      .select('id, name, case_slug, updated_at')
      .eq('is_talent', true)
      .neq('status', 'suspendu')
    if (talents) {
      const slugify = (s: string) =>
        s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      talentRoutes = talents
        .filter((t) => t.case_slug && t.name)
        .map((t) => ({
          url: `${base}/cases/${t.case_slug}/${slugify(t.name)}-${(t.id as string).slice(0, 6)}`,
          lastModified: t.updated_at ? new Date(t.updated_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
    }
  } catch {
    // If Supabase is unavailable, skip dynamic routes
  }

  return [...staticRoutes, ...caseRoutes, ...blogRoutes, ...talentRoutes]
}
