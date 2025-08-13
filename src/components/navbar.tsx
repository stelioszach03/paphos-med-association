'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { locales } from '@/lib/i18n-config'
import ThemeToggle from './theme-toggle'
import {
  Home,
  Newspaper,
  Megaphone,
  Calendar,
  UserPlus,
  LayoutDashboard,
  Settings,
} from 'lucide-react'

function segment(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  return parts[1] || ''
}

export default function Navbar({ t, locale }: { t: any; locale: string }) {
  const pathname = usePathname()
  const current = segment(pathname || `/${locale}`)
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<'guest' | 'doctor' | 'admin' | 'super_admin'>('guest')

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.role) {
          setRole(data.role)
        }
      })
      .catch(err => console.error('Failed to fetch session:', err))
  }, [])

  let nav = [
    { href: `/${locale}`, label: t.nav.home, key: '', icon: Home },
    { href: `/${locale}/articles`, label: t.nav.articles, key: 'articles', icon: Newspaper },
    { href: `/${locale}/announcements`, label: t.nav.announcements, key: 'announcements', icon: Megaphone },
    { href: `/${locale}/events`, label: t.nav.events, key: 'events', icon: Calendar },
    { href: `/${locale}/join`, label: t.nav.join, key: 'join', icon: UserPlus },
  ]
  if (role === 'doctor') nav.push({ href: `/${locale}/dashboard`, label: t.nav.dashboard, key: 'dashboard', icon: LayoutDashboard })
  if (role === 'admin' || role === 'super_admin') nav.push({ href: `/${locale}/admin`, label: t.nav.admin, key: 'admin', icon: Settings })
  return (
    <nav className="sticky top-0 z-50 border-b supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:backdrop-blur dark:supports-[backdrop-filter]:bg-black/30">
      <div className="container flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="font-semibold text-foreground">
          {t.site.title}
        </Link>
        <button
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Toggle menu"
          onClick={() => setOpen(v => !v)}
        >
          ☰
        </button>
        <div className="hidden md:flex items-center gap-4">
          {nav.map(n => {
            const Icon = n.icon
            const active = current === n.key
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md transition-colors ${active ? 'text-primary underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            )
          })}
          <Link href={`/${locale}/login`} className="text-sm text-muted-foreground hover:text-foreground">
            {t.nav.login}
          </Link>
          <ThemeToggle />
          <select
            className="text-sm border rounded-xl px-2 py-1 bg-background"
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
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-2 flex flex-col gap-2">
          {nav.map(n => {
            const Icon = n.icon
            const active = current === n.key
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-2 text-sm p-2 rounded-md ${active ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            )
          })}
          <Link
            href={`/${locale}/login`}
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            {t.nav.login}
          </Link>
          <select
            className="text-sm border rounded-xl px-2 py-1 mt-2 bg-background"
            value={locale}
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
      )}
    </nav>
  )
}
