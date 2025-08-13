import { getDictionary } from '@/lib/i18n'
import Hero from '@/components/hero'
import SectionHeader from '@/components/section-header'
import AnnouncementCard from '@/components/cards/AnnouncementCard'
import ArticleCard from '@/components/cards/ArticleCard'
import EventCard from '@/components/cards/EventCard'
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

      <section className="container py-10 space-y-6">
        <SectionHeader title={t.sections.announcements} />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {anns?.map((a: any) => (
            <AnnouncementCard
              key={a.id}
              href={`/${params.locale}/announcements/${a.slug}`}
              title={a.title}
              summary={a.summary}
            />
          ))}
          {!anns?.length && <div className="text-muted-foreground">{t.empty.none}</div>}
        </div>
      </section>

      <section className="container py-10 space-y-6">
        <SectionHeader title={t.sections.articles} />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {news?.map((n: any) => (
            <ArticleCard
              key={n.id}
              href={`/${params.locale}/articles/${n.slug}`}
              title={n.title}
              summary={n.summary}
            />
          ))}
          {!news?.length && <div className="text-muted-foreground">{t.empty.none}</div>}
        </div>
      </section>

      <section className="container py-10 space-y-6">
        <SectionHeader title={t.sections.events} />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {evs?.map((e: any) => (
            <EventCard
              key={e.id}
              href={`/${params.locale}/events/${e.slug}`}
              title={e.title}
              date={e.startAt}
              location={e.location}
            />
          ))}
          {!evs?.length && <div className="text-muted-foreground">{t.empty.none}</div>}
        </div>
      </section>
    </div>
  )
}
