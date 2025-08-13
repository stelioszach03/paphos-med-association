// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LRUCache } from 'lru-cache'
import { Redis } from '@upstash/redis'
import { lucia } from '@/lib/auth/lucia'

const middlewareLru = new LRUCache<string, number>({ max: 500, ttl: 60_000 })

const PUBLIC_FILE = /(.*)\.(.*)$/
const locales = ['el', 'en', 'ru', 'zh'] as const
const defaultLocale = 'el'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // Rate limiting for POST API routes
  if (pathname.startsWith('/api') && req.method === 'POST') {
    const ip =
      req.ip ||
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      '127.0.0.1'
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
    if (redisUrl && redisToken) {
      const redis = new Redis({ url: redisUrl, token: redisToken })
      const key = `rl:${ip}`
      const count = await redis.incr(key)
      if (count === 1) await redis.expire(key, 60)
      if (count > 20) return new NextResponse('Too Many Requests', { status: 429 })
    } else {
      const lru = middlewareLru
      const n = (lru.get(ip) as number) || 0
      if (n > 20) return new NextResponse('Too Many Requests', { status: 429 })
      lru.set(ip, n + 1)
    }
  }

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

  // Check auth for admin routes
  if (pathname.match(/^\/[a-z]{2}\/admin/)) {
    const sessionId = req.cookies.get(lucia.sessionCookieName)?.value ?? null
    
    if (!sessionId) {
      const url = req.nextUrl.clone()
      url.pathname = `/${pathLocale}/login`
      return NextResponse.redirect(url)
    }

    // Note: We can't validate session in middleware due to Next.js limitations
    // Session validation will happen in the actual page/route
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
