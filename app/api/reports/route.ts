import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail, emailReportNew } from '@/lib/email'

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

// POST /api/reports — signaler un profil
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = serverSupabase(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { reported_id, reason, details } = await request.json()
    if (!reported_id || !reason?.trim()) {
      return NextResponse.json({ error: 'reported_id et reason requis' }, { status: 400 })
    }
    if (reported_id === user.id) {
      return NextResponse.json({ error: 'Impossible de se signaler soi-même' }, { status: 400 })
    }

    // Check no duplicate pending report
    const { data: existing } = await supabaseAdmin
      .from('reports')
      .select('id')
      .eq('reporter_id', user.id)
      .eq('reported_id', reported_id)
      .eq('status', 'pending')
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Vous avez déjà signalé ce profil' }, { status: 409 })
    }

    const { error } = await supabaseAdmin.from('reports').insert({
      reporter_id: user.id,
      reported_id,
      reason: reason.trim(),
      details: details?.trim() || null,
      status: 'pending',
    })

    if (error) {
      console.error('[api/reports POST]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch names for email
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, name')
      .in('id', [user.id, reported_id])

    const reporterName = profiles?.find((p) => p.id === user.id)?.name ?? 'Un membre'
    const reportedName = profiles?.find((p) => p.id === reported_id)?.name ?? 'Profil inconnu'

    // Notify admin by email
    const adminEmail = process.env.ADMIN_EMAIL || 'dany.dombou@gmail.com'
    const { subject, html } = emailReportNew(reporterName, reportedName, reason, details || '')
    await sendEmail(adminEmail, subject, html)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/reports POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
