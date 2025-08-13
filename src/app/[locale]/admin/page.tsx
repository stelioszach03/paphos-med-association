import { getApplicationStatusCounts } from '@/data/applications'
import { getDoctorCount } from '@/data/doctors'
import { getUpcomingMeetingsCount } from '@/data/zoom'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Stethoscope, CalendarClock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminHome({ params: { locale } }: { params: { locale: string } }) {
  const [counts, doctorCount, meetingCount] = await Promise.all([
    getApplicationStatusCounts(),
    getDoctorCount(),
    getUpcomingMeetingsCount()
  ])
  return (
    <div className="container py-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-4">
          <Users className="h-8 w-8 text-primary" />
          <CardContent className="p-0">
            <p className="text-2xl font-bold">{counts.submitted}</p>
            <p className="text-sm text-muted-foreground">Applications</p>
          </CardContent>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <Stethoscope className="h-8 w-8 text-primary" />
          <CardContent className="p-0">
            <p className="text-2xl font-bold">{doctorCount}</p>
            <p className="text-sm text-muted-foreground">Doctors</p>
          </CardContent>
        </Card>
        <Card className="flex items-center gap-4 p-4">
          <CalendarClock className="h-8 w-8 text-primary" />
          <CardContent className="p-0">
            <p className="text-2xl font-bold">{meetingCount}</p>
            <p className="text-sm text-muted-foreground">Upcoming meetings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
