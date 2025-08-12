import { supabaseServer } from './supabaseServer'

export type EmailInput = { subject: string; from: string; to: string; snippet?: string; html?: string }

export async function saveEmail({ subject, from, to, snippet, html }: EmailInput) {
  const supabase = supabaseServer()
  await supabase.from('emails').insert({ subject, from, to, snippet, html })
}
