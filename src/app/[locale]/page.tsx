'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Coins, History, Network, Users } from 'lucide-react'
import AdBanner from '@/components/AdBanner'

export default function Home() {
  const t = useTranslations('home')

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      {/* Hero */}
      <div className="mb-12 float-anim">
        <span className="text-8xl">☯</span>
      </div>
      <h1 className="text-5xl font-bold text-primary-900 mb-4">{t('title')}</h1>
      <p className="text-xl text-gray-600 max-w-lg mb-2">
        {t('heroSub')}
      </p>
      <p className="text-gray-400 mb-12 max-w-md">
        {t('heroDesc')}
      </p>

      {/* CTA */}
      <Link href="/divination" className="btn-primary text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all mb-16">
        {t('cta')}
      </Link>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <FeatureCard
          icon={Coins}
          title={t('features.coins.title')}
          desc={t('features.coins.desc')}
        />
        <FeatureCard
          icon={History}
          title={t('features.history.title')}
          desc={t('features.history.desc')}
        />
        <FeatureCard
          icon={Network}
          title={t('features.network.title')}
          desc={t('features.network.desc')}
        />
      </div>

      {/* 广告卡片 — Features 与 Stats 之间 */}
      <div className="w-full max-w-4xl mb-12">
        <AdBanner slotType="card" />
      </div>

      {/* Stats placeholder */}
      <div className="mt-4 flex items-center space-x-8 text-gray-400">
        <div className="text-center">
          <Users className="inline-block mb-1" size={20} />
          <p className="text-sm">{t('stats.multiUser')}</p>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-primary-500">64</span>
          <p className="text-sm">{t('stats.hexagramCount')}</p>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-primary-500">384</span>
          <p className="text-sm">{t('stats.lineCount')}</p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="card text-center hover:shadow-lg transition-shadow">
      <Icon className="mx-auto mb-3 text-primary-600" size={32} />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  )
}