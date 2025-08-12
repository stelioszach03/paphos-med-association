import { requireAdmin } from '@/lib/roles'
import { supabaseServer } from '@/lib/supabaseServer'
import { createMeeting, addAttendees } from '@/lib/zoom'

export async function POST(req: Request) {
  await requireAdmin()
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  const body = await req.json()
  const meeting = await createMeeting({ topic: body.topic, startsAt: body.startsAt, duration: body.duration })
  await supabase.from('zoom_meetings').insert({
    id: meeting.id,
    topic: body.topic,
    starts_at: body.startsAt,
    duration_minutes: body.duration,
    join_url: meeting.join_url,
    host_url: meeting.host_url,
    created_by: user?.id,
  })
  if (Array.isArray(body.attendees) && body.attendees.length) {
    const rows = body.attendees.map((uid: string) => ({ meeting_id: meeting.id, user_id: uid }))
    await supabase.from('zoom_attendees').insert(rows)
    await addAttendees(meeting.id, body.attendees)
  }
  return Response.json({ id: meeting.id })
}
