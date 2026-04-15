export type UserStatus = 'observation' | 'parraine' | 'suspendu'
export type ReservationStatus =
  | 'pending'
  | 'accepted'
  | 'refused'
  | 'completed'
  | 'disputed'

export interface Profile {
  id: string
  name: string
  avatar_url: string | null
  city: string
  phone: string | null
  whatsapp: string | null
  bio: string | null
  is_talent: boolean
  case_slug: string | null
  sub_services: string[]
  availability: Record<string, { start: string; end: string }>
  photos: string[]
  parrain_id: string | null
  parrain_code: string
  status: UserStatus
  trust_score: number
  kory_balance: number
  is_admin: boolean
  review_count: number
  created_at: string
  updated_at: string
}

export interface Reservation {
  id: string
  client_id: string
  talent_id: string
  service: string
  description: string | null
  requested_date: string
  requested_time: string
  status: ReservationStatus
  kory_charged: boolean
  contact_revealed: boolean
  client_confirmed: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  reservation_id: string
  reviewer_id: string
  talent_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  tags: string[]
  case_slug: string | null
  city: string | null
  published: boolean
  author_id: string
  created_at: string
  published_at: string | null
}

export interface KoryTransaction {
  id: string
  user_id: string
  amount: number
  reason: string
  reservation_id: string | null
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_id: string
  reason: string
  details: string | null
  status: 'pending' | 'reviewed' | 'resolved'
  created_at: string
}
