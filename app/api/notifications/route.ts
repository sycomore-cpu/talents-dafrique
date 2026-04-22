import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/admin'

function serverSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
}

// GET /api/notifications — returns user's notifications (newest first, limit 20)
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = serverSupabase(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ notifications: data ?? [] })
  } catch (err) {
    console.error('[api/notifications GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/notifications — creates a notification (internal use, requires service secret)
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-internal-secret')
  const validSecrets = [
    process.env.INTERNAL_API_SECRET,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ].filter(Boolean)
  if (!secret || !validSecrets.includes(secret)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { user_id, type, title, message, link } = body

    if (!user_id || !type || !title || !message) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({ user_id, type, title, message, link: link ?? null })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ notification: data })
  } catch (err) {
    console.error('[api/notifications POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/notifications — marks notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = serverSupabase(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id, all } = await request.json()

    if (all) {
      // Mark all notifications as read for this user
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    if (!id) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    // Verify notification belongs to this user
    const { data: notif } = await supabaseAdmin
      .from('notifications')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!notif || notif.user_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/notifications PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
