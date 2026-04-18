import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface BlogPostInsert {
  title: string
  slug: string
  excerpt?: string
  content_md?: string
  cover_image?: string
  tags?: string[]
  case_slug?: string
  status?: string
  author_id?: string
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

// GET /api/blog — list posts
export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createSupabase(cookieStore)

  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status') ?? 'published'
  const caseParam = searchParams.get('case')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  // Check if admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.is_admin === true
  }

  let query = supabase
    .from('blog_posts')
    .select(
      'id, title, slug, excerpt, cover_image, tags, case_slug, author:profiles!author_id(name), published_at, created_at, published'
    )
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (statusParam === 'all' && isAdmin) {
    // no filter
  } else if (isAdmin && statusParam === 'draft') {
    query = query.eq('published', false)
  } else if (isAdmin && statusParam === 'published') {
    query = query.eq('published', true)
  } else {
    // Non-admin always sees only published
    query = query.eq('published', true)
  }

  if (caseParam) {
    query = query.eq('case_slug', caseParam)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Normalize author_name from join
  const posts = (data ?? []).map((p: Record<string, unknown>) => {
    const author = p.author as { name?: string } | null
    return {
      ...p,
      author_name: author?.name ?? "Talents d'Afrique",
    }
  })

  return NextResponse.json({ posts })
}

// POST /api/blog — create post
export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createSupabase(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  let isAdmin = false

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, name')
    .eq('id', user.id)
    .single()

  if (profile) {
    isAdmin = profile.is_admin === true
  }

  const body = (await request.json()) as BlogPostInsert

  if (!body.title || !body.slug) {
    return NextResponse.json(
      { error: 'title et slug sont requis' },
      { status: 400 }
    )
  }

  // Map status string to published boolean
  // Admin can publish directly; others submit as pending (published: false)
  const wantsPublished = isAdmin && body.status === 'published'

  const insert = {
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt ?? null,
    content: body.content_md ?? '',
    cover_image: body.cover_image ?? null,
    tags: body.tags ?? [],
    case_slug: body.case_slug ?? null,
    author_id: user.id,
    published: wantsPublished,
    published_at: wantsPublished ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(insert)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ post: data }, { status: 201 })
}
