'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { calculerResultats, genererRaisons, genererDetailsCandidat } from '@/lib/matching'
import { candidats, chapitres, questions as allQuestions } from '@/data/quizData'
import Header from '@/components/Header'
import Link from 'next/link'
import AdUnit from '@/components/AdUnit'
import { supabase } from '@/lib/supabase'

function calculerCompatibilite(resA, resB) {
  const mapB = {}
  resB.forEach(r => { mapB[r.candidat.id] = r.pourcentage })
  let total = 0, count = 0
  resA.forEach(r => {
    if (mapB[r.candidat.id] !== undefined) {
      total += Math.abs(r.pourcentage - mapB[r.candidat.id])
      count++
    }
  })
  return count > 0 ? Math.round(100 - total / count) : 0
}

function compatColor(score) {
  if (score >= 65) return '#10b981'
  if (score >= 45) return '#f59e0b'
  return '#cf2a2a'
}

function compatLabel(score) {
  if (score >= 70) return 'Très compatibles'
  if (score >= 55) return 'Plutôt compatibles'
  if (score >= 40) return 'Peu compatibles'
  return 'Profils opposés'
}

const CHOIX_META = {
  2:  { label: 'Fort pour',   color: '#10b981', icon: 'done_all' },
  1:  { label: 'Pour',        color: '#34d399', icon: 'thumb_up' },
  0:  { label: 'Neutre',      color: '#64748b', icon: 'remove' },
  '-1': { label: 'Contre',    color: '#f87171', icon: 'thumb_down' },
  '-2': { label: 'Fort contre', color: '#ef4444', icon: 'close' },
}

function ChoixBadge({ value, who }) {
  const c = CHOIX_META[value] ?? CHOIX_META[0]
  return (
    <span title={`${who} : ${c.label}`}
      className="w-6 h-6 rounded flex items-center justify-center shrink-0"
      style={{ background: `${c.color}22` }}>
      <span className="material-symbols-outlined icon-fill text-[13px]" style={{ color: c.color }}>{c.icon}</span>
    </span>
  )
}

async function fetchResultatById(shareId) {
  const { data, error } = await supabase
    .from('resultats')
    .select('reponses')
    .eq('share_id', shareId)
    .single()
  if (error || !data?.reponses) return null
  return { resultats: calculerResultats(data.reponses), reponses: data.reponses }
}

function ResultatsContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id
  const compareId = searchParams.get('compare')

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isOwnResult, setIsOwnResult] = useState(false)
  const [shareSaved, setShareSaved] = useState(true)
  const [resultats, setResultats] = useState(null)
  const [friendResultats, setFriendResultats] = useState(null)
  const [myResultats, setMyResultats] = useState(null)
  const [friendReponses, setFriendReponses] = useState(null)
  const [myReponses, setMyReponses] = useState(null)
  const [animateBars, setAnimateBars] = useState(false)
  const [copie, setCopie] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [expandedChapter, setExpandedChapter] = useState(null)

  useEffect(() => { loadData() }, [id, compareId])

  useEffect(() => {
    if (resultats) {
      const t = setTimeout(() => setAnimateBars(true), 500)
      return () => clearTimeout(t)
    }
  }, [resultats])

  async function loadData() {
    setLoading(true)
    try {
      const myShareId = localStorage.getItem('politikz_share_id')
      const isOwn = myShareId === id
      setIsOwnResult(isOwn)

      if (isOwn) {
        setShareSaved(localStorage.getItem('politikz_share_saved') !== 'false')
        const stored = localStorage.getItem('politikz_resultats')
        if (stored) setResultats(JSON.parse(stored))
        const myRep = localStorage.getItem('politikz_reponses')
        if (myRep) setMyReponses(JSON.parse(myRep))
        if (compareId) {
          const friend = await fetchResultatById(compareId)
          if (friend) {
            setFriendResultats(friend.resultats)
            setFriendReponses(friend.reponses)
          }
        }
      } else {
        const res = await fetchResultatById(id)
        if (!res) { setNotFound(true); setLoading(false); return }
        setResultats(res.resultats)
        setFriendReponses(res.reponses)
        const myStored = localStorage.getItem('politikz_resultats')
        if (myStored) setMyResultats(JSON.parse(myStored))
        const myRep = localStorage.getItem('politikz_reponses')
        if (myRep) setMyReponses(JSON.parse(myRep))
      }
    } catch (err) {
      console.error('Erreur loadData:', err)
      setNotFound(true)
    }
    setLoading(false)
  }

  function copierLien() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopie(true)
      setTimeout(() => setCopie(false), 2000)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <span className="material-symbols-outlined text-primary text-4xl mb-4 block">hourglass_empty</span>
          <h2 className="text-white text-xl font-bold mb-2">Chargement…</h2>
        </div>
      </div>
    )
  }

  if (notFound || !resultats) {
    return (
      <div className="min-h-screen bg-brand flex items-center justify-center">
        <div className="text-center animate-fade-in px-4">
          <span className="material-symbols-outlined text-accent-red text-4xl mb-4 block">link_off</span>
          <h2 className="text-white text-xl font-bold mb-2">Résultat introuvable</h2>
          <p className="text-slate-400 text-sm mb-6">Ce lien a expiré (1 mois) ou n'existe pas.</p>
          <Link href="/quiz" className="text-primary underline text-sm">Faire le test</Link>
        </div>
      </div>
    )
  }

  const premier = resultats[0]
  const raisons = genererRaisons(premier)

  // Precomputed O(1) lookups — avoids candidats.find() inside every render loop
  const candidatsMap = new Map(candidats.map(c => [c.id, c]))
  // myResMap / friendResMap adapt to own-result vs shared-result context
  const myResMap = new Map((isOwnResult ? resultats : myResultats || []).map(r => [r.candidat.id, r]))
  const friendResMap = new Map((isOwnResult ? friendResultats || [] : resultats).map(r => [r.candidat.id, r]))

  const premierData = candidatsMap.get(premier.candidat.id)
  const premierColor = premierData?.couleur || '#cf2a2a'

  const compat = (isOwnResult && friendResultats)
    ? calculerCompatibilite(resultats, friendResultats)
    : (!isOwnResult && myResultats)
    ? calculerCompatibilite(myResultats, resultats)
    : null

  const myPremier = isOwnResult ? premier : myResultats?.[0]
  const friendPremier = isOwnResult ? friendResultats?.[0] : resultats[0]

  // Renders the dual-bar comparison rows (shared between own+compare and friend views)
  function renderBars(topResults) {
    return topResults.slice(0, 5).map(r => {
      const me = myResMap.get(r.candidat.id)
      const friend = friendResMap.get(r.candidat.id)
      if (!me || !friend) return null
      const col = candidatsMap.get(r.candidat.id)?.couleur || '#1A3A7A'
      return (
        <div key={r.candidat.id} className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-white text-xs font-semibold">{r.candidat.prenom} {r.candidat.nom}</p>
            <span className="text-[10px] text-slate-500">{Math.abs(me.pourcentage - friend.pourcentage)}% d'écart</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-6 text-right shrink-0">Moi</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: animateBars ? `${me.pourcentage}%` : '0%', background: col }} />
              </div>
              <span className="text-[10px] text-white font-bold w-8 shrink-0">{me.pourcentage}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-6 text-right shrink-0">Ami</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: animateBars ? `${friend.pourcentage}%` : '0%', background: `${col}88` }} />
              </div>
              <span className="text-[10px] text-white font-bold w-8 shrink-0">{friend.pourcentage}%</span>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="min-h-screen bg-brand flex flex-col">
      <Header showShare={isOwnResult} onShare={copierLien} />

      <div className="flex-1 flex justify-center">
        <main className="flex-1 max-w-xl w-full px-4 py-8">

          {/* ── Je visite la page d'un ami ── */}
          {!isOwnResult && (
            <div className="bg-navy-card border border-primary/25 rounded-2xl p-5 mb-8 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                <p className="text-white font-bold text-sm">Résultat partagé</p>
              </div>

              {compat !== null ? (
                <>
                  <p className="text-slate-400 text-xs mb-4">Voici votre compatibilité politique avec cette personne.</p>
                  <div className="text-center py-2 mb-4">
                    <div className="text-6xl font-black mb-1" style={{ color: compatColor(compat) }}>
                      {compat}%
                    </div>
                    <p className="text-slate-400 text-sm font-medium">{compatLabel(compat)}</p>
                  </div>
                  {myPremier && friendPremier && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white/[0.05] rounded-xl p-3 text-center border border-white/10">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Moi</p>
                        <p className="text-white text-xs font-bold leading-tight">{myPremier.candidat.prenom} {myPremier.candidat.nom}</p>
                        <p className="font-black mt-1 text-sm" style={{ color: compatColor(compat) }}>{myPremier.pourcentage}%</p>
                      </div>
                      <div className="bg-white/[0.05] rounded-xl p-3 text-center border border-white/10">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Ami·e</p>
                        <p className="text-white text-xs font-bold leading-tight">{friendPremier.candidat.prenom} {friendPremier.candidat.nom}</p>
                        <p className="font-black mt-1 text-sm" style={{ color: compatColor(compat) }}>{friendPremier.pourcentage}%</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">{renderBars(resultats)}</div>
                </>
              ) : (
                <>
                  <p className="text-slate-400 text-xs mb-4">Fais le test pour découvrir votre compatibilité politique !</p>
                  <div className="flex gap-2">
                    <Link href={`/quiz?compare=${id}`} className="flex-1">
                      <button className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[0.97]">
                        Test complet
                      </button>
                    </Link>
                    <Link href={`/quiz?mode=rapide&compare=${id}`} className="flex-1">
                      <button className="w-full bg-white/[0.07] hover:bg-white/[0.12] text-white font-semibold py-3 rounded-xl text-sm border border-white/10 transition-all active:scale-[0.97]">
                        Quiz rapide
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Mon résultat + compatibilité ami ── */}
          {isOwnResult && friendResultats && compat !== null && (
            <div className="bg-navy-card border border-primary/25 rounded-2xl p-5 mb-8 animate-fade-in">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">compare_arrows</span>
                Compatibilité avec votre ami·e
              </h2>
              <div className="text-center py-2 mb-4">
                <div className="text-6xl font-black mb-1" style={{ color: compatColor(compat) }}>
                  {compat}%
                </div>
                <p className="text-slate-400 text-sm font-medium">{compatLabel(compat)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white/[0.05] rounded-xl p-3 text-center border border-white/10">
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Moi</p>
                  <p className="text-white text-xs font-bold leading-tight">{premier.candidat.prenom} {premier.candidat.nom}</p>
                  <p className="font-black mt-1 text-sm" style={{ color: compatColor(compat) }}>{premier.pourcentage}%</p>
                </div>
                <div className="bg-white/[0.05] rounded-xl p-3 text-center border border-white/10">
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">Ami·e</p>
                  <p className="text-white text-xs font-bold leading-tight">{friendResultats[0].candidat.prenom} {friendResultats[0].candidat.nom}</p>
                  <p className="font-black mt-1 text-sm" style={{ color: compatColor(compat) }}>{friendResultats[0].pourcentage}%</p>
                </div>
              </div>
              <div className="space-y-2">{renderBars(resultats)}</div>
            </div>
          )}

          {/* ── Match principal ── */}
          <section className="text-center mb-10 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-[-20px] rounded-full blur-3xl opacity-30 animate-glow-pulse" style={{ background: premierColor }}></div>
              <div className="relative p-1.5 rounded-full animate-float" style={{ background: `linear-gradient(135deg, ${premierColor}, #f97316)` }}>
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-brand relative" style={{ background: `linear-gradient(135deg, ${premierColor}88, ${premierColor}44)` }}>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white">
                    {premier.candidat.prenom[0]}{premier.candidat.nom[0]}
                  </div>
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
            <p className="font-semibold text-lg mb-1" style={{ color: premierColor }}>
              {isOwnResult ? 'Votre match principal' : 'Son match principal'}
            </p>
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
              D&apos;après {isOwnResult ? 'vos' : 'ses'} réponses sur l&apos;économie, le climat et le social.
            </p>
          </section>

          {/* ── Pourquoi ── */}
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

          <AdUnit slot="7759880253" className="my-6" />

          {/* ── Classement complet ── */}
          <h3 className="text-white text-lg font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            Classement complet
            <span className="text-slate-500 text-sm font-normal ml-2">12 candidats</span>
          </h3>
          <div className="space-y-3 mb-8">
            {resultats.map((resultat, index) => {
              const fullData = candidatsMap.get(resultat.candidat.id)
              const color = fullData?.couleur || '#1A3A7A'
              const isFirst = index === 0
              const isExpanded = expandedId === resultat.candidat.id
              const details = isExpanded ? genererDetailsCandidat(resultat) : null

              return (
                <div key={resultat.candidat.id} className="animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : resultat.candidat.id)}
                    className={`group relative flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 ease-out ${isExpanded ? 'rounded-t-2xl' : 'rounded-2xl'} ${isFirst ? 'bg-navy-card border-2 border-accent-red/30 hover:border-accent-red/60 hover:shadow-xl hover:shadow-accent-red/15' : 'bg-navy-card/40 border border-white/5 hover:bg-navy-card hover:border-white/15 hover:shadow-lg hover:shadow-white/5'} ${isExpanded ? '' : 'hover:scale-[1.01]'} ${isExpanded ? 'border-b-0 rounded-b-none' : ''}`}
                  >
                    <span className={`font-black text-lg w-6 text-center shrink-0 transition-colors duration-300 ${isFirst ? 'text-accent-red' : index < 3 ? 'text-slate-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                      {index + 1}
                    </span>
                    <div className={`relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 transition-all duration-300 ${isFirst ? 'border-accent-red/40 group-hover:border-accent-red' : 'border-white/10 group-hover:border-white/30'} ${index > 4 ? 'grayscale-[50%] group-hover:grayscale-0' : ''}`} style={{ background: `linear-gradient(135deg, ${color}, ${color}66)` }}>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        {resultat.candidat.prenom[0]}{resultat.candidat.nom[0]}
                      </div>
                      {fullData?.photo && (
                        <img src={fullData.photo} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{resultat.candidat.prenom} {resultat.candidat.nom}</p>
                      <p className="text-slate-400 text-xs truncate transition-colors duration-300 group-hover:text-slate-300">{resultat.candidat.parti}</p>
                      <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: animateBars ? `${resultat.pourcentage}%` : '0%', background: isFirst ? 'linear-gradient(90deg, #cf2a2a, #f97316)' : `linear-gradient(90deg, ${color}, ${color}88)`, transitionDelay: `${0.3 + index * 0.1}s` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`font-black text-lg transition-all duration-300 ${isFirst ? 'text-accent-red group-hover:text-orange-400' : 'text-slate-300 group-hover:text-white'}`}>
                        {resultat.pourcentage}%
                      </span>
                      <span className={`material-symbols-outlined text-slate-500 text-[20px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:text-slate-300'}`}>
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className={`overflow-hidden transition-all duration-400 ease-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className={`px-4 pb-4 pt-0 rounded-b-2xl ${isFirst ? 'bg-navy-card border-2 border-t-0 border-accent-red/30' : 'bg-navy-card/40 border border-t-0 border-white/5'}`}>
                      <div className="flex flex-wrap gap-1.5 mb-4 pt-3">
                        {fullData?.etiquettes?.map((tag) => (
                          <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full text-slate-300 border whitespace-nowrap" style={{ borderColor: `${color}44`, background: `${color}18` }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      {details && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* ── Comparaison détaillée ── */}
          {myReponses && friendReponses && (() => {
            let totalCompared = 0, totalAccord = 0
            allQuestions.forEach(q => {
              const m = myReponses[q.id]?.choix
              const f = friendReponses[q.id]?.choix
              if (m !== undefined && f !== undefined && m !== 0 && f !== 0) {
                totalCompared++
                if ((m > 0) === (f > 0)) totalAccord++
              }
            })
            return (
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-lg font-bold">Réponses comparées</h3>
                  <span className="text-xs text-slate-500">{totalAccord}/{totalCompared} en accord</span>
                </div>

                {/* Légende */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {[2,1,0,-1,-2].map(v => {
                    const c = CHOIX_META[v]
                    return (
                      <span key={v} className="flex items-center gap-1 text-[10px] text-slate-400">
                        <span className="w-4 h-4 rounded flex items-center justify-center" style={{ background: `${c.color}22` }}>
                          <span className="material-symbols-outlined icon-fill text-[11px]" style={{ color: c.color }}>{c.icon}</span>
                        </span>
                        {c.label}
                      </span>
                    )
                  })}
                </div>

                {chapitres.map(ch => {
                  const chQuestions = allQuestions.filter(q => q.chapitre === ch.id)
                  const compared = chQuestions.filter(q => {
                    const m = myReponses[q.id]?.choix
                    const f = friendReponses[q.id]?.choix
                    return m !== undefined && f !== undefined
                  })
                  if (compared.length === 0) return null
                  const chAccord = compared.filter(q => {
                    const m = myReponses[q.id]?.choix ?? 0
                    const f = friendReponses[q.id]?.choix ?? 0
                    return m === 0 || f === 0 || (m > 0) === (f > 0)
                  }).length
                  const isOpen = expandedChapter === ch.id
                  return (
                    <div key={ch.id} className="mb-2">
                      <button
                        onClick={() => setExpandedChapter(isOpen ? null : ch.id)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-navy-card/40 border border-white/5 hover:bg-navy-card hover:border-white/10 transition-all"
                      >
                        <span className="text-xs text-slate-300 font-semibold">{ch.emoji} {ch.nom}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">{chAccord}/{compared.length}</span>
                          <span className={`material-symbols-outlined text-slate-500 text-[18px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="mt-1 space-y-1 pl-1">
                          {compared.map(q => {
                            const m = myReponses[q.id]?.choix ?? 0
                            const f = friendReponses[q.id]?.choix ?? 0
                            const agree = m === 0 || f === 0 ? null : (m > 0) === (f > 0)
                            return (
                              <div key={q.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${agree === false ? 'bg-red-500/[0.05] border border-red-500/10' : 'bg-white/[0.02]'}`}>
                                <p className="flex-1 text-[11px] text-slate-300 leading-tight line-clamp-2 min-w-0">{q.texte}</p>
                                <div className="flex items-center gap-1 shrink-0">
                                  <ChoixBadge value={m} who="Moi" />
                                  <ChoixBadge value={f} who="Ami·e" />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })()}

          {/* ── Partage / CTA ── */}
          {isOwnResult ? (
            <div className="bg-navy-card border border-white/10 rounded-2xl p-6 text-center mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-white text-xl font-bold mb-2">Partagez votre résultat</h3>
              {!shareSaved ? (
                <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-4 text-left">
                  <span className="material-symbols-outlined text-amber-400 text-[18px] mt-0.5 shrink-0">warning</span>
                  <p className="text-amber-300 text-xs leading-relaxed">
                    La sauvegarde a échoué — le lien ne fonctionnera pas pour tes amis. Vérifie la console pour plus de détails.
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 text-sm mb-5 px-4">
                  Envoyez ce lien à un ami — il pourra faire le test et voir votre compatibilité politique.
                </p>
              )}
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
          ) : (
            <div className="bg-gradient-to-br from-primary/10 to-navy-card border border-primary/25 rounded-2xl p-6 text-center mb-6 animate-fade-in">
              <span className="material-symbols-outlined text-primary text-3xl mb-3 block">compare_arrows</span>
              <h3 className="text-white text-xl font-bold mb-2">
                {myResultats ? 'Comparer à nouveau' : 'Lance le test pour comparer'}
              </h3>
              <p className="text-slate-400 text-sm mb-5 px-2">
                {myResultats
                  ? 'Refais le test pour une comparaison mise à jour avec cette personne.'
                  : 'Fais le quiz et découvre à quel point vous êtes compatibles politiquement.'}
              </p>
              <Link href={`/quiz?compare=${id}`} className="block mb-3">
                <button className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-lg shadow-primary/25">
                  <span className="material-symbols-outlined text-[20px]">quiz</span>
                  {myResultats ? 'Refaire le test complet' : 'Lancer le test complet'}
                </button>
              </Link>
              <Link href={`/quiz?mode=rapide&compare=${id}`} className="block">
                <button className="w-full bg-white/[0.05] hover:bg-white/[0.10] text-white font-semibold py-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
                  <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
                  Quiz rapide (30 questions)
                </button>
              </Link>
            </div>
          )}

          {isOwnResult && (
            <Link href="/quiz" className="block mb-8">
              <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] hover:shadow-lg group">
                <span className="material-symbols-outlined text-[20px] transition-transform duration-500 group-hover:rotate-180">refresh</span>
                Refaire le test
              </button>
            </Link>
          )}

          <p className="text-slate-500 text-[10px] text-center leading-relaxed italic pb-4">
            Ce test ne constitue pas un conseil de vote. Il est un outil pédagogique basé sur les programmes officiels de 2022 et ne reflète pas nécessairement l&apos;évolution actuelle du paysage politique.
          </p>
        </main>
      </div>
    </div>
  )
}

export default function ResultatsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl">hourglass_empty</span>
      </div>
    }>
      <ResultatsContent />
    </Suspense>
  )
}
