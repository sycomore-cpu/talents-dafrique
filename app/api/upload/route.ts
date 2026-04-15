import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 Mo
const MAX_PHOTOS = 3
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export async function POST(request: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────────────────────
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only dans une route handler
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // ── Récupérer le profil pour connaître le nb de photos actuelles ─────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('photos')
    .eq('id', user.id)
    .single()

  const currentPhotos: string[] = profile?.photos ?? []

  if (currentPhotos.length >= MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_PHOTOS} photos autorisées.` },
      { status: 400 }
    )
  }

  // ── Lire le fichier ──────────────────────────────────────────────────────────
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Format non supporté. Utilisez JPG, PNG ou WebP.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `La photo ne doit pas dépasser 2 Mo (reçu : ${(file.size / 1024 / 1024).toFixed(1)} Mo).` },
      { status: 400 }
    )
  }

  // ── Upload Cloudinary ────────────────────────────────────────────────────────
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Configuration Cloudinary manquante.' },
      { status: 500 }
    )
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = `talents/${user.id}`

  // Signature HMAC-SHA1 (paramètres triés alphabétiquement)
  const crypto = await import('crypto')
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
  const signature = crypto
    .createHmac('sha1', apiSecret)
    .update(paramsToSign)
    .digest('hex')

  const uploadForm = new FormData()
  uploadForm.append('file', file)
  uploadForm.append('api_key', apiKey)
  uploadForm.append('timestamp', String(timestamp))
  uploadForm.append('signature', signature)
  uploadForm.append('folder', folder)
  // Les transformations à la livraison (f_auto, q_auto, w_800) se configurent
  // dans l'upload preset Cloudinary ou via l'URL de livraison — pas à l'upload

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: uploadForm }
  )

  if (!uploadRes.ok) {
    const err = await uploadRes.json()
    console.error('[upload] Cloudinary error:', err)
    return NextResponse.json(
      { error: "Erreur lors de l'upload. Réessayez." },
      { status: 502 }
    )
  }

  const { secure_url } = await uploadRes.json() as { secure_url: string }

  // ── Mettre à jour le profil Supabase ─────────────────────────────────────────
  const newPhotos = [...currentPhotos, secure_url]
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ photos: newPhotos, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (updateError) {
    console.error('[upload] Supabase update error:', updateError)
    return NextResponse.json(
      { error: 'Upload réussi mais mise à jour du profil échouée.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: secure_url, photos: newPhotos })
}

export async function DELETE(request: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────────────────────
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { photoUrl } = await request.json() as { photoUrl: string }

  if (!photoUrl) {
    return NextResponse.json({ error: 'URL manquante.' }, { status: 400 })
  }

  // Supprimer de Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('photos')
    .eq('id', user.id)
    .single()

  const newPhotos = (profile?.photos ?? []).filter((p: string) => p !== photoUrl)

  await supabase
    .from('profiles')
    .update({ photos: newPhotos, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  // Note : on ne supprime pas de Cloudinary ici (peut se faire via webhook ou admin)
  return NextResponse.json({ photos: newPhotos })
}
