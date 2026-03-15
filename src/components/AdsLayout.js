'use client'
import { usePathname } from 'next/navigation'
import AdSlot from './AdSlot'

export default function AdsLayout() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      {/* Desktop: fixed side ads (xl+) */}
      <div aria-label="publicité" className="hidden xl:flex fixed inset-y-0 left-0 items-center pointer-events-none" style={{ zIndex: 10, width: 180 }}>
        <div className="pointer-events-auto mx-auto" style={{ width: 160 }}>
          <AdSlot slot="9806926263" style={{ width: 160, height: 600 }} format="vertical" />
        </div>
      </div>
      <div aria-label="publicité" className="hidden xl:flex fixed inset-y-0 right-0 items-center pointer-events-none" style={{ zIndex: 10, width: 180 }}>
        <div className="pointer-events-auto mx-auto" style={{ width: 160 }}>
          <AdSlot slot="6301827922" style={{ width: 160, height: 600 }} format="vertical" />
        </div>
      </div>

      {/* Mobile: fixed bottom banner — z below CookieConsent (9999) */}
      <div aria-label="publicité" className="xl:hidden fixed bottom-0 left-0 right-0 flex justify-center bg-brand/80 backdrop-blur-sm" style={{ zIndex: 40, height: 60 }}>
        <AdSlot slot="3536063784" style={{ width: '100%', height: 50 }} format="banner" />
      </div>
    </>
  )
}
