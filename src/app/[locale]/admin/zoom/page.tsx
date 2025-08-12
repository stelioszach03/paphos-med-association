import { requireAdmin } from '@/lib/roles'
import { supabaseServer } from '@/lib/supabaseServer'
import { createMeeting } from '@/lib/zoom'

export const dynamic = 'force-dynamic'

export default async function AdminZoom() {
  await requireAdmin()
  const supabase = supabaseServer()
  const { data: meetings } = await supabase.from('zoom_meetings').select('*').order('starts_at')

  async function add(formData: FormData) {
    'use server'
    const topic = String(formData.get('topic'))
    const startsAt = String(formData.get('starts_at'))
    const duration = Number(formData.get('duration'))
    const meeting = await createMeeting({ topic, startsAt, duration })
    const supabase = supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('zoom_meetings').insert({
      id: meeting.id,
      topic,
      starts_at: startsAt,
      duration_minutes: duration,
      join_url: meeting.join_url,
      host_url: meeting.host_url,
      created_by: user?.id,
    })
  }

  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-xl font-semibold">Zoom meetings</h1>
      <ul className="list-disc pl-5">
        {meetings?.map(m => <li key={m.id}>{m.topic} – {m.starts_at}</li>)}
      </ul>
      <form action={add} className="flex flex-col gap-2 max-w-sm">
        <input name="topic" placeholder="Topic" className="input" />
        <input name="starts_at" type="datetime-local" className="input" />
        <input name="duration" type="number" placeholder="Duration (min)" className="input" />
        <button className="btn">Create</button>
      </form>
    </div>
  )
}
