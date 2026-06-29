import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '一言通玄 - 易经六爻占卜',
  description: '一言通玄，以三枚铜钱问天地之道。易经六爻在线占卜，含纳甲排盘、卦辞爻辞、占卜记录',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}