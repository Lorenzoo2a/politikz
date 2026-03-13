'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { calculerResultats, genererRaisons, genererDetailsCandidat } from '@/lib/matching'
import { candidats, chapitres } from '@/data/quizData'
import Header from '@/components/Header'
import AdPlaceholder from '@/components/AdPlaceholder'
import Link from 'next/link'

export default function ResultatsPage() {
  const router = useRouter()
  const [resultats, setResultats] = useState(null)
  const [copie, setCopie] = useState(false)
  const [animateBars, setAnimateBars] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('politikz_resultats')
    if (stored) setResultats(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (resultats) {
      const timer = setTimeout(() => setAnimateBars(true), 500)
      return () => clearTimeout(timer)
    }
  }, [resultats])

  function copierLien() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopie(true)
      setTimeout(() => setCopie(false), 2000)
    })
  }

  if (!resultats) {
    return (
      <div className="min-h-screen bg-brand flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <span className="material-symbols-outlined text-primary text-4xl mb-4 block">hourglass_empty</span>
          <h2 className="text-white text-xl font-bold mb-2">Chargement...</h2>
          <p className="text-slate-400 text-sm mb-6">Si rien ne se passe, refaites le test</p>
          <Link href="/quiz" className="text-primary underline text-sm">Refaire le test</Link>
        </div>
      </div>
    )
  }

  const premier = resultats[0]
  const raisons = genererRaisons(premier)
  const premierData = candidats.find(c => c.id === premier.candidat.id)
  const premierColor = premierData?.couleur || '#cf2a2a'

  return (
    <div className="min-h-screen bg-brand flex flex-col">
      <Header showShare onShare={copierLien} />

      <div className="flex-1 flex justify-center">
        {/* Left ads desktop */}
        <aside className="hidden xl:flex flex-col items-center gap-5 pt-8 px-4 w-[200px] shrink-0">
          <AdPlaceholder format="rectangle" />
          <AdPlaceholder format="skyscraper" />
        </aside>

        {/* Main content */}
        <main className="flex-1 max-w-xl w-full px-4 py-8">

          {/* Match principal */}
          <section className="text-center mb-10 animate-fade-in">
            <div className="relative inline-block mb-6">
              {/* Animated glow */}
              <div className="absolute inset-[-20px] rounded-full blur-3xl opacity-30 animate-glow-pulse" style={{ background: premierColor }}></div>
              <div className="relative p-1.5 rounded-full animate-float" style={{ background: `linear-gradient(135deg, ${premierColor}, #f97316)` }}>
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-brand relative" style={{ background: `linear-gradient(135deg, ${premierColor}88, ${premierColor}44)` }}>
                  {/* Initials fallback */}
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white">
                    {premier.candidat.prenom[0]}{premier.candidat.nom[0]}
                  </div>
                  {/* Photo */}
                  {premierData?.photo && (
                    <img src={premierData.photo} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 text-white text-sm font-bold px-3.5 py-1.5 rounded-full shadow-lg" style={{ background: premierColor, boxShadow: `0 4px 15px ${premierColor}40` }}>
                {premier.pourcentage}%
              </div>
            </div>

            <h1 className="text-white text-3xl font-black mb-1">
              {premier.candidat.prenom} {premier.candidat.nom}
            </h1>
            <p className="font-semibold text-lg mb-1" style={{ color: premierColor }}>Votre match principal</p>
            <p className="text-slate-500 text-xs mb-3">{premierData?.parti}</p>
            {premierData?.etiquettes && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {premierData.etiquettes.map(tag => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full text-slate-300 border transition-colors hover:text-white cursor-default" style={{ borderColor: `${premierColor}33`, background: `${premierColor}15` }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-slate-400 text-sm max-w-[280px] mx-auto">
              D&apos;après vos réponses sur l&apos;économie, le climat et le social.
            </p>
          </section>

          {/* Pourquoi */}
          <div className="bg-navy-card rounded-xl p-5 border border-accent-red/10 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="flex items-center gap-2 text-white font-bold mb-3">
              <span className="material-symbols-outlined text-accent-red">info</span>
              Pourquoi ?
            </h3>
            <ul className="space-y-3">
              {raisons.map((raison, i) => (
                <li key={i} className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-white/[0.04] transition-all duration-200 cursor-default">
                  <span className="material-symbols-outlined text-accent-red text-lg mt-0.5 icon-fill">check_circle</span>
                  <p className="text-sm text-slate-200">{raison}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile ad */}
          <div className="xl:hidden mb-6">
            <AdPlaceholder format="banner" />
          </div>

          {/* Classement complet */}
          <h3 className="text-white text-lg font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            Classement complet
            <span className="text-slate-500 text-sm font-normal ml-2">12 candidats</span>
          </h3>
          <div className="space-y-3 mb-8">
            {resultats.map((resultat, index) => {
              const fullData = candidats.find(c => c.id === resultat.candidat.id)
              const color = fullData?.couleur || '#1A3A7A'
              const isFirst = index === 0
              const isExpanded = expandedId === resultat.candidat.id
              const details = isExpanded ? genererDetailsCandidat(resultat) : null

              return (
                <div
                  key={resultat.candidat.id}
                  className={`animate-fade-in`}
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  {/* Card header - clickable */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : resultat.candidat.id)}
                    onMouseEnter={() => setHoveredId(resultat.candidat.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`group relative flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 ease-out ${
                      isExpanded
                        ? 'rounded-t-2xl'
                        : 'rounded-2xl'
                    } ${
                      isFirst
                        ? 'bg-navy-card border-2 border-accent-red/30 hover:border-accent-red/60 hover:shadow-xl hover:shadow-accent-red/15'
                        : 'bg-navy-card/40 border border-white/5 hover:bg-navy-card hover:border-white/15 hover:shadow-lg hover:shadow-white/5'
                    } ${
                      isExpanded ? '' : 'hover:scale-[1.01]'
                    } ${
                      isExpanded && isFirst ? 'border-b-0 rounded-b-none' : ''
                    } ${
                      isExpanded && !isFirst ? 'border-b-0 rounded-b-none' : ''
                    }`}
                  >
                    {/* Rank */}
                    <span className={`font-black text-lg w-6 text-center shrink-0 transition-colors duration-300 ${
                      isFirst ? 'text-accent-red' : index < 3 ? 'text-slate-400' : 'text-slate-600 group-hover:text-slate-400'
                    }`}>
                      {index + 1}
                    </span>

                    {/* Avatar with photo */}
                    <div
                      className={`relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                        isFirst ? 'border-accent-red/40 group-hover:border-accent-red' : 'border-white/10 group-hover:border-white/30'
                      } ${index > 4 ? 'grayscale-[50%] group-hover:grayscale-0' : ''}`}
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}66)` }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        {resultat.candidat.prenom[0]}{resultat.candidat.nom[0]}
                      </div>
                      {fullData?.photo && (
                        <img src={fullData.photo} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                      )}
                    </div>

                    {/* Info + progress bar */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">
                        {resultat.candidat.prenom} {resultat.candidat.nom}
                      </p>
                      <p className="text-slate-400 text-xs truncate transition-colors duration-300 group-hover:text-slate-300">
                        {resultat.candidat.parti}
                      </p>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: animateBars ? `${resultat.pourcentage}%` : '0%',
                            background: isFirst
                              ? 'linear-gradient(90deg, #cf2a2a, #f97316)'
                              : `linear-gradient(90deg, ${color}, ${color}88)`,
                            transitionDelay: `${0.3 + index * 0.1}s`
                          }}
                        />
                      </div>
                    </div>

                    {/* Percentage + expand icon */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`font-black text-lg transition-all duration-300 ${
                        isFirst ? 'text-accent-red group-hover:text-orange-400' : 'text-slate-300 group-hover:text-white'
                      }`}>
                        {resultat.pourcentage}%
                      </span>
                      <span className={`material-symbols-outlined text-slate-500 text-[20px] transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : 'group-hover:text-slate-300'
                      }`}>
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  <div className={`overflow-hidden transition-all duration-400 ease-out ${
                    isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className={`px-4 pb-4 pt-0 rounded-b-2xl ${
                      isFirst
                        ? 'bg-navy-card border-2 border-t-0 border-accent-red/30'
                        : 'bg-navy-card/40 border border-t-0 border-white/5'
                    }`}>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4 pt-3">
                        {fullData?.etiquettes?.map((tag) => (
                          <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full text-slate-300 border whitespace-nowrap" style={{ borderColor: `${color}44`, background: `${color}18` }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {details && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Points d'accord */}
                          {details.accords.length > 0 && (
                            <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-xl p-3">
                              <h4 className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-2.5">
                                <span className="material-symbols-outlined text-[16px] icon-fill">thumb_up</span>
                                Points d&apos;accord
                              </h4>
                              <ul className="space-y-1.5">
                                {details.accords.map(a => (
                                  <li key={a.nom} className="flex items-center justify-between text-xs">
                                    <span className="text-slate-300">{a.emoji} {a.nom}</span>
                                    <span className="text-emerald-400 font-bold">{a.pourcentage}%</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {/* Points de désaccord */}
                          {details.desaccords.length > 0 && (
                            <div className="bg-red-500/[0.06] border border-red-500/15 rounded-xl p-3">
                              <h4 className="flex items-center gap-1.5 text-red-400 text-xs font-bold mb-2.5">
                                <span className="material-symbols-outlined text-[16px] icon-fill">thumb_down</span>
                                Points de désaccord
                              </h4>
                              <ul className="space-y-1.5">
                                {details.desaccords.map(d => (
                                  <li key={d.nom} className="flex items-center justify-between text-xs">
                                    <span className="text-slate-300">{d.emoji} {d.nom}</span>
                                    <span className="text-red-400 font-bold">{d.pourcentage}%</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {/* Si ni accords forts ni desaccords forts */}
                          {details.accords.length === 0 && details.desaccords.length === 0 && (
                            <div className="sm:col-span-2 text-center text-slate-500 text-xs py-2">
                              Positions mitigées sur la plupart des thèmes
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Partage */}
          <div className="bg-navy-card border border-white/10 rounded-2xl p-6 text-center mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-white text-xl font-bold mb-2">Partagez votre résultat</h3>
            <p className="text-slate-400 text-sm mb-5 px-4">
              Comparez vos convictions avec vos amis en partageant ce test.
            </p>
            <button
              onClick={copierLien}
              className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-lg shadow-primary/20 mb-4"
            >
              <span className="material-symbols-outlined text-[20px]">link</span>
              {copie ? 'Lien copié !' : 'Copier le lien unique'}
            </button>
            <div className="flex gap-3 justify-center">
              <button className="bg-white/10 p-3 rounded-full border border-white/10 text-white hover:bg-white/20 hover:border-white/20 hover:scale-110 hover:shadow-lg transition-all duration-200 active:scale-95">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>
              <button className="bg-white/10 p-3 rounded-full border border-white/10 text-white hover:bg-white/20 hover:border-white/20 hover:scale-110 hover:shadow-lg transition-all duration-200 active:scale-95">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </button>
            </div>
          </div>

          {/* Large ad */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <AdPlaceholder format="billboard" />
          </div>

          {/* Refaire le test */}
          <Link href="/quiz" className="block mb-8">
            <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] hover:shadow-lg group">
              <span className="material-symbols-outlined text-[20px] transition-transform duration-500 group-hover:rotate-180">refresh</span>
              Refaire le test
            </button>
          </Link>

          {/* Mobile ad bottom */}
          <div className="xl:hidden mb-6">
            <AdPlaceholder format="banner" />
          </div>

          {/* Disclaimer */}
          <p className="text-slate-500 text-[10px] text-center leading-relaxed italic pb-4">
            Ce test ne constitue pas un conseil de vote. Il est un outil pédagogique basé sur les programmes officiels de 2022 et ne reflète pas nécessairement l&apos;évolution actuelle du paysage politique.
          </p>
        </main>

        {/* Right ads desktop */}
        <aside className="hidden xl:flex flex-col items-center gap-5 pt-8 px-4 w-[200px] shrink-0">
          <AdPlaceholder format="rectangle" />
          <AdPlaceholder format="skyscraper" />
        </aside>
      </div>
    </div>
  )
}
