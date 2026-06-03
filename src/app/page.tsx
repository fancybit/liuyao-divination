import Link from 'next/link'
import { Coins, History, Network, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      {/* Hero */}
      <div className="mb-12 float-anim">
        <span className="text-8xl">☯</span>
      </div>
      <h1 className="text-5xl font-bold text-primary-900 mb-4">一念通玄</h1>
      <p className="text-xl text-gray-600 max-w-lg mb-2">
        以三枚铜钱，问天地之道
      </p>
      <p className="text-gray-400 mb-12 max-w-md">
        依循《易经》六十四卦体系，掷币成卦，观象玩辞。心诚则灵，有疑则问。
      </p>

      {/* CTA */}
      <Link href="/divination" className="btn-primary text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all mb-16">
        开始起卦
      </Link>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <FeatureCard
          icon={Coins}
          title="三钱起卦"
          desc="模拟三枚铜钱掷六次，生成六爻卦象，含本卦与变卦"
        />
        <FeatureCard
          icon={History}
          title="占卜记录"
          desc="自动保存每次占卜，随时回顾历史卦象与解卦"
        />
        <FeatureCard
          icon={Network}
          title="六度关系网"
          desc="可视化用户之间的占卜关联，探索有缘人"
        />
      </div>

      {/* Stats placeholder */}
      <div className="mt-16 flex items-center space-x-8 text-gray-400">
        <div className="text-center">
          <Users className="inline-block mb-1" size={20} />
          <p className="text-sm">多用户支持</p>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-primary-500">64</span>
          <p className="text-sm">卦象体系</p>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-primary-500">384</span>
          <p className="text-sm">爻辞解读</p>
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