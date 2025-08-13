import { getDictionary } from '@/lib/i18n'
import { getAnnouncementBySlug } from '@/data/announcements'

export default async function AnnouncementDetail({ params }: { params: { locale: string; slug: string } }) {
  const t = await getDictionary(params.locale)
  const data = await getAnnouncementBySlug(params.slug, params.locale)
  if (!data) return <div className="container py-10">{t.empty.none}</div>
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <article className="prose" dangerouslySetInnerHTML={{ __html: data.content || '' }} />
    </div>
  )
}
