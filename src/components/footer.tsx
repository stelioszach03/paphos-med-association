import Link from 'next/link'
import { Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer({ t, locale }: { t: any; locale: string }) {
  return (
    <footer className="mt-10 border-t border-muted bg-background">
      <div className="container py-10 grid md:grid-cols-3 gap-8 text-sm text-muted-foreground">
        <div className="space-y-2">
          <Link href={`/${locale}`} className="font-semibold text-foreground">
            {t.site.title}
          </Link>
          <p className="max-w-xs">{t.footer.about}</p>
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
          <h3 className="font-semibold mb-2 text-foreground">{t.footer.social}</h3>
          <div className="flex gap-4 text-muted-foreground">
            <a href="#" aria-label="Facebook" className="hover:text-foreground">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-foreground">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
