import { supabase } from '@/lib/supabase'
import type { UserTier } from '@/types'

const COINS_PER_DIVINATION = 5

// 获取系统配置
export async function getSystemConfig(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error || !data) return null
  return data.value
}

// 获取所有等级
export async function getTiers(): Promise<UserTier[]> {
  const { data, error } = await supabase
    .from('user_tiers')
    .select('*')
    .order('min_exp', { ascending: true })

  if (error) {
    console.error('getTiers error:', error)
    return []
  }
  return data || []
}

// 根据累计经验匹配等级
export async function getCurrentTier(totalExp: number): Promise<UserTier | null> {
  const { data, error } = await supabase
    .from('user_tiers')
    .select('*')
    .lte('min_exp', totalExp)
    .order('min_exp', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('getCurrentTier error:', error)
    return null
  }
  return data
}

// 获取用户言币信息
export async function getUserCoins(userId: string) {
  const { data, error } = await supabase
    .from('user_credits')
    .select('*, user_tiers(name, color)')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('getUserCoins error:', error)
    return null
  }

  if (!data) return null

  return {
    ...data,
    tier_name: data.user_tiers?.name || null,
    tier_color: data.user_tiers?.color || null,
  }
}

// 获取下一等级所需经验（用于进度条）
export async function getNextTierInfo(totalExp: number): Promise<{ next: UserTier | null; exp_needed: number }> {
  const { data, error } = await supabase
    .from('user_tiers')
    .select('*')
    .gt('min_exp', totalExp)
    .order('min_exp', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !data) return { next: null, exp_needed: 0 }
  return { next: data, exp_needed: data.min_exp - totalExp }
}

// 确保用户有言币记录
export async function ensureUserCoins(userId: string): Promise<void> {
  const { data: existing } = await supabase
    .from('user_credits')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) return

  const freeCoinsStr = await getSystemConfig('new_user_free_coins')
  const freeCoins = parseInt(freeCoinsStr || '50', 10) || 50

  const { error } = await supabase
    .from('user_credits')
    .insert({
      user_id: userId,
      remaining_coins: freeCoins,
      total_divinations: 0,
      total_exp: 0,
      current_tier_id: 1,
    })

  if (error) {
    console.error('ensureUserCoins insert error:', error)
  }
}

// 检查并扣言币（每次固定5言币）
export async function checkAndDeductCoins(userId: string): Promise<{
  success: boolean
  remaining: number
  tier?: UserTier | null
  upgraded?: boolean
  error?: string
}> {
  const coins = await getUserCoins(userId)
  if (!coins) {
    return { success: false, remaining: 0, error: 'User coins record not found' }
  }

  if (coins.remaining_coins < COINS_PER_DIVINATION) {
    return {
      success: false,
      remaining: coins.remaining_coins,
      tier: null,
      error: 'insufficient',
    }
  }

  // 读取经验比率
  const expRatioStr = await getSystemConfig('exp_per_coin')
  const expRatio = parseInt(expRatioStr || '1', 10) || 1
  const expGained = COINS_PER_DIVINATION * expRatio

  const newRemaining = coins.remaining_coins - COINS_PER_DIVINATION
  const newTotalExp = (coins.total_exp || 0) + expGained
  const newTotalDivinations = (coins.total_divinations || 0) + 1

  // 检查升级
  const newTier = await getCurrentTier(newTotalExp)
  const newTierId = newTier?.id || coins.current_tier_id
  const upgraded = newTierId !== coins.current_tier_id

  const { error: updateError } = await supabase
    .from('user_credits')
    .update({
      remaining_coins: newRemaining,
      total_exp: newTotalExp,
      total_divinations: newTotalDivinations,
      current_tier_id: newTierId,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('checkAndDeductCoins update error:', updateError)
    return { success: false, remaining: coins.remaining_coins, error: updateError.message }
  }

  return {
    success: true,
    remaining: newRemaining,
    tier: newTier,
    upgraded,
  }
}

// 模拟充值言币
export async function rechargeCoins(userId: string, coinsToAdd: number): Promise<{
  success: boolean
  newRemaining: number
  error?: string
}> {
  const coins = await getUserCoins(userId)
  if (!coins) {
    return { success: false, newRemaining: 0, error: 'User coins record not found' }
  }

  const newRemaining = coins.remaining_coins + coinsToAdd

  const { error: billError } = await supabase
    .from('billing_records')
    .insert({
      user_id: userId,
      credits_added: coinsToAdd,
      amount: 0,
      payment_method: 'simulated',
      status: 'completed',
    })

  if (billError) {
    console.error('rechargeCoins billing record error:', billError)
    return { success: false, newRemaining: coins.remaining_coins, error: billError.message }
  }

  const { error: updateError } = await supabase
    .from('user_credits')
    .update({
      remaining_coins: newRemaining,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('rechargeCoins update error:', updateError)
    return { success: false, newRemaining: coins.remaining_coins, error: updateError.message }
  }

  return { success: true, newRemaining }
}
