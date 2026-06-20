'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import {
  Loader2, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Shield, UserPlus, UserMinus, ShieldAlert, Eye, EyeOff, X
} from 'lucide-react'

interface AdminRecord {
  id: number
  email: string
  is_initial: boolean
  created_at: string
}

interface DivinationRow {
  id: number
  user_id: string
  question: string
  hexagram_name?: string
  changed_hexagram_name?: string
  hexagram_original?: any
  hexagram_changed?: any
  interpretation: string
  interpretation_en: string | null
  is_public: boolean
  created_at: string
  cast_result?: string
  user_email?: string
}

export default function AdminPage() {
  const t = useTranslations('admin')
  const router = useRouter()

  // Auth & admin check
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  // Divination records
  const [records, setRecords] = useState<DivinationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 20

  // Filters
  const [searchEmail, setSearchEmail] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [publicFilter, setPublicFilter] = useState<'all' | 'public' | 'private'>('all')

  // Expanded rows
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  // Admin management
  const [admins, setAdmins] = useState<AdminRecord[]>([])
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  // Check if current user is admin
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }
      const { data } = await supabase
        .from('admins')
        .select('*')
        .eq('email', session.user.email!)
        .maybeSingle()
      if (!data) {
        setIsAdmin(false)
        setChecking(false)
        return
      }
      setIsAdmin(true)
      loadAdmins()
      setChecking(false)
    })()
  }, [])

  const loadAdmins = async () => {
    const { data } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setAdmins(data)
  }

  // Load records
  const loadRecords = useCallback(async () => {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('divination_records')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (publicFilter === 'public') query = query.eq('is_public', true)
    if (publicFilter === 'private') query = query.eq('is_public', false)

    // Search by user email: first find user_ids, then filter
    if (searchEmail.trim()) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', `%${searchEmail.trim()}%`)

      const userIds = profiles?.map(p => p.id) || []
      if (userIds.length > 0) {
        query = query.in('user_id', userIds)
      } else {
        setRecords([])
        setTotalCount(0)
        setLoading(false)
        return
      }
    }

    const { data, count, error } = await query

    if (error) {
      console.error('Load records error:', error)
      setRecords([])
      setTotalCount(0)
    } else {
      // Attach user emails
      const enriched = await attachUserEmails(data || [])
      setRecords(enriched)
      setTotalCount(count || 0)
    }
    setLoading(false)
  }, [page, publicFilter, searchEmail])

  useEffect(() => {
    if (isAdmin) loadRecords()
  }, [isAdmin, loadRecords])

  const attachUserEmails = async (rows: any[]): Promise<DivinationRow[]> => {
    const userIds = [...new Set(rows.map(r => r.user_id))]
    if (userIds.length === 0) return rows
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds)

    const emailMap = new Map(profiles?.map(p => [p.id, p.email]) || [])
    return rows.map(r => ({ ...r, user_email: emailMap.get(r.user_id) || r.user_id }))
  }

  const handleSearch = () => {
    setSearchEmail(emailInput.trim())
    setPage(1)
  }

  const handleClearSearch = () => {
    setEmailInput('')
    setSearchEmail('')
    setPage(1)
  }

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // --- Admin Management ---
  const handleAddAdmin = async () => {
    const email = newAdminEmail.trim()
    if (!email) return
    setAdminLoading(true)
    const { error } = await supabase.from('admins').insert({ email, is_initial: false })
    if (error) {
      alert(error.message)
    } else {
      setNewAdminEmail('')
      loadAdmins()
    }
    setAdminLoading(false)
  }

  const handleRemoveAdmin = async (id: number) => {
    if (!confirm(t('confirmRemove'))) return
    setAdminLoading(true)
    const { error } = await supabase.from('admins').delete().eq('id', id)
    if (error) {
      alert(error.message)
    } else {
      loadAdmins()
    }
    setAdminLoading(false)
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('noAccess')}</h1>
        <p className="text-gray-500">{t('noAccessDesc')}</p>
      </div>
    )
  }

  const getHexagramDisplayName = (row: DivinationRow) => {
    if (row.hexagram_original?.name) return row.hexagram_original.name
    return row.hexagram_name || '-'
  }

  const getChangedHexagramDisplayName = (row: DivinationRow) => {
    if (row.hexagram_changed?.name) return row.hexagram_changed.name
    return row.changed_hexagram_name || '-'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Shield size={24} className="text-primary-600" />
          {t('title')}
        </h1>
        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showAdminPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {t('adminManagement')}
        </button>
      </div>

      {/* Admin Management Panel */}
      {showAdminPanel && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus size={18} />
            {t('adminManagement')}
          </h2>

          {/* Add admin */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="email"
              value={newAdminEmail}
              onChange={e => setNewAdminEmail(e.target.value)}
              placeholder={t('adminEmailPlaceholder')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button
              onClick={handleAddAdmin}
              disabled={adminLoading || !newAdminEmail.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {adminLoading ? <Loader2 size={14} className="animate-spin" /> : t('addAdmin')}
            </button>
          </div>

          {/* Admin list */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('adminList')}</h3>
            {admins.map(admin => (
              <div
                key={admin.id}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">{admin.email}</span>
                  {admin.is_initial && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                      {t('initialBadge')}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveAdmin(admin.id)}
                  disabled={admin.is_initial || adminLoading}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title={admin.is_initial ? t('initialCannotRemove') : t('removeAdmin')}
                >
                  <UserMinus size={14} />
                  {t('remove')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder={t('searchByEmail')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button onClick={handleSearch} className="p-2 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            <Search size={16} className="text-primary-600" />
          </button>
          {searchEmail && (
            <button onClick={handleClearSearch} className="p-2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {(['all', 'public', 'private'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setPublicFilter(f); setPage(1) }}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                publicFilter === f
                  ? 'bg-white shadow-sm text-gray-800 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' && t('filterAll')}
              {f === 'public' && t('public')}
              {f === 'private' && t('private')}
            </button>
          ))}
        </div>

        <span className="text-sm text-gray-400 ml-auto">
          {t('totalRecords', { count: totalCount })}
        </span>
      </div>

      {/* Records table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-16">{t('id')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('user')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('question')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('hexagram')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('changedHexagram')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('public')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('createdAt')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-400" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">{t('noRecords')}</td>
                </tr>
              ) : (
                records.map(row => (
                  <>
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{row.id}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate" title={row.user_email}>
                        {row.user_email || row.user_id}
                      </td>
                      <td className="px-4 py-3 text-gray-800 max-w-[200px] truncate" title={row.question}>
                        {row.question}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{getHexagramDisplayName(row)}</td>
                      <td className="px-4 py-3 text-gray-500">{getChangedHexagramDisplayName(row)}</td>
                      <td className="px-4 py-3">
                        {row.is_public ? (
                          <Eye size={16} className="text-green-500" />
                        ) : (
                          <EyeOff size={16} className="text-gray-300" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleExpand(row.id)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                        >
                          {expandedIds.has(row.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {t('detail')}
                        </button>
                      </td>
                    </tr>
                    {expandedIds.has(row.id) && (
                      <tr key={`detail-${row.id}`} className="bg-gray-50 border-b border-gray-200">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-1">{t('interpretationZh')}</h4>
                              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed bg-white rounded-lg p-3 border border-gray-100">
                                {row.interpretation || '-'}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700 mb-1">{t('interpretationEn')}</h4>
                              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed bg-white rounded-lg p-3 border border-gray-100">
                                {row.interpretation_en || '-'}
                              </p>
                            </div>
                            {row.cast_result && (
                              <div className="md:col-span-2">
                                <h4 className="font-medium text-gray-700 mb-1">{t('castResult')}</h4>
                                <pre className="text-gray-600 bg-white rounded-lg p-3 border border-gray-100 overflow-auto text-xs max-h-80">
                                  {typeof row.cast_result === 'string'
                                    ? row.cast_result
                                    : JSON.stringify(row.cast_result, null, 2)}
                                </pre>
                              </div>
                            )}
                            {row.hexagram_original && typeof row.hexagram_original === 'object' && (
                              <div className="md:col-span-2">
                                <h4 className="font-medium text-gray-700 mb-1">{t('hexagramData')}</h4>
                                <pre className="text-gray-600 bg-white rounded-lg p-3 border border-gray-100 overflow-auto text-xs max-h-60">
                                  {JSON.stringify({ original: row.hexagram_original, changed: row.hexagram_changed }, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-500">
            {t('pageInfo', { page, total: totalPages })}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded text-sm transition-colors ${
                    page === pageNum
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
