'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import ManageCookiesButton from '@/components/ManageCookiesButton'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [testCount, setTestCount] = useState(null)
  const [displayCount, setDisplayCount] = useState(0)
  const [election, setElection] = useState('2027')
  const animFrameRef = useRef(null)

  useEffect(() => {
    supabase
      .from('resultats')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => { if (count) setTestCount(count) })

    // Track return visits (user already did the quiz and comes back)
    if (localStorage.getItem('politikz_share_id') && !sessionStorage.getItem('pz_return_tracked')) {
      sessionStorage.setItem('pz_return_tracked', '1')
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'return_visit' }) }).catch(() => {})
    }
  }, [])

  // Animate counter when testCount loads
  useEffect(() => {
    if (!testCount) return
    const duration = 1400
    let startTs = null
    const step = (ts) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayCount(Math.floor(eased * testCount))
      if (progress < 1) animFrameRef.current = requestAnimationFrame(step)
    }
    animFrameRef.current = requestAnimationFrame(step)
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current) }
  }, [testCount])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        {/* Main content */}
        <main className="w-full max-w-md px-5 py-12 flex flex-col items-center">
          {/* Hero */}
          <div className="w-full text-center mb-8 animate-fade-in">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Politikz" className="w-52 md:w-64 h-auto" />
            </div>

            {/* Sélecteur d'élection */}
            <div className="inline-flex items-center p-1 bg-white/[0.06] border border-white/10 rounded-xl mb-5">
              {[
                { id: '2027', label: '2027', badge: 'Projection' },
                { id: '2022', label: '2022', badge: 'Archive' },
              ].map(e => (
                <button
                  key={e.id}
                  onClick={() => setElection(e.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    election === e.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">how_to_vote</span>
                  {e.label}
                  <span className={`text-[9px] font-black tracking-widest uppercase ${election === e.id ? 'text-white/70' : 'text-slate-600'}`}>{e.badge}</span>
                </button>
              ))}
            </div>

            <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
              Découvrez votre{' '}
              <span className="text-primary italic">match</span>{' '}
              politique
            </h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-sm mx-auto">
              {election === '2027'
                ? 'Comparez vos convictions avec les positions des 12 candidats pressentis pour 2027.'
                : 'Comparez vos convictions avec les programmes officiels des 12 candidats de 2022.'}
            </p>
          </div>

          {/* CTA */}
          <div className="w-full space-y-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <Link href={`/quiz?election=${election}`}>
              <button className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-5 rounded-xl text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] cursor-pointer group">
                Test complet — 100 questions
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </Link>
            <Link href={`/quiz?mode=rapide&election=${election}`}>
              <button className="w-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold py-4 rounded-xl text-base border border-white/10 hover:border-primary/30 shadow-md hover:shadow-lg hover:shadow-primary/10 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] cursor-pointer group mt-3">
                <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                Quiz rapide — 30 questions
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </Link>
            <div className="text-center space-y-1 mt-2">
              <div className="flex items-center justify-center gap-4 text-slate-300 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>10–15 min</span>
                </div>
                <span className="text-slate-600">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">bolt</span>
                  <span>~5 min</span>
                </div>
              </div>

              {/* Social counter */}
              {testCount !== null && (
                <p className="text-slate-500 text-xs flex items-center justify-center gap-1.5 mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-slate-300 font-semibold">{displayCount.toLocaleString('fr-FR')}</span> personnes ont déjà fait le test
                </p>
              )}

              <p className="text-slate-400 text-xs italic">
                5 choix par question, résultat instantané.
              </p>
            </div>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-white/5">
        <div className="max-w-xs mx-auto text-center">
          <p className="text-slate-500 text-[10px] leading-relaxed uppercase tracking-widest font-medium">
            Ce test ne constitue pas un conseil de vote. Politikz est une plateforme indépendante non-partisane.
          </p>
          <div className="mt-3 flex justify-center gap-4 text-slate-400">
            <Link href="/methodologie" className="text-[10px] hover:text-white transition-colors">Méthodologie</Link>
            <Link href="/mentions-legales" className="text-[10px] hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/politique-de-confidentialite" className="text-[10px] hover:text-white transition-colors">Confidentialité</Link>
            <ManageCookiesButton />
          </div>
        </div>
      </footer>
    </div>
  )
}
