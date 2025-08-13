import { requireAdmin } from '@/lib/auth/requireAdmin'
import { getApplicationStatusCounts } from '@/data/applications'
import { getDoctorCount } from '@/data/doctors'
import { getUpcomingMeetingsCount } from '@/data/zoom'

export const dynamic = 'force-dynamic'

export default async function AdminHome({ params: { locale } }: { params: { locale: string } }) {
  await requireAdmin()
  
  const [counts, doctorCount, meetingCount] = await Promise.all([
    getApplicationStatusCounts(),
    getDoctorCount(),
    getUpcomingMeetingsCount()
  ])
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-semibold">Admin overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card"><p>Applications submitted: {counts.submitted}</p></div>
        <div className="card"><p>Doctors: {doctorCount}</p></div>
        <div className="card"><p>Upcoming meetings: {meetingCount}</p></div>
      </div>
    </div>
  )
}
