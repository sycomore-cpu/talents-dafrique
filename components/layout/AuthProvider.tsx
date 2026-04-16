'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'

// ─── Supabase singleton ────────────────────────────────────────────────────────
const supabase = createClient()

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

async function loadOrCreateProfile(userId: string, userMeta: Record<string, unknown>): Promise<Profile | null> {
  // Tenter de charger le profil existant
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (data) return data as Profile

  // Aucun profil → le créer (trigger manqué lors d'une inscription précédente)
  if (error?.code === 'PGRST116') {
    const code = Math.random().toString(36).slice(2, 10).toUpperCase()
    const name = (userMeta?.full_name as string) ?? (userMeta?.email as string) ?? 'Nouveau membre'
    const { data: created } = await supabase
      .from('profiles')
      .insert({ id: userId, name, parrain_code: code, kory_balance: 10 })
      .select()
      .single()

    if (created) {
      // Bonus de bienvenue
      await supabase
        .from('kory_transactions')
        .insert({ user_id: userId, amount: 10, reason: "Bienvenue sur Talents d'Afrique !" })
    }
    return (created as Profile) ?? null
  }

  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // Vérification initiale de session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const p = await loadOrCreateProfile(u.id, u.user_metadata ?? {})
        if (!cancelled) setProfile(p)
      }
      if (!cancelled) setLoading(false)
    })

    // Changements d'état auth (connexion / déconnexion / refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const p = await loadOrCreateProfile(u.id, u.user_metadata ?? {})
        if (!cancelled) setProfile(p)
      } else {
        setProfile(null)
      }
      if (!cancelled) setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, []) // ← s'exécute une seule fois au montage

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  async function refreshProfile() {
    if (!user) return
    const p = await loadOrCreateProfile(user.id, user.user_metadata ?? {})
    setProfile(p)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}

export function useUser() {
  const { user } = useAuth()
  return user
}

export function useProfile() {
  const { profile } = useAuth()
  return profile
}
