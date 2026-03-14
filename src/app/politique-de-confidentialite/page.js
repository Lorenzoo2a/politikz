import Link from 'next/link'
import Header from '@/components/Header'
import ManageCookiesButton from '@/components/ManageCookiesButton'

export const metadata = {
  title: 'Politique de confidentialité — Politikz',
  description: 'Politique de confidentialité et protection des données personnelles de Politikz.',
}

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-brand flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-10">
        <h1 className="text-white text-3xl font-extrabold mb-2">Politique de confidentialité</h1>
        <p className="text-slate-400 text-sm mb-10">Dernière mise à jour : mars 2025</p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">

          {/* Introduction */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Introduction
            </h2>
            <p>
              La présente politique de confidentialité décrit comment le site <strong className="text-white">www.politikz.com</strong>{' '}
              (ci-après « Politikz ») collecte, utilise et protège les informations vous concernant lorsque vous utilisez le service.
            </p>
            <p className="mt-2">
              Politikz est conforme au <strong className="text-white">Règlement Général sur la Protection des Données (RGPD)</strong>{' '}
              (UE) 2016/679 et à la loi Informatique et Libertés.
            </p>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Données collectées
            </h2>
            <p className="mb-3">Politikz ne collecte <strong className="text-white">aucune donnée personnelle identifiable</strong> (nom, email, adresse IP…).</p>

            <div className="space-y-3">
              <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-1">Résultats du quiz (base de données)</h3>
                <p>
                  Lorsque vous terminez un quiz et choisissez de partager votre résultat, un identifiant unique anonyme
                  (ex : <code className="bg-white/10 px-1 rounded text-xs">a8f3k2zx</code>) est généré aléatoirement
                  et associé à vos réponses et scores dans notre base de données.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-slate-400">
                  <li>Aucune information personnelle n'est enregistrée.</li>
                  <li>Les données sont <strong className="text-slate-300">entièrement anonymes</strong>.</li>
                  <li>Elles sont conservées pendant <strong className="text-slate-300">1 mois</strong> à compter de la création du résultat partagé, puis supprimées automatiquement.</li>
                </ul>
              </div>

              <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-1">Stockage local (localStorage)</h3>
                <p>
                  Vos réponses en cours de quiz et votre identifiant de résultat sont temporairement stockés dans le
                  stockage local de votre navigateur (<code className="bg-white/10 px-1 rounded text-xs">localStorage</code>).
                  Ces données restent sur votre appareil et ne sont jamais transmises à des tiers.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-slate-400">
                  <li>Clés utilisées : <code className="bg-white/10 px-1 rounded text-xs">politikz_reponses</code>, <code className="bg-white/10 px-1 rounded text-xs">politikz_resultats</code>, <code className="bg-white/10 px-1 rounded text-xs">politikz_share_id</code></li>
                  <li>Vous pouvez les supprimer à tout moment depuis les paramètres de votre navigateur.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Données sensibles */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Données politiques et sensibles
            </h2>
            <p>
              Les réponses au quiz portent sur des opinions politiques, considérées comme des{' '}
              <strong className="text-white">données sensibles au sens de l'article 9 du RGPD</strong>.
            </p>
            <p className="mt-2">
              Conformément à ce règlement, Politikz s'engage à ne traiter ces données que de manière{' '}
              <strong className="text-white">strictement anonyme</strong>, sans possibilité d'identifier
              les personnes concernées, et uniquement dans le but d'afficher votre résultat de compatibilité politique.
            </p>
          </section>

          {/* Finalité */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Finalité du traitement
            </h2>
            <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                    <th className="text-left pb-2">Finalité</th>
                    <th className="text-left pb-2">Base légale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2 text-slate-300">Afficher votre résultat de matching politique</td>
                    <td className="py-2 text-slate-400">Intérêt légitime</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">Permettre le partage d'un lien de résultat</td>
                    <td className="py-2 text-slate-400">Consentement (partage volontaire)</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">Afficher des publicités (Google AdSense)</td>
                    <td className="py-2 text-slate-400">Consentement</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">Mesure d'audience anonyme (Vercel Analytics)</td>
                    <td className="py-2 text-slate-400">Intérêt légitime</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Cookies et publicité */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Cookies et publicité
            </h2>
            <p>
              Politikz utilise <strong className="text-white">Google AdSense</strong> pour afficher des publicités.
              Si vous avez accepté les cookies publicitaires, Google peut déposer des cookies afin de vous proposer
              des annonces personnalisées basées sur vos centres d'intérêt.
            </p>
            <p className="mt-2">
              Si vous avez refusé les cookies publicitaires, des annonces non personnalisées peuvent être affichées.
            </p>
            <p className="mt-2">
              Vous pouvez à tout moment modifier vos préférences via le bouton « Gérer mes cookies » en bas de page,
              ou directement sur{' '}
              <a
                href="https://www.google.com/settings/ads"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                google.com/settings/ads
              </a>.
            </p>
          </section>

          {/* Sous-traitants */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Sous-traitants et tiers
            </h2>
            <div className="bg-white/[0.05] rounded-xl p-4 border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                    <th className="text-left pb-2">Service</th>
                    <th className="text-left pb-2">Rôle</th>
                    <th className="text-left pb-2">Localisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2 font-medium text-white">Vercel</td>
                    <td className="py-2 text-slate-300">Hébergement & analytics</td>
                    <td className="py-2 text-slate-400">États-Unis</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-white">Supabase</td>
                    <td className="py-2 text-slate-300">Base de données résultats</td>
                    <td className="py-2 text-slate-400">Europe (eu-west)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-white">Google AdSense</td>
                    <td className="py-2 text-slate-300">Publicité</td>
                    <td className="py-2 text-slate-400">États-Unis</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-slate-400">
              Les transferts vers des sous-traitants situés hors de l'Union Européenne (Vercel, Google) s'effectuent
              dans le cadre des Clauses Contractuelles Types approuvées par la Commission Européenne.
            </p>
          </section>

          {/* Droits */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Vos droits
            </h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-slate-400">
              <li><strong className="text-slate-300">Droit d'accès</strong> : obtenir une copie de vos données.</li>
              <li><strong className="text-slate-300">Droit de rectification</strong> : corriger des informations inexactes.</li>
              <li><strong className="text-slate-300">Droit à l'effacement</strong> : demander la suppression de vos données.</li>
              <li><strong className="text-slate-300">Droit d'opposition</strong> : vous opposer à un traitement.</li>
              <li><strong className="text-slate-300">Droit à la portabilité</strong> : récupérer vos données dans un format lisible.</li>
            </ul>
            <p className="mt-3">
              Pour exercer vos droits, contactez-nous à :{' '}
              <a href="mailto:contact@politikz.com" className="text-primary hover:underline">contact@politikz.com</a>
            </p>
            <p className="mt-2">
              Vous pouvez également introduire une réclamation auprès de la{' '}
              <a
                href="https://www.cnil.fr"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                CNIL
              </a>{' '}
              (Commission Nationale de l'Informatique et des Libertés).
            </p>
          </section>

          {/* Mineurs */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Mineurs
            </h2>
            <p>
              Politikz est accessible à tous publics. Cependant, les publicités personnalisées via Google AdSense
              ne sont pas diffusées aux utilisateurs de moins de 13 ans, conformément aux politiques de Google
              et aux réglementations applicables.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Modifications de cette politique
            </h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
              La date de dernière mise à jour sera toujours indiquée en haut de cette page.
              En continuant à utiliser le site après modification, vous acceptez la nouvelle politique.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Contact
            </h2>
            <p>
              Pour toute question relative à la protection de vos données :{' '}
              <a href="mailto:contact@politikz.com" className="text-primary hover:underline">contact@politikz.com</a>
            </p>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
          <Link href="/" className="text-slate-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Retour à l'accueil
          </Link>
          <ManageCookiesButton />
        </div>
      </main>
    </div>
  )
}
