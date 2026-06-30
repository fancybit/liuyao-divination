'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { getTiers, getNextTierInfo } from '@/lib/billing'
import { User } from '@supabase/supabase-js'
import { Coins, Zap, TrendingUp, Crown, Star, Loader2, ArrowRight, Award } from 'lucide-react'
import type { UserTier } from '@/types'
import toast from 'react-hot-toast'

const RECHARGE_OPTIONS = [50, 100, 200, 500, 1000]

export default function PricingPage() {
  const t = useTranslations('billing')
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [remainingCoins, setRemainingCoins] = useState(0)
  const [totalExp, setTotalExp] = useState(0)
  const [currentTierId, setCurrentTierId] = useState<number>(1)
  const [tiers, setTiers] = useState<(UserTier & { isCurrent?: boolean; exp_needed?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [recharging, setRecharging] = useState(false)

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }
      setUser(session.user)
      await Promise.all([loadCoins(session.user.id), loadTiers()])
      setLoading(false)
    })()
  }, [])

  const loadCoins = async (userId: string) => {
    const { data } = await supabase
      .from('user_credits')
      .select('remaining_coins, total_exp, current_tier_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (data) {
      setRemainingCoins(data.remaining_coins)
      setTotalExp(data.total_exp || 0)
      setCurrentTierId(data.current_tier_id)
    }
  }

  const loadTiers = async () => {
    const allTiers = await getTiers()
    if (allTiers.length > 0) {
      const enriched = await Promise.all(allTiers.map(async (tier) => {
        const { exp_needed } = await getNextTierInfo(tier.min_exp - 1)
        return { ...tier, exp_needed }
      }))
      setTiers(enriched)
    }
  }

  const handleRecharge = async (coins: number) => {
    setRecharging(true)
    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins }),
      })
      const result = await res.json()
      if (result.success) {
        setRemainingCoins(result.new_remaining)
        toast.success(t('rechargeSuccess', { credits: coins }))
      } else {
        toast.error(result.error || t('rechargeFail'))
      }
    } catch {
      toast.error(t('rechargeFail'))
    }
    setRecharging(false)
  }

  const getTierIcon = (index: number) => {
    switch (index) {
      case 0: return <Star size={20} />
      case 1: return <Zap size={20} />
      case 2: return <TrendingUp size={20} />
      case 3: return <Crown size={20} />
      default: return <Star size={20} />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  const currentTier = tiers.find(t => t.id === currentTierId)
  const currentTierIndex = tiers.findIndex(t => t.id === currentTierId)
  const nextTier = currentTierIndex >= 0 && currentTierIndex < tiers.length - 1
    ? tiers[currentTierIndex + 1]
    : null
  const expToNext = nextTier ? nextTier.min_exp - totalExp : 0
  const expProgress = nextTier && totalExp > 0
    ? Math.min(100, Math.round(((totalExp - (currentTier?.min_exp || 0)) / (nextTier.min_exp - (currentTier?.min_exp || 0))) * 100))
    : 100

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-primary-900 mb-2">{t('yanCoinTitle')}</h1>
      <p className="text-center text-gray-500 mb-8">{t('yanCoinDesc')}</p>

      {/* 当前状态卡片 */}
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
              <Coins size={28} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('yanCoin')}</p>
              <p className="text-2xl font-bold text-gray-800">{remainingCoins}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 rounded-lg" style={{ backgroundColor: currentTier?.color + '20' }}>
              <p className="text-sm text-gray-500">{t('tierLevel')}</p>
              <p className="text-lg font-bold" style={{ color: currentTier?.color }}>
                {currentTier?.name || t('tierDefault')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">{t('totalExp')}</p>
              <p className="text-xl font-bold text-primary-600">{totalExp}</p>
            </div>
          </div>
        </div>

        {/* 经验进度条 */}
        {nextTier && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">
                {t('expToNext', { exp: expToNext, tier: nextTier.name })}
              </span>
              <span className="text-xs font-medium" style={{ color: nextTier.color }}>
                <Award size={14} className="inline mr-1" />
                {nextTier.name}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${expProgress}%`,
                  backgroundColor: nextTier.color,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 充值区域 */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('recharge')}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {RECHARGE_OPTIONS.map(amount => (
            <button
              key={amount}
              onClick={() => handleRecharge(amount)}
              disabled={recharging}
              className="py-3 px-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors disabled:opacity-50 text-center"
            >
              <span className="block text-lg font-bold text-amber-700">+{amount}</span>
              <span className="block text-xs text-amber-500 mt-0.5">{t('yanCoinUnit')}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">{t('simulatedNotice')}</p>
      </div>

      {/* 等级经验对比表 */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('tierComparison')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">{t('tierLevel')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">{t('requiredExp')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">{t('costPerDivination')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, index) => {
                const isCurrent = tier.id === currentTierId
                const isNext = nextTier?.id === tier.id

                return (
                  <tr key={tier.id} className={`border-b border-gray-100 ${isCurrent ? 'bg-amber-50/50' : 'hover:bg-gray-50'}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span style={{ color: tier.color }}>{getTierIcon(index)}</span>
                        <span className="font-medium text-gray-800">{tier.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{tier.min_exp}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-700">5</span>
                      <span className="text-gray-400 ml-1">{t('yanCoinUnit')}</span>
                    </td>
                    <td className="py-3 px-4">
                      {isCurrent ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {t('currentTier')}
                        </span>
                      ) : isNext ? (
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <ArrowRight size={12} />
                          {t('needExp', { exp: expToNext })}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
