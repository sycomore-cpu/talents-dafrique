'use client'

import { useState, useCallback } from 'react'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 Mo
const MAX_PHOTOS = 3

export interface UploadState {
  uploading: boolean
  error: string | null
}

export function usePhotoUpload(
  currentPhotos: string[],
  onSuccess: (photos: string[]) => void
) {
  const [state, setState] = useState<UploadState>({ uploading: false, error: null })

  const upload = useCallback(
    async (file: File) => {
      setState({ uploading: false, error: null })

      // Validations client-side (double-check côté serveur aussi)
      if (currentPhotos.length >= MAX_PHOTOS) {
        setState({ uploading: false, error: `Maximum ${MAX_PHOTOS} photos autorisées.` })
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setState({
          uploading: false,
          error: `La photo ne doit pas dépasser 2 Mo (reçu\u00a0: ${(file.size / 1024 / 1024).toFixed(1)}\u00a0Mo).`,
        })
        return
      }

      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
      if (!allowed.includes(file.type)) {
        setState({
          uploading: false,
          error: 'Format non supporté. Utilisez JPG, PNG ou WebP.',
        })
        return
      }

      setState({ uploading: true, error: null })

      try {
        const form = new FormData()
        form.append('file', file)

        const res = await fetch('/api/upload', { method: 'POST', body: form })
        const data = await res.json()

        if (!res.ok) {
          setState({ uploading: false, error: data.error ?? 'Erreur inconnue.' })
          return
        }

        onSuccess(data.photos)
        setState({ uploading: false, error: null })
      } catch {
        setState({ uploading: false, error: 'Erreur réseau. Réessayez.' })
      }
    },
    [currentPhotos, onSuccess]
  )

  const remove = useCallback(
    async (photoUrl: string) => {
      setState({ uploading: true, error: null })
      try {
        const res = await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photoUrl }),
        })
        const data = await res.json()
        if (!res.ok) {
          setState({ uploading: false, error: data.error ?? 'Erreur suppression.' })
          return
        }
        onSuccess(data.photos)
        setState({ uploading: false, error: null })
      } catch {
        setState({ uploading: false, error: 'Erreur réseau.' })
      }
    },
    [onSuccess]
  )

  const canAdd = currentPhotos.length < MAX_PHOTOS

  return { ...state, upload, remove, canAdd, maxPhotos: MAX_PHOTOS, maxSizeMb: 2 }
}
