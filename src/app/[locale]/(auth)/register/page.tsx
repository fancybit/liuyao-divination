'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const t = useTranslations('auth.register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error(t('passwordMin'))
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(t('success'))
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-center text-primary-800 mb-6">{t('title')}</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('username')}</label>
            <input type="text" className="input-field" value={username} onChange={e => setUsername(e.target.value)} placeholder={t('usernamePlaceholder')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('loading') : t('submit')}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          {t('hasAccount')}<Link href="/login" className="text-primary-600 hover:underline">{t('login')}</Link>
        </p>
      </div>
    </div>
  )
}