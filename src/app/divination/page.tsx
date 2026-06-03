'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { castDivination, getHexagram, generateInterpretation, getLineDisplay } from '@/lib/liuyao'
import { CastResult, HexagramData } from '@/types'
import toast from 'react-hot-toast'
import { RefreshCw, Save, Loader2 } from 'lucide-react'

const COIN_FACES: Record<number, string> = {
  6: '反反反',
  7: '正正反',
  8: '正反反',
  9: '正正正',
}

export default function DivinationPage() {
  const [question, setQuestion] = useState('')
  const [castResult, setCastResult] = useState<CastResult | null>(null)
  const [original, setOriginal] = useState<HexagramData | null>(null)
  const [changed, setChanged] = useState<HexagramData | null>(null)
  const [interpretation, setInterpretation] = useState('')
  const [casting, setCasting] = useState(false)
  const [castProgress, setCastProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCast = useCallback(() => {
    setCasting(true)
    setCastProgress(0)
    setSaved(false)

    const result = castDivination()
    const orig = getHexagram(result.originalHexagram)
    const chang = result.changedHexagram ? getHexagram(result.changedHexagram) : null

    // Animate through 6 tosses
    let i = 0
    const interval = setInterval(() => {
      i++
      setCastProgress(i)
      if (i >= 6) {
        clearInterval(interval)
        setCastResult(result)
        setOriginal(orig)
        setChanged(chang)
        const interp = generateInterpretation(orig, chang, result.changingLines, question)
        setInterpretation(interp)
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
    if (!castResult || !original) return

    setSaving(true)
    const { error } = await supabase.from('divination_records').insert({
      user_id: session.user.id,
      question,
      hexagram_original: original,
      hexagram_changed: changed,
      changing_lines: castResult.changingLines,
      cast_result: JSON.stringify(castResult.lines),
      interpretation,
    })
    if (error) {
      toast.error('保存失败: ' + error.message)
    } else {
      toast.success('占卜记录已保存')
      setSaved(true)

      // Also create/update connection if from shared link (future)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-primary-900 mb-2">起卦占卜</h1>
      <p className="text-center text-gray-500 mb-8">心诚则灵，默念所问之事，点击起卦</p>

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
        {!castResult && !casting && (
          <button onClick={handleCast} className="btn-primary text-lg px-12 py-4 rounded-xl shadow-lg">
            <RefreshCw className="inline mr-2" size={20} />
            掷币起卦
          </button>
        )}
        {castResult && !casting && (
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
                  <span className="coin-animate text-2xl inline-block">
                    {['⚊', '⚋', '⚊', '⚋', '⚊', '⚋'][i]}
                  </span>
                ) : (
                  <span className="text-gray-300 text-2xl">⬤</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {castResult && original && !casting && (
        <div className="space-y-6">
          {/* Hexagram display */}
          <div className="card">
            <h2 className="text-xl font-bold text-center text-primary-800 mb-2">
              {original.symbol} {original.name}
            </h2>
            {changed && (
              <p className="text-center text-primary-600 mb-4">
                之 {changed.symbol} {changed.name}
              </p>
            )}

            {/* Lines display - from top (6) to bottom (1) */}
            <div className="space-y-1 my-4">
              {castResult.lines.map((value, i) => {
                const display = getLineDisplay(value)
                const pos = 6 - i
                return (
                  <div key={i} className={`flex items-center justify-center space-x-3 py-1 line-draw ${display.changing ? 'bg-amber-50 rounded' : ''}`}
                    style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="text-gray-400 w-8 text-right text-sm">第{pos}爻</span>
                    <span className={`text-2xl ${display.changing ? 'text-red-500' : 'text-gray-800'}`}>
                      {display.label}
                    </span>
                    <span className={`text-sm w-12 ${display.changing ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                      {display.type}
                    </span>
                    <span className="text-xs text-gray-400">{COIN_FACES[value]}</span>
                  </div>
                )
              })}
            </div>

            {castResult.changingLines.length > 0 && (
              <p className="text-center text-sm text-red-500 mt-2">
                动爻：第 {castResult.changingLines.join('、')} 爻
              </p>
            )}
          </div>

          {/* Interpretation */}
          <div className="card">
            <h2 className="text-xl font-bold text-primary-800 mb-4">解卦</h2>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {interpretation}
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