'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function AdminNav({ locale }: { locale: string }) {
  const pathname = usePathname()
  const base = `/${locale}/admin`
  const tabs = [
    { href: base, label: 'Overview' },
    { href: `${base}/articles`, label: 'Articles' },
    { href: `${base}/announcements`, label: 'Announcements' },
    { href: `${base}/events`, label: 'Events' },
    { href: `${base}/applications`, label: 'Applications' },
    { href: `${base}/email`, label: 'Email' },
    { href: `${base}/zoom`, label: 'Zoom' },
    { href: `${base}/admins`, label: 'Admins' },
  ]
  return (
    <nav className="flex gap-4 text-sm">
      {tabs.map(t => (
        <Link
          key={t.href}
          href={t.href}
          className={clsx(
            'px-2 py-1 rounded-md hover:text-foreground',
            pathname === t.href ? 'text-primary underline underline-offset-4' : 'text-muted-foreground'
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  )
}
