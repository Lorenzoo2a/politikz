import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import CookieConsent from '@/components/CookieConsent'
import AdsLayout from '@/components/AdsLayout'
import AdsMobileTop from '@/components/AdsMobileTop'

const BASE_URL = 'https://politikz.fr'

export const metadata = {
  title: {
    default: 'Politikz — Découvrez votre match politique',
    template: '%s | Politikz',
  },
  description: 'Faites le test politique en ligne et découvrez quel candidat à la présidentielle 2027 correspond le mieux à vos convictions. Quiz politique gratuit, résultat instantané.',
  metadataBase: new URL(BASE_URL),
  keywords: [
    'test politique', 'quiz politique', 'match politique', 'présidentielle 2027',
    'candidat politique france', 'orientation politique', 'boussole politique',
    'vote 2027', 'politikz', 'quel candidat voter', 'programme politique',
    'comparaison candidats', 'election presidentielle france',
  ],
  authors: [{ name: 'Politikz', url: BASE_URL }],
  creator: 'Politikz',
  publisher: 'Politikz',
  category: 'politics',
  classification: 'Politique / Éducation civique',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: { 'fr-FR': BASE_URL },
  },
  openGraph: {
    title: 'Politikz — Découvrez votre match politique',
    description: 'Faites le test et découvrez quel candidat à la présidentielle 2027 correspond à vos convictions. Quiz gratuit, résultat instantané.',
    url: BASE_URL,
    siteName: 'Politikz',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Politikz — Votre match politique' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Politikz — Découvrez votre match politique',
    description: 'Faites le test et découvrez quel candidat 2027 correspond à vos convictions.',
    images: ['/og-default.png'],
    creator: '@politikz',
    site: '@politikz',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  verification: {
    // google: 'VOTRE_CODE_GOOGLE_SEARCH_CONSOLE',
    // yandex: 'VOTRE_CODE_YANDEX',
    // bing: 'VOTRE_CODE_BING_WEBMASTER',
  },
}

const SCHEMA_ORG = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Politikz',
    url: BASE_URL,
    description: 'Quiz politique pour découvrir votre match avec les candidats à la présidentielle française 2027.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    inLanguage: 'fr',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    potentialAction: {
      '@type': 'StartAction',
      name: 'Commencer le quiz',
      target: `${BASE_URL}/quiz`,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Politikz',
    url: BASE_URL,
    inLanguage: 'fr',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/quiz` },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Comment fonctionne le quiz politique Politikz ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Politikz vous pose des questions sur vos positions politiques (économie, écologie, sécurité, etc.) et calcule votre niveau d\'accord avec chaque candidat à la présidentielle 2027.',
        },
      },
      {
        '@type': 'Question',
        name: 'Est-ce que Politikz est gratuit ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, Politikz est entièrement gratuit et sans inscription.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quel candidat me correspond le mieux pour 2027 ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Faites le quiz Politikz pour découvrir en quelques minutes quel candidat à la présidentielle 2027 correspond le mieux à vos convictions politiques.',
        },
      },
    ],
  },
])

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2315710604255343" />
        <meta name="theme-color" content="#0d1224" />
        <meta name="color-scheme" content="dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Politikz" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2315710604255343" crossOrigin="anonymous"></script>
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
        <style>{`
          @keyframes bgOrb1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(120px, 160px) scale(1.15); }
            66% { transform: translate(-80px, 80px) scale(0.9); }
          }
          @keyframes bgOrb2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-160px, -120px) scale(1.1); }
            66% { transform: translate(100px, -60px) scale(0.85); }
          }
          @keyframes bgOrb3 {
            0%, 100% { transform: translate(-50%, 0) scale(1); }
            50% { transform: translate(-50%, -140px) scale(1.2); }
          }
        `}</style>
        {/* Animated background orbs — purely decorative */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: -200, left: -150, background: 'radial-gradient(circle, rgba(59,130,246,0.38) 0%, transparent 65%)', animation: 'bgOrb1 14s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', bottom: -150, right: -150, background: 'radial-gradient(circle, rgba(237,41,57,0.30) 0%, transparent 65%)', animation: 'bgOrb2 18s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: '35%', left: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)', animation: 'bgOrb3 11s ease-in-out infinite' }} />
        </div>
        <AdsLayout />

        <div style={{ position: 'relative', zIndex: 1 }} className="pb-[68px] xl:pb-0">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SCHEMA_ORG }} />
          <AdsMobileTop />
          {children}
          <CookieConsent />
          <SpeedInsights />
          <Analytics />
        </div>
      </body>
    </html>
  )
}
