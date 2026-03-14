'use client'
import { useEffect, useRef } from 'react'

// Remplace slot="XXXXXXXX" par le vrai data-ad-slot de ton dashboard AdSense
// après approbation du compte.
export default function AdUnit({ slot, format = 'auto', className = '' }) {
  const adRef = useRef(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      const adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
      pushed.current = true
    } catch (e) {
      // AdSense pas encore chargé (cookies refusés ou script absent)
    }
  }, [])

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2315710604255343"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
