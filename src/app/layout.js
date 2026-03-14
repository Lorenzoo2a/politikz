import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import CookieConsent from '@/components/CookieConsent'

export const metadata = {
  title: 'Politikz — Découvrez votre match politique',
  description: 'Comparez vos convictions avec les programmes officiels des candidats à la présidentielle 2022.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2315710604255343" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-brand text-slate-100 min-h-screen font-display">
        {children}
        <CookieConsent />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
