import { randomUUID } from 'crypto'

export type MeetingArgs = { topic: string; startsAt?: string; duration?: number }

export async function createMeeting({ topic, startsAt, duration }: MeetingArgs) {
  const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env
  const id = randomUUID()
  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
    return { id, join_url: `/meeting/demo/${id}`, host_url: `/meeting/demo/${id}` }
  }
  // Real implementation would request Zoom APIs
  return { id, join_url: `/meeting/${id}`, host_url: `/meeting/${id}/host` }
}

export async function addAttendees(meetingId: string, userIds: string[]) {
  const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env
  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
    return { ok: true }
  }
  // Real implementation would add attendees via Zoom API
  return { ok: true }
}
