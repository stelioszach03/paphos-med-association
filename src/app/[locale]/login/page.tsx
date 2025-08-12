'use client'
import { Auth } from '@supabase/auth-ui-react'
// @ts-ignore - types not published
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useEffect, useMemo, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabaseRef = useRef(supabaseBrowser())
  const router = useRouter()
  const pathname = usePathname()
  const locale = useMemo(() => (pathname?.split('/')?.[1] || 'el'), [pathname])
  const redirectTo = useMemo(() => {
    if (typeof window === 'undefined') return undefined
    return `${window.location.origin}/${locale}/login`
  }, [locale])

  useEffect(() => {
    const { data: authListener } = supabaseRef.current.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.refresh()
    })
    return () => authListener.subscription.unsubscribe()
  }, [router])

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Σύνδεση</h1>
      <div className="max-w-md">
        <Auth supabaseClient={supabaseRef.current} appearance={{ theme: ThemeSupa }} providers={[]} redirectTo={redirectTo} />
      </div>
    </div>
  )
}
