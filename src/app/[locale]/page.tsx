import { getDictionary } from '@/lib/i18n'
import Hero from '@/components/hero'
import { listLatestArticles } from '@/data/articles'
import { listLatestAnnouncements } from '@/data/announcements'
import { listUpcomingEvents } from '@/data/events'

export default async function Home({ params }:{ params:{ locale: string } }){
  const t = await getDictionary(params.locale)
  const [news, anns, evs] = await Promise.all([
    listLatestArticles(params.locale, 3),
    listLatestAnnouncements(params.locale, 3),
    listUpcomingEvents(params.locale, 3),
  ])

  return (
    <div>
      <Hero t={t} locale={params.locale} />

      <section className="container py-10">
        <h2 className="text-xl font-bold mb-3">{t.sections.announcements}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {anns?.map(a => (
            <a key={a.id} href={`/${params.locale}/announcements/${a.slug}`} className="card hover:shadow-sm transition">
              <div className="card-header font-semibold">{a.title}</div>
              <div className="card-content text-sm text-slate-600 line-clamp-3">{a.summary || ''}</div>
            </a>
          ))}
          {!anns?.length && <div className="text-slate-500">{t.empty.none}</div>}
        </div>
      </section>

      <section className="container py-6">
        <h2 className="text-xl font-bold mb-3">{t.sections.articles}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {news?.map(n => (
            <a key={n.id} href={`/${params.locale}/articles/${n.slug}`} className="card hover:shadow-sm transition">
              <div className="card-header font-semibold">{n.title}</div>
              <div className="card-content text-sm text-slate-600 line-clamp-3">{n.summary || ''}</div>
            </a>
          ))}
          {!news?.length && <div className="text-slate-500">{t.empty.none}</div>}
        </div>
      </section>

      <section className="container py-6">
        <h2 className="text-xl font-bold mb-3">{t.sections.events}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {evs?.map(e => (
            <a key={e.id} href={`/${params.locale}/events/${e.slug}`} className="card hover:shadow-sm transition">
              <div className="card-header font-semibold">{e.title}</div>
              <div className="card-content text-sm text-slate-600">
                {e.startAt ? new Date(e.startAt).toLocaleString() : ''}
                {e.location ? ` • ${e.location}` : ''}
              </div>
            </a>
          ))}
          {!evs?.length && <div className="text-slate-500">{t.empty.none}</div>}
        </div>
      </section>
    </div>
  )
}
