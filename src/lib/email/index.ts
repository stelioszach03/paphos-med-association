import { fetchRecent as fetchImap } from './imap'
import { fetchRecent as fetchGmail } from './gmail'

export async function fetchEmails() {
  if (process.env.IMAP_HOST && process.env.IMAP_USER && process.env.IMAP_PASSWORD) {
    return fetchImap()
  }
  if (
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN &&
    process.env.GMAIL_USER
  ) {
    return fetchGmail()
  }
  return { ok: false, reason: 'missing-config' as const }
}
