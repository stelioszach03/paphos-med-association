import Link from 'next/link'

export default function Hero({ t, locale }: { t: any; locale: string }) {
  return (
    <section className="hero">
      <div className="container py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">{t.hero.title}</h1>
        <p className="text-slate-600 mt-3 max-w-2xl">{t.hero.subtitle}</p>
        <div className="mt-6 flex gap-3">
          <Link href={`/${locale}/join`} className="btn">
            {t.cta.join}
          </Link>
          <Link href={`/${locale}/events`} className="btn-outline">
            {t.cta.events}
          </Link>
        </div>
      </div>
    </section>
  )
}
