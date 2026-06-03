'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { UserProfile, DivinationRecord } from '@/types'
import { useRouter } from 'next/navigation'
import { Loader2, User, Calendar, Activity, Coins } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [records, setRecords] = useState<DivinationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push('/login')
        return
      }
      loadProfile(session.user.id)
    })
  }, [])

  const loadProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    const { data: records } = await supabase
      .from('divination_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (profile) {
      setProfile(profile)
      setBio(profile.bio || '')
    }
    setRecords(records || [])
    setLoading(false)
  }

  const handleSaveBio = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    const { error } = await supabase
      .from('profiles')
      .update({ bio, updated_at: new Date().toISOString() })
      .eq('id', session.user.id)

    if (error) {
      toast.error('保存失败')
    } else {
      toast.success('简介已更新')
      setEditing(false)
      setProfile(prev => prev ? { ...prev, bio } : null)
    }
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
      {/* Profile header */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="text-primary-600" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{profile?.username || '用户'}</h1>
            <p className="text-gray-500 text-sm flex items-center">
              <Calendar size={14} className="mr-1" />
              加入于 {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('zh-CN') : '-'}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="border-t border-amber-100 pt-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">个人简介</label>
          {editing ? (
            <div className="flex space-x-2">
              <input
                type="text"
                className="input-field flex-1"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="写一句话介绍自己..."
              />
              <button onClick={handleSaveBio} className="btn-primary text-sm">保存</button>
              <button onClick={() => setEditing(false)} className="btn-outline text-sm">取消</button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-600">{profile?.bio || '这个人很懒，什么都没写...'}</p>
              <button onClick={() => setEditing(true)} className="text-sm text-primary-600 hover:underline">编辑</button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <Coins className="mx-auto text-primary-500 mb-2" size={24} />
          <p className="text-2xl font-bold text-primary-700">{profile?.total_divinations || 0}</p>
          <p className="text-sm text-gray-500">总占卜次数</p>
        </div>
        <div className="card text-center">
          <Activity className="mx-auto text-primary-500 mb-2" size={24} />
          <p className="text-2xl font-bold text-primary-700">{records.filter(r => r.is_public).length}</p>
          <p className="text-sm text-gray-500">公开记录</p>
        </div>
        <div className="card text-center">
          <Calendar className="mx-auto text-primary-500 mb-2" size={24} />
          <p className="text-2xl font-bold text-primary-700">
            {records.length > 0
              ? Math.ceil((Date.now() - new Date(records[records.length - 1].created_at).getTime()) / (1000 * 60 * 60 * 24))
              : 0}
          </p>
          <p className="text-sm text-gray-500">距离首次占卜(天)</p>
        </div>
      </div>

      {/* Recent records */}
      <h2 className="text-xl font-bold text-primary-800 mb-4">最近占卜</h2>
      {records.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">暂无占卜记录</div>
      ) : (
        <div className="space-y-3">
          {records.slice(0, 5).map(record => (
            <div key={record.id} className="card flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{record.hexagram_original?.symbol || '☯'}</span>
                <div>
                  <p className="font-medium text-gray-800">{record.hexagram_original?.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(record.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{record.is_public ? '公开' : '私密'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}