import { fetchEmails } from '@/lib/email'
import { audit } from '@/lib/audit'

export async function GET(req: Request) {
  const url = new URL(req.url)
  if (
    process.env.NODE_ENV !== 'development' &&
    url.searchParams.get('secret') !== process.env.CRON_SECRET
  ) {
    return new Response('Not found', { status: 404 })
  }
  const result = await fetchEmails()
  await audit(null, 'cron-email-sync', 'emails', 'batch', result)
  return Response.json(result)
}
