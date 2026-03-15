'use client'
import { usePathname } from 'next/navigation'
import AdSlot from './AdSlot'

export default function AdsMobileTop() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <div aria-label="publicité" className="xl:hidden w-full flex justify-center py-1 bg-brand/60">
      <AdSlot slot="5643352375" style={{ width: '100%', height: 50 }} format="banner" />
    </div>
  )
}
