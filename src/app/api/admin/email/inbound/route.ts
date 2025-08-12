import { saveEmail } from '@/lib/email'

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') return new Response('Not found', { status: 404 })
  const secret = process.env.ADMIN_EMAIL_WEBHOOK_SECRET
  const url = new URL(req.url)
  if (secret && url.searchParams.get('secret') !== secret) {
    return new Response('Unauthorized', { status: 401 })
  }
  const body = await req.json()
  await saveEmail(body)
  return Response.json({ ok: true })
}
