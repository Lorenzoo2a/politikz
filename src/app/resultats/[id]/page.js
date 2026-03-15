'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { calculerResultats, genererRaisons, genererDetailsCandidat, genererQuestionsAlignement } from '@/lib/matching'
import { getElectionData, DEFAULT_ELECTION } from '@/data/elections'

import Link from 'next/link'
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

// ── Circular progress ring ───────────────────────────────────────
function CircularProgress({ pct, color, size = 108, strokeWidth = 5 }) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(pct, 100) / 100)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s', filter: `drop-shadow(0 0 6px ${color}88)` }} />
    </svg>
  )
}

// ── Radar chart SVG ──────────────────────────────────────────────
function RadarChart({ reponses, chapitres, questions, friendReponses }) {
  const n = chapitres.length
  const size = 280
  const cx = size / 2, cy = size / 2
  const maxR = size / 2 - 38
  const containerRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function score(ch, reps) {
    const qs = questions.filter(q => q.chapitre === ch.id)
    const answered = qs.filter(q => reps?.[q.id]?.choix !== undefined)
    if (!answered.length) return 0.5
    return answered.reduce((s, q) => s + (reps[q.id].choix + 2) / 4, 0) / answered.length
  }

  function pt(i, v) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    return { x: cx + v * maxR * Math.cos(a), y: cy + v * maxR * Math.sin(a) }
  }

  function poly(scores) {
    return scores.map((v, i) => { const p = pt(i, v); return `${p.x},${p.y}` }).join(' ')
  }

  const myScores = chapitres.map(ch => score(ch, reponses))
  const friendScores = friendReponses ? chapitres.map(ch => score(ch, friendReponses)) : null

  function handleMouseMove(e) {
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x, y })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        transform: hovered
          ? `perspective(500px) rotateY(${tilt.x * 22}deg) rotateX(${-tilt.y * 22}deg) scale(1.04)`
          : 'perspective(500px) rotateY(0deg) rotateX(0deg) scale(1)',
        transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'crosshair',
      }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map(lv => (
          <polygon key={lv}
            points={chapitres.map((_, i) => { const p = pt(i, lv); return `${p.x},${p.y}` }).join(' ')}
            fill="none" stroke="white" strokeOpacity={lv === 0.5 ? 0.15 : 0.06} strokeWidth="1"
          />
        ))}
        {/* Axes */}
        {chapitres.map((_, i) => {
          const p = pt(i, 1)
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="white" strokeOpacity="0.08" strokeWidth="1" />
        })}
        {/* Friend polygon */}
        {friendScores && (
          <polygon points={poly(friendScores)} fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.7" />
        )}
        {/* My polygon */}
        <polygon points={poly(myScores)} fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="2" />
        {/* Glow highlight qui suit la souris */}
        {hovered && (
          <circle
            cx={cx + tilt.x * maxR * 1.4}
            cy={cy + tilt.y * maxR * 1.4}
            r="28"
            fill="rgba(16,185,129,0.08)"
            style={{ filter: 'blur(8px)', pointerEvents: 'none' }}
          />
        )}
        {/* Emoji labels */}
        {chapitres.map((ch, i) => {
          const p = pt(i, 1.28)
          return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="13">{ch.emoji}</text>
        })}
      </svg>
    </div>
  )
}

// ── Spectre politique ────────────────────────────────────────────
const SPECTRUM_SCORES = {
  '2027': { 1: 0.88, 2: 0.91, 3: 0.73, 4: 0.76, 5: 0.97, 6: 0.62, 7: 0.52, 8: 0.50, 9: 0.30, 10: 0.08, 11: 0.20, 12: 0.05 },
  '2022': { 1: 0.52, 2: 0.88, 3: 0.10, 4: 0.96, 5: 0.70, 6: 0.30, 7: 0.58, 8: 0.15, 9: 0.78, 10: 0.28, 11: 0.04, 12: 0.02 },
}
const SPECTRUM_ZONES = ['Extrême gauche', 'Gauche', 'Centre gauche', 'Centre', 'Centre droit', 'Droite', 'Extrême droite']
const SPECTRUM_SHORT = ['Ext. gauche', 'Gauche', 'Ctr. gauche', 'Centre', 'Ctr. droit', 'Droite', 'Ext. droite']

function spectrumColor(p) {
  if (p < 0.5) {
    const t = p * 2
    return `rgb(${Math.round(239 + (234 - 239) * t)},${Math.round(68 + (179 - 68) * t)},${Math.round(68 + (8 - 68) * t)})`
  }
  const t = (p - 0.5) * 2
  return `rgb(${Math.round(234 + (59 - 234) * t)},${Math.round(179 + (130 - 179) * t)},${Math.round(8 + (246 - 8) * t)})`
}

function PoliticalSpectrum({ resultats, secondResultats, electionId }) {
  const [shown, setShown] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShown(true), 150); return () => clearTimeout(t) }, [])

  const scoreMap = SPECTRUM_SCORES[electionId] || SPECTRUM_SCORES['2027']

  function calcPosition(res) {
    if (!res?.length) return null
    const total = res.reduce((s, r) => s + r.pourcentage, 0)
    return total > 0 ? res.reduce((s, r) => s + (scoreMap[r.candidat.id] ?? 0.5) * r.pourcentage, 0) / total : 0.5
  }

  const position = calcPosition(resultats) ?? 0.5
  const friendPosition = calcPosition(secondResultats)

  const zoneIdx = Math.min(6, Math.floor(position * 7))
  const color = spectrumColor(position)
  const friendColor = '#a78bfa'
  const leftPct = `${(shown ? position : 0.5) * 100}%`
  const friendLeftPct = friendPosition !== null ? `${(shown ? friendPosition : 0.5) * 100}%` : null

  return (
    <div className="mb-5 animate-fade-in" style={{ animationDelay: '0.05s' }}>
      <p className="text-slate-500 text-[10px] uppercase tracking-[0.18em] font-semibold mb-3">
        Positionnement politique
      </p>
      <div className="px-4 pt-5 pb-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Zone label */}
        <p className="text-center font-black text-lg mb-5 tracking-tight" style={{ color }}>{SPECTRUM_ZONES[zoneIdx]}</p>

        {/* Bar + cursors */}
        <div className="relative mx-1 mb-2" style={{ paddingTop: 32, paddingBottom: friendLeftPct ? 28 : 0 }}>

          {/* TOI badge (above) */}
          <div className="absolute top-0 transition-[left] duration-1000 ease-out"
            style={{ left: leftPct, transform: 'translateX(-50%)', transitionDelay: shown ? '0.1s' : '0s' }}>
            <div className="px-2 py-0.5 rounded-md text-[9px] font-black text-white text-center whitespace-nowrap"
              style={{ background: color, boxShadow: `0 0 10px ${color}80` }}>TOI</div>
            <div className="w-0 h-0 mx-auto" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `6px solid ${color}` }} />
          </div>

          {/* Gradient bar */}
          <div className="h-4 rounded-full w-full" style={{ background: 'linear-gradient(to right, #ef4444 0%, #f97316 18%, #eab308 50%, #60a5fa 82%, #3b82f6 100%)' }} />

          {/* TOI dot */}
          <div className="absolute top-[32px] transition-[left] duration-1000 ease-out"
            style={{ left: leftPct, transform: 'translate(-50%, -50%)', transitionDelay: shown ? '0.1s' : '0s' }}>
            <div className="w-5 h-5 rounded-full border-[2.5px] border-white" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
          </div>

          {/* TON AMI badge (below bar) */}
          {friendLeftPct && (
            <>
              <div className="absolute top-[36px] transition-[left] duration-1000 ease-out"
                style={{ left: friendLeftPct, transform: 'translateX(-50%)', transitionDelay: shown ? '0.15s' : '0s' }}>
                <div className="w-0 h-0 mx-auto" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: `6px solid ${friendColor}` }} />
                <div className="px-2 py-0.5 rounded-md text-[9px] font-black text-white text-center whitespace-nowrap mt-0.5"
                  style={{ background: friendColor, boxShadow: `0 0 10px ${friendColor}80` }}>TON AMI</div>
              </div>
            </>
          )}
        </div>

        {/* Labels */}
        <div className="flex mt-3">
          {SPECTRUM_SHORT.map((z, i) => (
            <div key={i} className="flex-1 text-center">
              <span className={`text-[8px] leading-tight block transition-colors ${zoneIdx === i ? 'font-bold' : 'text-slate-600'}`}
                style={zoneIdx === i ? { color } : {}}>
                {z}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const USER_LABELS = { 2: 'Absolument pour', 1: 'Plutôt pour', '-1': 'Plutôt contre', '-2': 'Absolument contre' }
const CAND_LABELS = { 1: 'Pour', 0.5: 'Sous cond.', '-1': 'Contre' }

function QuestionAlignRow({ q, accord }) {
  const uLabel = USER_LABELS[q.userChoix] || (q.userChoix > 0 ? 'Pour' : 'Contre')
  const cLabel = CAND_LABELS[q.candidatPos] || (q.candidatPos > 0 ? 'Pour' : 'Contre')
  return (
    <div className="flex items-start gap-2">
      <span className={`material-symbols-outlined icon-fill text-[11px] shrink-0 mt-0.5 ${accord ? 'text-emerald-500' : 'text-red-500'}`}>
        {accord ? 'check_circle' : 'cancel'}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-slate-300 text-[11px] leading-snug">{q.texte}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className={`text-[9px] font-bold ${q.userChoix > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            Vous : {uLabel}
          </span>
          <span className="text-slate-700 text-[9px]">·</span>
          <span className={`text-[9px] font-bold ${q.candidatPos > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            Candidat : {cLabel}
          </span>
        </div>
      </div>
    </div>
  )
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
    .select('reponses, election')
    .eq('share_id', shareId)
    .single()
  if (error || !data?.reponses) return null
  const electionId = data.election || '2022' // résultats sans colonne election = anciens résultats 2022
  const electionData = getElectionData(electionId)
  return {
    resultats: calculerResultats(data.reponses, electionData),
    reponses: data.reponses,
    election: electionId,
  }
}

function ResultatsContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id
  const compareId = searchParams.get('compare')
  const [filterChap, setFilterChap] = useState(0) // #12 filtre par thème

  const [electionId, setElectionId] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('politikz_election') || DEFAULT_ELECTION) : DEFAULT_ELECTION
  )
  const { candidats, chapitres, questions: allQuestions } = getElectionData(electionId)

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
        if (res.election) setElectionId(res.election)
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

  function trackShare() {
    const shareId = localStorage.getItem('politikz_share_id')
    if (shareId) fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'share', share_id: shareId }) }).catch(() => {})
  }

  function copierLien() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopie(true)
      setTimeout(() => setCopie(false), 2000)
      trackShare()
    })
  }

  function partagerWhatsApp() {
    trackShare()
    const url = window.location.href
    const msg = encodeURIComponent(`🗳️ Voici mes résultats sur Politikz !\nFais le test et compare notre compatibilité politique :\n${url}`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  function partagerTelegram() {
    trackShare()
    const url = encodeURIComponent(window.location.href)
    const txt = encodeURIComponent('🗳️ Voici mes résultats sur Politikz ! Fais le test et compare notre compatibilité politique.')
    window.open(`https://t.me/share/url?url=${url}&text=${txt}`, '_blank')
  }

  function partagerX() {
    trackShare()
    const url = encodeURIComponent(window.location.href)
    const txt = encodeURIComponent('🗳️ Je viens de découvrir ma compatibilité politique sur Politikz ! Et toi ?')
    window.open(`https://twitter.com/intent/tweet?text=${txt}&url=${url}`, '_blank')
  }

  function partagerEmail() {
    trackShare()
    const url = window.location.href
    const subject = encodeURIComponent('Mes résultats Politikz')
    const body = encodeURIComponent(`Voici mes résultats sur Politikz !\n\nFais le test et compare notre compatibilité politique :\n${url}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  async function genererStory() {
    try {
      const W = 1080, H = 1920
      const canvas = document.createElement('canvas')
      canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d')

      function loadImg(src) {
        return new Promise(resolve => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = () => resolve(null)
          img.src = src
        })
      }

      // Background
      ctx.fillStyle = '#0D2159'
      ctx.fillRect(0, 0, W, H)
      const glow = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, W * 0.75)
      glow.addColorStop(0, premierColor + '38')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)

      // ── Layout: measure total content height, then center vertically ──
      const photoR = 215
      const lW = 480, lH = Math.round(lW * (475.15 / 1920)) // ≈119px
      const badgePillH = 58
      // Total stacked height: logo + gap + ring+photo + badge overlap + gap + labels + cta
      const totalH = lH + 70 + (photoR + 12) * 2 + 20 + badgePillH + 65
                   + 38 + 20 + 100 + 100 + 44 + 60 + 38 + 48
      const startY = Math.round((H - totalH) / 2)

      // Logo
      try {
        const svgTxt = await fetch('/logo.svg').then(r => r.text())
        const logoUrl = URL.createObjectURL(new Blob([svgTxt], { type: 'image/svg+xml;charset=utf-8' }))
        const logoImg = await loadImg(logoUrl)
        URL.revokeObjectURL(logoUrl)
        if (logoImg) {
          ctx.drawImage(logoImg, (W - lW) / 2, startY, lW, lH)
        }
      } catch (_) { /* skip */ }

      // Photo
      const photoX = W / 2
      const photoY = startY + lH + 70 + photoR + 12
      // Ring
      const ring = ctx.createLinearGradient(photoX - photoR, photoY - photoR, photoX + photoR, photoY + photoR)
      ring.addColorStop(0, premierColor); ring.addColorStop(1, '#f97316')
      ctx.beginPath(); ctx.arc(photoX, photoY, photoR + 12, 0, Math.PI * 2)
      ctx.fillStyle = ring; ctx.fill()
      // Clip photo (object-fit: cover)
      ctx.save()
      ctx.beginPath(); ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2); ctx.clip()
      ctx.fillStyle = premierColor + '44'; ctx.fillRect(photoX - photoR, photoY - photoR, photoR * 2, photoR * 2)
      const photo = premierData?.photo ? await loadImg(premierData.photo) : null
      if (photo) {
        const size = photoR * 2
        const scale = Math.max(size / photo.naturalWidth, size / photo.naturalHeight)
        const sw = size / scale, sh = size / scale
        const sx = (photo.naturalWidth - sw) / 2, sy = (photo.naturalHeight - sh) / 2
        ctx.drawImage(photo, sx, sy, sw, sh, photoX - photoR, photoY - photoR, size, size)
      } else {
        ctx.fillStyle = 'white'; ctx.font = 'bold 130px system-ui'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(`${premier.candidat.prenom[0]}${premier.candidat.nom[0]}`, photoX, photoY)
      }
      ctx.restore()

      // % badge
      const badgeY = photoY + photoR + 20
      ctx.fillStyle = premierColor
      ctx.beginPath(); ctx.roundRect(photoX - 80, badgeY - badgePillH / 2, 160, badgePillH, 29); ctx.fill()
      ctx.fillStyle = 'white'; ctx.font = 'bold 34px system-ui'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(`${premier.pourcentage}%`, photoX, badgeY)

      // Text block
      const ty = badgeY + badgePillH / 2 + 65
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = premierColor; ctx.font = 'bold 30px system-ui'
      ctx.fillText('VOTRE MATCH PRINCIPAL', photoX, ty)
      ctx.fillStyle = 'white'; ctx.font = 'bold 92px system-ui'
      ctx.fillText(premier.candidat.prenom, photoX, ty + 115)
      ctx.fillText(premier.candidat.nom, photoX, ty + 215)
      ctx.fillStyle = 'rgba(148,163,184,0.85)'; ctx.font = '34px system-ui'
      ctx.fillText(premierData?.parti || '', photoX, ty + 270)

      // Divider
      const divY = ty + 310
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.fillRect(160, divY, W - 320, 1)

      // CTA
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '30px system-ui'
      ctx.fillText('Fais le test sur', photoX, divY + 60)
      ctx.fillStyle = 'white'; ctx.font = 'bold 40px system-ui'
      ctx.fillText('politikz.fr', photoX, divY + 112)

      // Share or download
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png'))
      const file = new File([blob], `politikz-${premier.candidat.nom.toLowerCase()}.png`, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Mon match Politikz' })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = file.name; a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Erreur génération story:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <span className="material-symbols-outlined text-primary text-4xl mb-4 block">hourglass_empty</span>
          <h2 className="text-white text-xl font-bold mb-2">Chargement…</h2>
        </div>
      </div>
    )
  }

  if (notFound || !resultats) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-accent-red/10 border border-accent-red/20 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-accent-red text-4xl">link_off</span>
          </div>
          <h2 className="text-white text-2xl font-black mb-3">Résultat introuvable</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Ce lien a expiré ou n'existe pas. Les résultats sont conservés 30 jours après le quiz.
          </p>
          <Link href="/quiz">
            <button className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-lg shadow-primary/25 mb-3">
              <span className="material-symbols-outlined text-[20px]">quiz</span>
              Faire le test moi-même
            </button>
          </Link>
          <Link href="/" className="block text-slate-500 text-sm hover:text-white transition-colors">
            Retour à l'accueil
          </Link>
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

  // Détecte si trop de réponses neutres (>50%) — résultats peu fiables
  const reponsesAffichees = isOwnResult ? myReponses : friendReponses
  const neutralWarning = (() => {
    if (!reponsesAffichees) return false
    const vals = Object.values(reponsesAffichees)
    if (vals.length < 15) return false
    return vals.filter(r => r.choix === 0).length / vals.length > 0.5
  })()

  // Score de confiance : % de réponses engagées (non-neutres)
  const totalQ = Object.keys(reponsesAffichees || {}).length
  const engagedQ = Object.values(reponsesAffichees || {}).filter(r => r.choix !== 0).length
  const scoreConfiance = totalQ >= 10 ? Math.round((engagedQ / totalQ) * 100) : null

  // Pire match
  const dernier = resultats[resultats.length - 1]
  const dernierData = dernier ? candidatsMap.get(dernier.candidat.id) : null

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
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-center px-4 pt-5 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Link href="/"><img src="/logo.svg" alt="Politikz" className="h-9 w-auto" /></Link>
      </div>

      <div className="flex-1 flex justify-center">
        <main className="flex-1 max-w-xl xl:max-w-[960px] w-full px-4 py-4">

          {/* ── Warning trop de neutres ── */}
          {neutralWarning && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-4 flex items-start gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-amber-400 text-[20px] shrink-0 mt-0.5">warning</span>
              <div>
                <p className="text-amber-300 font-bold text-sm mb-0.5">Résultats peu représentatifs</p>
                <p className="text-amber-400/80 text-xs leading-relaxed">
                  Plus de la moitié des réponses sont "Neutre". Le classement affiché peut manquer de précision — refaire le quiz en se positionnant davantage donnera un résultat plus juste.
                </p>
              </div>
            </div>
          )}

          {/* #14 ── Banner "Défie un ami" (visiteur sans résultat) ── */}
          {!isOwnResult && compat === null && (
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/40 rounded-2xl p-5 mb-5 animate-fade-in text-center"
              style={{ boxShadow: '0 0 32px rgba(16,185,129,0.12)' }}>
              <div className="text-2xl mb-2">⚔️</div>
              <h2 className="text-white font-black text-lg mb-1">Défie cet·te ami·e !</h2>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                Fais le quiz et découvre si vous êtes politiquement compatibles.
              </p>
              <Link href={`/quiz?compare=${id}`} className="block mb-2">
                <button className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  Lancer le quiz maintenant
                </button>
              </Link>
              <Link href={`/quiz?mode=rapide&compare=${id}`}
                className="block text-slate-400 text-xs hover:text-primary transition-colors">
                ou quiz rapide (30 questions)
              </Link>
            </div>
          )}

          {/* ── Desktop 2-col grid ── */}
          <div className="xl:grid xl:grid-cols-[1fr_380px] xl:gap-6 xl:items-start">
          <div className="min-w-0">

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
                  {/* CTA partage visiteur */}
                  {myResultats && (() => {
                    const myId = typeof window !== 'undefined' ? localStorage.getItem('politikz_share_id') : null
                    if (!myId) return null
                    return (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-slate-500 text-[10px] text-center mb-2">Partage aussi tes résultats !</p>
                        <button
                          onClick={() => { navigator.clipboard.writeText(`https://politikz.fr/resultats/${myId}`); setCopie(true); setTimeout(() => setCopie(false), 2000) }}
                          className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                          style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                          <span className="material-symbols-outlined text-[16px]">link</span>
                          {copie ? '✓ Lien copié !' : 'Copier mon lien résultats'}
                        </button>
                      </div>
                    )
                  })()}
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
            <div className="bg-navy-card border border-primary/25 rounded-2xl p-4 mb-5 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-bold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">compare_arrows</span>
                  Compatibilité avec votre ami·e
                </h2>
                <div className="text-2xl font-black" style={{ color: compatColor(compat) }}>{compat}%</div>
              </div>
              <p className="text-slate-400 text-xs mb-3 text-center font-medium">{compatLabel(compat)}</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/[0.05] rounded-xl p-2.5 text-center border border-white/10">
                  <p className="text-slate-500 text-[9px] uppercase tracking-widest mb-1">Moi</p>
                  <p className="text-white text-[11px] font-bold leading-tight">{premier.candidat.prenom} {premier.candidat.nom}</p>
                  <p className="font-black mt-0.5 text-sm" style={{ color: compatColor(compat) }}>{premier.pourcentage}%</p>
                </div>
                <div className="bg-white/[0.05] rounded-xl p-2.5 text-center border border-white/10">
                  <p className="text-slate-500 text-[9px] uppercase tracking-widest mb-1">Ami·e</p>
                  <p className="text-white text-[11px] font-bold leading-tight">{friendResultats[0].candidat.prenom} {friendResultats[0].candidat.nom}</p>
                  <p className="font-black mt-0.5 text-sm" style={{ color: compatColor(compat) }}>{friendResultats[0].pourcentage}%</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-3">{renderBars(resultats)}</div>
              {/* CTA défier d'autres amis */}
              <div className="pt-3 border-t border-white/8">
                <p className="text-slate-500 text-[10px] text-center mb-2">Défie d'autres amis !</p>
                <button onClick={copierLien}
                  className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <span className="material-symbols-outlined text-[16px]">group_add</span>
                  {copie ? '✓ Lien copié !' : 'Envoyer à un autre ami'}
                </button>
              </div>
            </div>
          )}

          {/* ── Match principal ── */}
          <section className="mb-8 animate-hero-entrance">
            {/* Hero card */}
            <div className="relative rounded-3xl overflow-hidden mb-4" style={{ background: `linear-gradient(160deg, ${premierColor}22, ${premierColor}08)`, border: `1px solid ${premierColor}30` }}>
              {/* Glow bg */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: premierColor }} />

              <div className="relative flex items-center gap-5 p-5">
                {/* Photo + ring */}
                <div className="relative shrink-0" style={{ width: 108, height: 108 }}>
                  <CircularProgress pct={animateBars ? premier.pourcentage : 0} color={premierColor} size={108} strokeWidth={5} />
                  <div className="absolute rounded-full overflow-hidden border-2" style={{ inset: 7, background: `linear-gradient(135deg, ${premierColor}88, ${premierColor}44)`, borderColor: `${premierColor}50` }}>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white">
                      {premier.candidat.prenom[0]}{premier.candidat.nom[0]}
                    </div>
                    {premierData?.photo && (
                      <img src={premierData.photo} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: premierColor }}>
                    🏆 {isOwnResult ? 'Votre match principal' : 'Son match principal'}
                  </p>
                  <h1 className="text-white text-2xl font-black leading-tight mb-0.5">
                    {premier.candidat.prenom}<br />{premier.candidat.nom}
                  </h1>
                  <p className="text-slate-400 text-xs mb-2">{premierData?.parti}</p>
                  {/* Score proéminent */}
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-4xl font-black leading-none" style={{ color: premierColor }}>{premier.pourcentage}</span>
                    <span className="text-xl font-black leading-none" style={{ color: `${premierColor}99` }}>%</span>
                    <span className="text-slate-500 text-xs">de compatibilité</span>
                  </div>
                  {premierData?.etiquettes && (
                    <div className="flex flex-wrap gap-1.5">
                      {premierData.etiquettes.map(tag => (
                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full text-slate-300 border" style={{ borderColor: `${premierColor}33`, background: `${premierColor}15` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── Mini podium 2e / 3e ── */}
          {resultats.length >= 3 && (
            <div className="grid grid-cols-2 gap-2 mb-4 animate-fade-in" style={{ animationDelay: '0.04s' }}>
              {resultats.slice(1, 3).map((r, i) => {
                const d = candidatsMap.get(r.candidat.id)
                const col = d?.couleur || '#1A3A7A'
                return (
                  <div key={r.candidat.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="text-base shrink-0">{i === 0 ? '🥈' : '🥉'}</span>
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border" style={{ background: `${col}44`, borderColor: `${col}55` }}>
                      <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-white">
                        {r.candidat.prenom[0]}{r.candidat.nom[0]}
                      </div>
                      {d?.photo && <img src={d.photo} alt="" loading="lazy" className="w-full h-full object-cover -mt-8" onError={e => { e.target.style.display = 'none' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-[11px] font-bold truncate">{r.candidat.prenom} {r.candidat.nom}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: animateBars ? `${r.pourcentage}%` : '0%', background: col, transitionDelay: '0.6s' }} />
                        </div>
                        <span className="text-[10px] font-black shrink-0" style={{ color: col }}>{r.pourcentage}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── CTA Partage — après le podium ── */}
          {isOwnResult && (
            <div className="mb-5 animate-fade-in">
              {!shareSaved && (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-2 text-amber-300 text-[11px]">
                  <span className="material-symbols-outlined text-[14px] shrink-0">warning</span>
                  Sauvegarde échouée — le lien ne fonctionnera pas
                </div>
              )}
              <button onClick={copierLien}
                className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-lg shadow-primary/20 mb-2">
                <span className="material-symbols-outlined text-[18px]">link</span>
                {copie ? '✓ Lien copié !' : 'Partager mes résultats'}
              </button>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { label: 'WhatsApp', bg: '#25D366', fn: partagerWhatsApp, icon: <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
                  { label: 'Telegram', bg: '#0088cc', fn: partagerTelegram, icon: <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
                  { label: 'X', bg: '#000', fn: partagerX, icon: <svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { label: 'Email', bg: '#334155', fn: partagerEmail, icon: <span className="material-symbols-outlined icon-fill text-white text-[18px]">mail</span> },
                  { label: 'Story', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', fn: genererStory, icon: <svg viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                ].map(({ label, bg, fn, icon }) => (
                  <button key={label} onClick={fn} className="flex flex-col items-center gap-1 group">
                    <div className="w-full aspect-square rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95" style={{ background: bg }}>{icon}</div>
                    <span className="text-[8px] text-slate-600 group-hover:text-slate-400">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Spectre + Radar (desktop: côte à côte, hauteur égale) ── */}
          <div className="xl:grid xl:grid-cols-2 xl:gap-4 xl:items-stretch">
            <PoliticalSpectrum
              resultats={isOwnResult ? resultats : (myResultats || resultats)}
              secondResultats={isOwnResult ? (friendResultats || null) : (myResultats ? resultats : null)}
              electionId={electionId}
            />
            {myReponses && (
              <div className="bg-navy-card rounded-xl p-4 border border-white/5 mb-5 animate-fade-in" style={{ animationDelay: '0.12s' }}>
                <h3 className="text-white font-bold mb-1 flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">radar</span>
                  {friendReponses ? 'Comparaison des profils' : 'Profil politique'}
                </h3>
                <p className="text-slate-500 text-[10px] mb-3">
                  {friendReponses
                    ? <><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: '#10b981' }} />Vous &nbsp;<span className="inline-block w-2 h-2 rounded-sm mr-1 ml-2" style={{ background: '#ef4444' }} />Ami·e</>
                    : 'Centre = neutre · Bord = opinion forte'}
                </p>
                <RadarChart
                  reponses={myReponses}
                  chapitres={chapitres}
                  questions={allQuestions}
                  friendReponses={friendReponses}
                />
              </div>
            )}
          </div>

          {/* ── Désaccords + Pourquoi (desktop: côte à côte, hauteur égale) ── */}
          <div className="xl:grid xl:grid-cols-2 xl:gap-4 xl:items-stretch mb-3">
            {/* Désaccords */}
            {isOwnResult && (() => {
              const desaccords = [...(premier.chapitresScores || [])]
                .filter(ch => ch.pourcentage !== null && ch.pourcentage < 40)
                .sort((a, b) => a.pourcentage - b.pourcentage)
                .slice(0, 3)
              if (desaccords.length === 0) return null
              return (
                <div className="bg-red-500/[0.06] rounded-xl p-4 border border-red-500/15 mb-5 xl:mb-0 xl:h-full animate-fade-in" style={{ animationDelay: '0.08s' }}>
                  <h3 className="flex items-center gap-2 text-red-400 font-bold text-sm mb-3">
                    <span className="material-symbols-outlined text-[16px] icon-fill">thumb_down</span>
                    Désaccords avec {premier.candidat.prenom} {premier.candidat.nom}
                  </h3>
                  <div className="space-y-1.5">
                    {desaccords.map(ch => (
                      <div key={ch.id} className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">{ch.emoji} {ch.nom}</span>
                        <span className="text-red-400 font-bold text-sm">{ch.pourcentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Pourquoi */}
            <div className="rounded-xl p-4 border mb-5 xl:mb-0 xl:h-full animate-fade-in" style={{ animationDelay: '0.1s', background: `${premierColor}0a`, borderColor: `${premierColor}25` }}>
              <h3 className="flex items-center gap-2 text-white font-bold text-sm mb-3">
                <span className="material-symbols-outlined text-[16px] icon-fill" style={{ color: premierColor }}>auto_awesome</span>
                Pourquoi ce match ?
              </h3>
              <ul className="space-y-2">
                {raisons.map((raison, i) => (
                  <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-black" style={{ background: `${premierColor}25`, color: premierColor }}>
                      {i + 1}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">{raison}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          </div>{/* end left col */}
          <div className="xl:sticky xl:top-4 min-w-0" style={{ maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto' }}>

          {/* ── Classement complet ── */}
          <div className="flex items-center justify-between mb-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <h3 className="text-white text-lg font-bold">
              Classement
              <span className="text-slate-500 text-sm font-normal ml-2">12 candidats</span>
            </h3>
            {scoreConfiance !== null && (
              <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg ${scoreConfiance >= 70 ? 'bg-primary/10 text-primary' : scoreConfiance >= 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                <span className="material-symbols-outlined text-[13px]">verified</span>
                {scoreConfiance}% de fiabilité
              </div>
            )}
          </div>

          {/* #12 Filtre par thème */}
          <div className="flex flex-wrap gap-1.5 mb-4 animate-fade-in" style={{ animationDelay: '0.17s' }}>
            <button onClick={() => setFilterChap(0)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${filterChap === 0 ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/[0.04] text-slate-500 hover:text-slate-300 border border-white/5'}`}>
              Tous
            </button>
            {chapitres.map(ch => (
              <button key={ch.id} onClick={() => setFilterChap(filterChap === ch.id ? 0 : ch.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${filterChap === ch.id ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/[0.04] text-slate-500 hover:text-slate-300 border border-white/5'}`}>
                {ch.emoji} {ch.nom}
              </button>
            ))}
          </div>

          <div className="space-y-3 mb-8">
            {[...resultats]
              .map(r => ({
                ...r,
                _score: filterChap === 0
                  ? r.pourcentage
                  : (r.chapitresScores?.find(c => c.id === filterChap)?.pourcentage ?? 0),
              }))
              .sort((a, b) => b._score - a._score)
              .map((resultat, index) => {
              const fullData = candidatsMap.get(resultat.candidat.id)
              const color = fullData?.couleur || '#1A3A7A'
              const isFirst = index === 0
              const isExpanded = expandedId === resultat.candidat.id
              const details = isExpanded ? genererDetailsCandidat(resultat) : null
              const candidatIdx = isExpanded ? candidats.findIndex(c => c.id === resultat.candidat.id) : -1
              const qDetails = (isExpanded && reponsesAffichees && candidatIdx >= 0)
                ? genererQuestionsAlignement(candidatIdx, reponsesAffichees, allQuestions, chapitres)
                : null

              return (
                <div key={resultat.candidat.id} className="animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : resultat.candidat.id)}
                    className={`group relative flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 ease-out ${isExpanded ? 'rounded-t-2xl' : 'rounded-2xl'} ${isFirst ? 'bg-navy-card border-2 border-accent-red/30 hover:border-accent-red/60 hover:shadow-xl hover:shadow-accent-red/15' : 'bg-navy-card/40 border border-white/5 hover:bg-navy-card hover:border-white/15 hover:shadow-lg hover:shadow-white/5'} ${isExpanded ? '' : 'hover:scale-[1.01]'} ${isExpanded ? 'border-b-0 rounded-b-none' : ''}`}
                  >
                    <span className="w-6 text-center shrink-0 text-lg leading-none">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (
                        <span className={`font-black text-base ${index < 5 ? 'text-slate-500' : 'text-slate-700 group-hover:text-slate-500'}`}>{index + 1}</span>
                      )}
                    </span>
                    <div className={`relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 transition-all duration-300 ${isFirst ? 'border-accent-red/40 group-hover:border-accent-red' : 'border-white/10 group-hover:border-white/30'} ${index > 4 ? 'grayscale-[50%] group-hover:grayscale-0' : ''}`} style={{ background: `linear-gradient(135deg, ${color}, ${color}66)` }}>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        {resultat.candidat.prenom[0]}{resultat.candidat.nom[0]}
                      </div>
                      {fullData?.photo && (
                        // #16 lazy loading — priority seulement sur top 3
                        <img src={fullData.photo} alt="" loading={index < 3 ? 'eager' : 'lazy'} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{resultat.candidat.prenom} {resultat.candidat.nom}</p>
                      <p className="text-slate-400 text-xs truncate transition-colors duration-300 group-hover:text-slate-300">{resultat.candidat.parti}</p>
                      <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: animateBars ? `${resultat._score}%` : '0%', background: isFirst ? 'linear-gradient(90deg, #cf2a2a, #f97316)' : `linear-gradient(90deg, ${color}, ${color}88)`, transitionDelay: `${0.3 + index * 0.1}s` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`font-black text-lg transition-all duration-300 ${isFirst ? 'text-accent-red group-hover:text-orange-400' : 'text-slate-300 group-hover:text-white'}`}>
                        {resultat._score}%
                      </span>
                      <span className={`material-symbols-outlined text-slate-500 text-[20px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:text-slate-300'}`}>
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className={`overflow-hidden transition-all duration-400 ease-out ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
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

                      {/* ── Questions spécifiques ── */}
                      {qDetails && (qDetails.accords.length > 0 || qDetails.desaccords.length > 0) && (
                        <div className="mt-3 pt-3 border-t border-white/[0.06]">
                          <p className="text-slate-600 text-[9px] uppercase tracking-wider font-bold mb-2.5">Questions clés</p>
                          <div className="space-y-2.5">
                            {qDetails.accords.slice(0, 3).map((q, i) => (
                              <QuestionAlignRow key={`a${i}`} q={q} accord={true} />
                            ))}
                            {qDetails.desaccords.slice(0, 3).map((q, i) => (
                              <QuestionAlignRow key={`d${i}`} q={q} accord={false} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Pire match ── */}
          {dernier && dernierData && (
            <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.35s' }}>
              <p className="text-slate-600 text-[10px] uppercase tracking-[0.18em] font-semibold mb-2">
                Candidat le plus opposé
              </p>
              <div className="flex items-center gap-3 p-3.5 bg-red-500/[0.05] rounded-xl border border-red-500/10">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-red-500/20" style={{ background: dernierData.couleur + '33' }}>
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white">
                    {dernier.candidat.prenom[0]}{dernier.candidat.nom[0]}
                  </div>
                  {dernierData.photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={dernierData.photo} alt="" loading="lazy" className="w-full h-full object-cover -mt-9" onError={(e) => { e.target.style.display = 'none' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold">{dernier.candidat.prenom} {dernier.candidat.nom}</p>
                  <p className="text-slate-500 text-xs truncate">{dernierData.parti}</p>
                </div>
                <span className="text-red-400 font-black text-xl shrink-0">{dernier.pourcentage}%</span>
              </div>
            </div>
          )}

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

          {!isOwnResult && !myResultats && (
            <Link href={`/quiz?compare=${id}`} className="block mb-4">
              <button className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-lg shadow-primary/25">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Lancer le quiz pour comparer
              </button>
            </Link>
          )}

          <Link href="/quiz" className="block mb-4">
            <button className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-[0.97] group">
              <span className="material-symbols-outlined text-[18px] transition-transform duration-500 group-hover:rotate-180">refresh</span>
              Refaire le quiz
            </button>
          </Link>

          <p className="text-slate-500 text-[10px] text-center leading-relaxed italic pb-4">
            Ce test ne constitue pas un conseil de vote. Il est un outil pédagogique basé sur les programmes officiels de 2022 et ne reflète pas nécessairement l&apos;évolution actuelle du paysage politique.
          </p>
          </div>{/* end right col */}
          </div>{/* end desktop grid */}
        </main>
      </div>
    </div>
  )
}

export default function ResultatsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl">hourglass_empty</span>
      </div>
    }>
      <ResultatsContent />
    </Suspense>
  )
}
