'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { performFullDivination } from '@/lib/liuyao'
import toast from 'react-hot-toast'
import { RefreshCw, Save, Loader2 } from 'lucide-react'
import HexagramCard from '@/components/HexagramCard'

export default function DivinationPage() {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<ReturnType<typeof performFullDivination> | null>(null)
  const [casting, setCasting] = useState(false)
  const [castProgress, setCastProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCast = useCallback(() => {
    setCasting(true)
    setCastProgress(0)
    setSaved(false)

    let i = 0
    const interval = setInterval(() => {
      i++
      setCastProgress(i)
      if (i >= 6) {
        clearInterval(interval)
        const divResult = performFullDivination(question)
        setResult(divResult)
        setCasting(false)
      }
    }, 600)
  }, [question])

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      toast.error('请先登录后再保存记录')
      return
    }
    if (!result) return

    setSaving(true)

    // 为 NaJiaResult 增加 name / symbol 别名字段，确保与 HexagramData 接口兼容
    const toRecordHexagram = (pan: typeof result.originalPan) => ({
      ...pan,
      name: pan.hexagramName,
      symbol: pan.hexagramSymbol,
    })

    const hexagramOriginal = toRecordHexagram(result.originalPan)
    const hexagramChanged = result.changedPan ? toRecordHexagram(result.changedPan) : null

    const { error } = await supabase.from('divination_records').insert({
      user_id: session.user.id,
      question,
      hexagram_original: hexagramOriginal,
      hexagram_changed: hexagramChanged,
      changing_lines: result.castResult.changingLines,
      cast_result: JSON.stringify(result.castResult.lines),
      interpretation: result.interpretation,
    })
    if (error) {
      toast.error('保存失败: ' + error.message)
    } else {
      toast.success('占卜记录已保存')
      setSaved(true)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-primary-900 mb-2">一念通玄 · 纳甲六爻</h1>
      <p className="text-center text-gray-500 mb-8">京房纳甲筮法 · 三枚铜钱起卦 · 六亲六兽排盘</p>

      {/* Question input */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">所问何事？（选填）</label>
        <input
          type="text"
          className="input-field"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="如：今年事业运如何？"
          disabled={casting}
        />
      </div>

      {/* Cast button */}
      <div className="text-center mb-8">
        {!result && !casting && (
          <button onClick={handleCast} className="btn-primary text-lg px-12 py-4 rounded-xl shadow-lg">
            <RefreshCw className="inline mr-2" size={20} />
            掷币起卦
          </button>
        )}
        {result && !casting && (
          <button onClick={handleCast} className="btn-outline text-lg px-8 py-3 rounded-xl">
            <RefreshCw className="inline mr-2" size={18} />
            重新起卦
          </button>
        )}
      </div>

      {/* Casting animation */}
      {casting && (
        <div className="card mb-6 text-center">
          <p className="text-lg text-primary-700 mb-4">正在掷币...</p>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center space-x-2">
                <span className="text-gray-400 w-8 text-right">{i + 1}.</span>
                {i < castProgress ? (
                  <span className="text-2xl">{['⚊', '⚋', '⚊', '⚋', '⚊', '⚋'][i]}</span>
                ) : (
                  <span className="text-gray-300 text-2xl">⬤</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && !casting && (
        <div className="space-y-6">
          {/* 本卦牌面 */}
          <HexagramCard naJiaResult={result.originalPan} />

          {/* 变卦牌面 */}
          {result.changedPan && (
            <>
              <div className="text-center py-2">
                <span className="text-4xl font-serif text-sky-600">⇩</span>
                <p className="text-sm text-sky-600 font-serif mt-1">
                  之{result.changedPan.hexagramName}
                  {result.castResult.changingLines.length > 0 && (
                    <span className="ml-2 text-red-500">
                      （动爻：第 {result.castResult.changingLines.join('、')} 爻）
                    </span>
                  )}
                </p>
              </div>
              <HexagramCard naJiaResult={result.changedPan} />
            </>
          )}

          {/* Six Relatives summary */}
          <div className="card">
            <h3 className="text-sm font-semibold text-primary-700 mb-3">六亲分布</h3>
            <div className="flex flex-wrap gap-2">
              {['父母', '兄弟', '妻财', '官鬼', '子孙'].map(liuQin => {
                const count = result.originalPan.lines.filter(l => l.liuQin === liuQin).length
                return (
                  <span key={liuQin} className="px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600">
                    {liuQin} × {count}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Interpretation */}
          <div className="card">
            <h2 className="text-xl font-bold text-primary-800 mb-4">解卦</h2>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
              {result.interpretation}
            </div>
          </div>

          {/* Save button */}
          <div className="text-center">
            {saved ? (
              <p className="text-green-600 font-medium">已保存</p>
            ) : (
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="inline animate-spin mr-2" size={18} /> : <Save className="inline mr-2" size={18} />}
                {saving ? '保存中...' : '保存记录'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
