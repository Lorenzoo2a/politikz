'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { getElectionData, ELECTIONS, DEFAULT_ELECTION } from '@/data/elections'

const getToken = () => typeof window !== 'undefined' ? sessionStorage.getItem('politikz_admin_token') : null

// ── Position helpers ────────────────────────────────────────────────────────

const POS_COLORS = { 1: '#10b981', 0.5: '#f59e0b', '-1': '#ef4444', 0: '#475569' }
const POS_LABELS = { 1: 'Pour', 0.5: 'Cond.', '-1': 'Contre', 0: 'Neutre' }
const POS_CYCLE  = { 1: 0.5, 0.5: -1, '-1': 0, 0: 1 }

function PositionDots({ positions, candidats }) {
  return (
    <div className="flex gap-0.5 flex-wrap">
      {candidats.map((c, i) => {
        const v = positions[i] ?? 0
        return (
          <span key={c.id} title={`${c.prenom} ${c.nom} : ${POS_LABELS[v] ?? 'Neutre'}`}
            className="w-2 h-2 rounded-sm transition-colors shrink-0"
            style={{ background: POS_COLORS[v] ?? POS_COLORS[0] }} />
        )
      })}
    </div>
  )
}

function PositionToggle({ value, label, onChange }) {
  const v = value ?? 0
  const bg    = v === 1 ? 'rgba(16,185,129,0.15)' : v === 0.5 ? 'rgba(245,158,11,0.15)' : v === -1 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)'
  const bord  = v === 1 ? 'rgba(16,185,129,0.4)'  : v === 0.5 ? 'rgba(245,158,11,0.4)'  : v === -1 ? 'rgba(239,68,68,0.4)'  : 'rgba(255,255,255,0.08)'
  const color = v === 1 ? '#10b981'                : v === 0.5 ? '#f59e0b'                : v === -1 ? '#ef4444'                : '#475569'
  const icon  = v === 1 ? 'thumb_up'              : v === 0.5 ? 'rule'                   : v === -1 ? 'thumb_down'             : 'remove'
  return (
    <button type="button" onClick={() => onChange(POS_CYCLE[v] ?? 0)}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border"
      style={{ background: bg, borderColor: bord, color, minWidth: 80 }}>
      <span className="material-symbols-outlined icon-fill text-[13px]">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

// ── Matrix view ─────────────────────────────────────────────────────────────

const CHAPTER_COLORS = ['#f59e0b','#3b82f6','#ec4899','#eab308','#22c55e','#a855f7','#f97316','#14b8a6','#0ea5e9']

function MatrixView({ questions, candidats, chapitres, synced, onCellClick }) {
  return (
    <div className="overflow-auto rounded-xl flex-1" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <table className="w-full border-collapse text-xs" style={{ minWidth: candidats.length * 76 + 320 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0a1628' }}>
            <th className="sticky left-0 z-20 text-right px-2 py-2.5 text-slate-700 font-mono text-[10px] w-8"
              style={{ background: '#0a1628', borderRight: '1px solid rgba(255,255,255,0.06)' }}>#</th>
            <th className="sticky left-8 z-20 text-left px-3 py-2.5 text-slate-500 font-medium text-[10px] uppercase tracking-wider"
              style={{ background: '#0a1628', borderRight: '1px solid rgba(255,255,255,0.06)', minWidth: 260 }}>Question</th>
            {candidats.map(c => (
              <th key={c.id} className="px-1 py-2 text-center text-slate-500 font-medium" style={{ minWidth: 72, maxWidth: 76 }}>
                <span className="block truncate text-[10px]">{c.prenom}</span>
                <span className="block truncate text-[9px] text-slate-700">{c.nom.split(' ').pop()}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((q, qi) => {
            const ch    = chapitres.find(c => c.id === q.chapitre)
            const chIdx = chapitres.findIndex(c => c.id === q.chapitre)
            const chColor = CHAPTER_COLORS[chIdx] || '#64748b'
            return (
              <tr key={q.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: qi % 2 === 0 ? '#060e22' : '#07112a' }}>
                <td className="sticky left-0 z-10 text-right px-2 py-2 text-slate-700 font-mono text-[10px]"
                  style={{ background: qi % 2 === 0 ? '#060e22' : '#07112a', borderRight: '1px solid rgba(255,255,255,0.04)' }}>{q.id}</td>
                <td className="sticky left-8 z-10 px-3 py-2"
                  style={{ background: qi % 2 === 0 ? '#060e22' : '#07112a', borderRight: '1px solid rgba(255,255,255,0.04)', minWidth: 260 }}>
                  <p className="text-slate-300 text-[11px] leading-snug line-clamp-2">{q.texte}</p>
                  <span className="text-[9px] font-medium mt-0.5 block" style={{ color: chColor }}>{ch?.emoji} {ch?.nom}</span>
                </td>
                {candidats.map((c, i) => {
                  const pos = q.positions?.[i] ?? 0
                  const bg    = pos === 1 ? 'rgba(16,185,129,0.18)' : pos === 0.5 ? 'rgba(245,158,11,0.18)' : pos === -1 ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.04)'
                  const bord  = pos === 1 ? 'rgba(16,185,129,0.35)' : pos === 0.5 ? 'rgba(245,158,11,0.35)' : pos === -1 ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.08)'
                  return (
                    <td key={c.id} className="px-1 py-1.5 text-center">
                      <button onClick={() => onCellClick(q, i, POS_CYCLE[pos] ?? 0)} disabled={!synced}
                        className="w-[66px] h-6 rounded-lg text-[10px] font-bold transition-all disabled:opacity-30 hover:opacity-80"
                        style={{ background: bg, color: POS_COLORS[pos] ?? '#475569', border: `1px solid ${bord}` }}
                        title={`${c.prenom} ${c.nom}`}>
                        {POS_LABELS[pos] ?? '–'}
                      </button>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {questions.length === 0 && (
        <div className="text-center py-12 text-slate-700 text-sm">
          <span className="material-symbols-outlined text-3xl block mb-2">search_off</span>
          Aucune question trouvée
        </div>
      )}
    </div>
  )
}

// ── Sub-question editor ──────────────────────────────────────────────────────

function SQEditor({ draft, candidats, onChange, onSave, onDelete, onCancel }) {
  const setPos = (i, v) => onChange(d => { const p = [...d.positions]; p[i] = v; return { ...d, positions: p } })
  return (
    <div className="p-3 space-y-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)' }}>
      <textarea value={draft.texte} onChange={e => onChange(d => ({ ...d, texte: e.target.value }))} rows={2}
        className="w-full rounded-lg px-3 py-2 text-white text-xs placeholder-slate-600 focus:outline-none resize-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        placeholder="Texte de la sous-question…" autoFocus />

      <div>
        <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-1.5">Déclencher quand l'utilisateur répond…</p>
        <div className="flex gap-1.5">
          {[
            { v: 1,    label: '👍 Si Pour',    color: '#10b981' },
            { v: -1,   label: '👎 Si Contre',  color: '#ef4444' },
            { v: null, label: '∞ Toujours',    color: '#64748b' },
          ].map(opt => (
            <button key={String(opt.v)} type="button"
              onClick={() => onChange(d => ({ ...d, condition: opt.v }))}
              className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={draft.condition === opt.v
                ? { background: `${opt.color}25`, color: opt.color, border: `1px solid ${opt.color}50` }
                : { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-1.5">Positions des candidats</p>
        <div className="grid grid-cols-2 gap-1">
          {candidats.map((c, i) => (
            <PositionToggle key={c.id} value={draft.positions[i] ?? 0}
              label={`${c.prenom} ${c.nom}`} onChange={v => setPos(i, v)} />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onSave} disabled={!draft.texte.trim()}
          className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-40 transition-all"
          style={{ background: '#10b981' }}>
          <span className="material-symbols-outlined text-[13px] align-middle mr-1">check</span>
          Enregistrer
        </button>
        {onDelete && (
          <button type="button" onClick={onDelete}
            className="py-1.5 px-3 rounded-lg text-xs text-red-400 hover:bg-red-400/10 transition-all border border-red-400/20">
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </button>
        )}
        <button type="button" onClick={onCancel}
          className="py-1.5 px-3 rounded-lg text-xs text-slate-500 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          Annuler
        </button>
      </div>
    </div>
  )
}

// ── Question Editor Panel ────────────────────────────────────────────────────

function QuestionEditor({ question, candidats, chapitres, onSave, onClose }) {
  const [texte,         setTexte]         = useState(question?.texte || '')
  const [chapitre,      setChapitre]      = useState(question?.chapitre || chapitres[0]?.id || 1)
  const [sourceUrl,     setSourceUrl]     = useState(question?.source_url || '')
  const [positions,     setPositions]     = useState(
    question?.positions ? [...question.positions] : new Array(candidats.length).fill(0)
  )
  const [sousQuestions, setSousQuestions] = useState(
    (question?.sous_questions ?? question?.sousQuestions) ? [...(question.sous_questions ?? question.sousQuestions)] : []
  )
  const [editingSQ,     setEditingSQ]     = useState(null)
  const [sqDraft,       setSqDraft]       = useState(null)
  const [saving,        setSaving]        = useState(false)
  const isNew = !question?.id
  const textareaRef = useRef(null)

  // Re-init when question changes
  useEffect(() => {
    setTexte(question?.texte || '')
    setChapitre(question?.chapitre || chapitres[0]?.id || 1)
    setSourceUrl(question?.source_url || '')
    setPositions(question?.positions ? [...question.positions] : new Array(candidats.length).fill(0))
    setSousQuestions((question?.sous_questions ?? question?.sousQuestions) ? [...(question.sous_questions ?? question.sousQuestions)] : [])
    setEditingSQ(null); setSqDraft(null)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }, [question?.id])

  const setPos = (i, v) => setPositions(p => { const n = [...p]; n[i] = v; return n })

  async function submit() {
    if (!texte.trim()) return
    setSaving(true)
    await onSave({ texte: texte.trim(), chapitre, positions, source_url: sourceUrl.trim() || null, sous_questions: sousQuestions })
    setSaving(false)
  }

  function openNewSQ() {
    setSqDraft({ id: Date.now(), texte: '', condition: 1, positions: new Array(candidats.length).fill(0) })
    setEditingSQ('new')
  }
  function openEditSQ(i) { setSqDraft({ ...sousQuestions[i] }); setEditingSQ(i) }
  function saveSQ() {
    if (editingSQ === 'new') setSousQuestions(p => [...p, sqDraft])
    else setSousQuestions(p => p.map((sq, i) => i === editingSQ ? sqDraft : sq))
    setEditingSQ(null); setSqDraft(null)
  }
  function deleteSQ() {
    setSousQuestions(p => p.filter((_, i) => i !== editingSQ))
    setEditingSQ(null); setSqDraft(null)
  }

  const pour   = positions.filter(v => v === 1).length
  const contre = positions.filter(v => v === -1).length
  const neutre = positions.filter(v => v === 0).length
  const cond   = positions.filter(v => v === 0.5).length

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]" style={{ color: isNew ? '#10b981' : '#60a5fa' }}>
            {isNew ? 'add_circle' : 'edit'}
          </span>
          <h2 className="text-white font-bold text-sm">{isNew ? 'Nouvelle question' : `Question #${question.id}`}</h2>
        </div>
        <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

        {/* Texte */}
        <div>
          <label className="text-slate-500 text-[10px] uppercase tracking-wider mb-2 block">Texte de la question</label>
          <textarea ref={textareaRef} value={texte} onChange={e => setTexte(e.target.value)} rows={3}
            className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none resize-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            placeholder="Faut-il…" />
        </div>

        {/* Chapitre + Source — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-500 text-[10px] uppercase tracking-wider mb-2 block">Chapitre</label>
            <select value={chapitre} onChange={e => setChapitre(Number(e.target.value))}
              className="w-full rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {chapitres.map(ch => <option key={ch.id} value={ch.id} style={{ background: '#0d1a35' }}>{ch.emoji} {ch.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-500 text-[10px] uppercase tracking-wider mb-2 block">Source URL</label>
            <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} type="url"
              className="w-full rounded-xl px-3 py-2.5 text-white text-xs placeholder-slate-600 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              placeholder="https://…" />
          </div>
        </div>

        {/* Positions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-500 text-[10px] uppercase tracking-wider">Positions des candidats</label>
            <div className="flex items-center gap-2 text-[10px]">
              <span style={{ color: '#10b981' }}>✓ {pour}</span>
              <span style={{ color: '#f59e0b' }}>~ {cond}</span>
              <span style={{ color: '#ef4444' }}>✗ {contre}</span>
              <span className="text-slate-600">– {neutre}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex gap-0.5 mb-3 h-1.5 rounded-full overflow-hidden">
            <div className="transition-all duration-300 rounded-l-full" style={{ width: `${(pour/candidats.length)*100}%`, background: '#10b981' }} />
            <div className="transition-all duration-300" style={{ width: `${(cond/candidats.length)*100}%`, background: '#f59e0b' }} />
            <div className="transition-all duration-300" style={{ width: `${(neutre/candidats.length)*100}%`, background: 'rgba(255,255,255,0.1)' }} />
            <div className="transition-all duration-300 rounded-r-full" style={{ width: `${(contre/candidats.length)*100}%`, background: '#ef4444' }} />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {candidats.map((c, i) => (
              <PositionToggle key={c.id} value={positions[i] ?? 0}
                label={`${c.prenom} ${c.nom}`} onChange={v => setPos(i, v)} />
            ))}
          </div>
        </div>

        {/* Sous-questions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <label className="text-slate-500 text-[10px] uppercase tracking-wider">Sous-questions</label>
              {sousQuestions.length > 0 && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                  {sousQuestions.length}
                </span>
              )}
            </div>
            {editingSQ === null && (
              <button type="button" onClick={openNewSQ}
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                <span className="material-symbols-outlined text-[13px]">add</span>
                Ajouter une sous-question
              </button>
            )}
          </div>

          <p className="text-slate-600 text-[10px] mb-3 leading-relaxed">
            Les sous-questions s'affichent <span className="text-slate-400">après que l'utilisateur ait répondu</span> à cette question.
            Configurez la condition de déclenchement (Si Pour, Si Contre, ou Toujours).
          </p>

          {sousQuestions.length === 0 && editingSQ === null && (
            <div className="text-center py-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
              <span className="material-symbols-outlined text-slate-700 text-2xl block mb-1">subdirectory_arrow_right</span>
              <p className="text-slate-700 text-[11px]">Aucune sous-question</p>
              <button type="button" onClick={openNewSQ}
                className="mt-2 text-[10px] font-bold text-primary hover:text-emerald-400 transition-colors">
                + Ajouter
              </button>
            </div>
          )}

          <div className="space-y-2">
            {sousQuestions.map((sq, i) => (
              <div key={sq.id ?? i} className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.18)' }}>
                {editingSQ === i ? (
                  <SQEditor draft={sqDraft} candidats={candidats} onChange={setSqDraft}
                    onSave={saveSQ} onDelete={deleteSQ} onCancel={() => setEditingSQ(null)} />
                ) : (
                  <div className="flex items-start gap-2.5 px-3 py-2.5 group/sq">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded shrink-0 mt-0.5"
                      style={sq.condition === 1
                        ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                        : sq.condition === -1
                        ? { background: 'rgba(239,68,68,0.15)', color: '#ef4444' }
                        : { background: 'rgba(255,255,255,0.08)', color: '#64748b' }}>
                      {sq.condition === 1 ? '👍 Si Pour' : sq.condition === -1 ? '👎 Si Contre' : '∞ Toujours'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-[11px] leading-snug">
                        {sq.texte || <span className="text-slate-600 italic">Sans texte</span>}
                      </p>
                      <PositionDots positions={sq.positions || []} candidats={candidats} />
                    </div>
                    <button onClick={() => openEditSQ(i)}
                      className="text-slate-700 hover:text-primary transition-colors shrink-0 opacity-0 group-hover/sq:opacity-100 p-1 rounded hover:bg-primary/10">
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {editingSQ === 'new' && sqDraft && (
            <div className="rounded-xl overflow-hidden mt-2"
              style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <SQEditor draft={sqDraft} candidats={candidats} onChange={setSqDraft}
                onSave={saveSQ} onCancel={() => setEditingSQ(null)} />
            </div>
          )}
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="px-5 py-4 border-t flex gap-3 shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)', background: '#0d1a35' }}>
        <button onClick={submit} disabled={saving || !texte.trim()}
          className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          style={{ background: '#10b981' }}>
          {saving
            ? <><span className="material-symbols-outlined text-[16px] animate-spin">refresh</span> Enregistrement…</>
            : <><span className="material-symbols-outlined text-[16px]">{isNew ? 'add' : 'check'}</span>{isNew ? 'Créer la question' : 'Sauvegarder'}</>
          }
        </button>
        <button onClick={onClose}
          className="px-4 text-slate-400 py-2.5 rounded-xl text-sm transition-all hover:text-white border border-white/10 hover:border-white/20">
          Fermer
        </button>
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function QuestionsAdmin() {
  const [electionId,  setElectionId]  = useState(DEFAULT_ELECTION)
  const [questions,   setQuestions]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [synced,      setSynced]      = useState(false)
  const [seeding,     setSeeding]     = useState(false)
  const [seedError,   setSeedError]   = useState(null)
  const [search,      setSearch]      = useState('')
  const [filterChap,  setFilterChap]  = useState(0)
  const [selectedQ,   setSelectedQ]   = useState(null) // question en cours d'édition
  const [toggling,    setToggling]    = useState(null)
  const [showSQL,     setShowSQL]     = useState(false)
  const [showMigSQL,  setShowMigSQL]  = useState(false)
  const [viewMode,    setViewMode]    = useState('list')

  const { candidats, chapitres, questions: staticQ } = getElectionData(electionId)

  useEffect(() => {
    loadQuestions()
    setSearch('')
    setFilterChap(0)
    setSelectedQ(null)
  }, [electionId])

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/admin/questions?election=${electionId}`)
      const json = await res.json()
      if (json.ok && json.questions?.length > 0) {
        setQuestions(json.questions); setSynced(true)
      } else {
        setQuestions(staticQ.map(q => ({ ...q, actif: true, _static: true }))); setSynced(false)
      }
    } catch {
      setQuestions(staticQ.map(q => ({ ...q, actif: true, _static: true }))); setSynced(false)
    }
    setLoading(false)
  }, [electionId, staticQ])

  async function seedToSupabase() {
    setSeeding(true); setSeedError(null)
    const res  = await fetch('/api/admin/questions/seed', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: getToken(), election: electionId }),
    })
    const json = await res.json()
    json.ok ? await loadQuestions() : setSeedError(json.error || 'Erreur inconnue')
    setSeeding(false)
  }

  async function saveQuestion(data) {
    const isNew = !selectedQ?.id
    if (isNew) {
      const res  = await fetch('/api/admin/questions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: getToken(), question: data, election: electionId }),
      })
      const json = await res.json()
      if (json.ok) {
        setQuestions(prev => [...prev, json.question])
        setSelectedQ(json.question)
      }
    } else {
      const updatedQ = { ...selectedQ, ...data }
      const res  = await fetch('/api/admin/questions', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: getToken(), id: selectedQ.id, question: updatedQ }),
      })
      const json = await res.json()
      if (json.ok) {
        setQuestions(prev => prev.map(q => q.id === selectedQ.id ? updatedQ : q))
        setSelectedQ(updatedQ)
      } else {
        alert(`Erreur sauvegarde : ${json.error || 'inconnue'}`)
      }
    }
  }

  async function toggleActive(q, e) {
    e.stopPropagation()
    setToggling(q.id)
    await fetch('/api/admin/questions', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: getToken(), id: q.id, question: { ...q, actif: !q.actif } }),
    })
    const updated = { ...q, actif: !q.actif }
    setQuestions(prev => prev.map(x => x.id === q.id ? updated : x))
    if (selectedQ?.id === q.id) setSelectedQ(updated)
    setToggling(null)
  }

  async function saveCellPosition(question, candidatIndex, newPos) {
    const newPositions = [...(question.positions || [])]
    newPositions[candidatIndex] = newPos
    setQuestions(prev => prev.map(q => q.id === question.id ? { ...q, positions: newPositions } : q))
    await fetch('/api/admin/questions', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: getToken(), id: question.id, question: { ...question, positions: newPositions } }),
    })
  }

  const filtered = questions.filter(q =>
    (filterChap === 0 || q.chapitre === filterChap) &&
    (!search || q.texte.toLowerCase().includes(search.toLowerCase()))
  )
  const activeCount = questions.filter(q => q.actif).length
  const sqCount     = questions.filter(q => (q.sous_questions?.length || q.sousQuestions?.length || 0) > 0).length

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
    </div>
  )

  return (
    <div className="py-7 flex flex-col h-[calc(100vh-80px)]">

      {/* ── Top bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-white text-xl font-bold">Questions</h1>
          <p className="text-slate-600 text-xs mt-0.5">{activeCount} actives · {questions.length} total · {sqCount} avec sous-questions</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex p-0.5 rounded-xl gap-0.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[{ id: 'list', icon: 'list', label: 'Liste' }, { id: 'matrix', icon: 'grid_on', label: 'Matrice' }].map(v => (
              <button key={v.id} onClick={() => setViewMode(v.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-[11px] font-bold"
                style={viewMode === v.id ? { background: 'rgba(16,185,129,0.2)', color: '#10b981' } : { color: '#475569' }}>
                <span className="material-symbols-outlined text-[14px]">{v.icon}</span>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Election tabs ───────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-4 p-1 rounded-xl w-fit shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {Object.values(ELECTIONS).map(e => (
          <button key={e.id} onClick={() => setElectionId(e.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              electionId === e.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            style={electionId === e.id ? { background: '#10b981' } : {}}>
            <span className="material-symbols-outlined text-[14px]">how_to_vote</span>
            {e.id}
            <span className={`text-[9px] font-black tracking-widest uppercase ${electionId === e.id ? 'text-white/60' : 'text-slate-700'}`}>{e.badge}</span>
          </button>
        ))}
      </div>

      {/* ── Sync banner ─────────────────────────────────────────── */}
      {!synced && (
        <div className="rounded-2xl p-4 mb-4 flex items-start gap-3 shrink-0"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <span className="material-symbols-outlined text-amber-400 text-[18px] shrink-0 mt-0.5">warning</span>
          <div className="flex-1 min-w-0">
            <p className="text-amber-300 font-bold text-sm mb-1">Questions {electionId} non encore dans Supabase</p>
            <button onClick={() => setShowSQL(s => !s)}
              className="text-xs text-slate-500 hover:text-white underline underline-offset-2 mb-2 block transition-colors">
              {showSQL ? 'Masquer le SQL' : '↓ Voir le SQL à exécuter'}
            </button>
            {showSQL && (
              <pre className="rounded-xl p-3 text-[11px] text-slate-400 overflow-x-auto mb-2 whitespace-pre-wrap"
                style={{ background: 'rgba(0,0,0,0.4)' }}>
                {electionId === '2022'
                  ? `create table quiz_questions (\n  id serial primary key,\n  texte text not null,\n  chapitre integer not null,\n  positions jsonb not null,\n  actif boolean default true,\n  election text default '2022',\n  source_url text,\n  sous_questions jsonb default '[]',\n  created_at timestamptz default now()\n);\nalter table quiz_questions enable row level security;\ncreate policy "acces public" on quiz_questions\n  for all using (true) with check (true);`
                  : `ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS election text DEFAULT '2022';\nALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS source_url text;\nALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS sous_questions jsonb DEFAULT '[]';`}
              </pre>
            )}
            {seedError && <p className="text-red-400 text-xs mb-2">Erreur : {seedError}</p>}
            <button onClick={seedToSupabase} disabled={seeding}
              className="text-black font-bold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50"
              style={{ background: '#f59e0b' }}>
              {seeding ? 'Copie en cours…' : `⬆ Copier les 100 questions ${electionId} dans Supabase`}
            </button>
          </div>
        </div>
      )}

      {/* ── Migration SQL (colonnes manquantes) ─────────────────── */}
      {synced && (
        <div className="rounded-2xl p-3 mb-4 flex items-start gap-3 shrink-0"
          style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <span className="material-symbols-outlined text-blue-400 text-[16px] shrink-0 mt-0.5">build</span>
          <div className="flex-1 min-w-0">
            <p className="text-blue-300 font-bold text-xs mb-0.5">Colonnes requises pour les sous-questions</p>
            <p className="text-slate-500 text-[10px] mb-1.5">Si les sous-questions ne s'affichent pas, exécutez ce SQL dans le dashboard Supabase → SQL Editor :</p>
            <button onClick={() => setShowMigSQL(s => !s)}
              className="text-[10px] text-slate-500 hover:text-white underline underline-offset-2 mb-1.5 block transition-colors">
              {showMigSQL ? 'Masquer' : '↓ Voir le SQL de migration'}
            </button>
            {showMigSQL && (
              <pre className="rounded-xl p-3 text-[11px] text-slate-400 overflow-x-auto whitespace-pre-wrap select-all"
                style={{ background: 'rgba(0,0,0,0.4)' }}>
                {`ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS source_url text;\nALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS sous_questions jsonb DEFAULT '[]';`}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* ── Matrix view (full width) ────────────────────────────── */}
      {viewMode === 'matrix' && (
        <MatrixView questions={filtered} candidats={candidats} chapitres={chapitres}
          synced={synced} onCellClick={saveCellPosition} />
      )}

      {/* ── Split panel: list + editor ──────────────────────────── */}
      {viewMode === 'list' && (
        <div className="flex gap-4 flex-1 min-h-0">

          {/* Left: question list */}
          <div className="flex flex-col rounded-2xl overflow-hidden shrink-0"
            style={{ width: selectedQ ? '42%' : '100%', transition: 'width 0.2s', border: '1px solid rgba(255,255,255,0.07)', background: '#090f1f' }}>

            {/* Search + chapter filter */}
            <div className="p-3 border-b space-y-2" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-600">search</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => setFilterChap(0)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
                  style={filterChap === 0 ? { background: 'rgba(16,185,129,0.2)', color: '#10b981' } : { background: 'rgba(255,255,255,0.04)', color: '#475569' }}>
                  Tous ({questions.length})
                </button>
                {chapitres.map((ch, i) => {
                  const count = questions.filter(q => q.chapitre === ch.id).length
                  return (
                    <button key={ch.id} onClick={() => setFilterChap(ch.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
                      style={filterChap === ch.id
                        ? { background: `${CHAPTER_COLORS[i]}22`, color: CHAPTER_COLORS[i], border: `1px solid ${CHAPTER_COLORS[i]}40` }
                        : { background: 'rgba(255,255,255,0.04)', color: '#475569' }}>
                      {ch.emoji} {ch.nom.split(' ')[0]} <span className="text-[9px] opacity-60">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.map(q => {
                const ch      = chapitres.find(c => c.id === q.chapitre)
                const chIdx   = chapitres.findIndex(c => c.id === q.chapitre)
                const chColor = CHAPTER_COLORS[chIdx] || '#64748b'
                const isSelected = selectedQ?.id === q.id
                const sqLen   = q.sous_questions?.length || q.sousQuestions?.length || 0
                return (
                  <div key={q.id} onClick={() => setSelectedQ(isSelected ? null : q)}
                    className="flex items-start gap-2.5 px-3 py-2.5 cursor-pointer transition-all group/row border-b"
                    style={{
                      borderColor: 'rgba(255,255,255,0.04)',
                      background: isSelected ? 'rgba(16,185,129,0.08)' : 'transparent',
                      borderLeft: isSelected ? '2px solid #10b981' : '2px solid transparent',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}>

                    <span className="text-slate-700 text-[9px] font-mono w-5 shrink-0 text-right pt-0.5">{q.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: chColor }} />

                    <div className={`flex-1 min-w-0 ${!q.actif ? 'opacity-40' : ''}`}>
                      <p className="text-slate-200 text-[11px] leading-snug line-clamp-2">{q.texte}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px]" style={{ color: chColor }}>{ch?.emoji} {ch?.nom}</span>
                        {sqLen > 0 && (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                            SQ {sqLen}
                          </span>
                        )}
                        {!q.actif && <span className="text-[8px] text-slate-600 font-bold">INACTIF</span>}
                      </div>
                    </div>

                    {synced && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity shrink-0">
                        <button onClick={e => toggleActive(q, e)} disabled={toggling === q.id}
                          className="p-1 rounded-lg transition-all hover:bg-white/5 disabled:opacity-40"
                          title={q.actif ? 'Désactiver' : 'Activer'}
                          style={{ color: q.actif ? '#f59e0b' : '#10b981' }}>
                          <span className="material-symbols-outlined text-[13px]">{q.actif ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-700 text-sm">
                  <span className="material-symbols-outlined text-3xl block mb-2">search_off</span>
                  Aucune question trouvée
                </div>
              )}
            </div>

            {/* Add button */}
            <div className="p-3 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <button
                onClick={() => setSelectedQ({ texte: '', chapitre: chapitres[0]?.id || 1, positions: new Array(candidats.length).fill(0) })}
                disabled={!synced}
                className="w-full flex items-center justify-center gap-2 text-white text-xs font-bold py-2.5 rounded-xl transition-all disabled:opacity-30"
                style={{ background: '#10b981' }}>
                <span className="material-symbols-outlined text-[15px]">add</span>
                Nouvelle question
              </button>
            </div>
          </div>

          {/* Right: editor panel */}
          {selectedQ && (
            <div className="flex-1 min-w-0 rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#0d1a35' }}>
              <QuestionEditor
                key={selectedQ?.id ?? 'new'}
                question={selectedQ?.id ? selectedQ : null}
                candidats={candidats}
                chapitres={chapitres}
                onSave={saveQuestion}
                onClose={() => setSelectedQ(null)}
              />
            </div>
          )}

          {/* Empty state when no question selected */}
          {!selectedQ && (
            <div />
          )}
        </div>
      )}

      <div className="h-4 shrink-0" />
    </div>
  )
}
