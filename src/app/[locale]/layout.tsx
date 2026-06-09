import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster position="top-center" />
    </NextIntlClientProvider>
  )
}