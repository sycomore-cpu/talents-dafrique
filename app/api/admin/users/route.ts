import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'

// GET /api/admin/users — list profiles with emails + filter
export async function GET(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim() ?? ''
  const isTalent = searchParams.get('is_talent') // '1' | '0' | null
  const status = searchParams.get('status') // 'observation' | 'parraine' | 'suspendu' | null
  const caseSlug = searchParams.get('case_slug') // category filter

  let q = supabaseAdmin
    .from('profiles')
    .select('id, name, city, case_slug, status, is_talent, kory_balance, phone, whatsapp, trust_score, bio, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(50)

  if (search.length >= 2) q = q.ilike('name', `%${search}%`)
  if (isTalent === '1') q = q.eq('is_talent', true)
  if (isTalent === '0') q = q.eq('is_talent', false)
  if (status) {
    q = q.eq('status', status)
  } else {
    // Hide suspended users by default — only show when explicitly filtered
    q = q.neq('status', 'suspendu')
  }
  if (caseSlug) q = q.eq('case_slug', caseSlug)

  const { data: profiles, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch emails from auth.users via admin API
  const emails: Record<string, string> = {}
  try {
    const { data: authList } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    for (const u of authList?.users ?? []) {
      if (u.id && u.email) emails[u.id] = u.email
    }
  } catch (e) {
    console.error('[admin/users listUsers]', e)
  }

  const withEmails = (profiles ?? []).map((p) => ({ ...p, email: emails[p.id] ?? null }))
  return NextResponse.json({ users: withEmails })
}

// PATCH /api/admin/users — update a user (status, trust_score, kory_balance)
export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await request.json()
  const { id, status, trust_score } = body
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  if (status) updates.status = status
  if (typeof trust_score === 'number') updates.trust_score = trust_score

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Aucune mise à jour' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notification
  if (status === 'parraine') {
    await supabaseAdmin.from('notifications').insert({
      user_id: id,
      type: 'status_change',
      title: '✨ Profil certifié',
      message: 'Votre profil a été validé par la communauté. Bienvenue parmi les parrainés !',
      link: '/dashboard',
    })
  } else if (status === 'suspendu') {
    await supabaseAdmin.from('notifications').insert({
      user_id: id,
      type: 'status_change',
      title: 'Compte suspendu',
      message: 'Votre compte a été suspendu. Contactez l\'équipe pour plus d\'informations.',
      link: '/contact',
    })
  }

  return NextResponse.json({ success: true })
}
