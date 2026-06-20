/**
 * 广告系统类型定义
 * Ad System Type Definitions
 */

/** 广告展示模式 */
export type AdMode = 'adsense' | 'custom' | 'none'

/** 广告位类型 */
export type AdSlotType = 'banner' | 'inline' | 'card'

/** 单条自定义推广广告 */
export interface CustomAdConfig {
  /** 推广链接 */
  url: string
  /** 推广文案 */
  text: string
  /** 平台标签（如 京东 / 淘宝），不填则不显示 */
  label?: string
}

/** AdBanner 组件 Props */
export interface AdBannerProps {
  /** 广告位类型，影响布局样式 */
  slotType?: AdSlotType
  /** 自定义 CSS 类名 */
  className?: string
}

/** 广告配置（从环境变量解析） */
export interface AdConfig {
  mode: AdMode
  /** Google AdSense 发布商 ID */
  adsenseClientId: string
  /** [旧版兼容] 自定义广告链接 — 仅 NEXT_PUBLIC_AD_CUSTOM_ADS 为空时生效 */
  customUrl: string
  /** [旧版兼容] 自定义广告文案 — 仅 NEXT_PUBLIC_AD_CUSTOM_ADS 为空时生效 */
  customText: string
  /** 多条自定义推广广告 — 通过 NEXT_PUBLIC_AD_CUSTOM_ADS JSON 数组配置 */
  customAds: CustomAdConfig[]
}

/**
 * 从环境变量解析广告配置。
 * 优先级：NEXT_PUBLIC_ADSENSE_CLIENT_ID > NEXT_PUBLIC_AD_CUSTOM_ADS > NEXT_PUBLIC_AD_CUSTOM_URL
 */
export function getAdConfig(): AdConfig {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''
  const customAdsRaw = process.env.NEXT_PUBLIC_AD_CUSTOM_ADS || ''
  const customUrl = process.env.NEXT_PUBLIC_AD_CUSTOM_URL || ''
  const customText = process.env.NEXT_PUBLIC_AD_CUSTOM_TEXT || ''

  let mode: AdMode = 'none'
  let customAds: CustomAdConfig[] = []

  if (adsenseId) {
    mode = 'adsense'
  } else if (customAdsRaw) {
    // 解析 JSON 数组
    try {
      const parsed = JSON.parse(customAdsRaw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        customAds = parsed
          .filter((item: any) => item.url && item.text)
          .map((item: any) => ({
            url: item.url || '',
            text: item.text || '',
            label: item.label || undefined,
          }))
        if (customAds.length > 0) {
          mode = 'custom'
        }
      }
    } catch {
      // JSON 解析失败，回退到旧版单条模式
    }
  }

  // 旧版兼容：JSON 未成功解析时回退到单条模式
  if (mode === 'none' && customUrl) {
    mode = 'custom'
  }

  return { mode, adsenseClientId: adsenseId, customUrl, customText, customAds }
}

/** 从广告数组中随机选取一条 */
export function pickRandomAd(ads: CustomAdConfig[]): CustomAdConfig {
  return ads[Math.floor(Math.random() * ads.length)]
}
