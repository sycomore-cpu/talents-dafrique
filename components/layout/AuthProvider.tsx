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

async function fetchOrCreateProfile(
  userId: string,
  userMeta: Record<string, unknown>
): Promise<Profile | null> {
  try {
    // 1. Essaie de récupérer le profil existant
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) return data as Profile

    // 2. Profil absent → on le crée (trigger manqué ou race condition)
    if (error?.code === 'PGRST116') {
      const code = Math.random().toString(36).slice(2, 10).toUpperCase()
      const name =
        (userMeta?.full_name as string) ??
        (userMeta?.email as string) ??
        'Nouveau membre'
      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, name, parrain_code: code, kory_balance: 10 })
        .select()
        .single()

      if (created) {
        // Créditer les Korys de bienvenue
        await supabase.from('kory_transactions').insert({
          user_id: userId,
          amount: 10,
          reason: "Bienvenue sur Talents d'Afrique !",
        })
        return created as Profile
      }

      // 3. Conflit (le trigger a déjà créé le profil entre-temps) → re-fetch
      if (insertError?.code === '23505') {
        const { data: existing } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        return (existing as Profile) ?? null
      }
    }
    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // ── IMPORTANT : on résout loading dès qu'on connaît l'état auth,
    //   sans attendre le profil — le profil charge en parallèle.
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (cancelled) return
        const u = session?.user ?? null
        setUser(u)
        setLoading(false) // ← débloque tout de suite
        if (u) {
          fetchOrCreateProfile(u.id, u.user_metadata ?? {}).then(p => {
            if (!cancelled) setProfile(p)
          })
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (cancelled) return
        const u = session?.user ?? null
        setUser(u)
        setLoading(false) // ← débloque aussi ici
        if (u) {
          fetchOrCreateProfile(u.id, u.user_metadata ?? {}).then(p => {
            if (!cancelled) setProfile(p)
          })
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  async function refreshProfile() {
    if (!user) return
    const p = await fetchOrCreateProfile(user.id, user.user_metadata ?? {})
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
