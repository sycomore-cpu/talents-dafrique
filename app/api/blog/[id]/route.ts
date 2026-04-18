import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface BlogPostUpdate {
  title?: string
  excerpt?: string
  content_md?: string
  cover_image?: string
  tags?: string[]
  case_slug?: string | null
  status?: string
}

function createSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
}

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/blog/[id] — single post by ID or slug
export async function GET(request: NextRequest, { params }: RouteContext) {
  const cookieStore = await cookies()
  const supabase = createSupabase(cookieStore)
  const { id } = await params

  const slugParam = new URL(request.url).searchParams.get('slug')

  let query = supabase
    .from('blog_posts')
    .select('*, author:profiles!author_id(name)')

  if (slugParam) {
    query = query.eq('slug', slugParam)
  } else {
    query = query.eq('id', id)
  }

  const { data, error } = await query.single()

  if (error || !data) {
    return NextResponse.json({ error: 'Article introuvable' }, { status: 404 })
  }

  const post = {
    ...data,
    author_name: (data.author as { name?: string } | null)?.name ?? "Talents d'Afrique",
    // Expose content as content_md for backward compatibility
    content_md: data.content ?? '',
  }

  return NextResponse.json({ post })
}

// PATCH /api/blog/[id] — update post
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const cookieStore = await cookies()
  const supabase = createSupabase(cookieStore)
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Get current post
  const { data: post, error: fetchError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !post) {
    return NextResponse.json({ error: 'Article introuvable' }, { status: 404 })
  }

  // Check permissions
  let isAdmin = false
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  isAdmin = profile?.is_admin === true

  const isAuthor = post.author_id === user.id

  if (!isAdmin && !isAuthor) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = (await request.json()) as BlogPostUpdate

  // Non-admin authors can only edit unpublished posts
  if (!isAdmin) {
    if (post.published === true) {
      return NextResponse.json(
        { error: 'Vous ne pouvez modifier que vos articles en attente' },
        { status: 403 }
      )
    }
    delete body.status
  }

  // Map status string to published boolean
  const wasPublished = post.published !== true && body.status === 'published'
  const isUnpublishing = post.published === true && body.status === 'draft'

  const update: Record<string, unknown> = {}

  if (body.title !== undefined) update.title = body.title
  if (body.excerpt !== undefined) update.excerpt = body.excerpt
  if (body.content_md !== undefined) update.content = body.content_md
  if (body.cover_image !== undefined) update.cover_image = body.cover_image
  if (body.tags !== undefined) update.tags = body.tags
  if (body.case_slug !== undefined) update.case_slug = body.case_slug

  if (body.status !== undefined) {
    update.published = body.status === 'published'
  }

  if (wasPublished) {
    update.published_at = new Date().toISOString()
  } else if (isUnpublishing) {
    update.published_at = null
  }

  const { data: updated, error } = await supabase
    .from('blog_posts')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Credit +10 Korys when publishing
  if (wasPublished && post.author_id) {
    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('kory_balance')
      .eq('id', post.author_id)
      .single()

    const currentBalance = authorProfile?.kory_balance ?? 0

    await Promise.all([
      supabase
        .from('profiles')
        .update({ kory_balance: currentBalance + 10 })
        .eq('id', post.author_id),
      supabase.from('kory_transactions').insert({
        user_id: post.author_id,
        amount: 10,
        reason: `Article publié : ${post.title}`,
      }),
    ])
  }

  return NextResponse.json({ post: updated })
}

// DELETE /api/blog/[id] — admin only
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const cookieStore = await cookies()
  const supabase = createSupabase(cookieStore)
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
