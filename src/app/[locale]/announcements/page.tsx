import { getDictionary } from '@/lib/i18n'
import { listAllAnnouncements } from '@/data/announcements'
import SectionHeader from '@/components/section-header'
import AnnouncementCard from '@/components/cards/AnnouncementCard'
import Skeleton from '@/components/ui/skeleton'

export default async function AnnouncementsPage({ params }: { params: { locale: string } }) {
  const t = await getDictionary(params.locale)
  const data = await listAllAnnouncements(params.locale)
  return (
    <div className="container py-10 space-y-6">
      <SectionHeader title={t.nav.announcements} />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.map((a: any) => (
          <AnnouncementCard
            key={a.id}
            href={`/${params.locale}/announcements/${a.slug}`}
            title={a.title}
            summary={a.summary}
          />
        ))}
        {data && data.length === 0 && <p className="text-muted-foreground">{t.empty.none}</p>}
        {!data && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
    </div>
  )
}
