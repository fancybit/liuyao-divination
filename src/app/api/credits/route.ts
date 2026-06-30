import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { getUserCoins, rechargeCoins } from '@/lib/billing'

// GET /api/credits — 获取当前用户言币信息
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await getUserCoins(session.user.id)

  if (!data) {
    return NextResponse.json({
      remaining_coins: 0,
      total_divinations: 0,
      total_exp: 0,
      current_tier: null,
      error: 'Coins record not found',
    })
  }

  return NextResponse.json({
    remaining_coins: data.remaining_coins,
    total_divinations: data.total_divinations,
    total_exp: data.total_exp,
    current_tier: {
      id: data.current_tier_id,
      name: data.tier_name,
      color: data.tier_color,
    },
  })
}

// POST /api/credits — 模拟充值言币
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const coinsToAdd = parseInt(body.coins, 10) || 100

    if (coinsToAdd <= 0) {
      return NextResponse.json({ error: 'Invalid coins amount' }, { status: 400 })
    }

    const result = await rechargeCoins(session.user.id, coinsToAdd)

    return NextResponse.json({
      success: result.success,
      new_remaining: result.newRemaining,
      coins_added: coinsToAdd,
      error: result.error,
    })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
