import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { sendEmail, emailKorysAdded } from '@/lib/email'

// POST /api/admin/korys — credit or debit Korys with notification + email
export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { user_id, amount, reason } = await request.json()
  if (!user_id || typeof amount !== 'number' || amount === 0 || !reason?.trim()) {
    return NextResponse.json({ error: 'user_id, amount (≠0) et reason requis' }, { status: 400 })
  }

  // Fetch current balance + name
  const { data: profile, error: profErr } = await supabaseAdmin
    .from('profiles')
    .select('id, name, kory_balance')
    .eq('id', user_id)
    .single()

  if (profErr || !profile) {
    return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })
  }

  const newBalance = (profile.kory_balance ?? 0) + amount
  if (newBalance < 0) {
    return NextResponse.json({ error: 'Solde insuffisant pour ce débit' }, { status: 400 })
  }

  // Update balance
  const { error: updErr } = await supabaseAdmin
    .from('profiles')
    .update({ kory_balance: newBalance })
    .eq('id', user_id)

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  // Insert transaction
  await supabaseAdmin.from('kory_transactions').insert({
    user_id,
    amount,
    reason: reason.trim(),
  })

  // Notification
  await supabaseAdmin.from('notifications').insert({
    user_id,
    type: amount > 0 ? 'korys_credited' : 'korys_debited',
    title: amount > 0 ? `🪙 +${amount} Korys` : `🪙 ${amount} Korys`,
    message: amount > 0
      ? `L'équipe vous a crédité ${amount} Korys (${reason.trim()}).`
      : `L'équipe a débité ${Math.abs(amount)} Korys de votre solde (${reason.trim()}).`,
    link: '/dashboard?tab=korys',
  })

  // Email (only for credit, to avoid bad UX on debit)
  if (amount > 0) {
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user_id)
      const email = authUser?.user?.email
      if (email) {
        const { subject, html } = emailKorysAdded(profile.name, amount, reason.trim())
        await sendEmail(email, subject, html)
      }
    } catch (e) {
      console.error('[admin/korys email]', e)
    }
  }

  return NextResponse.json({ success: true, newBalance })
}
