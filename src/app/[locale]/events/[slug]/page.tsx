import { supabaseServer } from '@/lib/supabaseServer'
import { getDictionary } from '@/lib/i18n'

export default async function EventDetail({ params }: { params: { locale: string; slug: string } }) {
  const t = await getDictionary(params.locale)
  const supabase = supabaseServer()
  const { data } = await supabase
    .from('events')
    .select('title,description,location,start_at,end_at')
    .eq('slug', params.slug)
    .eq('lang', params.locale)
    .maybeSingle()
  if (!data) return <div className="container py-10">{t.empty.none}</div>
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <p className="text-slate-600 mb-4">
        {data.start_at ? new Date(data.start_at).toLocaleString() : ''}
        {data.location ? ` • ${data.location}` : ''}
      </p>
      <article className="prose" dangerouslySetInnerHTML={{ __html: data.description || '' }} />
    </div>
  )
}
