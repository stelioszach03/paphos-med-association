import { redirect } from 'next/navigation'
import { supabaseServer } from './supabaseServer'

export type Role = 'super_admin' | 'admin' | 'doctor' | 'guest'

export async function getUserRole(): Promise<Role> {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'guest'
  const { data: admin } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (admin?.role === 'super_admin') return 'super_admin'
  if (admin?.role === 'admin') return 'admin'
  const { data: doctor } = await supabase
    .from('doctors')
    .select('status')
    .eq('id', user.id)
    .maybeSingle()
  if (doctor?.status === 'approved') return 'doctor'
  return 'guest'
}

export async function requireAdmin() {
  const role = await getUserRole()
  if (role === 'admin' || role === 'super_admin') return role
  redirect('/login')
}

export async function requireSuperAdmin() {
  const role = await getUserRole()
  if (role !== 'super_admin') redirect('/login')
  return role
}
