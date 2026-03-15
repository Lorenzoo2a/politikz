import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  try {
    const { type, share_id } = await req.json()
    if (!type) return Response.json({ ok: false }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    if (type === 'share' && share_id) {
      // Increment share_clicks on the result row
      const { data } = await supabase
        .from('resultats')
        .select('share_clicks')
        .eq('share_id', share_id)
        .single()
      const current = data?.share_clicks || 0
      await supabase
        .from('resultats')
        .update({ share_clicks: current + 1 })
        .eq('share_id', share_id)
    } else {
      // Generic event (return_visit, etc.)
      await supabase.from('page_events').insert({ type })
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 500 })
  }
}
