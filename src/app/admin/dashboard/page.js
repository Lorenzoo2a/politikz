'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { calculerResultats } from '@/lib/matching'
import { getElectionData, ELECTIONS } from '@/data/elections'

// ── Helpers ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, color = '#10b981', trend }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#0d1a35', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</span>
        <span className="material-symbols-outlined text-[18px]" style={{ color }}>{icon}</span>
      </div>
      <p className="text-white text-3xl font-black tracking-tight">{value}</p>
      {sub   && <p className="text-slate-600 text-xs mt-1.5">{sub}</p>}
      {trend !== undefined && (
        <p className={`text-xs mt-1.5 font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)} vs hier
        </p>
      )}
    </div>
  )
}

function CandidateBar({ label, value, max, count, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color || '#10b981' }} />
      </div>
      <span className="text-xs text-white font-bold w-8 text-right shrink-0">{count}</span>
    </div>
  )
}

function ActivityChart({ dayMap }) {
  const values    = Object.values(dayMap)
  const dates     = Object.keys(dayMap)
  const max       = Math.max(...values, 1)
  const today     = new Date()
  const todayKey  = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  return (
    <div className="flex items-end gap-1 h-24">
      {dates.map((date, i) => {
        const v      = values[i]
        const isToday = date === todayKey
        const h      = max > 0 ? Math.max((v / max) * 80, v > 0 ? 6 : 2) : 2
        return (
          <div key={date} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
            <span className="text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: isToday ? '#10b981' : '#94a3b8' }}>{v}</span>
            <div className="w-full rounded-sm transition-all duration-500"
              style={{
                height: `${h}px`,
                background: isToday ? '#10b981' : v > 0 ? 'rgba(16,185,129,0.45)' : 'rgba(255,255,255,0.06)',
              }} />
            <span className="text-[8px] text-slate-700 hidden sm:block">{date.slice(5)}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [loading,       setLoading]       = useState(true)
  const [rows,          setRows]          = useState([])
  const [stats,         setStats]         = useState(null)
  const [deleting,      setDeleting]      = useState(null)
  const [page,          setPage]          = useState(0)
  const [search,        setSearch]        = useState('')
  const [filterEl,      setFilterEl]      = useState('all')
  const PER_PAGE = 20

  const getToken = () => typeof window !== 'undefined' ? sessionStorage.getItem('politikz_admin_token') : null

  const loadData = useCallback(async () => {
    setLoading(true)
    const [{ data }, { data: events }] = await Promise.all([
      supabase
        .from('resultats')
        .select('id, share_id, created_at, reponses, share_clicks, election')
        .order('created_at', { ascending: false })
        .limit(2000),
      supabase
        .from('page_events')
        .select('type, created_at')
        .eq('type', 'return_visit')
        .limit(5000),
    ])

    if (data) {
      const processed = data.map(r => {
        const eid = r.election || '2022'
        try {
          const scores = calculerResultats(r.reponses, getElectionData(eid))
          return { ...r, election: eid, topMatch: scores[0], scores }
        } catch {
          return { ...r, election: eid, topMatch: null, scores: [] }
        }
      })
      setRows(processed)
      buildStats(processed, events || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function buildStats(processed, events) {
    const now       = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo   = new Date(todayStart - 6 * 86400000)
    const yesterStart = new Date(todayStart - 86400000)

    const dateKey = d => {
      const dd = new Date(d)
      return `${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,'0')}-${String(dd.getDate()).padStart(2,'0')}`
    }
    const dayMap = {}
    for (let i = 13; i >= 0; i--) dayMap[dateKey(todayStart - i * 86400000)] = 0
    processed.forEach(r => {
      if (!r.created_at) return
      const k = dateKey(new Date(r.created_at))
      if (dayMap[k] !== undefined) dayMap[k]++
    })

    const todayCount     = processed.filter(r => r.created_at && new Date(r.created_at) >= todayStart).length
    const yesterdayCount = processed.filter(r => {
      if (!r.created_at) return false
      const d = new Date(r.created_at)
      return d >= yesterStart && d < todayStart
    }).length

    // Top candidates per election
    const topByEl = {}
    Object.keys(ELECTIONS).forEach(eid => { topByEl[eid] = {} })
    processed.forEach(r => {
      if (!r.topMatch) return
      const eid = r.election || '2022'
      if (!topByEl[eid]) topByEl[eid] = {}
      const cid = Number(r.topMatch.candidat.id)
      topByEl[eid][cid] = (topByEl[eid][cid] || 0) + 1
    })
    const topCandidates = Object.entries(topByEl).flatMap(([eid, map]) => {
      const { candidats } = getElectionData(eid)
      const cm = new Map(candidats.map(c => [c.id, c]))
      return Object.entries(map)
        .map(([cid, n]) => ({ data: cm.get(Number(cid)), n, eid }))
        .filter(x => x.data)
    }).sort((a, b) => b.n - a.n)

    // Avg scores per election
    const avgByEl = {}
    Object.keys(ELECTIONS).forEach(eid => {
      const { candidats } = getElectionData(eid)
      const sum = {}, cnt = {}
      processed.filter(r => (r.election || '2022') === eid).forEach(r => {
        if (!r.scores) return
        r.scores.forEach(s => {
          sum[s.candidat.id] = (sum[s.candidat.id] || 0) + s.pourcentage
          cnt[s.candidat.id] = (cnt[s.candidat.id] || 0) + 1
        })
      })
      avgByEl[eid] = candidats
        .map(c => ({ data: c, avg: cnt[c.id] ? Math.round(sum[c.id] / cnt[c.id]) : 0 }))
        .sort((a, b) => b.avg - a.avg)
    })

    const totalShares = processed.reduce((a, r) => a + (r.share_clicks || 0), 0)
    const sharedCount = processed.filter(r => (r.share_clicks || 0) > 0).length
    const byEl        = {}
    Object.keys(ELECTIONS).forEach(eid => { byEl[eid] = processed.filter(r => (r.election||'2022') === eid).length })

    setStats({
      total: processed.length,
      today: todayCount,
      trend: todayCount - yesterdayCount,
      week:  processed.filter(r => r.created_at && new Date(r.created_at) >= weekAgo).length,
      shareRate: processed.length > 0 ? Math.round((sharedCount / processed.length) * 100) : 0,
      totalShares,
      returnVisits: events.length,
      dayMap,
      topCandidates,
      avgByEl,
      byEl,
    })
  }

  async function deleteResult(id) {
    if (!confirm('Supprimer ce résultat définitivement ?')) return
    setDeleting(id)
    await fetch('/api/admin/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, token: getToken() }),
    })
    setRows(prev => prev.filter(r => r.id !== id))
    setDeleting(null)
  }

  const filtered = rows.filter(r =>
    (filterEl === 'all' || r.election === filterEl) &&
    (!search ||
      r.share_id?.includes(search) ||
      (r.topMatch && `${r.topMatch.candidat.prenom} ${r.topMatch.candidat.nom}`.toLowerCase().includes(search.toLowerCase())))
  )
  const paginated  = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const topMax     = stats?.topCandidates[0]?.n || 1
  const curElForAvg = filterEl === 'all' ? '2027' : filterEl

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
    </div>
  )

  return (
    <div className="py-7 max-w-5xl">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-white text-xl font-bold">Tableau de bord</h1>
          <p className="text-slate-600 text-xs mt-0.5">Vue d'ensemble des résultats</p>
        </div>
        {/* Election filter */}
        <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {[{ id: 'all', label: 'Tous' }, ...Object.values(ELECTIONS)].map(e => (
            <button key={e.id} onClick={() => { setFilterEl(e.id); setPage(0) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterEl === e.id ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
              style={filterEl === e.id ? { background: '#10b981' } : {}}>
              {e.label || e.id}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI cards ───────────────────────────────────────── */}
      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard label="Tests total"        value={stats.total}        icon="quiz"       color="#10b981" />
            <StatCard label="Aujourd'hui"        value={stats.today}        icon="today"      color="#60a5fa" trend={stats.trend} />
            <StatCard label="7 derniers jours"   value={stats.week}         icon="date_range" color="#a78bfa" />
            <StatCard label="Taux de partage"    value={`${stats.shareRate}%`} icon="share"  color="#f59e0b" sub={`${stats.totalShares} clics · ${stats.returnVisits} retours`} />
          </div>

          {/* Election split */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(stats.byEl).map(([eid, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={eid} className="rounded-2xl p-4 flex items-center gap-4"
                  style={{ background: '#0d1a35', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: eid === '2027' ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)' }}>
                    <span className="material-symbols-outlined text-[18px]"
                      style={{ color: eid === '2027' ? '#10b981' : '#64748b' }}>how_to_vote</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <span className="text-white font-bold text-lg">{count}</span>
                      <span className="text-slate-600 text-xs">{pct}%</span>
                    </div>
                    <p className="text-slate-500 text-xs truncate">Présidentielle {eid}
                      <span className="ml-1.5 text-[9px] font-black uppercase tracking-widest"
                        style={{ color: eid === '2027' ? '#10b981' : '#64748b' }}>
                        {ELECTIONS[eid]?.badge}
                      </span>
                    </p>
                    <div className="mt-1.5 w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: eid === '2027' ? '#10b981' : '#64748b' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl p-5" style={{ background: '#0d1a35', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">bar_chart</span>
                Activité — 14 derniers jours
              </h2>
              <p className="text-slate-600 text-xs mb-4">Tests complétés par jour</p>
              <ActivityChart dayMap={stats.dayMap} />
            </div>

            <div className="rounded-2xl p-5" style={{ background: '#0d1a35', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                <span className="text-[16px]">🏆</span>
                Top match #1
              </h2>
              <p className="text-slate-600 text-xs mb-4">Candidat en tête le plus souvent</p>
              <div className="space-y-2.5 overflow-y-auto max-h-28">
                {stats.topCandidates.slice(0, 8).map(({ data, n, eid }) => (
                  <CandidateBar key={`${eid}-${data.id}`}
                    label={`${data.prenom} ${data.nom}`}
                    value={n} max={topMax} count={n} color={data.couleur} />
                ))}
              </div>
            </div>
          </div>

          {/* Avg scores */}
          <div className="rounded-2xl p-5 mb-6" style={{ background: '#0d1a35', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-[16px]">leaderboard</span>
                  Score moyen par candidat
                </h2>
                <p className="text-slate-600 text-xs mt-0.5">Compatibilité moyenne sur tous les tests</p>
              </div>
              <div className="flex gap-1.5">
                {Object.keys(ELECTIONS).map(eid => (
                  <button key={eid}
                    onClick={() => setFilterEl(eid)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                      curElForAvg === eid ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    style={curElForAvg === eid ? { background: '#10b981' } : { background: 'rgba(255,255,255,0.05)' }}>
                    {eid}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(stats.avgByEl[curElForAvg] || []).map(({ data, avg }) => (
                <CandidateBar key={data.id}
                  label={`${data.prenom} ${data.nom}`}
                  value={avg} max={100} count={`${avg}%`} color={data.couleur} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Results table ───────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0d1a35', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 className="text-white font-semibold text-sm">
            Résultats
            <span className="ml-2 text-slate-600 font-normal text-xs">({filtered.length})</span>
          </h2>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            placeholder="Rechercher un share ID ou candidat…"
            className="text-xs placeholder-slate-600 text-white focus:outline-none w-52"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '6px 12px' }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['Date', 'Élection', 'Match #1', 'Score', 'Share ID', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-600 font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(r => {
                const elData  = getElectionData(r.election)
                const cm      = new Map(elData.candidats.map(c => [c.id, c]))
                const cdata   = r.topMatch ? cm.get(r.topMatch.candidat.id) : null
                return (
                  <tr key={r.id}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={r.election === '2027'
                          ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                          : { background: 'rgba(100,116,139,0.15)', color: '#64748b' }}>
                        {r.election || '2022'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.topMatch ? (
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cdata?.couleur || '#666' }} />
                          <span className="text-white font-medium">{r.topMatch.candidat.prenom} {r.topMatch.candidat.nom}</span>
                        </span>
                      ) : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="px-4 py-3 font-bold" style={{ color: cdata?.couleur || '#fff' }}>
                      {r.topMatch ? `${r.topMatch.pourcentage}%` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/resultats/${r.share_id}`} target="_blank" rel="noreferrer"
                        className="font-mono text-slate-600 hover:text-primary transition-colors">
                        {r.share_id?.slice(0, 10)}…
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteResult(r.id)} disabled={deleting === r.id}
                        className="text-slate-700 hover:text-red-400 transition-colors disabled:opacity-30 p-1">
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-700 text-xs">Aucun résultat</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-white disabled:opacity-30 transition-colors">
              <span className="material-symbols-outlined text-[15px]">chevron_left</span> Préc.
            </button>
            <span className="text-xs text-slate-600">Page {page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-white disabled:opacity-30 transition-colors">
              Suiv. <span className="material-symbols-outlined text-[15px]">chevron_right</span>
            </button>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  )
}
