import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ensureUserCoins } from '@/lib/billing'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await ensureUserCoins(session.user.id)
    }
  }

  return NextResponse.redirect(requestUrl.origin)
}
