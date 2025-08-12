'use client'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function supabaseBrowser() {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error('Missing Supabase env')
  const g = globalThis as any
  if (g.__supabase) {
    client = g.__supabase as SupabaseClient
    return client
  }
  client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: `sb-${new URL(url).host}-auth-token`,
    },
  })
  if (process.env.NODE_ENV !== 'production') g.__supabase = client
  return client
}
