import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import { saveEmail } from './save'

export async function fetchRecent() {
  const { IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASSWORD, IMAP_SECURE } =
    process.env
  if (!IMAP_HOST || !IMAP_PORT || !IMAP_USER || !IMAP_PASSWORD) {
    return { ok: false, reason: 'missing-config' as const }
  }
  const client = new ImapFlow({
    host: IMAP_HOST,
    port: Number(IMAP_PORT),
    secure: IMAP_SECURE !== 'false',
    auth: { user: IMAP_USER, pass: IMAP_PASSWORD },
  })
  await client.connect()
  await client.mailboxOpen('INBOX')
  let count = 0
  for await (const msg of client.fetch('1:*', { envelope: true, source: true })) {
    const parsed = await simpleParser(msg.source as Buffer)
    await saveEmail({
      subject: parsed.subject || undefined,
      from: parsed.from?.text,
      to: parsed.to?.text,
      snippet: parsed.text?.slice(0, 120),
      html: parsed.html as string | undefined,
    })
    count++
    if (count >= 10) break
  }
  await client.logout()
  return { ok: true, count }
}
