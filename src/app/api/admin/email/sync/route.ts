import { supabaseServer } from '@/lib/supabaseServer'
import { fetchEmails } from '@/lib/email'
import { audit } from '@/lib/audit'

export async function POST() {
  const supabase = supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })
  const { data: isAdmin } = await supabase.rpc('is_admin', { uid: user.id })
  if (!isAdmin) return new Response('Forbidden', { status: 403 })
  const result = await fetchEmails()
  await audit(user.id, 'email-sync', 'emails', 'batch', result)
  return Response.json(result)
}
