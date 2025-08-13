import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/requireAdmin'
import { getDoctorById } from '@/data/doctors'
import { listLatestAnnouncements } from '@/data/announcements'
import { getUserMeetings } from '@/data/zoom'

export const dynamic = 'force-dynamic'

export default async function Dashboard({ params: { locale } }: { params: { locale: string } }) {
  const { session, user } = await getSession()
  if (!session || !user) redirect(`/${locale}/login`)
  
  const [doctor, announcements, meetings] = await Promise.all([
    getDoctorById(user.id),
    listLatestAnnouncements(locale, 5),
    getUserMeetings(user.id)
  ])
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
          {meetings.map((m) => (
            <li key={m.id}>
              {m.topic} – <a className="text-primary" href={m.joinUrl || '#'}>Join</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
