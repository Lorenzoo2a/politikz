'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (sessionStorage.getItem('politikz_admin_token')) {
      router.replace('/admin/dashboard')
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        const { token } = await res.json()
        sessionStorage.setItem('politikz_admin_token', token)
        router.push('/admin/dashboard')
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Politikz" className="w-40 h-auto mx-auto mb-8" />
        <div className="bg-navy-card border border-white/10 rounded-2xl p-8">
          <h1 className="text-white text-xl font-bold mb-1">Espace admin</h1>
          <p className="text-slate-500 text-sm mb-6">Accès restreint</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 text-sm"
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 text-sm"
            />
            {error && (
              <p className="text-accent-red text-xs">Mot de passe incorrect.</p>
            )}
            <button
              type="submit"
              disabled={loading || !password || !username}
              className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Vérification…' : 'Accéder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
