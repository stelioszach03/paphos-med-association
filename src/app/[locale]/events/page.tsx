import { getDictionary } from '@/lib/i18n'
import { listAllEvents } from '@/data/events'

export default async function EventsPage({ params }: { params: { locale: string } }) {
  const t = await getDictionary(params.locale)
  const data = await listAllEvents(params.locale)
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{t.nav.events}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {data?.map(e => (
          <a key={e.id} href={`/${params.locale}/events/${e.slug}`} className="card hover:shadow-sm transition">
            <div className="card-header font-semibold">{e.title}</div>
            <div className="card-content text-sm text-slate-600">
              {e.startAt ? new Date(e.startAt).toLocaleString() : ''}
              {e.location ? ` • ${e.location}` : ''}
            </div>
          </a>
        ))}
        {!data?.length && <p className="text-slate-500">{t.empty.none}</p>}
      </div>
    </div>
  )
}
