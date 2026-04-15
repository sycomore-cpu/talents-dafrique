import React from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/supabase/types'
import AdminDashboard from './AdminDashboard'

export const metadata: Metadata = {
  title: 'Administration',
}

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !(profile as Profile).is_admin) {
    redirect('/')
  }

  return <AdminDashboard />
}
