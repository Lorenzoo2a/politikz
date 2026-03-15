const BASE_URL = 'https://politikz.fr'

export const metadata = {
  title: 'Quiz politique 2027 — Quel candidat me correspond ?',
  description: 'Répondez à 30 ou 100 questions sur vos positions politiques et découvrez instantanément quel candidat à la présidentielle 2027 vous correspond le mieux. Gratuit, sans inscription.',
  keywords: [
    'quiz politique 2027', 'test politique presidentielle', 'quel candidat voter',
    'comparaison candidats 2027', 'orientation politique quiz', 'boussole politique france',
    'quiz presidentielle france', 'test election 2027',
  ],
  alternates: { canonical: `${BASE_URL}/quiz` },
  openGraph: {
    title: 'Quiz politique 2027 — Quel candidat me correspond ?',
    description: 'Répondez à 30 ou 100 questions et découvrez votre match politique pour 2027.',
    url: `${BASE_URL}/quiz`,
    type: 'website',
    siteName: 'Politikz',
    locale: 'fr_FR',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Quiz politique Politikz 2027' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiz politique 2027 — Quel candidat me correspond ?',
    description: 'Faites le test et découvrez votre match politique pour la présidentielle 2027.',
    images: ['/og-default.png'],
  },
}

export default function QuizLayout({ children }) {
  return children
}
