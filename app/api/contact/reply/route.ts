import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin-auth'
import { sendEmail } from '@/lib/email'

// POST /api/contact/reply — admin replies directly to a contact message
export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const { id, reply } = await request.json()
    if (!id || !reply?.trim()) {
      return NextResponse.json({ error: 'id et reply requis' }, { status: 400 })
    }

    // Load the original message
    const { data: msg, error: loadErr } = await supabaseAdmin
      .from('contact_messages')
      .select('id, name, email, subject, message')
      .eq('id', id)
      .single()

    if (loadErr || !msg) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 })
    }

    const originalSubject = (msg.subject as string) || 'Votre message'
    const emailSubject = `Re: ${originalSubject}`
    const escaped = (reply as string).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const quoted = (msg.message as string).replace(/</g, '&lt;').replace(/>/g, '&gt;')

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3D2009; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #F5E6C8; margin: 0; font-size: 20px;">Talents d'Afrique</h1>
        </div>
        <div style="background: #FFFBF5; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E8D5B7;">
          <h2 style="color: #3D2009;">Bonjour ${msg.name},</h2>
          <p style="color: #5C3D1E; white-space: pre-wrap;">${escaped}</p>
          <p style="color: #8B6845; font-size: 12px; margin-top: 24px;">— L'équipe Talents d'Afrique</p>
          <hr style="border: none; border-top: 1px solid #E8D5B7; margin: 24px 0;" />
          <p style="color: #8B6845; font-size: 11px;">Votre message initial :</p>
          <blockquote style="border-left: 3px solid #E8D5B7; padding-left: 12px; margin: 8px 0; color: #8B6845; font-size: 12px; white-space: pre-wrap;">${quoted}</blockquote>
        </div>
      </div>
    `

    await sendEmail(msg.email as string, emailSubject, html)

    // Mark replied
    await supabaseAdmin
      .from('contact_messages')
      .update({ status: 'replied' })
      .eq('id', id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/contact/reply POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
