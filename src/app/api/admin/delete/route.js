import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(req) {
  const { id, token } = await req.json()
  const adminPwd = process.env.ADMIN_PASSWORD
  const expected = crypto.createHmac('sha256', adminPwd).update('politikz-admin').digest('hex')
  if (!adminPwd || token !== expected) {
    return Response.json({ ok: false }, { status: 401 })
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { error } = await supabase.from('resultats').delete().eq('id', id)
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
