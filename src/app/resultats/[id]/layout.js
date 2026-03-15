const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://politikz.fr'

export async function generateMetadata({ params }) {
  const ogImage = `${BASE_URL}/api/og/${params.id}`
  return {
    // Pages de résultats personnelles → pas d'indexation Google
    robots: { index: false, follow: false },
    title: 'Mon match politique 2027 — Politikz',
    description: 'Découvrez avec quel candidat je suis le plus aligné politiquement, et faites le test pour comparer nos positions.',
    openGraph: {
      title: 'Voici mon match politique 2027 — Politikz',
      description: 'Découvrez avec quel candidat je suis le plus aligné, et faites le test pour voir notre compatibilité.',
      url: `${BASE_URL}/resultats/${params.id}`,
      siteName: 'Politikz',
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Mon match politique Politikz' }],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Voici mon match politique 2027 — Politikz',
      description: 'Faites le quiz et comparez notre compatibilité politique.',
      images: [ogImage],
    },
  }
}

export default function ResultatsLayout({ children }) {
  return children
}
