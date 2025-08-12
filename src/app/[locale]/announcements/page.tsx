import { supabaseServer } from '@/lib/supabaseServer'
import { getDictionary } from '@/lib/i18n'

export default async function AnnouncementsPage({ params }: { params: { locale: string } }) {
  const t = await getDictionary(params.locale)
  const supabase = supabaseServer()
  const { data } = await supabase
    .from('announcements')
    .select('id,title,slug,summary,created_at')
    .eq('lang', params.locale)
    .order('created_at', { ascending: false })
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{t.nav.announcements}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {data?.map(a => (
          <a key={a.id} href={`/${params.locale}/announcements/${a.slug}`} className="card hover:shadow-sm transition">
            <div className="card-header font-semibold">{a.title}</div>
            <div className="card-content text-sm text-slate-600 line-clamp-3">{a.summary || ''}</div>
          </a>
        ))}
        {!data?.length && <p className="text-slate-500">{t.empty.none}</p>}
      </div>
    </div>
  )
}
