'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { generateQimenChart, type QimenChart } from '@/lib/qimen'

const LAYOUT: number[][] = [
  [4, 9, 2],  // 上排: 巽4 离9 坤2
  [3, 5, 7],  // 中排: 震3 中5 兑7
  [8, 1, 6],  // 下排: 艮8 坎1 乾6
]

function formatBeijingTime(date: Date): string {
  const y = date.getFullYear()
  const mo = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${mo}-${d} ${h}:${mi}`
}

export default function QimenPage() {
  const t = useTranslations('qimen')
  const c = useTranslations('common')
  const [chart, setChart] = useState<QimenChart | null>(null)
  const [now, setNow] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    const d = new Date()
    setNow(d)
    const result = generateQimenChart(d)
    setChart(result)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const palaceMap = new Map(chart?.palaces.map(p => [p.gong, p]) || [])

  const dunColor = chart?.dunType === '阳遁'
    ? 'from-amber-50 to-orange-50 border-amber-200'
    : 'from-slate-50 to-blue-50 border-slate-200'

  if (loading || !chart) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse text-primary-600 text-lg">{c('loading')}</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${dunColor}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">
            {t('title')}
          </h1>
        </div>

        {/* 时间与排盘信息栏 */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{t('currentTime')}:</span>
              <span className="text-lg font-mono font-semibold text-primary-800">
                {formatBeijingTime(now)}
              </span>
            </div>
            <button
              onClick={refresh}
              className="btn-outline text-sm px-4 py-1.5"
            >
              {t('refresh')}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <InfoBadge label={t('dunType')} value={chart.dunType} hl={true} />
            <InfoBadge label={t('juNumber')} value={`${t('ju')} ${chart.juNumber}${t('juSuffix')}`} />
            <InfoBadge label={t('solarTerm')} value={chart.timeInfo.solarTerm} />
            <InfoBadge label={t('yuan')} value={chart.timeInfo.yuan} />
            <InfoBadge label={t('dayStem')} value={chart.timeInfo.dayStem} />
            <InfoBadge label={t('hourStem')} value={chart.timeInfo.hourStem} />
          </div>
        </div>

        {/* 九宫格 */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
          {LAYOUT.flat().map(gong => {
            const p = palaceMap.get(gong)
            if (!p) return null
            const isCenter = gong === 5
            return (
              <div
                key={gong}
                className={`
                  relative rounded-xl p-3 text-center transition-all
                  ${isCenter
                    ? 'bg-primary-50 border-2 border-primary-300 shadow-md'
                    : 'bg-white border shadow-sm hover:shadow-md'
                  }
                  ${p.isEmpty ? 'border-dashed border-gray-400' : 'border-gray-200'}
                `}
              >
                {/* 宫名 */}
                <div className="text-[10px] text-gray-400 mb-1">{p.gongName.replace('宫', '')}</div>

                {/* 天盘干 + 地盘干 */}
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-xl font-bold text-primary-800">{p.tianPan}</span>
                  <span className="text-xs text-gray-400">/</span>
                  <span className="text-sm text-gray-500">{p.diPan}</span>
                </div>

                {/* 九星 */}
                <div className="text-sm font-medium text-amber-700">
                  {p.star}
                </div>

                {/* 八门 */}
                <div className="text-xs text-emerald-700">
                  {p.door}
                </div>

                {/* 八神 */}
                <div className="text-xs text-purple-600 mt-0.5">
                  {p.god || '-'}
                </div>

                {/* 标记 */}
                <div className="absolute top-1 right-1.5 flex gap-0.5">
                  {p.isHorse && (
                    <span className="text-[10px] text-red-500 font-bold" title={t('horse')}>
                      {t('horseMark')}
                    </span>
                  )}
                  {p.isEmpty && (
                    <span className="text-[10px] text-gray-400" title={t('empty')}>
                      {t('emptyMark')}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 图例 */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('legend')}</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
            <span>{t('topStem')}: <strong className="text-primary-700">{t('topStemDesc')}</strong></span>
            <span>{t('bottomStem')}: <strong className="text-gray-500">{t('bottomStemDesc')}</strong></span>
            <span>{t('starLabel')}: <strong className="text-amber-700">{t('starDesc')}</strong></span>
            <span>{t('doorLabel')}: <strong className="text-emerald-700">{t('doorDesc')}</strong></span>
            <span>{t('godLabel')}: <strong className="text-purple-600">{t('godDesc')}</strong></span>
            <span>{t('dashedBorder')}: <strong className="text-gray-400">{t('emptyDesc')}</strong></span>
            <span><span className="text-red-500 font-bold">{t('horseMark')}</span>: <strong className="text-red-500">{t('horseDesc')}</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoBadge({ label, value, hl }: { label: string; value: string; hl?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-400">{label}</span>
      <span className={hl ? 'font-semibold text-primary-700' : 'text-gray-700'}>
        {value}
      </span>
    </div>
  )
}
