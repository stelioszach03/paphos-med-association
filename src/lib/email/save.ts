import { supabaseServer } from '@/lib/supabaseServer'

export type EmailInput = {
  subject?: string
  from?: string
  to?: string
  snippet?: string
  html?: string
}

export async function saveEmail(input: EmailInput) {
  const supabase = supabaseServer()
  await supabase.from('emails').insert({
    subject: input.subject,
    from: input.from,
    to: input.to,
    snippet: input.snippet,
    html: input.html,
  })
}
