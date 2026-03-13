'use client'
import { useState, useCallback, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { questions as allQuestions, chapitres } from '@/data/quizData'
import { calculerResultats } from '@/lib/matching'
import { supabase } from '@/lib/supabase'
import AdPlaceholder from '@/components/AdPlaceholder'

/**
 * Sélectionne 30 questions réparties équitablement sur les 9 chapitres
 * (3-4 questions par chapitre, les plus discriminantes)
 */
function selectionnerQuestionsRapides() {
  const selected = []
  const perChapter = Math.floor(30 / chapitres.length) // 3
  const extra = 30 - perChapter * chapitres.length      // 3

  chapitres.forEach((ch, idx) => {
    const chapterQuestions = allQuestions.filter(q => q.chapitre === ch.id)
    // Prendre les questions les plus polarisantes (plus de positions non-neutres)
    const sorted = [...chapterQuestions].sort((a, b) => {
      const scoreA = a.positions.filter(p => p !== 0).length
      const scoreB = b.positions.filter(p => p !== 0).length
      return scoreB - scoreA
    })
    const count = perChapter + (idx < extra ? 1 : 0)
    selected.push(...sorted.slice(0, count))
  })

  return selected.sort((a, b) => a.id - b.id)
}

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

  const questions = useMemo(() => {
    return isRapide ? selectionnerQuestionsRapides() : allQuestions
  }, [isRapide])

  const [questionIndex, setQuestionIndex] = useState(0)
  const [reponses, setReponses] = useState({})
  const [animState, setAnimState] = useState('visible') // 'visible' | 'exiting' | 'entering'
  const [chargement, setChargement] = useState(false)

  const question = questions[questionIndex]
  const totalQuestions = questions.length
  const pourcentage = Math.round(((questionIndex) / totalQuestions) * 100)
  const chapitreActuel = chapitres.find(ch => ch.questions.includes(question.id))
  const reponseExistante = reponses[question.id]?.choix

  const handleChoix = useCallback((valeur) => {
    setReponses(prev => ({ ...prev, [question.id]: { choix: valeur } }))

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
  }, [questionIndex, question.id])

  function retour() {
    if (questionIndex > 0) {
      setAnimState('entering')
      setQuestionIndex(prev => prev - 1)
      setTimeout(() => setAnimState('visible'), 50)
    }
  }

  async function terminerQuiz() {
    setChargement(true)
    const resultats = calculerResultats(reponses)
    const shareId = Math.random().toString(36).substring(2, 10)

    try {
      await supabase.from('resultats').insert({
        share_id: shareId,
        reponses: reponses,
        scores: resultats.map(r => ({ candidat_id: r.candidat.id, pourcentage: r.pourcentage })),
        created_at: new Date().toISOString()
      })
    } catch (err) {
      console.log('Sauvegarde Supabase optionnelle:', err)
    }

    localStorage.setItem('politikz_resultats', JSON.stringify(resultats))
    localStorage.setItem('politikz_reponses', JSON.stringify(reponses))
    localStorage.setItem('politikz_share_id', shareId)
    router.push(`/resultats/${shareId}`)
  }

  if (chargement) {
    return (
      <div className="min-h-screen bg-brand flex items-center justify-center">
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
    <div className="min-h-screen bg-brand flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-brand/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <button onClick={() => router.push('/')} className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        <span className="text-white text-lg font-extrabold tracking-tighter uppercase">Politikz</span>
        {isRapide && <span className="absolute right-14 top-1/2 -translate-y-1/2 text-[9px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-bold border border-primary/20">RAPIDE</span>}
        <div className="w-9"></div>
      </header>

      {/* 3-column desktop layout */}
      <div className="flex-1 flex justify-center">

        {/* Left ads - desktop */}
        <aside className="hidden xl:flex flex-col items-center gap-5 pt-8 px-4 w-[200px] shrink-0">
          <AdPlaceholder format="rectangle" />
          <AdPlaceholder format="skyscraper" />
        </aside>

        {/* Main quiz area */}
        <main className="flex-1 max-w-xl w-full px-4 py-5 flex flex-col">

          {/* Mobile ad top */}
          <div className="xl:hidden mb-4">
            <AdPlaceholder format="banner" />
          </div>

          {/* Question card */}
          <div className={`bg-white rounded-2xl p-5 md:p-7 shadow-2xl shadow-black/20 flex flex-col flex-1 ${animClass}`} key={questionIndex}>

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

            {/* Chapitre tag */}
            {chapitreActuel && (
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 text-slate-400 text-[10px] uppercase tracking-widest font-medium">
                  <span className="material-symbols-outlined text-[14px]">label</span>
                  {chapitreActuel.nom}
                </span>
              </div>
            )}

            {/* Question text */}
            <h2 className="text-slate-900 text-lg md:text-xl font-bold leading-snug text-center px-2 mb-7">
              {question.texte}
            </h2>

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

          {/* Bouton retour */}
          <div className="mt-4">
            <button
              onClick={retour}
              disabled={questionIndex === 0}
              className={`w-full py-3 rounded-xl text-sm font-semibold border border-white/15 transition-all flex items-center justify-center gap-1.5 ${
                questionIndex === 0
                  ? 'text-white/15 border-white/5 cursor-not-allowed'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Question précédente
            </button>
          </div>

          {/* Mobile ad bottom */}
          <div className="xl:hidden mt-4">
            <AdPlaceholder format="banner" />
          </div>
        </main>

        {/* Right ads - desktop */}
        <aside className="hidden xl:flex flex-col items-center gap-5 pt-8 px-4 w-[200px] shrink-0">
          <AdPlaceholder format="rectangle" />
          <AdPlaceholder format="skyscraper" />
        </aside>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand flex items-center justify-center">
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
