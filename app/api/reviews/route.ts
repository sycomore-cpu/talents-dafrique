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

// POST /api/reviews — submit a review for a completed reservation
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = serverSupabase(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { reservation_id, talent_id, rating, comment } = await request.json()

    if (!reservation_id || !talent_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }

    // Verify the reservation belongs to this user as client and is accepted/completed
    const { data: reservation, error: resError } = await supabase
      .from('reservations')
      .select('id, client_id, talent_id, status')
      .eq('id', reservation_id)
      .single()

    if (resError || !reservation) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

    if (reservation.client_id !== user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    if (!['accepted', 'completed'].includes(reservation.status)) {
      return NextResponse.json({ error: 'La réservation doit être acceptée pour laisser un avis' }, { status: 400 })
    }

    if (reservation.talent_id !== talent_id) {
      return NextResponse.json({ error: 'Talent non correspondant' }, { status: 400 })
    }

    // Check no duplicate review
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('reservation_id', reservation_id)
      .eq('reviewer_id', user.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Avis déjà publié pour cette réservation' }, { status: 409 })
    }

    // Insert review
    const { error: reviewErr } = await supabase.from('reviews').insert({
      reviewer_id: user.id,
      talent_id,
      reservation_id,
      rating,
      comment: comment || null,
    })

    if (reviewErr) return NextResponse.json({ error: reviewErr.message }, { status: 500 })

    // Mark reservation as completed
    await supabase
      .from('reservations')
      .update({ status: 'completed' })
      .eq('id', reservation_id)

    // Recalculate talent trust_score and review_count
    const { data: allReviews } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('talent_id', talent_id)

    if (allReviews && allReviews.length > 0) {
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      await supabaseAdmin
        .from('profiles')
        .update({
          trust_score: Math.round(avg * 10) / 10,
          review_count: allReviews.length,
        })
        .eq('id', talent_id)
    }

    // Notify talent
    await supabaseAdmin.from('notifications').insert({
      user_id: talent_id,
      type: 'new_review',
      title: 'Nouvel avis ⭐',
      message: `Vous avez reçu un avis ${rating}/5 pour votre prestation.`,
      link: '/dashboard?tab=profil',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/reviews POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
