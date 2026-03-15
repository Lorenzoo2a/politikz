import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { questions as questions2022 } from '@/data/quizData'
import { questions as questions2027 } from '@/data/quizData2027'

function verifyToken(token) {
  const adminPwd = process.env.ADMIN_PASSWORD
  if (!adminPwd || !token) return false
  const expected = crypto.createHmac('sha256', adminPwd).update('politikz-admin').digest('hex')
  return token === expected
}

export async function POST(req) {
  const { token, election = '2022' } = await req.json()
  if (!verifyToken(token)) return Response.json({ ok: false }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const source = election === '2027' ? questions2027 : questions2022

  // For 2027, offset IDs to avoid collision with 2022 (IDs 1001–1100)
  const idOffset = election === '2027' ? 1000 : 0

  const rows = source.map(q => ({
    id: q.id + idOffset,
    texte: q.texte,
    chapitre: q.chapitre,
    positions: q.positions,
    actif: true,
    election,
  }))

  const { error } = await supabase.from('quiz_questions').upsert(rows, { onConflict: 'id' })
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true, seeded: rows.length, election })
}
