import { supabaseServer } from '@/lib/supabaseServer'
import { getDictionary } from '@/lib/i18n'

export default async function Home({ params }:{ params:{ locale: string } }){
  const t = await getDictionary(params.locale)
  const supabase = supabaseServer()
  const [{ data: news }, { data: anns }, { data: evs }] = await Promise.all([
    supabase.from('articles').select('id,title,slug,summary,created_at').eq('lang', params.locale).order('created_at', { ascending: false }).limit(3),
    supabase.from('announcements').select('id,title,slug,summary,created_at').eq('lang', params.locale).order('created_at', { ascending: false }).limit(3),
    supabase.from('events').select('id,title,slug,start_at,end_at,location').eq('lang', params.locale).order('start_at', { ascending: true }).limit(3),
  ])

  return (
    <div>
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="container py-16">
          <h1 className="text-4xl font-extrabold tracking-tight">{t.hero.title}</h1>
          <p className="text-slate-600 mt-3 max-w-2xl">{t.hero.subtitle}</p>
          <div className="mt-6 flex gap-3">
            <a href={`/${params.locale}/join`} className="btn">{t.cta.join}</a>
            <a href={`/${params.locale}/events`} className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50">{t.cta.events}</a>
          </div>
        </div>
      </section>

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
                {e.start_at ? new Date(e.start_at).toLocaleString() : ''}
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
