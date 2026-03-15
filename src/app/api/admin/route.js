import crypto from 'crypto'

export async function POST(req) {
  const { username, password } = await req.json()
  const adminPwd = process.env.ADMIN_PASSWORD
  if (!adminPwd || username !== 'admin' || password !== adminPwd) {
    return Response.json({ ok: false }, { status: 401 })
  }
  const token = crypto.createHmac('sha256', adminPwd).update('politikz-admin').digest('hex')
  return Response.json({ ok: true, token })
}
