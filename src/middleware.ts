import createMiddleware from 'next-intl/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function middleware(req: NextRequest) {
  const intlRes = intlMiddleware(req)

  // If next-intl didn't produce a response, pass through
  if (!intlRes) {
    const supabase = createMiddlewareClient({ req, res: NextResponse.next() })
    await supabase.auth.getSession()
    return supabase
  }

  // Attach supabase session to the next-intl response
  const supabase = createMiddlewareClient({ req, res: intlRes })
  await supabase.auth.getSession()
  return intlRes
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}