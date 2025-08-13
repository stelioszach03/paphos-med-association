import { supabaseServer } from '@/lib/supabaseServer'
import { createMeeting, addAttendees } from '@/lib/zoom'
import { audit } from '@/lib/audit'

export async function POST(req: Request) {
  const supabase = supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })
  const { data: isAdmin } = await supabase.rpc('is_admin', { uid: user.id })
  if (!isAdmin) return new Response('Forbidden', { status: 403 })
  const body = await req.json()
  const meeting = await createMeeting({
    topic: body.topic,
    startsAt: body.startsAt,
    duration: body.duration,
  })
  await supabase.from('zoom_meetings').insert({
    id: meeting.id,
    topic: body.topic,
    starts_at: body.startsAt,
    duration_minutes: body.duration,
    join_url: meeting.join_url,
    host_url: meeting.host_url,
    created_by: user.id,
  })
  if (body.attendees?.length) {
    await addAttendees(meeting.id, body.attendees)
  }
  await audit(user.id, 'create-zoom-meeting', 'zoom_meetings', meeting.id, body)
  return Response.json({ ok: true, meeting })
}
