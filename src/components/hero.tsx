import Link from 'next/link'
import Button from './ui/button'

export default function Hero({ t, locale }: { t: any; locale: string }) {
  return (
    <section className="w-full bg-gradient-to-b from-primary/10 via-transparent to-transparent">
      <div className="container py-24 text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
          {t.hero.title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {t.hero.subtitle}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href={`/${locale}/join`}>
            <Button size="lg">{t.cta.join}</Button>
          </Link>
          <Link href={`/${locale}/events`}>
            <Button variant="outline" size="lg">{t.cta.events}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
