import { getDictionary } from '@/lib/i18n'
import { getEventBySlug } from '@/data/events'

export default async function EventDetail({ params }: { params: { locale: string; slug: string } }) {
  const t = await getDictionary(params.locale)
  const data = await getEventBySlug(params.slug, params.locale)
  if (!data) return <div className="container py-10">{t.empty.none}</div>
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <p className="text-slate-600 mb-4">
        {data.startAt ? new Date(data.startAt).toLocaleString() : ''}
        {data.location ? ` • ${data.location}` : ''}
      </p>
      <article className="prose" dangerouslySetInnerHTML={{ __html: data.description || '' }} />
    </div>
  )
}
