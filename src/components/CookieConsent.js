'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const CONSENT_KEY = 'politikz_cookie_consent'

function loadAdsense(personalized) {
  if (document.getElementById('adsense-script')) return
  if (!personalized) {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.requestNonPersonalizedAds = 1
  }
  const script = document.createElement('script')
  script.id = 'adsense-script'
  script.async = true
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2315710604255343'
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved) {
      loadAdsense(saved === 'accepted')
    } else {
      setVisible(true)
    }

    const handler = () => setVisible(true)
    window.addEventListener('show-cookie-banner', handler)
    return () => window.removeEventListener('show-cookie-banner', handler)
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
    loadAdsense(true)
  }

  function refuse() {
    localStorage.setItem(CONSENT_KEY, 'refused')
    setVisible(false)
    loadAdsense(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto bg-[#0f1e4a] border border-white/15 rounded-2xl shadow-2xl shadow-black/50 p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 bg-accent-red/15 p-1.5 rounded-lg border border-accent-red/20">
            <span className="material-symbols-outlined text-accent-red text-[18px]">cookie</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-1">Ce site utilise des cookies</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Nous utilisons des cookies publicitaires (Google AdSense) pour financer ce service gratuit.
              Vous pouvez accepter les annonces personnalisées ou refuser — dans ce cas des annonces génériques seront affichées.{' '}
              <Link href="/politique-de-confidentialite" className="text-primary hover:underline">
                En savoir plus
              </Link>
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={accept}
            className="flex-1 bg-primary hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-[0.97] hover:scale-[1.01]"
          >
            Accepter
          </button>
          <button
            onClick={refuse}
            className="flex-1 bg-white/[0.07] hover:bg-white/[0.12] text-slate-300 font-semibold py-2.5 rounded-xl text-sm border border-white/10 transition-all active:scale-[0.97]"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  )
}
