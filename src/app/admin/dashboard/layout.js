'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { href: '/admin/dashboard',           label: 'Dashboard',  icon: 'bar_chart' },
  { href: '/admin/dashboard/questions', label: 'Questions',  icon: 'quiz'      },
]

export default function AdminDashboardLayout({ children }) {
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!sessionStorage.getItem('politikz_admin_token')) router.replace('/admin')
  }, [])

  function logout() {
    sessionStorage.removeItem('politikz_admin_token')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen" style={{ background: '#060e22' }}>

      {/* ── Top navigation bar ─────────────────────────────── */}
      <header className="sticky top-0 z-30"
        style={{ background: '#07112a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">

          {/* Logo + badge */}
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Politikz" className="h-5 w-auto" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
              Admin
            </span>
          </Link>

          <div className="w-px h-5 shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Nav links */}
          <nav className="flex items-center gap-0.5">
            {NAV.map(({ href, label, icon }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active ? '' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                  style={active ? { background: 'rgba(16,185,129,0.12)', color: '#10b981' } : {}}>
                  <span className="material-symbols-outlined text-[16px]">{icon}</span>
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="flex-1" />

          <Link href="/" target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]">
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            Voir le site
          </Link>
          <button onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all text-slate-500 hover:text-red-400 hover:bg-red-400/[0.06]">
            <span className="material-symbols-outlined text-[14px]">logout</span>
            Déconnexion
          </button>
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6">
        {children}
      </main>
    </div>
  )
}
