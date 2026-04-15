'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { CASES } from '@/lib/constants'
import { slugify } from '@/lib/utils'
import { Save, Globe, Tag, X } from 'lucide-react'

export default function NouvelArticlePage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [caseSlug, setCaseSlug] = useState('')
  const [city, setCity] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Auto-generate slug from title unless user has manually edited it
  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title))
    }
  }, [title, slugEdited])

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(slugify(e.target.value))
    setSlugEdited(true)
  }

  function addTag() {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
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

  async function handleSave(publish: boolean) {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    if (publish) setPublished(true)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const caseOptions = [
    { value: '', label: 'Toutes les Cases (général)' },
    ...CASES.map((c) => ({ value: c.slug, label: c.label })),
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <div className="bg-white border-b border-brown/10 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="sm" href="/admin">
              ← Admin
            </Button>
            <span className="text-brown/20">/</span>
            <span className="text-sm font-medium text-brown truncate">
              {title || 'Nouvel article'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {saved && (
              <span className="text-xs text-green-600 font-medium">
                Sauvegardé ✓
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave(false)}
              isLoading={saving}
              disabled={!title || !content}
            >
              <Save className="w-3.5 h-3.5" />
              Brouillon
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSave(true)}
              isLoading={saving}
              disabled={!title || !content}
            >
              <Globe className="w-3.5 h-3.5" />
              Publier
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
              <div className="flex flex-col gap-4">
                <Input
                  label="Titre de l'article"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex. Comment entretenir ses locks : le guide complet"
                  className="text-lg font-semibold"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-brown">
                    Slug (URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brown/40 shrink-0">
                      /blog/
                    </span>
                    <input
                      value={slug}
                      onChange={handleSlugChange}
                      placeholder="mon-article-de-blog"
                      className="flex-1 rounded-lg border border-brown/15 bg-white px-3 py-2 text-sm text-brown font-mono placeholder:text-brown/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-brown/30 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-brown/40">
                    Généré automatiquement depuis le titre. Modifiable manuellement.
                  </p>
                </div>
                <Textarea
                  label="Extrait"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Court résumé de l'article affiché dans la liste du blog..."
                  rows={2}
                  helper="150-200 caractères recommandés."
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-brown">
                  Contenu (Markdown)
                  <span className="text-primary ml-0.5">*</span>
                </label>
                <span className="text-xs text-brown/40">
                  {content.length} caractères
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="## Introduction&#10;&#10;Commencez à écrire votre article en Markdown...&#10;&#10;## Sous-titre&#10;&#10;Votre contenu ici..."
                rows={20}
                className="w-full rounded-lg border border-brown/15 bg-white px-3 py-2.5 text-sm text-brown placeholder:text-brown/30 font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-brown/30 transition-colors"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Publish status */}
            <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-brown mb-3">
                Publication
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setPublished((p) => !p)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    published ? 'bg-secondary' : 'bg-brown/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      published ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm text-brown">
                  {published ? 'Publié' : 'Brouillon'}
                </span>
              </label>
            </div>

            {/* Case + City */}
            <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-brown mb-3">
                Catégorisation
              </h3>
              <div className="flex flex-col gap-3">
                <Select
                  label="Case associée"
                  value={caseSlug}
                  onChange={(e) => setCaseSlug(e.target.value)}
                  options={caseOptions}
                />
                <Input
                  label="Ville (SEO local)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="ex. Paris"
                  helper="Optionnel. Améliore le référencement local."
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-brown mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-brown/40" />
                Tags
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Ajouter un tag..."
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
                        onClick={() => removeTag(tag)}
                        className="hover:text-primary/60 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-brown/40 mt-2">
                Appuyez sur Entrée ou virgule pour ajouter.
              </p>
            </div>

            {/* Cover image */}
            <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-brown mb-3">
                Image de couverture
              </h3>
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                helper="URL de l'image. Utilisez Cloudinary pour l'hébergement."
              />
              {coverImage && (
                <div className="mt-3 rounded-lg overflow-hidden aspect-video bg-brown/5">
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
          </div>
        </div>
      </div>
    </div>
  )
}
