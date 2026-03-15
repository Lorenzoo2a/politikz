import Link from 'next/link'
import Header from '@/components/Header'

const BASE_URL = 'https://politikz.fr'

export const metadata = {
  title: 'Méthodologie — Comment calcule-t-on votre match politique ?',
  description: 'Découvrez comment Politikz calcule votre compatibilité avec chaque candidat : pondération des questions, chapitres thématiques et système de scoring transparent.',
  keywords: ['méthodologie quiz politique', 'calcul compatibilité politique', 'comment fonctionne politikz'],
  alternates: { canonical: `${BASE_URL}/methodologie` },
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full inline-block shrink-0"></span>
        {title}
      </h2>
      <div className="text-slate-300 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

export default function Methodologie() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-5 py-10">
        <h1 className="text-white text-3xl font-extrabold mb-2">Méthodologie</h1>
        <p className="text-slate-400 text-sm mb-10">Comment fonctionne Politikz ?</p>

        <div className="space-y-10">

          <Section title="Ce que Politikz est — et n'est pas">
            <p>
              Politikz est un <strong className="text-white">outil d'information civique</strong> à but non lucratif. Il a été conçu pour aider les citoyens à mieux comprendre les positions des candidats aux élections présidentielles françaises et à identifier ceux avec lesquels ils partagent le plus de convictions.
            </p>
            <p>
              <strong className="text-white">Politikz ne constitue en aucun cas un conseil de vote.</strong> Un résultat élevé avec un candidat ne signifie pas que vous devez voter pour lui. Le vote est un acte souverain et personnel qui prend en compte de nombreux facteurs que cet outil ne peut pas mesurer : le contexte local, les alliances politiques, la personne du candidat, son parcours, ses actions passées, ou des critères qui vous sont propres.
            </p>
            <p>
              Nous vous encourageons à utiliser ce résultat comme un <strong className="text-white">point de départ de réflexion</strong>, pas comme une conclusion.
            </p>
          </Section>

          <Section title="D'où viennent les positions des candidats ?">
            <p>
              Les positions attribuées à chaque candidat sont issues de leurs <strong className="text-white">programmes officiels</strong>, de leurs déclarations publiques, de leurs interviews et de leurs votes au Parlement (pour les élus). Chaque position a été déterminée manuellement à partir de ces sources.
            </p>
            <p>
              Quatre positions sont possibles pour chaque candidat sur chaque question :
            </p>
            <div className="grid grid-cols-2 gap-3 my-4">
              {[
                { val: 'Pour', color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300', desc: 'Le candidat soutient cette mesure dans son programme' },
                { val: 'Pour sous conditions', color: 'bg-amber-500/20 border-amber-500/30 text-amber-300', desc: 'Le candidat est favorable, mais sous certaines réserves ou contraintes' },
                { val: 'Contre', color: 'bg-red-500/20 border-red-500/30 text-red-300', desc: "Le candidat s'oppose à cette mesure" },
                { val: 'Neutre / NP', color: 'bg-slate-700/40 border-slate-600/30 text-slate-400', desc: 'Position non exprimée, ambiguë, ou non applicable' },
              ].map(p => (
                <div key={p.val} className={`rounded-xl border p-3 text-center ${p.color}`}>
                  <p className="font-bold text-sm mb-1">{p.val}</p>
                  <p className="text-xs opacity-80">{p.desc}</p>
                </div>
              ))}
            </div>
            <p>
              Dans le calcul, "Pour" et "Pour sous conditions" sont tous deux comptés comme une position positive. La nuance entre les deux est indicative et visible dans les résultats détaillés.
            </p>
          </Section>

          <Section title="Comment le score de compatibilité est calculé">
            <p>
              Pour chaque question, vous choisissez parmi <strong className="text-white">5 niveaux de réponse</strong> :
            </p>
            <div className="space-y-2 my-4">
              {[
                { label: "Absolument d'accord", weight: 'Intensité ×2', color: 'text-emerald-400' },
                { label: "Plutôt d'accord", weight: 'Intensité ×1', color: 'text-emerald-300' },
                { label: 'Neutre', weight: 'Ignoré', color: 'text-slate-500' },
                { label: "Plutôt pas d'accord", weight: 'Intensité ×1', color: 'text-red-300' },
                { label: "Absolument pas d'accord", weight: 'Intensité ×2', color: 'text-red-400' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between bg-white/[0.04] rounded-lg px-4 py-2.5">
                  <span>{r.label}</span>
                  <span className={`text-xs font-bold ${r.color}`}>{r.weight}</span>
                </div>
              ))}
            </div>
            <p>
              Pour chaque question répondue (hors neutre), on vérifie si vous et le candidat êtes du <strong className="text-white">même côté</strong> (tous les deux pour, ou tous les deux contre). Si oui, vous obtenez des points. Le poids de chaque point est calculé ainsi :
            </p>
            <div className="bg-white/[0.04] rounded-xl px-4 py-3 my-3 font-mono text-xs text-center text-slate-300">
              poids = intensité × poids_question × poids_thème
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-white font-bold">Intensité</span> — 1 ou 2 selon votre niveau de réponse (voir ci-dessus).</p>
              <p><span className="text-white font-bold">Poids de la question</span> — Les questions marquées comme <em>structurantes</em> (grandes thématiques qui différencient clairement les candidats) comptent double (×2). Les autres comptent ×1.</p>
              <p><span className="text-white font-bold">Poids du thème</span> — Chaque chapitre a un coefficient selon son importance politique globale :</p>
            </div>
            <div className="grid grid-cols-3 gap-2 my-3">
              {[
                { label: 'Démocratie', weight: '×1', color: 'text-slate-400' },
                { label: 'Pouvoir d\'achat', weight: '×2', color: 'text-sky-400' },
                { label: 'Énergie', weight: '×2', color: 'text-sky-400' },
                { label: 'Environnement', weight: '×2', color: 'text-sky-400' },
                { label: 'Sécurité & Justice', weight: '×2', color: 'text-sky-400' },
                { label: 'Europe & Monde', weight: '×2', color: 'text-sky-400' },
                { label: 'Économie & Travail', weight: '×3', color: 'text-primary' },
                { label: 'Retraites & Santé', weight: '×3', color: 'text-primary' },
                { label: 'Immigration', weight: '×3', color: 'text-primary' },
              ].map(t => (
                <div key={t.label} className="bg-white/[0.03] rounded-lg px-3 py-2 text-center border border-white/[0.06]">
                  <p className="text-slate-400 text-[10px] leading-tight mb-0.5">{t.label}</p>
                  <p className={`font-bold text-xs ${t.weight === '×3' ? 'text-primary' : t.weight === '×2' ? 'text-sky-400' : 'text-slate-500'}`}>{t.weight}</p>
                </div>
              ))}
            </div>
            <p>
              Le score final est le ratio <strong className="text-white">points obtenus / points maximum possibles</strong>, exprimé en pourcentage. Les questions auxquelles vous répondez "neutre" et celles où le candidat n'a pas de position ne sont pas comptabilisées.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mt-2">
              <p className="text-primary text-xs font-bold mb-1">Exemple</p>
              <p className="text-slate-300 text-xs">Vous êtes "Absolument d'accord" (intensité 2) avec une mesure structurante (×2) sur l'Immigration (×3) que le candidat soutient → <strong className="text-white">12 points sur 12</strong>. Même réponse mais le candidat s'y oppose → <strong className="text-white">0 point sur 12</strong>.</p>
            </div>
          </Section>

          <Section title="Questions structurantes et tirage aléatoire">
            <p>
              Le quiz contient un large pool de questions pour chaque élection. Pour ne pas rendre le test interminable, un <strong className="text-white">tirage aléatoire intelligent</strong> sélectionne les questions affichées :
            </p>
            <ul className="space-y-2 mt-2">
              {[
                'Les questions structurantes (marquées comme particulièrement différenciatrices) sont toujours incluses en priorité, dans la limite de 40 % du total.',
                'Un minimum de questions est garanti par thème, proportionnellement à leur taille, pour couvrir tous les sujets.',
                'Le reste est complété aléatoirement parmi les questions restantes.',
              ].map((l, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1 shrink-0">—</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2">
              Le <strong className="text-white">mode rapide</strong> tire 30 questions, le mode complet peut aller jusqu'à 100. Deux utilisateurs peuvent donc avoir des questions différentes, ce qui est normal : le score reste comparable car il est toujours calculé sur les questions effectivement répondues.
            </p>
          </Section>

          <Section title="Questions de précision (sous-questions)">
            <p>
              Sur certains sujets, une <strong className="text-white">question de précision</strong> peut apparaître immédiatement après votre réponse. Elle n'est déclenchée que si votre réponse est cohérente avec la question : par exemple, si vous êtes favorable à une mesure, on peut vous demander une précision sur ses modalités de financement ou de mise en œuvre.
            </p>
            <p>
              Ces sous-questions permettent de mieux distinguer des candidats qui partagent un objectif mais divergent sur les moyens. Si vous changez votre réponse à la question parente en revenant en arrière, la sous-question est automatiquement retirée ou remplacée.
            </p>
          </Section>

          <Section title="Limites de la méthode">
            <p>Tout outil de ce type comporte des limites inhérentes. Nous les assumons et les listons ici par transparence :</p>
            <ul className="space-y-2 mt-2">
              {[
                'Les questions sont nécessairement simplificatrices : la politique réelle est plus nuancée.',
                'Les positions sont une interprétation de sources publiques — elles peuvent comporter des inexactitudes ou évoluer.',
                "Pour 2027, les positions sont des projections basées sur les déclarations connues à ce jour. Elles seront mises à jour au fil de la campagne.",
                'Les pondérations thématiques reflètent une importance politique générale, pas nécessairement vos propres priorités.',
                'Le résultat n\'intègre pas la probabilité d\'élection, les coalitions ou la stratégie de vote utile.',
              ].map((l, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-slate-600 mt-1 shrink-0">—</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Données personnelles et confidentialité">
            <p>
              Vos réponses sont stockées de manière <strong className="text-white">anonyme</strong>. Aucune information d'identification personnelle (nom, email, IP) n'est collectée ni liée à vos réponses. Un identifiant aléatoire unique est généré pour permettre le partage de résultats.
            </p>
            <p>
              Vos réponses peuvent être supprimées en utilisant la fonction de suppression disponible sur votre page de résultats.
            </p>
          </Section>

          <Section title="Indépendance et financement">
            <p>
              Politikz est un projet <strong className="text-white">indépendant</strong>, sans affiliation à aucun parti politique, candidat, syndicat ou organisation. Il n'a reçu aucun financement politique. Il ne perçoit aucune rémunération de la part de candidats ou de partis pour son contenu.
            </p>
          </Section>

          <div className="border-t border-white/10 pt-8 flex flex-wrap gap-4 text-xs text-slate-500">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="/" className="hover:text-white transition-colors">← Retour à l'accueil</Link>
          </div>

        </div>
      </main>
    </div>
  )
}
