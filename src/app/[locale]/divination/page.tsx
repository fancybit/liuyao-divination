'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { performFullDivination } from '@/lib/liuyao'
import toast from 'react-hot-toast'
import { RefreshCw, Save, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import HexagramCard from '@/components/HexagramCard'

export default function DivinationPage() {
  const t = useTranslations('divination')
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<ReturnType<typeof performFullDivination> | null>(null)
  const [casting, setCasting] = useState(false)
  const [castProgress, setCastProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [interpreting, setInterpreting] = useState(false)

  const handleCast = useCallback(() => {
    setCasting(true)
    setCastProgress(0)
    setSaved(false)
    setInterpreting(false)

    let i = 0
    const interval = setInterval(() => {
      i++
      setCastProgress(i)
      if (i >= 6) {
        clearInterval(interval)
        const divResult = performFullDivination(question)
        setResult(divResult)
        setCasting(false)

        // 异步调千问解卦
        setInterpreting(true)
        fetch('/api/interpret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            original: divResult.originalPan,
            changed: divResult.changedPan,
            question,
          }),
        })
          .then(res => res.json())
          .then(data => {
            setResult(prev => prev ? { ...prev, interpretation: data.interpretation || data.error || '解卦失败' } : prev)
            setInterpreting(false)
          })
          .catch(() => {
            setResult(prev => prev ? { ...prev, interpretation: t('interpretFail') } : prev)
            setInterpreting(false)
          })
      }
    }, 600)
  }, [question, t])

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      toast.error(t('loginRequired'))
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
      toast.error(t('saveFail') + ': ' + error.message)
    } else {
      toast.success(t('saveSuccess'))
      setSaved(true)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-primary-900 mb-2">{t('title')}</h1>
      <p className="text-center text-gray-500 mb-8">{t('subtitle')}</p>

      {/* Question input */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('questionLabel')} {t('questionOptional')}</label>
        <input
          type="text"
          className="input-field"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder={t('questionPlaceholder')}
          disabled={casting}
        />
      </div>

      {/* Cast button */}
      <div className="text-center mb-8">
        {!result && !casting && (
          <button onClick={handleCast} className="btn-primary text-lg px-12 py-4 rounded-xl shadow-lg">
            <RefreshCw className="inline mr-2" size={20} />
            {t('cast')}
          </button>
        )}
        {result && !casting && (
          <button onClick={handleCast} className="btn-outline text-lg px-8 py-3 rounded-xl">
            <RefreshCw className="inline mr-2" size={18} />
            {t('recast')}
          </button>
        )}
      </div>

      {/* Casting animation */}
      {casting && (
        <div className="card mb-6 text-center">
          <p className="text-lg text-primary-700 mb-4">{t('casting')}</p>
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
                  {t('changedTo')}{result.changedPan.hexagramName}
                  {result.castResult.changingLines.length > 0 && (
                    <span className="ml-2 text-red-500">
                      （{t('changingLine')}：{t('changingLinesCount', { count: result.castResult.changingLines.length })}）
                    </span>
                  )}
                </p>
              </div>
              <HexagramCard naJiaResult={result.changedPan} />
            </>
          )}

          {/* Six Relatives summary */}
          <div className="card">
            <h3 className="text-sm font-semibold text-primary-700 mb-3">{t('sixRelatives')}</h3>
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
            <h2 className="text-xl font-bold text-primary-800 mb-4">{t('interpretation')}</h2>
            {interpreting ? (
              <div className="flex items-center space-x-3 text-gray-500">
                <Loader2 className="animate-spin" size={20} />
                <span>{t('aiInterpreting')}</span>
              </div>
            ) : result.interpretation ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                {result.interpretation}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">{t('interpretFail')}</div>
            )}
          </div>

          {/* Save button */}
          <div className="text-center">
            {saved ? (
              <p className="text-green-600 font-medium">{t('savedToast')}</p>
            ) : (
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="inline animate-spin mr-2" size={18} /> : <Save className="inline mr-2" size={18} />}
                {saving ? t('saving') : t('saveRecord')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
