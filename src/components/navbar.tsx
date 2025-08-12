'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales } from '@/lib/i18n-config'

function segment(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  return parts[1] || ''
}

export default function Navbar({ t, locale }: { t: any; locale: string }) {
  const pathname = usePathname()
  const current = segment(pathname || `/${locale}`)
  const nav = [
    { href: `/${locale}`, label: t.nav.home, key: '' },
    { href: `/${locale}/articles`, label: t.nav.articles, key: 'articles' },
    { href: `/${locale}/announcements`, label: t.nav.announcements, key: 'announcements' },
    { href: `/${locale}/events`, label: t.nav.events, key: 'events' },
    { href: `/${locale}/join`, label: t.nav.join, key: 'join' },
  ]
  return (
    <nav className="border-b border-slate-200 sticky top-0 z-40 sticky-blur">
      <div className="container flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="font-semibold text-slate-800">
          {t.site.title}
        </Link>
        <div className="flex items-center gap-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm ${current === n.key ? 'text-primary' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {n.label}
            </Link>
          ))}
          <Link href={`/${locale}/login`} className="text-sm text-slate-600 hover:text-slate-900">
            {t.nav.login}
          </Link>
          <select
            className="text-sm border rounded-xl px-2 py-1"
            defaultValue={locale}
            onChange={(e) => {
              const next = e.target.value
              const parts = (pathname || `/${locale}`).split('/')
              parts[1] = next
              window.location.assign(parts.join('/'))
            }}
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  )
}
