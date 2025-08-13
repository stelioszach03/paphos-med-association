import { getDictionary } from '@/lib/i18n'
import { listAllEvents } from '@/data/events'
import SectionHeader from '@/components/section-header'
import EventCard from '@/components/cards/EventCard'
import Skeleton from '@/components/ui/skeleton'

export default async function EventsPage({ params }: { params: { locale: string } }) {
  const t = await getDictionary(params.locale)
  const data = await listAllEvents(params.locale)
  return (
    <div className="container py-10 space-y-6">
      <SectionHeader title={t.nav.events} />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.map((e: any) => (
          <EventCard
            key={e.id}
            href={`/${params.locale}/events/${e.slug}`}
            title={e.title}
            date={e.startAt}
            location={e.location}
          />
        ))}
        {data && data.length === 0 && <p className="text-muted-foreground">{t.empty.none}</p>}
        {!data && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
    </div>
  )
}
