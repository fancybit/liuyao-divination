'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { getAdConfig, AdSlotType, CustomAdConfig, pickRandomAd } from '@/types/ads'

interface AdBannerProps {
  slotType?: AdSlotType
  className?: string
}

/** 平台标签颜色映射 */
const labelColors: Record<string, string> = {
  京东: 'bg-red-100 text-red-700 border-red-300',
  淘宝: 'bg-orange-100 text-orange-700 border-orange-300',
  天猫: 'bg-red-100 text-red-700 border-red-300',
  拼多多: 'bg-pink-100 text-pink-700 border-pink-300',
}

function getLabelStyle(label: string): string {
  return labelColors[label] || 'bg-gray-100 text-gray-600 border-gray-300'
}

export default function AdBanner({ slotType = 'banner', className = '' }: AdBannerProps) {
  const t = useTranslations('ad')
  const adsenseRef = useRef<HTMLModElement>(null)

  // getAdConfig() 在组件顶层调用，每次渲染重新读取环境变量
  const config = getAdConfig()

  // 多条广告时随机选取一条（仅挂载时执行一次，不同 AdBanner 实例各自独立选取）
  const selectedAd: CustomAdConfig | null = useMemo(() => {
    if (config.mode === 'custom') {
      if (config.customAds.length > 0) {
        return pickRandomAd(config.customAds)
      }
      // 旧版兼容：单条模式
      if (config.customUrl) {
        return { url: config.customUrl, text: config.customText || t('customDefault') }
      }
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const slotStyles: Record<AdSlotType, string> = {
    banner: 'w-full min-h-[90px]',
    inline: 'w-full min-h-[60px]',
    card: 'w-full min-h-[100px]',
  }

  // Google AdSense 初始化
  useEffect(() => {
    if (config.mode !== 'adsense' || !adsenseRef.current) return
    try {
      const adsbygoogle = (window as any).adsbygoogle || []
      adsbygoogle.push({})
    } catch {
      // AdSense 脚本未加载或已加载，忽略
    }
  }, [config.mode])

  if (config.mode === 'none') return null

  return (
    <div className={`ad-container ${slotStyles[slotType]} ${className}`}>
      {/* 广告标签 */}
      <div className="text-center mb-1">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
          {t('label')}
        </span>
      </div>

      {/* Google AdSense 模式 */}
      {config.mode === 'adsense' && (
        <div className="flex justify-center">
          <ins
            ref={adsenseRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={config.adsenseClientId}
            data-ad-format="auto"
            data-ad-layout-key={slotType === 'banner' ? '-gw-1+2a-3x+5c' : '-6t+ed+2i-1n-4w'}
            data-full-width-responsive="true"
          />
        </div>
      )}

      {/* 自定义推广链接模式（多条 + 旧版单条兼容） */}
      {config.mode === 'custom' && selectedAd && (
        <a
          href={selectedAd.url}
          target="_blank"
          rel="nofollow noopener sponsored"
          className={`
            block rounded-lg border border-dashed border-amber-300
            bg-amber-50/50 hover:bg-amber-50 transition-colors
            ${slotType === 'banner' ? 'px-6 py-3' : 'px-4 py-2'}
          `}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-amber-600 text-lg">&#9733;</span>

            {/* 平台标签 */}
            {selectedAd.label && (
              <span
                className={`
                  text-[10px] px-1.5 py-0.5 rounded border font-medium
                  ${getLabelStyle(selectedAd.label)}
                `}
              >
                {selectedAd.label}
              </span>
            )}

            <span className="text-amber-800 font-medium text-sm">
              {selectedAd.text}
            </span>
            <span className="text-amber-600 text-lg">&#9733;</span>
          </div>
        </a>
      )}
    </div>
  )
}
