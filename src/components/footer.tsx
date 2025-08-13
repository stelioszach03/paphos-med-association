import Link from 'next/link'

export default function Footer({ t, locale }: { t: any; locale: string }) {
  return (
    <footer className="border-t border-muted mt-10">
      <div className="container py-10 grid md:grid-cols-3 gap-8 text-sm text-muted">
        <div>
          <Link href={`/${locale}`} className="font-semibold text-foreground">
            {t.site.title}
          </Link>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-foreground">{t.footer.quick}</h3>
          <ul className="space-y-1">
            <li>
              <a href={`/${locale}/announcements`} className="hover:text-foreground">
                {t.nav.announcements}
              </a>
            </li>
            <li>
              <a href={`/${locale}/articles`} className="hover:text-foreground">
                {t.nav.articles}
              </a>
            </li>
            <li>
              <a href={`/${locale}/events`} className="hover:text-foreground">
                {t.nav.events}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-foreground">{t.footer.contact}</h3>
          <p>
            {t.footer.email}:{' '}
            <a href="mailto:info@paphosma.org" className="hover:text-foreground">
              info@paphosma.org
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
