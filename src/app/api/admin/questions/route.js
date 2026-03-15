import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

function verifyToken(token) {
  const adminPwd = process.env.ADMIN_PASSWORD
  if (!adminPwd || !token) return false
  const expected = crypto.createHmac('sha256', adminPwd).update('politikz-admin').digest('hex')
  return token === expected
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const election = searchParams.get('election') || '2022'
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('election', election)
    .order('id', { ascending: true })
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true, questions: data })
}

export async function POST(req) {
  const { token, question, election = '2022' } = await req.json()
  if (!verifyToken(token)) return Response.json({ ok: false }, { status: 401 })
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('quiz_questions')
    .insert({ texte: question.texte, chapitre: question.chapitre, positions: question.positions, actif: true, election, source_url: question.source_url ?? null, sous_questions: question.sous_questions ?? [] })
    .select()
    .single()
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true, question: data })
}

export async function PUT(req) {
  const { token, id, question } = await req.json()
  if (!verifyToken(token)) return Response.json({ ok: false }, { status: 401 })
  const supabase = getSupabase()
  const { error } = await supabase
    .from('quiz_questions')
    .update({ texte: question.texte, chapitre: question.chapitre, positions: question.positions, actif: question.actif, source_url: question.source_url ?? null, sous_questions: question.sous_questions ?? [] })
    .eq('id', id)
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

export async function DELETE(req) {
  const { token, id } = await req.json()
  if (!verifyToken(token)) return Response.json({ ok: false }, { status: 401 })
  const supabase = getSupabase()
  const { error } = await supabase
    .from('quiz_questions')
    .update({ actif: false })
    .eq('id', id)
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
