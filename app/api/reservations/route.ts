import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
      .select('id, status, talent_id, client_id')
      .eq('id', id)
      .single()

    if (fetchError || !reservation) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

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
