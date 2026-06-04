'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Menu, X, Coins, History, Network, User as UserIcon, LogOut, Globe } from 'lucide-react'

export default function Navbar() {
  const t = useTranslations('nav')
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setUsername('')
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('username').eq('id', userId).single()
    if (data?.username) setUsername(data.username)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const switchLocale = (locale: string) => {
    // Set cookie and reload
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`
    window.location.reload()
  }

  const navLinks = [
    { href: '/divination', label: t('divination'), icon: Coins },
    { href: '/records', label: t('records'), icon: History },
    { href: '/network', label: t('network'), icon: Network },
  ]

  return (
    <nav className="bg-white border-b border-sky-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">☯</span>
            <span className="text-xl font-bold text-primary-800">{t('brand')}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                  <UserIcon size={18} />
                  <span className="text-sm">{username || user.email?.split('@')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title={t('logout')}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm">
                {t('login')}
              </Link>
            )}

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors"
                title={t('language')}
              >
                <Globe size={16} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 min-w-[80px]">
                  <button onClick={() => switchLocale('zh')} className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-sky-50">中文</button>
                  <button onClick={() => switchLocale('en')} className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-sky-50">English</button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-sky-100 pt-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary-50"
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:bg-primary-50">
                  <UserIcon size={18} />
                  <span>{t('profile')}</span>
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="flex items-center space-x-2 px-4 py-3 text-red-500 hover:bg-red-50 w-full">
                  <LogOut size={18} />
                  <span>{t('logout')}</span>
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3">
                <span className="btn-primary text-sm inline-block">{t('login')}</span>
              </Link>
            )}
            {/* Mobile lang switch */}
            <div className="flex space-x-2 px-4 py-3">
              <button onClick={() => switchLocale('zh')} className="text-sm text-gray-500 hover:text-primary-600">中文</button>
              <button onClick={() => switchLocale('en')} className="text-sm text-gray-500 hover:text-primary-600">English</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}