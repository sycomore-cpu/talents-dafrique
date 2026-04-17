import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') ?? 'email'
  // next peut venir de l'URL (legacy) ou du cookie (préféré, car les redirectTo avec query params
  // ne sont pas toujours acceptés par Supabase si non enregistrés exactement)
  const nextFromUrl = searchParams.get('next')

  const cookieStore = await cookies()

  // Lire le cookie auth_next (posé avant l'OAuth pour éviter les URL non enregistrées)
  const cookieNext = cookieStore.get('auth_next')?.value

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )

  // Destination finale (priorité : cookie > query param > dashboard)
  const nextPath = cookieNext
    ? decodeURIComponent(cookieNext)
    : nextFromUrl?.startsWith('/') ? nextFromUrl : '/dashboard'

  // ── 1. OAuth code (Google, GitHub…) ────────────────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      cookieStore.delete('auth_next')
      return NextResponse.redirect(`${origin}${nextPath}`)
    }
  }

  // ── 2. Magic link / Email OTP (token_hash dans l'URL envoyée par Supabase) ─
  if (token_hash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'magiclink' | 'recovery' | 'invite',
    })
    if (!error) {
      cookieStore.delete('auth_next')
      return NextResponse.redirect(`${origin}${nextPath}`)
    }
  }

  // En cas d'erreur → retour connexion avec message
  return NextResponse.redirect(`${origin}/connexion?error=auth`)
}
