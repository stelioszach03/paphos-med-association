import { supabaseServer } from '@/lib/supabaseServer'
import { createMeeting } from '@/lib/zoom'
import { Card, CardContent } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminZoom() {
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
      <Card>
        <CardContent className="p-4 space-y-4">
          <ul className="list-disc pl-5 space-y-1">
            {meetings?.map((m: any) => <li key={m.id}>{m.topic} – {m.starts_at}</li>)}
          </ul>
          <form action={add} className="flex flex-col gap-2 max-w-sm">
            <Input name="topic" placeholder="Topic" />
            <Input name="starts_at" type="datetime-local" />
            <Input name="duration" type="number" placeholder="Duration (min)" />
            <Button>Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
