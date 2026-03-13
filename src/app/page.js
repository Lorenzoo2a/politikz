'use client'
import Link from 'next/link'
import Header from '@/components/Header'
import AdPlaceholder from '@/components/AdPlaceholder'

export default function Home() {
  return (
    <div className="min-h-screen bg-brand flex flex-col">
      <Header />

      {/* Desktop: 3-column layout */}
      <div className="flex-1 flex justify-center">
        {/* Left ad column - desktop only */}
        <aside className="hidden xl:flex flex-col items-center gap-6 pt-12 px-6 w-[200px] shrink-0">
          <AdPlaceholder format="rectangle" />
          <AdPlaceholder format="halfpage" />
        </aside>

        {/* Main content */}
        <main className="flex-1 max-w-2xl px-5 py-10 flex flex-col items-center">
          {/* Hero */}
          <div className="w-full max-w-lg text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-red/15 text-accent-red rounded-full text-[10px] font-bold tracking-widest uppercase mb-5 border border-accent-red/20">
              <span className="material-symbols-outlined text-xs">how_to_vote</span>
              Élections 2022
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-5">
              Découvrez votre{' '}
              <span className="text-primary italic">match</span>{' '}
              politique
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-sm mx-auto">
              Comparez vos convictions avec les programmes officiels des 12 candidats.
            </p>
          </div>

          {/* CTA */}
          <div className="w-full max-w-md space-y-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <Link href="/quiz">
              <button className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-5 rounded-xl text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] cursor-pointer group">
                Test complet — 100 questions
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </Link>
            <Link href="/quiz?mode=rapide">
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
              <p className="text-slate-400 text-xs italic">
                5 choix par question, résultat instantané.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="w-full max-w-md mt-14 grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: 'quiz', label: '2 modes', sub: '100 ou 30 questions' },
              { icon: 'groups', label: '12 candidats', sub: 'Présidentielle 2022' },
              { icon: 'share', label: 'Partageable', sub: 'Lien unique' },
            ].map((stat) => (
              <div key={stat.icon} className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-primary/20 hover:scale-[1.06] hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-default">
                <span className="material-symbols-outlined text-primary text-2xl mb-2 block">{stat.icon}</span>
                <p className="text-white text-xs font-semibold">{stat.label}</p>
                <p className="text-slate-500 text-[10px]">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Mobile ad */}
          <div className="w-full max-w-md mt-10 lg:hidden">
            <AdPlaceholder format="banner" />
          </div>

          {/* Large ad */}
          <div className="w-full max-w-lg mt-10 animate-fade-in" style={{ animationDelay: '0.45s' }}>
            <AdPlaceholder format="billboard" />
          </div>
        </main>

        {/* Right ad column - desktop only */}
        <aside className="hidden xl:flex flex-col items-center gap-6 pt-12 px-6 w-[200px] shrink-0">
          <AdPlaceholder format="rectangle" />
          <AdPlaceholder format="halfpage" />
        </aside>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-white/5">
        <div className="max-w-xs mx-auto text-center">
          <p className="text-slate-500 text-[10px] leading-relaxed uppercase tracking-widest font-medium">
            Ce test ne constitue pas un conseil de vote. Politikz est une plateforme indépendante non-partisane.
          </p>
          <div className="mt-3 flex justify-center gap-4 text-slate-400">
            <span className="text-[10px] hover:text-white cursor-pointer transition-colors">Mentions légales</span>
            <span className="text-[10px] hover:text-white cursor-pointer transition-colors">Confidentialité</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
