import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

type BlogStatus = 'draft' | 'pending' | 'published' | 'rejected'

interface BlogPostUpdate {
  title?: string
  excerpt?: string
  content_md?: string
  cover_image?: string
  tags?: string[]
  case_slug?: string | null
  status?: BlogStatus
  author_name?: string
  is_featured?: boolean
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

  let query = supabase.from('blog_posts').select('*')

  if (slugParam) {
    query = query.eq('slug', slugParam)
  } else {
    query = query.eq('id', id)
  }

  const { data, error } = await query.single()

  if (error || !data) {
    return NextResponse.json({ error: 'Article introuvable' }, { status: 404 })
  }

  // Increment view count (fire and forget)
  supabase
    .from('blog_posts')
    .update({ views: (data.views ?? 0) + 1 })
    .eq('id', data.id)
    .then(() => {})

  return NextResponse.json({ post: data })
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

  // Non-admin authors can only edit pending posts, not change status
  if (!isAdmin) {
    if (post.status !== 'pending') {
      return NextResponse.json(
        { error: 'Vous ne pouvez modifier que vos articles en attente' },
        { status: 403 }
      )
    }
    delete body.status
  }

  const wasPublished = post.status !== 'published' && body.status === 'published'

  const update: Record<string, unknown> = {
    ...body,
    updated_at: new Date().toISOString(),
  }

  if (wasPublished) {
    update.published_at = new Date().toISOString()
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
