import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export default async function Dashboard({ params: { locale } }: { params: { locale: string } }) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)
  const { data: doctor } = await supabase.from('doctors').select('*').eq('id', user.id).maybeSingle()
  const { data: announcements } = await supabase.from('announcements').select('id,title,slug').order('created_at', { ascending: false }).limit(5)
  const { data: meetingsRaw } = await supabase
    .from('zoom_attendees')
    .select('zoom_meetings(id,topic,join_url,starts_at)')
    .eq('user_id', user.id)
  const meetings = (meetingsRaw as any[]) || []
  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Status: {doctor?.status}</p>
      <div className="flex gap-2">
        <form method="post" action="/api/wallet/issue">
          <input type="hidden" name="platform" value="apple" />
          <button className="btn">Add to Apple Wallet</button>
        </form>
        <form method="post" action="/api/wallet/issue">
          <input type="hidden" name="platform" value="google" />
          <button className="btn">Save to Google Wallet</button>
        </form>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-2">Announcements</h2>
        <ul className="list-disc pl-5">
          {announcements?.map(a => <li key={a.id}>{a.title}</li>)}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Upcoming meetings</h2>
        <ul className="list-disc pl-5">
          {meetings.map((m: any) => (
            <li key={m.zoom_meetings.id}>
              {m.zoom_meetings.topic} – <a className="text-primary" href={m.zoom_meetings.join_url}>Join</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
