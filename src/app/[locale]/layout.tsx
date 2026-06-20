import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Script from 'next/script'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import AdBanner from '@/components/AdBanner'

type Props = {
  children: React.ReactNode
  params: { locale: string }
}

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

export default async function LocaleLayout({ children, params }: Props) {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages} locale={params.locale}>
      {ADSENSE_CLIENT_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <Navbar />
      {/* 全局顶部横幅广告 */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner slotType="banner" />
      </div>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
      {/* 全局底部横幅广告 */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <AdBanner slotType="banner" />
      </div>
      <Toaster position="top-center" />
    </NextIntlClientProvider>
  )
}