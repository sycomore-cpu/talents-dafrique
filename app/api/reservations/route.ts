import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail, emailReservationNew, emailReservationAccepted, emailReservationRefused } from '@/lib/email'

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

// POST /api/reservations — create a new reservation
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = serverSupabase(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { talent_id, service, date, time, description } = body

    if (!talent_id || !service) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert({
        client_id: user.id,
        talent_id,
        service,
        requested_date: date ?? '',
        requested_time: time ?? '09:00',
        description: description ?? null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Notify the talent about the new reservation
    const { data: clientProfile } = await supabaseAdmin
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single()

    const clientName = clientProfile?.name ?? 'Un membre'
    const dateStr = date ? new Date(date).toLocaleDateString('fr-FR') : ''

    const { error: notifErr1 } = await supabaseAdmin.from('notifications').insert({
      user_id: talent_id,
      type: 'reservation_new',
      title: 'Nouvelle demande 🔔',
      message: `${clientName} souhaite réserver "${service}"${dateStr ? ` le ${dateStr}` : ''}.`,
      link: '/dashboard?tab=reservations',
    })
    if (notifErr1) console.error('[notify reservation_new]', notifErr1)

    // Email the talent
    const { data: { user: talentAuthUser } } = await supabaseAdmin.auth.admin.getUserById(talent_id)
    const talentEmail = talentAuthUser?.email
    if (talentEmail) {
      const { data: talentProfile } = await supabaseAdmin.from('profiles').select('name').eq('id', talent_id).single()
      const talentName = talentProfile?.name ?? 'le talent'
      const emailData = emailReservationNew(talentName, clientName, service, dateStr || 'une date à convenir')
      await sendEmail(talentEmail, emailData.subject, emailData.html)
    }

    return NextResponse.json({ reservation })
  } catch (err) {
    console.error('[api/reservations POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PATCH /api/reservations
// Body: { id, action: 'accept' | 'refuse' | 'reveal_contact' }
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = serverSupabase(cookieStore)

    // Vérifier l'utilisateur connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id, action } = await request.json()
    if (!id || !action) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    // Récupérer la réservation pour vérifier les droits
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('id, status, talent_id, client_id, service, date')
      .eq('id', id)
      .single()

    if (fetchError || !reservation) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

    const service: string = reservation.service ?? 'votre prestation'

    if (action === 'accept') {
      // Seul le talent peut accepter
      if (reservation.talent_id !== user.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
      if (reservation.status !== 'pending') {
        return NextResponse.json({ error: 'Réservation déjà traitée' }, { status: 400 })
      }

      // Débiter 1 Kory au talent
      const { data: profile } = await supabase
        .from('profiles')
        .select('kory_balance')
        .eq('id', user.id)
        .single()

      if (profile && (profile.kory_balance ?? 0) > 0) {
        await supabase
          .from('profiles')
          .update({ kory_balance: (profile.kory_balance ?? 0) - 1 })
          .eq('id', user.id)

        await supabase.from('kory_transactions').insert({
          user_id: user.id,
          amount: -1,
          reason: 'Acceptation d\'une demande de réservation',
        })
      }

      // Mettre à jour le statut
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'accepted' })
        .eq('id', id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Notifier le client
      const { error: notifErr2 } = await supabaseAdmin.from('notifications').insert({
        user_id: reservation.client_id,
        type: 'reservation_accepted',
        title: 'Demande acceptée 🎉',
        message: `Votre demande pour "${service}" a été acceptée ! Vous pouvez maintenant contacter le talent.`,
        link: '/dashboard?tab=reservations',
      })
      if (notifErr2) console.error('[notify reservation_accepted]', notifErr2)

      // Email the client
      const { data: { user: clientAuthUser } } = await supabaseAdmin.auth.admin.getUserById(reservation.client_id)
      const clientEmail = clientAuthUser?.email
      if (clientEmail) {
        const { data: clientProfile } = await supabaseAdmin.from('profiles').select('name').eq('id', reservation.client_id).single()
        const { data: talentProfileAccept } = await supabaseAdmin.from('profiles').select('name').eq('id', user.id).single()
        const clientName = clientProfile?.name ?? 'le client'
        const talentName = talentProfileAccept?.name ?? 'le talent'
        const emailData = emailReservationAccepted(clientName, talentName, service)
        await sendEmail(clientEmail, emailData.subject, emailData.html)
      }

      return NextResponse.json({ success: true, status: 'accepted' })
    }

    if (action === 'refuse') {
      // Seul le talent peut refuser
      if (reservation.talent_id !== user.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
      if (reservation.status !== 'pending') {
        return NextResponse.json({ error: 'Réservation déjà traitée' }, { status: 400 })
      }

      const { error } = await supabase
        .from('reservations')
        .update({ status: 'refused' })
        .eq('id', id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Notifier le client
      const { error: notifErr3 } = await supabaseAdmin.from('notifications').insert({
        user_id: reservation.client_id,
        type: 'reservation_refused',
        title: 'Demande refusée',
        message: `Votre demande pour "${service}" a été refusée.`,
        link: '/dashboard?tab=reservations',
      })
      if (notifErr3) console.error('[notify reservation_refused]', notifErr3)

      // Email the client
      const { data: { user: clientAuthUserRefuse } } = await supabaseAdmin.auth.admin.getUserById(reservation.client_id)
      const clientEmailRefuse = clientAuthUserRefuse?.email
      if (clientEmailRefuse) {
        const { data: clientProfileRefuse } = await supabaseAdmin.from('profiles').select('name').eq('id', reservation.client_id).single()
        const clientNameRefuse = clientProfileRefuse?.name ?? 'le client'
        const emailData = emailReservationRefused(clientNameRefuse, service)
        await sendEmail(clientEmailRefuse, emailData.subject, emailData.html)
      }

      return NextResponse.json({ success: true, status: 'refused' })
    }

    if (action === 'reveal_contact') {
      // Seul le client peut révéler le contact (après acceptation)
      if (reservation.client_id !== user.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
      if (reservation.status !== 'accepted') {
        return NextResponse.json({ error: 'Réservation non acceptée' }, { status: 400 })
      }

      const { error } = await supabase
        .from('reservations')
        .update({ contact_revealed: true })
        .eq('id', id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Debit 1 Kory from client for revealing contact
      const { data: clientProfileReveal } = await supabase.from('profiles').select('kory_balance').eq('id', user.id).single()
      if (clientProfileReveal && (clientProfileReveal.kory_balance ?? 0) > 0) {
        await supabase.from('profiles').update({ kory_balance: (clientProfileReveal.kory_balance ?? 0) - 1 }).eq('id', user.id)
        await supabase.from('kory_transactions').insert({ user_id: user.id, amount: -1, reason: "Révélation du contact d'un talent" })
      }

      // Notifier le talent
      const { error: notifErr4 } = await supabaseAdmin.from('notifications').insert({
        user_id: reservation.talent_id,
        type: 'contact_revealed',
        title: 'Contact révélé 📞',
        message: `Un client a révélé votre contact pour "${service}".`,
        link: '/dashboard?tab=reservations',
      })
      if (notifErr4) console.error('[notify contact_revealed]', notifErr4)

      return NextResponse.json({ success: true })
    }

    if (action === 'complete') {
      // Client ou talent peut marquer comme terminée
      const isParty = reservation.client_id === user.id || reservation.talent_id === user.id
      if (!isParty) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

      const { error } = await supabase
        .from('reservations')
        .update({ status: 'completed' })
        .eq('id', id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true, status: 'completed' })
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
  } catch (err) {
    console.error('[api/reservations PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
