'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
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
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STATS = {
  totalUsers: 1247,
  talentsCertifies: 382,
  enObservation: 91,
  reservationsMois: 234,
  korysDistribues: 18940,
}

const MOCK_RECENT_USERS = [
  {
    id: 'u1',
    name: 'Kofi Asante',
    city: 'Paris',
    case: 'Case Beauté',
    status: 'observation' as const,
    date: '2026-04-10',
  },
  {
    id: 'u2',
    name: 'Nadia Traoré',
    city: 'Lyon',
    case: 'Case Saveurs',
    status: 'observation' as const,
    date: '2026-04-11',
  },
  {
    id: 'u3',
    name: 'Ibrahima Balde',
    city: 'Marseille',
    case: 'Case Maison',
    status: 'parraine' as const,
    date: '2026-04-09',
  },
  {
    id: 'u4',
    name: 'Marianne Kone',
    city: 'Bordeaux',
    case: 'Case Couture',
    status: 'observation' as const,
    date: '2026-04-12',
  },
]

const MOCK_REPORTS = [
  {
    id: 'rep1',
    reporter: 'Sophie L.',
    reported: 'Moussa D.',
    reason: 'Contact partagé hors plateforme',
    date: '2026-04-10',
    status: 'pending' as const,
  },
  {
    id: 'rep2',
    reporter: 'Jean-Paul M.',
    reported: 'Aminata K.',
    reason: 'Prestation non conforme',
    date: '2026-04-08',
    status: 'pending' as const,
  },
]

const MOCK_OBSERVATION = [
  {
    id: 'o1',
    name: 'Kofi Asante',
    case: 'Case Beauté',
    city: 'Paris',
    reviews: 0,
    date: '2026-04-10',
  },
  {
    id: 'o2',
    name: 'Nadia Traoré',
    case: 'Case Saveurs',
    city: 'Lyon',
    reviews: 3,
    date: '2026-04-11',
  },
  {
    id: 'o3',
    name: 'Marianne Kone',
    case: 'Case Couture',
    city: 'Bordeaux',
    reviews: 1,
    date: '2026-04-12',
  },
  {
    id: 'o4',
    name: 'Oumar Diallo',
    case: 'Case Zen',
    city: 'Toulouse',
    reviews: 5,
    date: '2026-04-07',
  },
]

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
    title: 'Pourquoi le Kory s\'inspire du Cauri, l\'ancienne monnaie africaine',
    case: null,
    published: false,
    date: '2026-04-10',
  },
]

const MOCK_KORY_TRANSACTIONS = [
  {
    id: 'kt1',
    user: 'Kofi Asante',
    amount: +10,
    reason: 'Bonus inscription',
    date: '2026-04-10',
  },
  {
    id: 'kt2',
    user: 'Nadia Traoré',
    amount: +5,
    reason: 'Correction manuelle',
    date: '2026-04-11',
  },
  {
    id: 'kt3',
    user: 'Ibrahima Balde',
    amount: -1,
    reason: 'Débit acceptation demande',
    date: '2026-04-12',
  },
]

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number | string
  icon: React.FC<{ className?: string }>
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-brown/50 mb-1">{label}</p>
          <p className="text-2xl font-bold text-brown">{value.toLocaleString('fr-FR')}</p>
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
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>(
    Object.fromEntries(MOCK_RECENT_USERS.map((u) => [u.id, u.status]))
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total membres"
          value={MOCK_STATS.totalUsers}
          icon={Users}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Talents parrainés"
          value={MOCK_STATS.talentsCertifies}
          icon={Star}
          color="bg-secondary/10 text-secondary"
        />
        <StatCard
          label="En observation"
          value={MOCK_STATS.enObservation}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Réservations ce mois"
          value={MOCK_STATS.reservationsMois}
          icon={Calendar}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          label="Korys distribués"
          value={MOCK_STATS.korysDistribues}
          icon={Coins}
          color="bg-kory/10 text-kory-700"
        />
      </div>

      {/* Recent signups */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8 flex items-center justify-between">
          <h3 className="font-semibold text-brown">Inscriptions récentes</h3>
          <TrendingUp className="w-4 h-4 text-brown/30" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brown/2">
                {['Membre', 'Ville', 'Case', 'Statut', 'Inscrit le', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-medium text-brown/40 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/6">
              {MOCK_RECENT_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-brown/2 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={u.name} size="sm" />
                      <span className="font-medium text-brown">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-brown/60">{u.city}</td>
                  <td className="px-5 py-3 text-brown/60">{u.case}</td>
                  <td className="px-5 py-3">
                    <Badge
                      variant={userStatuses[u.id] === 'parraine' ? 'parraine' : userStatuses[u.id] === 'suspendu' ? 'suspendu' : 'observation'}
                      size="sm"
                    />
                  </td>
                  <td className="px-5 py-3 text-brown/50 whitespace-nowrap">
                    {new Date(u.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      {userStatuses[u.id] !== 'parraine' && (
                        <button
                          onClick={() =>
                            setUserStatuses((prev) => ({
                              ...prev,
                              [u.id]: 'parraine',
                            }))
                          }
                          className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <CircleCheck className="w-3.5 h-3.5" />
                          Certifier
                        </button>
                      )}
                      {userStatuses[u.id] !== 'suspendu' && (
                        <button
                          onClick={() =>
                            setUserStatuses((prev) => ({
                              ...prev,
                              [u.id]: 'suspendu',
                            }))
                          }
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
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8 flex items-center justify-between">
          <h3 className="font-semibold text-brown">Signalements récents</h3>
          <TriangleAlert className="w-4 h-4 text-amber-500" />
        </div>
        {MOCK_REPORTS.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brown/40 text-center">
            Aucun signalement en attente.
          </p>
        ) : (
          <div className="divide-y divide-brown/6">
            {MOCK_REPORTS.map((r) => (
              <div key={r.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brown">
                    {r.reporter} → {r.reported}
                  </p>
                  <p className="text-xs text-brown/50 mt-0.5">{r.reason}</p>
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
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(MOCK_OBSERVATION.map((u) => [u.id, 'observation']))
  )
  const [reportStatuses, setReportStatuses] = useState<Record<string, string>>(
    Object.fromEntries(MOCK_REPORTS.map((r) => [r.id, r.status]))
  )

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brown/2">
                {['Talent', 'Case', 'Ville', 'Avis', 'Inscrit le', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-medium text-brown/40 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/6">
              {MOCK_OBSERVATION.map((u) => (
                <tr key={u.id} className="hover:bg-brown/2 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={u.name} size="sm" />
                      <span className="font-medium text-brown">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-brown/60">{u.case}</td>
                  <td className="px-5 py-3 text-brown/60">{u.city}</td>
                  <td className="px-5 py-3">
                    <span className="text-brown font-medium">{u.reviews}</span>
                  </td>
                  <td className="px-5 py-3 text-brown/50 whitespace-nowrap">
                    {new Date(u.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="px-5 py-3">
                    {statuses[u.id] === 'observation' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setStatuses((p) => ({ ...p, [u.id]: 'parraine' }))
                          }
                          className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <CircleCheck className="w-3.5 h-3.5" />
                          Certifier
                        </button>
                        <button
                          onClick={() =>
                            setStatuses((p) => ({ ...p, [u.id]: 'suspendu' }))
                          }
                          className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Suspendre
                        </button>
                      </div>
                    ) : (
                      <Badge
                        variant={statuses[u.id] === 'parraine' ? 'parraine' : 'suspendu'}
                        size="sm"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8">
          <h3 className="font-semibold text-brown">Signalements</h3>
        </div>
        <div className="divide-y divide-brown/6">
          {MOCK_REPORTS.map((r) => (
            <div
              key={r.id}
              className="px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-brown">
                    {r.reporter}
                  </span>
                  <span className="text-brown/30">→</span>
                  <span className="text-sm font-medium text-brown">
                    {r.reported}
                  </span>
                  <span className="text-xs text-brown/40">
                    {new Date(r.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-xs text-brown/60 mt-0.5">{r.reason}</p>
              </div>
              {reportStatuses[r.id] === 'pending' ? (
                <button
                  onClick={() =>
                    setReportStatuses((p) => ({ ...p, [r.id]: 'resolved' }))
                  }
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
                  <td className="px-5 py-3 text-brown/60">
                    {post.case ?? '—'}
                  </td>
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

function KorysTab() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [credited, setCredited] = useState(false)

  function handleCredit(e: React.FormEvent) {
    e.preventDefault()
    setCredited(true)
    setSelectedUser('')
    setAmount('')
    setReason('')
    setTimeout(() => setCredited(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Credit form */}
      <div className="bg-white rounded-xl border border-brown/10 p-5 shadow-sm">
        <h3 className="font-semibold text-brown mb-4">Créditer des Korys</h3>
        <form onSubmit={handleCredit} className="flex flex-col gap-4">
          <Input
            label="Rechercher un membre"
            placeholder="Nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Membre sélectionné"
              placeholder="Cliquez sur un résultat"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            />
            <Input
              label="Montant (Korys)"
              type="number"
              min="1"
              max="100"
              placeholder="ex. 5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Input
            label="Motif"
            placeholder="ex. Bonus fidélité, correction manuelle..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button
            type="submit"
            variant="kory"
            size="md"
            className="w-fit"
            disabled={!amount || !reason}
          >
            {credited ? 'Korys crédités !' : 'Créditer les Korys'}
          </Button>
        </form>
      </div>

      {/* Transaction log */}
      <div className="bg-white rounded-xl border border-brown/10 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-brown/8">
          <h3 className="font-semibold text-brown">Journal des transactions</h3>
        </div>
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
              {MOCK_KORY_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-brown/2 transition-colors">
                  <td className="px-5 py-3 text-brown/50 whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-5 py-3 font-medium text-brown">{tx.user}</td>
                  <td className="px-5 py-3 text-brown/60">{tx.reason}</td>
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
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type AdminTab = 'overview' | 'moderation' | 'blog' | 'korys'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  const tabs: { key: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
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
              <h1 className="text-lg font-bold font-playfair">
                Administration
              </h1>
              <p className="text-white/60 text-xs mt-0.5">
                Talents d&apos;Afrique — Panneau de gestion
              </p>
            </div>
            <Button variant="ghost" size="sm" href="/" className="text-white/70 hover:text-white">
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
