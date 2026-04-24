import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { sendEmail } from '@/lib/email'

// POST /api/admin/message — send an email + in-app notification to a member
export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { user_id, subject, message } = await request.json()
  if (!user_id || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'user_id, subject et message requis' }, { status: 400 })
  }

  // Fetch user
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, name')
    .eq('id', user_id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })

  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user_id)
  const email = authUser?.user?.email

  // In-app notification
  await supabaseAdmin.from('notifications').insert({
    user_id,
    type: 'admin_message',
    title: `📩 ${subject.trim()}`,
    message: message.trim(),
    link: '/dashboard',
  })

  // Email
  if (email) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3D2009; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #F5E6C8; margin: 0; font-size: 20px;">Talents d'Afrique</h1>
        </div>
        <div style="background: #FFFBF5; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E8D5B7;">
          <h2 style="color: #3D2009;">Bonjour ${profile.name},</h2>
          <p style="color: #5C3D1E; white-space: pre-wrap; line-height: 1.6;">${message.trim().replace(/</g, '&lt;')}</p>
          <hr style="border: none; border-top: 1px solid #E8D5B7; margin: 24px 0;" />
          <p style="color: #8B6845; font-size: 12px;">L'équipe Talents d'Afrique</p>
        </div>
      </div>
    `
    await sendEmail(email, subject.trim(), html)
  }

  return NextResponse.json({ success: true, emailSent: !!email })
}
