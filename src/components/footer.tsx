import Link from 'next/link'

export default function Footer({ t, locale }: { t:any; locale:string }){
  return (
    <footer className="border-t border-slate-200 mt-10">
      <div className="container py-10 grid md:grid-cols-3 gap-8 text-sm text-slate-600">
        <div>
          <Link href={`/${locale}`} className="font-semibold text-slate-800">
            {t.site.title}
          </Link>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-slate-800">{t.footer.quick}</h3>
          <ul className="space-y-1">
            <li><a href={`/${locale}/announcements`} className="hover:text-slate-900">{t.nav.announcements}</a></li>
            <li><a href={`/${locale}/articles`} className="hover:text-slate-900">{t.nav.articles}</a></li>
            <li><a href={`/${locale}/events`} className="hover:text-slate-900">{t.nav.events}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-slate-800">{t.footer.contact}</h3>
          <p>
            {t.footer.email}: <a href="mailto:info@paphosma.org" className="hover:text-slate-900">info@paphosma.org</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
