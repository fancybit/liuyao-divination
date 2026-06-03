import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: '六爻占卜 - 易经在线占卜',
  description: '易经六爻在线占卜系统，支持多用户、占卜记录和六度关系网',
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