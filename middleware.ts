// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const PUBLIC_FILE = /(.*)\.(.*)$/
const locales = ['el', 'en', 'ru', 'zh'] as const
const defaultLocale = 'el'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  )
  await supabase.auth.getSession()

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return res
  }

  const pathLocale = pathname.split('/')[1]
  if (!locales.includes(pathLocale as any)) {
    const url = req.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname}`
    url.hash = req.nextUrl.hash
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
