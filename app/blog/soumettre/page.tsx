'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { CASES } from '@/lib/constants'
import { Tag, X, Loader2 } from 'lucide-react'

export default function SoumettreArticlePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [caseSlug, setCaseSlug] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/connexion?redirect=/blog/soumettre')
      } else {
        setAuthenticated(true)
      }
      setLoading(false)
    })
  }, [])

  function addTag() {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      setTags((prev) => [...prev, trimmed])
    }
    setTagInput('')
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !content) return

    setSubmitting(true)
    setError(null)

    try {
      const slug = slugify(title)
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt: excerpt || undefined,
          content_md: content,
          cover_image: coverImage || undefined,
          tags,
          case_slug: caseSlug || undefined,
          status: 'pending',
        }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Erreur lors de la soumission')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  const caseOptions = [
    { value: '', label: 'Choisir une Case (optionnel)' },
    ...CASES.map((c) => ({ value: c.slug, label: `${c.icon} ${c.label}` })),
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-brown/30 animate-spin" />
      </div>
    )
  }

  if (!authenticated) return null

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-brown/10 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">✍️</span>
          </div>
          <h1 className="text-2xl font-bold font-playfair text-brown mb-3">
            Article soumis !
          </h1>
          <p className="text-brown/60 text-sm leading-relaxed mb-6">
            Merci pour ta contribution. L&apos;équipe va le relire et te contacter si
            il est accepté. Tu recevras <strong>10 Korys</strong> si ton article
            est publié !
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="primary" href="/blog">
              Voir le blog
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false)
                setTitle('')
                setExcerpt('')
                setContent('')
                setCaseSlug('')
                setTags([])
                setCoverImage('')
              }}
            >
              Soumettre un autre article
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="bg-brown text-white py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/blog"
            className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1 mb-4"
          >
            ← Blog
          </Link>
          <h1 className="text-3xl font-bold font-playfair mb-2">
            Proposer un article
          </h1>
          <p className="text-white/70 text-sm">
            Partage ton expertise avec la communauté. Si ton article est accepté,
            tu gagnes{' '}
            <span className="text-kory font-semibold">10 Korys !</span>
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Info banner */}
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mb-6 flex gap-3">
          <span className="text-xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold text-brown mb-0.5">
              Comment ça fonctionne ?
            </p>
            <p className="text-xs text-brown/60 leading-relaxed">
              Ton article sera soumis à l&apos;équipe pour relecture. S&apos;il est accepté
              et publié, tu recevras automatiquement <strong>10 Korys</strong>.
              Écris en français, avec des conseils concrets et authentiques pour
              notre communauté.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Main card */}
          <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm flex flex-col gap-4">
            <Input
              label="Titre de l'article"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex. Mes conseils pour des tresses longue durée"
            />

            <Textarea
              label="Extrait (optionnel)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Court résumé affiché dans la liste du blog (150-200 caractères)..."
              rows={2}
              helper="Optionnel. Si vide, les premières lignes du contenu seront utilisées."
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-brown">
                  Contenu (Markdown){' '}
                  <span className="text-primary">*</span>
                </label>
                <span className="text-xs text-brown/40">
                  {content.length} caractères
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder={
                  '## Introduction\n\nCommencez à écrire votre article...\n\n## Sous-titre\n\nVotre contenu ici...'
                }
                rows={16}
                className="w-full rounded-lg border border-brown/15 bg-white px-3 py-2.5 text-sm text-brown placeholder:text-brown/30 font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-brown/30 transition-colors"
              />
              <p className="text-xs text-brown/40 mt-1">
                Utilisez la syntaxe Markdown : ## pour les titres, **gras**,
                *italique*, - pour les listes.
              </p>
            </div>
          </div>

          {/* Metadata card */}
          <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-brown">
              Informations complémentaires
            </h3>

            <Select
              label="Case associée (optionnel)"
              value={caseSlug}
              onChange={(e) => setCaseSlug(e.target.value)}
              options={caseOptions}
            />

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-brown flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-brown/40" />
                Tags (optionnel)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="coiffure, recette, Paris..."
                  className="flex-1 rounded-lg border border-brown/15 bg-white px-3 py-1.5 text-sm text-brown placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-brown/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-1.5 text-xs font-medium bg-brown/5 text-brown rounded-lg hover:bg-brown/10 transition-colors"
                >
                  +
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-primary/60 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-brown/40 mt-1.5">
                Appuyez sur Entrée ou virgule pour ajouter. Max 8 tags.
              </p>
            </div>

            <Input
              label="Image de couverture (optionnel)"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              helper="URL d'une image. Vous pouvez utiliser une image de votre galerie."
            />

            {coverImage && (
              <div className="rounded-lg overflow-hidden aspect-video bg-brown/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-brown/40">
              En soumettant, tu acceptes que l&apos;équipe puisse modifier ton
              article avant publication.
            </p>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={submitting}
              disabled={!title || !content || submitting}
              className="shrink-0"
            >
              Soumettre l&apos;article
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
