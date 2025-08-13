import { google } from 'googleapis'
import { saveEmail } from './save'

export async function fetchRecent() {
  const {
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
    GMAIL_USER,
  } = process.env
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !GMAIL_USER) {
    return { ok: false, reason: 'missing-config' as const }
  }
  const auth = new google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET)
  auth.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN })
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.messages.list({ userId: GMAIL_USER, maxResults: 5 })
  const messages = res.data.messages || []
  let count = 0
  for (const m of messages) {
    const msg = await gmail.users.messages.get({ userId: GMAIL_USER, id: m.id!, format: 'full' })
    const headers = msg.data.payload?.headers || []
    const subject = headers.find((h) => h.name === 'Subject')?.value || undefined
    const from = headers.find((h) => h.name === 'From')?.value || undefined
    const to = headers.find((h) => h.name === 'To')?.value || undefined
    const snippet = msg.data.snippet || undefined
    await saveEmail({ subject, from, to, snippet })
    count++
  }
  return { ok: true, count }
}
