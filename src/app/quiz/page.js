'use client'
import { useState, useCallback, useMemo, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { calculerResultats } from '@/lib/matching'
import { getElectionData, DEFAULT_ELECTION } from '@/data/elections'
import { HINTS } from '@/data/hints'
import { supabase } from '@/lib/supabase'

/**
 * Sélectionne `target` questions depuis le pool complet.
 * Garantit :
 *  - les questions structurantes en priorité (≤40% du total)
 *  - un minimum par chapitre (proportionnel, min 2)
 *  - le reste aléatoirement
 */
function selectionnerQuestionsPool(allQ, chapitres, target) {
  const structurantes = allQ.filter(q => q.structurante)
  const normales = allQ.filter(q => !q.structurante)

  const result = new Set()

  // 1. Questions structurantes — toujours prioritaires (max 40% du total)
  const maxStruct = Math.min(structurantes.length, Math.round(target * 0.4))
  const shuffledStruct = [...structurantes].sort(() => Math.random() - 0.5)
  shuffledStruct.slice(0, maxStruct).forEach(q => result.add(q.id))

  // 2. Minimum par chapitre depuis les normales
  const minPerCh = Math.max(2, Math.floor((target - result.size) * 0.65 / chapitres.length))
  chapitres.forEach(ch => {
    const chNormales = normales.filter(q => q.chapitre === ch.id && !result.has(q.id))
    const shuffled = [...chNormales].sort(() => Math.random() - 0.5)
    shuffled.slice(0, minPerCh).forEach(q => { if (result.size < target) result.add(q.id) })
  })

  // 3. Compléter aléatoirement
  const remaining = allQ.filter(q => !result.has(q.id)).sort(() => Math.random() - 0.5)
  remaining.forEach(q => { if (result.size < target) result.add(q.id) })

  return allQ.filter(q => result.has(q.id)).sort((a, b) => a.id - b.id)
}

// Une couleur par chapitre (9 chapitres)
const CHAPTER_COLORS = ['#f59e0b','#3b82f6','#ec4899','#eab308','#22c55e','#a855f7','#f97316','#14b8a6','#0ea5e9']

const choixOptions = [
  { valeur: 2,  label: "Absolument d'accord",     icon: "check_circle",   colorBtn: "hover:border-emerald-500/50 hover:bg-emerald-500/[0.06]", colorActive: "border-emerald-500/60 bg-emerald-500/10", colorIcon: "text-emerald-500", colorIconBg: "bg-emerald-500/10" },
  { valeur: 1,  label: "Plutôt d'accord",          icon: "thumb_up",       colorBtn: "hover:border-emerald-400/40 hover:bg-emerald-400/[0.04]", colorActive: "border-emerald-400/50 bg-emerald-400/[0.07]", colorIcon: "text-emerald-400", colorIconBg: "bg-emerald-400/10" },
  { valeur: 0,  label: "Neutre",                    icon: "remove",         colorBtn: "hover:border-slate-400/40 hover:bg-white/[0.04]",         colorActive: "border-slate-400/50 bg-white/[0.06]",        colorIcon: "text-slate-400",   colorIconBg: "bg-white/[0.06]" },
  { valeur: -1, label: "Plutôt pas d'accord",       icon: "thumb_down",     colorBtn: "hover:border-red-400/40 hover:bg-red-400/[0.04]",         colorActive: "border-red-400/50 bg-red-400/[0.07]",        colorIcon: "text-red-400",     colorIconBg: "bg-red-400/10" },
  { valeur: -2, label: "Absolument pas d'accord",   icon: "cancel",         colorBtn: "hover:border-red-500/50 hover:bg-red-500/[0.06]",         colorActive: "border-red-500/60 bg-red-500/10",            colorIcon: "text-red-500",     colorIconBg: "bg-red-500/10" },
]

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRapide = searchParams.get('mode') === 'rapide'
  const compareId = searchParams.get('compare')
  const electionId = searchParams.get('election') || DEFAULT_ELECTION
  const electionData = getElectionData(electionId)
  const { chapitres, questions: staticQuestions } = electionData

  // Charger depuis Supabase (admin) pour les deux élections si disponible, sinon fallback statique
  const [baseQuestions, setBaseQuestions] = useState(staticQuestions)
  useEffect(() => {
    setBaseQuestions(staticQuestions)
    fetch(`/api/admin/questions?election=${electionId}`)
      .then(r => r.json())
      .then(json => {
        if (json.ok && json.questions?.length > 0) {
          const idOffset = electionId === '2027' ? 1000 : 0
          const active = json.questions
            .filter(q => q.actif)
            .map(q => {
              const staticQ = staticQuestions.find(sq => sq.id === q.id - idOffset)
              return { id: q.id - idOffset, texte: q.texte, chapitre: q.chapitre, positions: q.positions, sousQuestions: staticQ?.sousQuestions, structurante: staticQ?.structurante, poids: staticQ?.poids }
            })
          if (active.length > 0) setBaseQuestions(active)
        }
      })
      .catch(() => {})
  }, [electionId])

  const baseSelectedQuestions = useMemo(() => {
    if (isRapide) return selectionnerQuestionsPool(baseQuestions, chapitres, 30)
    if (baseQuestions.length > 100) return selectionnerQuestionsPool(baseQuestions, chapitres, 100)
    return baseQuestions
  }, [isRapide, baseQuestions, chapitres])

  // File de questions dynamique : les sous-questions s'y glissent après leur parent
  const [activeQueue, setActiveQueue] = useState([])
  useEffect(() => {
    setActiveQueue([...baseSelectedQuestions])
  }, [baseSelectedQuestions])

  const questions = activeQueue.length > 0 ? activeQueue : baseSelectedQuestions

  const [questionIndex, setQuestionIndex] = useState(0)
  const [reponses, setReponses] = useState({})
  const reponsesRef = useRef({})
  reponsesRef.current = reponses
  const [animState, setAnimState] = useState('visible')
  const [chargement, setChargement] = useState(false)

  // #9 Restaurer progression sauvegardée (une seule fois au montage)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('politikz_progress') || 'null')
      if (saved?.election === electionId && saved.questionIndex > 0) {
        setQuestionIndex(saved.questionIndex)
        setReponses(saved.reponses || {})
      }
    } catch {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // #9 Sauvegarder à chaque réponse
  useEffect(() => {
    if (questionIndex === 0 && Object.keys(reponses).length === 0) return
    localStorage.setItem('politikz_progress', JSON.stringify({ election: electionId, questionIndex, reponses }))
  }, [questionIndex, reponses, electionId])

  // #20 Tracker démarrage
  useEffect(() => {
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'quiz_start', election: electionId }) }).catch(() => {})
  }, [electionId])

  const totalQuestions = questions.length
  const question = questions[Math.min(questionIndex, totalQuestions - 1)]
  const pourcentage = Math.round(((questionIndex) / totalQuestions) * 100)
  const chapitreActuel = chapitres.find(ch => ch.questions.includes(question.id))
  const chapitreIndex = chapitres.findIndex(ch => ch.id === chapitreActuel?.id)
  const reponseExistante = reponses[question.id]?.choix

  const handleChoix = useCallback((valeur) => {
    // #24 Feedback haptique mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30)

    // #20 Tracking milestones (25 / 50 / 75 %)
    const pctBefore = (questionIndex / totalQuestions) * 100
    const pctAfter  = ((questionIndex + 1) / totalQuestions) * 100
    for (const m of [25, 50, 75]) {
      if (pctBefore < m && pctAfter >= m) {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: `quiz_question_${m}`, election: electionId }) }).catch(() => {})
      }
    }

    setReponses(prev => ({ ...prev, [question.id]: { choix: valeur } }))

    // Mettre à jour la file : retirer les sous-questions obsolètes, injecter les nouvelles
    if (question.sousQuestions?.length > 0) {
      const allSubQIds = new Set(question.sousQuestions.map(sq => sq.id))
      const triggered = question.sousQuestions.filter(sq => {
        if (!sq.condition) return true
        return sq.condition > 0 ? valeur > 0 : valeur < 0
      })
      setActiveQueue(prev => {
        // Retirer toutes les sous-questions de ce parent (peu importe si elles avaient été injectées avant)
        const next = prev.filter(q => !allSubQIds.has(q.id))
        // Injecter les nouvelles déclenchées juste après la question courante
        if (triggered.length > 0) {
          const parentIdx = next.findIndex(q => q.id === question.id)
          const toInject = triggered.map(sq => ({ ...sq, chapitre: question.chapitre, poids: sq.poids ?? 1, _isSousQuestion: true, _parentId: question.id }))
          next.splice(parentIdx + 1, 0, ...toInject)
        }
        return next
      })
    }

    // Animation: slide out, then slide in
    setAnimState('exiting')
    setTimeout(() => {
      if (questionIndex < totalQuestions - 1) {
        setQuestionIndex(prev => prev + 1)
      } else {
        terminerQuiz()
        return
      }
      setAnimState('entering')
      setTimeout(() => setAnimState('visible'), 50)
    }, 250)
  }, [questionIndex, question.id, totalQuestions, electionId, question.sousQuestions, question.chapitre])

  function retour() {
    if (questionIndex > 0) {
      setAnimState('entering')
      setQuestionIndex(prev => prev - 1)
      setTimeout(() => setAnimState('visible'), 50)
    }
  }

  async function terminerQuiz() {
    setChargement(true)
    try {
      const currentReponses = reponsesRef.current
      // Inclure les sous-questions répondues dans le calcul de matching
      const answeredSubQs = questions.filter(q => q._isSousQuestion && currentReponses[q.id])
      const augmentedData = answeredSubQs.length > 0
        ? { ...electionData, questions: [...baseSelectedQuestions, ...answeredSubQs] }
        : electionData
      const resultats = calculerResultats(currentReponses, augmentedData)
      const shareId = Math.random().toString(36).substring(2, 10)

      const { error: insertError } = await supabase.from('resultats').insert({
        share_id: shareId,
        election: electionId,
        reponses: currentReponses,
        scores: resultats.map(r => ({ candidat_id: r.candidat.id, pourcentage: r.pourcentage })),
        created_at: new Date().toISOString()
      })
      if (insertError) {
        console.error('Supabase insert échoué — partage désactivé:', insertError)
        localStorage.setItem('politikz_share_saved', 'false')
      } else {
        localStorage.setItem('politikz_share_saved', 'true')
      }

      localStorage.setItem('politikz_resultats', JSON.stringify(resultats))
      localStorage.setItem('politikz_reponses', JSON.stringify(currentReponses))
      localStorage.setItem('politikz_share_id', shareId)
      localStorage.setItem('politikz_election', electionId)
      localStorage.removeItem('politikz_progress') // #9 clear saved progress
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'quiz_complete', election: electionId }) }).catch(() => {}) // #20
      router.push(`/resultats/${shareId}${compareId ? `?compare=${compareId}` : ''}`)
    } catch (err) {
      console.error('Erreur terminerQuiz:', err)
      setChargement(false)
    }
  }

  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <span className="material-symbols-outlined text-primary text-5xl mb-4 block" style={{ animation: 'pulse-subtle 1.5s ease-in-out infinite' }}>insights</span>
          <h2 className="text-white text-xl font-bold mb-2">Calcul de vos résultats...</h2>
          <p className="text-slate-400 text-sm">Comparaison avec les 12 candidats{isRapide ? ' (mode rapide)' : ''}</p>
        </div>
      </div>
    )
  }

  const animClass = animState === 'exiting' ? 'animate-slide-out' : animState === 'entering' ? 'opacity-0' : 'animate-slide-in'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-brand/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <button onClick={() => router.push('/')} className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Politikz" className="h-7 w-auto" />
        {isRapide && <span className="absolute right-14 top-1/2 -translate-y-1/2 text-[9px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-bold border border-primary/20">RAPIDE</span>}
        <div className="w-9"></div>
      </header>

      {/* 3-column desktop layout */}
      <div className="flex-1 flex justify-center">
        {/* Main quiz area */}
        <main className="flex-1 max-w-xl w-full px-4 py-5 flex flex-col">

          {/* Question card */}
          <div className={`bg-white rounded-2xl p-5 md:p-7 shadow-2xl shadow-black/20 flex flex-col flex-1 ${animClass}`} key={questionIndex}>

            {/* Chapter progress pills */}
            {(() => {
              const dots = chapitres.map((ch, i) => {
                const chIndices = questions.reduce((acc, q, idx) => { if (q.chapitre === ch.id) acc.push(idx); return acc }, [])
                if (chIndices.length === 0) return null
                const isActive = ch.id === chapitreActuel?.id
                const isDone = !isActive && Math.max(...chIndices) < questionIndex
                return { ch, isActive, isDone, color: CHAPTER_COLORS[i] }
              }).filter(Boolean)
              return (
                <div className="flex items-center gap-1 mb-4 justify-center" title="">
                  {dots.map(({ ch, isActive, isDone, color }) => (
                    <div
                      key={ch.id}
                      title={ch.nom}
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: isActive ? 22 : 8,
                        background: isDone || isActive ? color : 'rgba(148,163,184,0.2)',
                        boxShadow: isActive ? `0 0 8px ${color}90` : 'none',
                      }}
                    />
                  ))}
                </div>
              )
            })()}

            {/* Progress bar */}
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                Question {questionIndex + 1} sur {totalQuestions}
              </span>
              <span className="text-accent-red text-xs font-bold">{pourcentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-5">
              <div
                className="bg-accent-red h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${pourcentage}%` }}
              ></div>
            </div>

            {/* #8 Chapitre visible */}
            {chapitreActuel && (
              <div className="mb-4 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-primary text-[10px] font-black uppercase tracking-wider">
                    Chapitre {chapitreIndex + 1}/{chapitres.length}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-primary/40" />
                  <span className="text-slate-700 text-[11px] font-semibold">
                    {chapitreActuel.emoji} {chapitreActuel.nom}
                  </span>
                </div>
              </div>
            )}

            {/* Contexte sous-question */}
            {question._isSousQuestion && (() => {
              const parentQ = questions.find(q => q.id === question._parentId)
              const parentAnswerOption = choixOptions.find(o => o.valeur === reponses[question._parentId]?.choix)
              return (
                <div className="mx-2 mb-4 rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-[13px]" style={{ color: '#f59e0b' }}>subdirectory_arrow_right</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>Question de précision</span>
                  </div>
                  {parentQ && (
                    <p className="text-slate-500 text-[11px] leading-snug mb-1.5 italic">"{parentQ.texte}"</p>
                  )}
                  {parentAnswerOption && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[10px]">Votre réponse :</span>
                      <span className={`text-[10px] font-bold ${parentAnswerOption.colorIcon}`}>{parentAnswerOption.label}</span>
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Question text */}
            <h2 className="text-slate-900 text-lg md:text-xl font-bold leading-snug text-center px-2 mb-3">
              {question.texte}
            </h2>

            {/* Hint contextuel */}
            {HINTS[electionId]?.[question.id] && (
              <div className="flex items-start gap-2 mx-2 mb-5 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <span className="material-symbols-outlined text-blue-400 text-[16px] mt-0.5 shrink-0">info</span>
                <p className="text-blue-600 text-[12px] leading-snug">{HINTS[electionId][question.id]}</p>
              </div>
            )}

            {/* 5 answer buttons */}
            <div className="space-y-2.5 flex-1 flex flex-col justify-center">
              {choixOptions.map((option) => {
                const isSelected = reponseExistante === option.valeur
                return (
                  <button
                    key={option.valeur}
                    onClick={() => handleChoix(option.valeur)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 transition-all duration-150 cursor-pointer active:scale-[0.97] ${
                      isSelected
                        ? option.colorActive
                        : `border-slate-100 ${option.colorBtn}`
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${option.colorIconBg}`}>
                      <span className={`material-symbols-outlined text-xl ${option.colorIcon} ${isSelected ? 'icon-fill' : ''}`}>
                        {option.icon}
                      </span>
                    </div>
                    <span className="text-slate-800 font-semibold text-[15px]">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Boutons navigation */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={retour}
              disabled={questionIndex === 0}
              className={`py-3 rounded-xl text-sm font-semibold border border-white/15 transition-all flex items-center justify-center gap-1.5 ${
                questionIndex === 0
                  ? 'text-white/15 border-white/5 cursor-not-allowed'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Précédente
            </button>
            {/* #7 Passer cette question */}
            <button
              onClick={() => handleChoix(0)}
              className="py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/[0.04] hover:border-white/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]">skip_next</span>
              Passer
            </button>
          </div>

        </main>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <span className="material-symbols-outlined text-primary text-5xl mb-4 block" style={{ animation: 'pulse-subtle 1.5s ease-in-out infinite' }}>quiz</span>
          <h2 className="text-white text-xl font-bold">Chargement...</h2>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}
