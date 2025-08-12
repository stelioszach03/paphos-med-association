import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getDictionary } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n-config'

export default async function LocaleLayout({
  children, params
}: { children: React.ReactNode; params: { locale: Locale } }) {
  const t = await getDictionary(params.locale)
  return (
    <section>
      {/* @ts-expect-error server-to-client */}
      <Navbar t={t} locale={params.locale} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer t={t} locale={params.locale} />
    </section>
  )
}
