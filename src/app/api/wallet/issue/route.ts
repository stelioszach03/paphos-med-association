import { supabaseServer } from '@/lib/supabaseServer'
import { issueApplePass } from '@/lib/wallet/apple'
import { issueGooglePass } from '@/lib/wallet/google'

export async function POST(req: Request) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { platform } = await req.json()
  const { data: doctor } = await supabase
    .from('doctors')
    .select('full_name, registry_no, status')
    .eq('id', user.id)
    .maybeSingle()
  if (!doctor || doctor.status !== 'approved') return new Response('Forbidden', { status: 403 })

  const args = { userId: user.id, fullName: doctor.full_name || '', registryNo: doctor.registry_no || '' }
  const result = platform === 'apple'
    ? await issueApplePass(args)
    : platform === 'google'
      ? await issueGooglePass(args)
      : { ok: false as const, reason: 'unknown-platform' }

  if (!result.ok) return Response.json(result, { status: 400 })

  await supabase.from('wallet_passes').upsert({ user_id: user.id, platform, token: String(result.urlOrBuffer) })
  return Response.json(result)
}
