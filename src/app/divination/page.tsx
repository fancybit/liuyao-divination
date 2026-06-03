'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { performFullDivination } from '@/lib/liuyao'
import { NaJiaLineInfo } from '@/lib/liuyao'
import toast from 'react-hot-toast'
import { RefreshCw, Save, Loader2 } from 'lucide-react'

function NaJiaTable({ lines, title, highlightPositions }: { lines: NaJiaLineInfo[]; title: string; highlightPositions?: number[] }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-primary-700 mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary-50 text-primary-700">
              <th className="p-2 border text-center w-14">爻位</th>
              <th className="p-2 border text-center w-14">天干</th>
              <th className="p-2 border text-center w-14">地支</th>
              <th className="p-2 border text-center w-16">六亲</th>
              <th className="p-2 border text-center w-16">六兽</th>
              <th className="p-2 border text-center w-14">世应</th>
              <th className="p-2 border text-center">阴阳</th>
            </tr>
          </thead>
          <tbody>
            {[...lines].reverse().map((line) => {
              const isChanging = highlightPositions?.includes(line.position)
              return (
                <tr key={line.position} className={`text-center ${isChanging ? 'bg-amber-50' : ''}`}>
                  <td className="p-1.5 border">{line.position === 6 ? '上' : line.position === 1 ? '初' : `${line.position}`}</td>
                  <td className="p-1.5 border font-medium">{line.naJia}</td>
                  <td className="p-1.5 border font-medium">{line.naZhi}</td>
                  <td className={`p-1.5 border ${line.liuQin === '妻财' ? 'text-green-600' : line.liuQin === '官鬼' ? 'text-red-600' : line.liuQin === '子孙' ? 'text-blue-600' : line.liuQin === '父母' ? 'text-yellow-700' : 'text-gray-600'} font-medium`}>{line.liuQin}</td>
                  <td className="p-1.5 border text-gray-600">{line.liuShou}</td>
                  <td className={`p-1.5 border font-bold ${line.shiYing === '世' ? 'text-red-500' : line.shiYing === '应' ? 'text-blue-500' : ''}`}>{line.shiYing || '-'}</td>
                  <td className={`p-1.5 border ${line.yinYang === '阳' ? 'text-cyan-600' : 'text-purple-600'}`}>
                    {line.yinYang}{isChanging && <span className="ml-1 text-xs text-red-500">动</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

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
    const { error } = await supabase.from('divination_records').insert({
      user_id: session.user.id,
      question,
      hexagram_original: result.originalPan,
      hexagram_changed: result.changedPan,
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
      <h1 className="text-3xl font-bold text-center text-primary-900 mb-2">纳甲六爻占卜</h1>
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
          {/* Hexagram header */}
          <div className="card">
            <div className="text-center mb-2">
              <span className="text-3xl">{result.originalPan.hexagramSymbol}</span>
              <h2 className="text-2xl font-bold text-primary-800">{result.originalPan.hexagramName}</h2>
              {result.changedPan && (
                <p className="text-primary-600 mt-1">
                  之 <span className="text-xl">{result.changedPan.hexagramSymbol}</span> {result.changedPan.hexagramName}
                </p>
              )}
            </div>
            <div className="flex justify-center gap-6 text-sm text-gray-500 mt-2">
              <span>宫：{result.originalPan.palace}宫（{result.originalPan.palaceElement}）</span>
              <span>世：第{result.originalPan.shiYao}爻</span>
              <span>应：第{result.originalPan.yingYao}爻</span>
              <span>日干：{result.originalPan.dayGan}</span>
            </div>
          </div>

          {/* NaJia Pan */}
          <div className="card">
            <NaJiaTable
              lines={result.originalPan.lines}
              title="本卦纳甲排盘"
              highlightPositions={result.castResult.changingLines}
            />
            {result.changedPan && (
              <NaJiaTable
                lines={result.changedPan.lines}
                title="变卦纳甲排盘"
              />
            )}
          </div>

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
            {result.castResult.changingLines.length > 0 && (
              <p className="mt-3 text-sm text-red-500">
                动爻：第 {result.castResult.changingLines.join('、')} 爻
              </p>
            )}
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
