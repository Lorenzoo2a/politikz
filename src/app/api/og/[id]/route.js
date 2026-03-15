import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'
import { calculerResultats } from '@/lib/matching'
import { getElectionData } from '@/data/elections'

export const runtime = 'nodejs'

export async function GET(req, { params }) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data } = await supabase
      .from('resultats')
      .select('reponses, election')
      .eq('share_id', params.id)
      .single()

    let prenom = '', nom = 'Politikz', pct = 0, parti = '', color = '#10b981'

    if (data?.reponses) {
      const electionData = getElectionData(data.election || '2022')
      const resultats = calculerResultats(data.reponses, electionData)
      if (resultats.length > 0) {
        const premier = resultats[0]
        prenom = premier.candidat.prenom
        nom = premier.candidat.nom
        pct = premier.pourcentage
        const c = electionData.candidats.find(c => c.id === premier.candidat.id)
        parti = c?.parti || ''
        color = c?.couleur || '#10b981'
      }
    }

    return new ImageResponse(
      (
        <div style={{
          display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #0a1832 0%, #0d2159 60%, #0a1832 100%)',
          fontFamily: 'sans-serif', padding: '60px', position: 'relative',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 500, height: 500,
            borderRadius: '50%', background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
          }} />

          {/* Logo */}
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 900, color: '#10b981', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 'auto' }}>
            POLITIKZ
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', fontSize: 18, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 20 }}>
              VOTRE MATCH PRINCIPAL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
              <span style={{ fontSize: 88, fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: -2 }}>
                {prenom}
              </span>
              <span style={{ fontSize: 88, fontWeight: 900, color, lineHeight: 1, letterSpacing: -2 }}>
                {nom}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{
                display: 'flex', background: color, borderRadius: 50,
                paddingLeft: 36, paddingRight: 36, paddingTop: 14, paddingBottom: 14,
              }}>
                <span style={{ fontSize: 52, fontWeight: 900, color: 'white' }}>{pct}%</span>
              </div>
              <span style={{ fontSize: 22, color: '#64748b', maxWidth: 320, lineHeight: 1.4 }}>{parti}</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', fontSize: 20, color: '#334155' }}>
            Découvrez votre match sur politikz.fr
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#0d2159' }}>
          <span style={{ fontSize: 72, fontWeight: 900, color: '#10b981' }}>POLITIKZ</span>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
