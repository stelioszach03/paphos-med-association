'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { locales } from '@/lib/i18n-config'
import { supabaseBrowser } from '@/lib/supabaseClient'

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
    const supabase = supabaseBrowser()
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user
      if (!user) return
      const { data: admin } = await supabase.from('admin_users').select('role').eq('user_id', user.id).maybeSingle()
      if (admin?.role) { setRole(admin.role as any); return }
      const { data: doctor } = await supabase.from('doctors').select('status').eq('id', user.id).maybeSingle()
      if (doctor?.status === 'approved') setRole('doctor')
    })
  }, [])

  const nav = [
    { href: `/${locale}`, label: t.nav.home, key: '' },
    { href: `/${locale}/articles`, label: t.nav.articles, key: 'articles' },
    { href: `/${locale}/announcements`, label: t.nav.announcements, key: 'announcements' },
    { href: `/${locale}/events`, label: t.nav.events, key: 'events' },
    { href: `/${locale}/join`, label: t.nav.join, key: 'join' },
  ]
  if (role === 'doctor') nav.push({ href: `/${locale}/dashboard`, label: t.nav.dashboard, key: 'dashboard' })
  if (role === 'admin' || role === 'super_admin') nav.push({ href: `/${locale}/admin`, label: t.nav.admin, key: 'admin' })
  return (
    <nav className="navbar sticky top-0 z-40 sticky-blur">
      <div className="container flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="font-semibold text-slate-800">
          {t.site.title}
        </Link>
        <button className="md:hidden" onClick={() => setOpen(v => !v)}>☰</button>
        <div className="hidden md:flex items-center gap-4">
          {nav.map(n => (
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
      {open && (
        <div className="md:hidden border-t border-slate-200 px-4 py-2 flex flex-col gap-2">
          {nav.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm ${current === n.key ? 'text-primary' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/login`}
            className="text-sm text-slate-600 hover:text-slate-900"
            onClick={() => setOpen(false)}
          >
            {t.nav.login}
          </Link>
          <select
            className="text-sm border rounded-xl px-2 py-1 mt-2"
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
