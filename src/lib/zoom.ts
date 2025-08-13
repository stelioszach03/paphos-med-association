import { supabaseServer } from './supabaseServer'
import { randomUUID } from 'crypto'

export type MeetingArgs = {
  topic: string
  startsAt?: string
  duration?: number
}

async function getToken() {
  const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env
  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) return null
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
    {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64'),
      },
    }
  )
  if (!res.ok) return null
  const json = await res.json()
  return json.access_token as string
}

export async function createMeeting({ topic, startsAt, duration }: MeetingArgs) {
  const token = await getToken()
  const id = randomUUID()
  if (!token) {
    return { id, join_url: `/meeting/demo/${id}`, host_url: `/meeting/demo/${id}` }
  }
  const res = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic,
      start_time: startsAt,
      duration,
      type: 2,
    }),
  })
  const json = await res.json()
  return { id: json.id ?? id, join_url: json.join_url, host_url: json.start_url }
}

export async function addAttendees(meetingId: string, userIds: string[]) {
  const supabase = supabaseServer()
  if (!userIds.length) return { ok: true }
  await supabase
    .from('zoom_attendees')
    .insert(userIds.map((uid) => ({ meeting_id: meetingId, user_id: uid })))
  return { ok: true }
}
