import Link from 'next/link'
import Header from '@/components/Header'
import ManageCookiesButton from '@/components/ManageCookiesButton'

export const metadata = {
  title: 'Mentions légales — Politikz',
  description: 'Mentions légales du site Politikz.',
}

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-brand flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-10">
        <h1 className="text-white text-3xl font-extrabold mb-2">Mentions légales</h1>
        <p className="text-slate-400 text-sm mb-10">Dernière mise à jour : mars 2025</p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">

          {/* Éditeur */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Éditeur du site
            </h2>
            <p>
              Le site <strong className="text-white">www.politikz.com</strong> est édité à titre personnel par un particulier.
            </p>
            <p className="mt-2">
              <strong className="text-white">Responsable de publication :</strong> disponible sur demande à l'adresse{' '}
              <a href="mailto:contact@politikz.com" className="text-primary hover:underline">contact@politikz.com</a>
            </p>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Hébergement
            </h2>
            <p>Le site est hébergé par :</p>
            <div className="mt-2 bg-white/[0.05] rounded-xl p-4 border border-white/10">
              <p><strong className="text-white">Vercel Inc.</strong></p>
              <p>340 Pine Street, Suite 701</p>
              <p>San Francisco, CA 94104 — États-Unis</p>
              <p className="mt-1">
                Site web :{' '}
                <a href="https://vercel.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* Base de données */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Base de données
            </h2>
            <p>
              Le stockage des résultats partagés est assuré par <strong className="text-white">Supabase</strong>,
              dont les serveurs sont localisés en <strong className="text-white">Europe (eu-west)</strong>,
              en conformité avec le Règlement Général sur la Protection des Données (RGPD).
            </p>
            <p className="mt-2">
              Site web :{' '}
              <a href="https://supabase.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                supabase.com
              </a>
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Propriété intellectuelle
            </h2>
            <p>
              L'ensemble du contenu du site Politikz (textes, design, algorithme de matching, données des programmes électoraux)
              est protégé par les lois relatives à la propriété intellectuelle.
            </p>
            <p className="mt-2">
              Les programmes électoraux utilisés dans le quiz sont des documents publics issus des candidatures officielles
              à l'élection présidentielle française de 2022. Leur utilisation à des fins pédagogiques et non commerciales
              est reconnue par la loi.
            </p>
            <p className="mt-2">
              Toute reproduction, représentation, modification ou exploitation partielle ou totale du contenu propre à Politikz
              sans autorisation expresse est interdite.
            </p>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Limitation de responsabilité
            </h2>
            <p>
              Politikz est une plateforme indépendante et <strong className="text-white">non-partisane</strong>.
              Les résultats du quiz sont fournis à titre <strong className="text-white">indicatif et pédagogique uniquement</strong>.
              Ils ne constituent en aucun cas un conseil de vote ou une recommandation politique.
            </p>
            <p className="mt-2">
              Les données des programmes électoraux sont basées sur les documents officiels de la campagne présidentielle 2022.
              Une mise à jour est prévue pour l'élection présidentielle 2027.
              L'éditeur ne peut être tenu responsable d'éventuelles imprécisions ou évolutions des positions des candidats
              postérieures à la date de publication.
            </p>
          </section>

          {/* Publicité */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Publicité
            </h2>
            <p>
              Le site Politikz utilise <strong className="text-white">Google AdSense</strong> pour afficher des publicités.
              Google peut utiliser des cookies afin de diffuser des annonces en fonction de vos visites sur ce site
              et d'autres sites internet.
            </p>
            <p className="mt-2">
              Vous pouvez désactiver les annonces personnalisées en consultant la page{' '}
              <a
                href="https://www.google.com/settings/ads"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Paramètres des annonces Google
              </a>.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
              Contact
            </h2>
            <p>
              Pour toute question relative au site ou à ces mentions légales :{' '}
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
