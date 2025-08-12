import { supabaseServer } from './supabaseServer'

export async function requireAdmin(){
  const supabase = supabaseServer()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data } = await supabase.from('admin_users').select('role').eq('user_id', session.user.id).maybeSingle()
  if (!data) return null
  return { userId: session.user.id, role: data.role as 'admin'|'super_admin' }
}
