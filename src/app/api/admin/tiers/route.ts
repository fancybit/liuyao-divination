import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/admin/tiers — 获取等级 + 系统配置
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('email', session.user.email!)
    .maybeSingle()

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: tiers, error: tierError } = await supabase
    .from('user_tiers')
    .select('*')
    .order('min_exp', { ascending: true })

  if (tierError) {
    return NextResponse.json({ error: tierError.message }, { status: 500 })
  }

  const { data: configs, error: cfgError } = await supabase
    .from('system_config')
    .select('*')
    .in('key', ['new_user_free_coins', 'exp_per_coin'])

  // 转为 key-value map
  const configMap: Record<string, string> = {}
  if (configs) {
    configs.forEach((c: { key: string; value: string }) => {
      configMap[c.key] = c.value
    })
  }

  return NextResponse.json({
    tiers: tiers || [],
    new_user_free_coins: configMap.new_user_free_coins || '50',
    exp_per_coin: configMap.exp_per_coin || '1',
  })
}

// PUT /api/admin/tiers — 修改等级 + 系统配置
export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  let { data: { session } } = await supabase.auth.getSession()

  // 兜底：从 Authorization header 获取 token 并设置 session
  if (!session?.user) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const { data: { user }, error: userError } = await supabase.auth.getUser(token)
      if (user && !userError) {
        session = { user, ...session } as any
      }
    }
  }

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('email', session.user.email!)
    .maybeSingle()

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const results = []

    // 处理等级更新
    if (Array.isArray(body.tiers)) {
      for (const tier of body.tiers) {
        if (tier.id) {
          const { error } = await supabase
            .from('user_tiers')
            .update({
              name: tier.name,
              min_exp: tier.min_exp,
              color: tier.color,
            })
            .eq('id', tier.id)
          if (error) results.push({ id: tier.id, error: error.message })
          else results.push({ id: tier.id, success: true })
        } else {
          const { error } = await supabase
            .from('user_tiers')
            .insert({
              name: tier.name || 'New Tier',
              min_exp: tier.min_exp || 0,
              color: tier.color || '#6b7280',
            })
          if (error) results.push({ error: error.message })
          else results.push({ success: true })
        }
      }
    }

    // 处理系统配置更新
    if (body.new_user_free_coins !== undefined) {
      const { error } = await supabase
        .from('system_config')
        .upsert({
          key: 'new_user_free_coins',
          value: String(body.new_user_free_coins),
          description: '新用户注册赠送言币数',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' })
      if (error) results.push({ config: 'new_user_free_coins', error: error.message })
      else results.push({ config: 'new_user_free_coins', success: true })
    }

    if (body.exp_per_coin !== undefined) {
      const { error } = await supabase
        .from('system_config')
        .upsert({
          key: 'exp_per_coin',
          value: String(body.exp_per_coin),
          description: '每消费1言币获得的经验值',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' })
      if (error) results.push({ config: 'exp_per_coin', error: error.message })
      else results.push({ config: 'exp_per_coin', success: true })
    }

    return NextResponse.json({ results })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

// DELETE /api/admin/tiers — 删除等级
export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  let { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const { data: { user }, error: userError } = await supabase.auth.getUser(token)
      if (user && !userError) {
        session = { user, ...session } as any
      }
    }
  }

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('email', session.user.email!)
    .maybeSingle()

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('user_tiers')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
