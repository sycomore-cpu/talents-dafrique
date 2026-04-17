'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import {
  Users,
  Star,
  Clock,
  Calendar,
  Coins,
  CircleCheck,
  Ban,
  FileText,
  TrendingUp,
  TriangleAlert,
  CirclePlus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  RotateCcw,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileStatus = 'observation' | 'parraine' | 'suspendu'

interface Profile {
  id: string
  name: string
  city: string | null
  case: string | null
  status: ProfileStatus
  created_at: string
  is_talent: boolean
  kory_balance: number
}

interface Report {
  id: string
  reporter: { name: string } | null
  reported: { name: string } | null
  reason: string | null
  created_at: string
  status: string
}

interface KoryTransaction {
  id: string
  user_id: string
  amount: number
  reason: string | null
  created_at: string
  profiles: { name: string } | null
}

interface Stats {
  totalUsers: number | string
  talentsCertifies: number | string
  enObservation: number | string
  reservationsMois: number | string
  korysDistribues: number | string
}

// ─── Mock Blog Data (blog pas encore connecté à Supabase) ──────────────────────

const MOCK_BLOG_POSTS = [
  {
    id: 'b1',
    title: 'Comment entretenir ses locks : le guide complet',
    case: 'Case Beauté',
    published: true,
    date: '2026-04-01',
  },
  {
    id: 'b2',
    title: 'Monter ses meubles IKEA : nos talents disponibles ce week-end à Paris',
    case: 'Case Maison',
    published: true,
    date: '2026-04-05',
  },
  {
    id: 'b3',
    title: "Pourquoi le Kory s'inspire du Cauri, l'ancienne monnaie africaine",
    case: null,
    published: false,
    date: '2026-04-10',
  },
]

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string
  value: number | string
  icon: React.FC<{ className?: string }>
  color: string
  loading?: boolean
}) {
  return (
    <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-brown/50 mb-1">{label}</p>
          {loading ? (
            <Loader2 className="w-5 h-5 text-brown/30 animate-spin mt-1" />
          ) : (
            <p className="text-2xl font-bold text-brown">
              {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const supabase = createClient()
  const [stats, setStats] = useState<Stats>({
    totalUsers: '—',
    talentsCertifies: '—',
    enObservation: '—',
    reservationsMois: '—',
    korysDistribues: '—',
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState<Profile[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [userStatuses, setUserStatuses] = useState<Record<string, ProfileStatus>>({})
  const [pendingReports, setPendingReports] = useState<Report[]>([])
  const [reportsLoading, setReportsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setStatsLoading(true)
      try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

        const [
          totalRes,
          parrainedRes,
          observationRes,
          reservationsRes,
          korysRes,
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'parraine'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'observation'),
          supabase.from('reservations').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
          supabase.from('kory_transactions').select('amount'),
        ])

        let korysTotal: number | string = '—'
        if (!korysRes.error && korysRes.data) {
          korysTotal = (korysRes.data as { amount: number }[])
            .filter((t) => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0)
        }

        setStats({
          totalUsers: totalRes.error ? '—' : (totalRes.count ?? '—'),
          talentsCertifies: parrainedRes.error ? '—' : (parrainedRes.count ?? '—'),
          enObservation: observationRes.error ? '—' : (observationRes.count ?? '—'),
          reservationsMois: reservationsRes.error ? '—' : (reservationsRes.count ?? '—'),
          korysDistribues: korysTotal,
        })
      } catch {
        // affiche '—' en cas d'erreur
      } finally {
        setStatsLoading(false)
      }
    }

    async function loadRecentUsers() {
      setUsersLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, city, case, status, created_at, is_talent, kory_balance')
          .order('created_at', { ascending: false })
          .limit(8)

        if (!error && data) {
          setRecentUsers(data as Profile[])
          setUserStatuses(Object.fromEntries((data as Profile[]).map((u) => [u.id, u.status])))
        }
      } catch {
        // silent
      } finally {
        setUsersLoading(false)
      }
    }

    async function loadPendingReports() {
      setReportsLoading(true)
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('id, reason, created_at, status, reporter:profiles!reporter_id(name), reported:profiles!reported_id(name)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(5)

        if (!error && data) {
          setPendingReports(data as unknown as Report[])
        }
      } catch {
        // silent
      } finally {
        setReportsLoading(false)
      }
    }

    loadStats()
    loadRecentUsers()
    loadPendingReports()
  }, [])

  async function updateUserStatus(userId: string, newStatus: ProfileStatus) {
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId)

    if (!error) {
      setUserStatuses((prev) => ({ ...prev, [userId]: newStatus }))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total membres"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-50 text-blue-600"
          loading={statsLoading}
        />
        <StatCard
          label="Talents parrainés"
          value={stats.talentsCertifies}
          icon={Star}
          color="bg-secondary/10 text-secondary"
          loading={statsLoading}
        />
        <StatCard
          label="En observation"
          value={stats.enObservation}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
          loading={statsLoading}
        />
        <StatCard
          label="Réservations ce mois"
          value={stats.reservationsMois}
          icon={Calendar}
          color="bg-primary/10 text-primary"
          loading={statsLoading}
        />
        <StatCard
          label="Korys distribués"
          value={stats.korysDistribues}
          icon={Coins}
          color="bg-kory/10 text-kory-700"
          loading={statsLoading}
        />
      </div>

      {/* Recent signups */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8 flex items-center justify-between">
          <h3 className="font-semibold text-brown">Inscriptions récentes</h3>
          <TrendingUp className="w-4 h-4 text-brown/30" />
        </div>
        {usersLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-brown/30 animate-spin" />
          </div>
        ) : recentUsers.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brown/40 text-center">Aucun membre récent.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brown/2">
                  {['Membre', 'Ville', 'Case', 'Statut', 'Inscrit le', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-medium text-brown/40 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brown/6">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-brown/2 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={u.name} size="sm" />
                        <span className="font-medium text-brown">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-brown/60">{u.city ?? '—'}</td>
                    <td className="px-5 py-3 text-brown/60">{u.case ?? '—'}</td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={
                          userStatuses[u.id] === 'parraine'
                            ? 'parraine'
                            : userStatuses[u.id] === 'suspendu'
                            ? 'suspendu'
                            : 'observation'
                        }
                        size="sm"
                      />
                    </td>
                    <td className="px-5 py-3 text-brown/50 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {userStatuses[u.id] !== 'parraine' && (
                          <button
                            onClick={() => updateUserStatus(u.id, 'parraine')}
                            className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <CircleCheck className="w-3.5 h-3.5" />
                            Certifier
                          </button>
                        )}
                        {userStatuses[u.id] === 'suspendu' ? (
                          <button
                            onClick={() => updateUserStatus(u.id, 'observation')}
                            className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Rétablir
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(u.id, 'suspendu')}
                            className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Suspendre
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8 flex items-center justify-between">
          <h3 className="font-semibold text-brown">Signalements récents</h3>
          <TriangleAlert className="w-4 h-4 text-amber-500" />
        </div>
        {reportsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-brown/30 animate-spin" />
          </div>
        ) : pendingReports.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brown/40 text-center">
            Aucun signalement en attente.
          </p>
        ) : (
          <div className="divide-y divide-brown/6">
            {pendingReports.map((r) => (
              <div key={r.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brown">
                    {r.reporter?.name ?? '—'} → {r.reported?.name ?? '—'}
                  </p>
                  <p className="text-xs text-brown/50 mt-0.5">{r.reason ?? '—'}</p>
                </div>
                <Button variant="outline" size="sm" href="/admin">
                  Voir
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Moderation Tab ───────────────────────────────────────────────────────────

function ModerationTab() {
  const supabase = createClient()
  const [talents, setTalents] = useState<Profile[]>([])
  const [talentsLoading, setTalentsLoading] = useState(true)
  const [talentStatuses, setTalentStatuses] = useState<Record<string, ProfileStatus>>({})
  const [reports, setReports] = useState<Report[]>([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportStatuses, setReportStatuses] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadTalentsObservation() {
      setTalentsLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, city, case, status, created_at, is_talent, kory_balance')
          .eq('status', 'observation')
          .eq('is_talent', true)
          .order('created_at', { ascending: false })

        if (!error && data) {
          setTalents(data as Profile[])
          setTalentStatuses(Object.fromEntries((data as Profile[]).map((u) => [u.id, u.status])))
        }
      } catch {
        // silent
      } finally {
        setTalentsLoading(false)
      }
    }

    async function loadReports() {
      setReportsLoading(true)
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('id, reason, created_at, status, reporter:profiles!reporter_id(name), reported:profiles!reported_id(name)')
          .order('created_at', { ascending: false })
          .limit(20)

        if (!error && data) {
          setReports(data as unknown as Report[])
          setReportStatuses(Object.fromEntries((data as unknown as Report[]).map((r) => [r.id, r.status])))
        }
      } catch {
        // silent
      } finally {
        setReportsLoading(false)
      }
    }

    loadTalentsObservation()
    loadReports()
  }, [])

  async function updateTalentStatus(userId: string, newStatus: ProfileStatus) {
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId)

    if (!error) {
      setTalentStatuses((prev) => ({ ...prev, [userId]: newStatus }))
    }
  }

  async function resolveReport(reportId: string) {
    const { error } = await supabase
      .from('reports')
      .update({ status: 'resolved' })
      .eq('id', reportId)

    if (!error) {
      setReportStatuses((prev) => ({ ...prev, [reportId]: 'resolved' }))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Observation list */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8">
          <h3 className="font-semibold text-brown">Talents en observation</h3>
          <p className="text-xs text-brown/50 mt-0.5">
            Ces talents n&apos;ont pas encore été parrainés par un membre certifié.
          </p>
        </div>
        {talentsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-brown/30 animate-spin" />
          </div>
        ) : talents.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brown/40 text-center">
            Aucun talent en observation.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brown/2">
                  {['Talent', 'Case', 'Ville', 'Inscrit le', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-medium text-brown/40 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brown/6">
                {talents.map((u) => (
                  <tr key={u.id} className="hover:bg-brown/2 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={u.name} size="sm" />
                        <span className="font-medium text-brown">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-brown/60">{u.case ?? '—'}</td>
                    <td className="px-5 py-3 text-brown/60">{u.city ?? '—'}</td>
                    <td className="px-5 py-3 text-brown/50 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="px-5 py-3">
                      {talentStatuses[u.id] === 'observation' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateTalentStatus(u.id, 'parraine')}
                            className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <CircleCheck className="w-3.5 h-3.5" />
                            Certifier
                          </button>
                          <button
                            onClick={() => updateTalentStatus(u.id, 'suspendu')}
                            className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Suspendre
                          </button>
                        </div>
                      ) : (
                        <Badge
                          variant={talentStatuses[u.id] === 'parraine' ? 'parraine' : 'suspendu'}
                          size="sm"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reports */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8">
          <h3 className="font-semibold text-brown">Signalements</h3>
        </div>
        {reportsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-brown/30 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brown/40 text-center">
            Aucun signalement.
          </p>
        ) : (
          <div className="divide-y divide-brown/6">
            {reports.map((r) => (
              <div
                key={r.id}
                className="px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-brown">
                      {r.reporter?.name ?? '—'}
                    </span>
                    <span className="text-brown/30">→</span>
                    <span className="text-sm font-medium text-brown">
                      {r.reported?.name ?? '—'}
                    </span>
                    <span className="text-xs text-brown/40">
                      {new Date(r.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-xs text-brown/60 mt-0.5">{r.reason ?? '—'}</p>
                </div>
                {reportStatuses[r.id] === 'pending' ? (
                  <button
                    onClick={() => resolveReport(r.id)}
                    className="flex items-center gap-1 text-xs font-medium text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg hover:bg-secondary/20 transition-colors whitespace-nowrap"
                  >
                    <CircleCheck className="w-3.5 h-3.5" />
                    Résolu
                  </button>
                ) : (
                  <span className="text-xs text-green-600 font-medium">Résolu</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Blog Tab ─────────────────────────────────────────────────────────────────

function BlogTab() {
  const [posts, setPosts] = useState(MOCK_BLOG_POSTS)

  function togglePublish(id: string) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    )
  }

  function deletePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-brown">Articles du blog</h3>
        <Button variant="primary" size="sm" href="/admin/blog/nouveau">
          <CirclePlus className="w-3.5 h-3.5" />
          Nouvel article
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brown/2">
                {['Titre', 'Case', 'Statut', 'Date', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-medium text-brown/40 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/6">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-brown/2 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-brown line-clamp-1 max-w-xs">
                      {post.title}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-brown/60">{post.case ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5 ${
                        post.published
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {post.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-brown/50 whitespace-nowrap">
                    {new Date(post.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 rounded-lg hover:bg-brown/5 text-brown/50 hover:text-brown transition-colors"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-brown/5 text-brown/50 hover:text-brown transition-colors"
                        title="Éditer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => togglePublish(post.id)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                          post.published
                            ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                            : 'text-green-700 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {post.published ? 'Dépublier' : 'Publier'}
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-brown/30 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Korys Tab ────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string
  name: string
  kory_balance: number
}

function KorysTab() {
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [credited, setCredited] = useState(false)
  const [crediting, setCrediting] = useState(false)
  const [transactions, setTransactions] = useState<KoryTransaction[]>([])
  const [txLoading, setTxLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    setTxLoading(true)
    try {
      const { data, error } = await supabase
        .from('kory_transactions')
        .select('id, user_id, amount, reason, created_at, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data) {
        setTransactions(data as unknown as KoryTransaction[])
      }
    } catch {
      // silent
    } finally {
      setTxLoading(false)
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)
    setSelectedUser(null)
    setShowDropdown(false)

    if (searchDebounce.current) clearTimeout(searchDebounce.current)

    if (value.trim().length < 2) {
      setSearchResults([])
      return
    }

    searchDebounce.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, kory_balance')
          .ilike('name', `%${value.trim()}%`)
          .limit(6)

        if (!error && data) {
          setSearchResults(data as SearchResult[])
          setShowDropdown(true)
        }
      } catch {
        // silent
      } finally {
        setSearchLoading(false)
      }
    }, 300)
  }

  function selectUser(user: SearchResult) {
    setSelectedUser(user)
    setSearch(user.name)
    setShowDropdown(false)
    setSearchResults([])
  }

  async function handleCredit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedUser || !amount || !reason) return

    setCrediting(true)
    try {
      const numAmount = parseInt(amount, 10)
      const newBalance = (selectedUser.kory_balance ?? 0) + numAmount

      const [balanceRes, txRes] = await Promise.all([
        supabase
          .from('profiles')
          .update({ kory_balance: newBalance })
          .eq('id', selectedUser.id),
        supabase.from('kory_transactions').insert({
          user_id: selectedUser.id,
          amount: numAmount,
          reason,
        }),
      ])

      if (!balanceRes.error && !txRes.error) {
        setCredited(true)
        setSelectedUser(null)
        setSearch('')
        setAmount('')
        setReason('')
        await loadTransactions()
        setTimeout(() => setCredited(false), 2500)
      }
    } catch {
      // silent
    } finally {
      setCrediting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Credit form */}
      <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
        <h3 className="font-semibold text-brown mb-4">Créditer des Korys</h3>
        <form onSubmit={handleCredit} className="flex flex-col gap-4">
          {/* Search with dropdown */}
          <div className="relative">
            <Input
              label="Rechercher un membre"
              placeholder="Nom du membre..."
              value={search}
              onChange={handleSearchChange}
              autoComplete="off"
            />
            {searchLoading && (
              <div className="absolute right-3 top-9">
                <Loader2 className="w-4 h-4 text-brown/30 animate-spin" />
              </div>
            )}
            {showDropdown && searchResults.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full bg-white border border-brown/10 rounded-xl shadow-lg overflow-hidden">
                {searchResults.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => selectUser(u)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-brown/5 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium text-brown">{u.name}</span>
                      <span className="text-xs text-brown/40">{u.kory_balance ?? 0} K</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedUser && (
            <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
              Membre sélectionné : <strong>{selectedUser.name}</strong> — solde actuel :{' '}
              <strong>{selectedUser.kory_balance ?? 0} K</strong>
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Montant (Korys)"
              type="number"
              min="1"
              max="1000"
              placeholder="ex. 5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              label="Motif"
              placeholder="ex. Bonus fidélité..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="kory"
            size="md"
            className="w-fit"
            disabled={!selectedUser || !amount || !reason || crediting}
          >
            {crediting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Crédit en cours…
              </>
            ) : credited ? (
              'Korys crédités !'
            ) : (
              'Créditer les Korys'
            )}
          </Button>
        </form>
      </div>

      {/* Transaction log */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8">
          <h3 className="font-semibold text-brown">Journal des transactions</h3>
        </div>
        {txLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-brown/30 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brown/40 text-center">
            Aucune transaction enregistrée.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brown/2">
                  {['Date', 'Membre', 'Motif', 'Montant'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-medium text-brown/40 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brown/6">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-brown/2 transition-colors">
                    <td className="px-5 py-3 text-brown/50 whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-3 font-medium text-brown">
                      {tx.profiles?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-brown/60">{tx.reason ?? '—'}</td>
                    <td
                      className={`px-5 py-3 font-semibold whitespace-nowrap ${
                        tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount} K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type AdminTab = 'overview' | 'moderation' | 'blog' | 'korys'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  const tabs: { key: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'overview', label: "Vue d'ensemble", icon: TrendingUp },
    { key: 'moderation', label: 'Modération', icon: TriangleAlert },
    { key: 'blog', label: 'Blog', icon: FileText },
    { key: 'korys', label: 'Korys', icon: Coins },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin header */}
      <div className="bg-brown text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold font-playfair">Administration</h1>
              <p className="text-white/60 text-xs mt-0.5">
                Talents d&apos;Afrique — Panneau de gestion
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              href="/"
              className="text-white/70 hover:text-white"
            >
              ← Retour au site
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-kory text-white'
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'moderation' && <ModerationTab />}
        {activeTab === 'blog' && <BlogTab />}
        {activeTab === 'korys' && <KorysTab />}
      </div>
    </div>
  )
}
