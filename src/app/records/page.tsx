'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DivinationRecord } from '@/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Trash2, Eye, EyeOff, Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import HexagramCard from '@/components/HexagramCard'
import { NaJiaResult } from '@/lib/liuyao'

export default function RecordsPage() {
  const [records, setRecords] = useState<DivinationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push('/login')
        return
      }
      setUser(session.user)
      loadRecords(session.user.id)
    })
  }, [])

  const loadRecords = async (userId: string) => {
    const { data, error } = await supabase
      .from('divination_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('加载失败')
    } else {
      setRecords(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('divination_records').delete().eq('id', id)
    if (error) {
      toast.error('删除失败')
    } else {
      toast.success('已删除')
      setRecords(prev => prev.filter(r => r.id !== id))
    }
  }

  const togglePublic = async (record: DivinationRecord) => {
    const { error } = await supabase
      .from('divination_records')
      .update({ is_public: !record.is_public })
      .eq('id', record.id)

    if (error) {
      toast.error('操作失败')
    } else {
      setRecords(prev => prev.map(r => r.id === record.id ? { ...r, is_public: !r.is_public } : r))
      toast.success(record.is_public ? '已设为私密' : '已设为公开')
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-primary-900 mb-8">占卜记录</h1>

      {records.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">暂无占卜记录</p>
          <Link href="/divination" className="btn-primary">去起卦</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map(record => {
            const isExpanded = expandedIds.has(record.id)
            // 兼容旧数据：优先用 name/symbol，回退到 hexagramName/hexagramSymbol
            const origData = record.hexagram_original as unknown as NaJiaResult
            const changedData = record.hexagram_changed as unknown as NaJiaResult | null
            const displayName = record.hexagram_original?.name || origData?.hexagramName || '未知卦'
            const displaySymbol = record.hexagram_original?.symbol || origData?.hexagramSymbol || '☯'

            return (
              <div key={record.id} className="card hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl">{displaySymbol}</span>
                      <h3 className="text-lg font-semibold text-primary-800">{displayName}</h3>
                      {record.hexagram_changed && (
                        <span className="text-primary-500 text-sm">
                          → {record.hexagram_changed?.name || changedData?.hexagramName || '?'}
                        </span>
                      )}
                    </div>
                    {record.question && (
                      <p className="text-gray-500 text-sm flex items-center">
                        <Tag size={14} className="mr-1" /> {record.question}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 flex items-center mt-1">
                      <Calendar size={12} className="mr-1" />
                      {new Date(record.created_at).toLocaleString('zh-CN')}
                    </p>
                    {record.changing_lines?.length > 0 && (
                      <p className="text-xs text-red-400 mt-1">
                        动爻: 第 {record.changing_lines.join('、')} 爻
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => togglePublic(record)}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      title={record.is_public ? '设为私密' : '设为公开'}
                    >
                      {record.is_public ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="删除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Expand toggle */}
                <button
                  onClick={() => toggleExpand(record.id)}
                  className="w-full flex items-center justify-center py-2 text-sm text-primary-600 hover:text-primary-700 transition-colors border-t border-gray-100"
                >
                  {isExpanded ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                  {isExpanded ? '收起排盘' : '查看排盘与解卦'}
                </button>

                {/* Expanded: HexagramCard(s) + interpretation */}
                {isExpanded && (
                  <div className="mt-4 space-y-6 border-t border-gray-100 pt-4">
                    {/* 本卦 */}
                    <HexagramCard naJiaResult={origData} />

                    {/* 变卦 */}
                    {changedData && (
                      <>
                        <div className="text-center py-2">
                          <span className="text-4xl font-serif text-sky-600">⇩</span>
                          <p className="text-sm text-sky-600 font-serif mt-1">
                            之{changedData.hexagramName}
                            {record.changing_lines?.length > 0 && (
                              <span className="ml-2 text-red-500">
                                （动爻：第 {record.changing_lines.join('、')} 爻）
                              </span>
                            )}
                          </p>
                        </div>
                        <HexagramCard naJiaResult={changedData} />
                      </>
                    )}

                    {/* 解卦 */}
                    {record.interpretation && (
                      <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
                        <h3 className="text-sm font-semibold text-primary-700 mb-2">解卦</h3>
                        <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                          {record.interpretation}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}