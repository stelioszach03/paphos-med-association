import { requireAdmin } from '@/lib/roles'
import { supabaseServer } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export default async function AdminHome({ params: { locale } }: { params: { locale: string } }) {
  await requireAdmin()
  const supabase = supabaseServer()
  const { data: apps } = await supabase.from('applications').select('status')
  const { data: doctors } = await supabase.from('doctors').select('id')
  const { data: meetings } = await supabase
    .from('zoom_meetings')
    .select('id')
    .gt('starts_at', new Date().toISOString())
  const counts = { submitted: 0, approved: 0, rejected: 0 }
  apps?.forEach(a => { counts[a.status as 'submitted' | 'approved' | 'rejected']++ })
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-semibold">Admin overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card"><p>Applications submitted: {counts.submitted}</p></div>
        <div className="card"><p>Doctors: {doctors?.length || 0}</p></div>
        <div className="card"><p>Upcoming meetings: {meetings?.length || 0}</p></div>
      </div>
    </div>
  )
}
