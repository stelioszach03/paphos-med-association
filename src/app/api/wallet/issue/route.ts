import { supabaseServer } from '@/lib/supabaseServer'
import { issueApplePass } from '@/lib/wallet/apple'
import { issueGooglePass } from '@/lib/wallet/google'
import { audit } from '@/lib/audit'

export async function POST(req: Request) {
  const supabase = supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })
  const { platform } = await req.json()
  const { data: doctor } = await supabase
    .from('doctors')
    .select('status')
    .eq('id', user.id)
    .maybeSingle()
  if (!doctor || doctor.status !== 'approved') return new Response('Forbidden', { status: 403 })

  if (platform === 'apple') {
    const result = await issueApplePass()
    if (!result.ok) return Response.json(result, { status: 400 })
    await supabase
      .from('wallet_passes')
      .upsert({ user_id: user.id, platform: 'apple', status: 'issued' })
    await audit(user.id, 'issue-wallet', 'wallet_passes', user.id, { platform })
    return new Response(result.buffer as any, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
      },
    })
  }
  if (platform === 'google') {
    const result = await issueGooglePass(user.id)
    if (!result.ok) return Response.json(result, { status: 400 })
    await supabase
      .from('wallet_passes')
      .upsert({ user_id: user.id, platform: 'google', token: result.link })
    await audit(user.id, 'issue-wallet', 'wallet_passes', user.id, { platform })
    return Response.json({ ok: true, link: result.link })
  }
  return Response.json({ ok: false, reason: 'unknown-platform' }, { status: 400 })
}
