import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: '一念通玄 - 易经六爻占卜',
  description: '一念通玄，以三枚铜钱问天地之道。易经六爻在线占卜，含纳甲排盘、卦辞爻辞、占卜记录',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}