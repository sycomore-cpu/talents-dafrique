import type { MetadataRoute } from 'next'
import { CASES } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://talentsdafrique.fr'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/comment-ca-marche`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/inscription`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/confidentialite`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cgu`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const caseRoutes: MetadataRoute.Sitemap = CASES.map((c) => ({
    url: `${base}/cases/${c.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...caseRoutes]
}
