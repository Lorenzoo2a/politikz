import { questions as defaultQuestions, candidats as defaultCandidats, chapitres as defaultChapitres } from '@/data/quizData'

/**
 * Calcule le pourcentage de match entre les réponses de l'utilisateur et chaque candidat
 *
 * Système à 5 niveaux :
 *   +2 = Tout à fait d'accord    →  poids fort pour la comparaison
 *   +1 = Plutôt d'accord         →  poids normal
 *    0 = Je ne sais pas           →  ignoré dans le calcul
 *   -1 = Plutôt pas d'accord     →  poids normal
 *   -2 = Pas du tout d'accord    →  poids fort pour la comparaison
 *
 * Comparaison avec le candidat (qui a 1, -1, ou 0) :
 *   - User +2 et candidat +1 : très bon match → 2 points sur 2
 *   - User +1 et candidat +1 : bon match → 1 point sur 1
 *   - User +2 et candidat -1 : fort désaccord → 0 points sur 2
 *   - User -2 et candidat -1 : très bon match (les deux sont contre) → 2 points sur 2
 *
 * @param {object} reponses - Les réponses de l'utilisateur
 * @param {object|null} electionData - Données de l'élection { candidats, questions, chapitres } (optionnel, défaut 2022)
 */
export function calculerResultats(reponses, electionData = null) {
  const candidats = electionData?.candidats ?? defaultCandidats
  const questions = electionData?.questions ?? defaultQuestions
  const chapitres = electionData?.chapitres ?? defaultChapitres

  // Poids par chapitre (défini dans les données, défaut 1)
  const chapPoids = {}
  chapitres.forEach(ch => { chapPoids[ch.id] = ch.poids || 1 })

  const scores = candidats.map((candidat, index) => {
    let pointsObtenus = 0
    let pointsMax = 0
    const scoresParChapitre = {}

    chapitres.forEach(ch => {
      scoresParChapitre[ch.id] = { points: 0, max: 0 }
    })

    questions.forEach((question) => {
      const reponse = reponses[question.id]
      if (!reponse || reponse.choix === 0) return

      const positionCandidat = question.positions[index]
      if (positionCandidat === 0) return

      // Poids combiné : intensité × poids question × poids chapitre
      const intensite = Math.abs(reponse.choix)
      const qPoids = question.poids || 1
      const cPoids = chapPoids[question.chapitre] || 1
      const weight = intensite * qPoids * cPoids

      pointsMax += weight

      if (scoresParChapitre[question.chapitre]) {
        scoresParChapitre[question.chapitre].max += weight
      }

      // Vérifier si l'utilisateur et le candidat sont du même côté
      const userPositif = reponse.choix > 0
      const candidatPositif = positionCandidat > 0

      if (userPositif === candidatPositif) {
        pointsObtenus += weight
        if (scoresParChapitre[question.chapitre]) {
          scoresParChapitre[question.chapitre].points += weight
        }
      }
    })

    const pourcentage = pointsMax > 0 ? Math.round((pointsObtenus / pointsMax) * 100) : 0

    const chapitresScores = chapitres.map(ch => {
      const s = scoresParChapitre[ch.id]
      return {
        ...ch,
        pourcentage: s.max > 0 ? Math.round((s.points / s.max) * 100) : null,
      }
    }).filter(ch => ch.pourcentage !== null)

    const themesTriés = [...chapitresScores].sort((a, b) => b.pourcentage - a.pourcentage)
    const themesForts = themesTriés.slice(0, 3).filter(t => t.pourcentage >= 50)

    return {
      candidat,
      pourcentage,
      chapitresScores,
      themesForts,
    }
  })

  scores.sort((a, b) => b.pourcentage - a.pourcentage)
  return scores
}

/**
 * Génère les raisons du match principal
 */
export function genererRaisons(resultat) {
  const raisons = []
  
  resultat.themesForts.forEach(theme => {
    if (theme.pourcentage >= 70) {
      raisons.push(`Alignement fort sur ${theme.nom.toLowerCase()} (${theme.pourcentage}%)`)
    } else if (theme.pourcentage >= 50) {
      raisons.push(`Accord sur ${theme.nom.toLowerCase()} (${theme.pourcentage}%)`)
    }
  })

  if (raisons.length === 0) {
    raisons.push("Quelques points de convergence sur différents sujets")
  }

  return raisons.slice(0, 3)
}

/**
 * Génère les détails d'alignement pour un candidat :
 * - Les thèmes où l'utilisateur est d'accord (points positifs)
 * - Les thèmes où il y a désaccord (points négatifs)
 */
export function genererDetailsCandidat(resultat) {
  const accords = []
  const desaccords = []

  const sorted = [...resultat.chapitresScores].sort((a, b) => b.pourcentage - a.pourcentage)

  sorted.forEach(theme => {
    if (theme.pourcentage >= 60) {
      accords.push({ nom: theme.nom, emoji: theme.emoji, pourcentage: theme.pourcentage })
    } else if (theme.pourcentage < 40) {
      desaccords.push({ nom: theme.nom, emoji: theme.emoji, pourcentage: theme.pourcentage })
    }
  })

  return { accords: accords.slice(0, 4), desaccords: desaccords.slice(0, 4) }
}

/**
 * Génère les questions spécifiques d'accord/désaccord avec un candidat donné
 * @param {number} candidatIndex - Index du candidat dans le tableau positions[]
 * @param {object} reponses - Réponses de l'utilisateur
 * @param {Array} questions - Toutes les questions
 * @param {Array} chapitres - Chapitres avec leur poids
 */
export function genererQuestionsAlignement(candidatIndex, reponses, questions, chapitres) {
  const chapPoids = {}
  chapitres.forEach(ch => { chapPoids[ch.id] = ch.poids || 1 })

  const accords = []
  const desaccords = []

  questions.forEach(q => {
    const rep = reponses?.[q.id]
    if (!rep || rep.choix === 0) return
    const posCandidat = q.positions?.[candidatIndex]
    if (!posCandidat || posCandidat === 0) return

    const intensite = Math.abs(rep.choix)
    const weight = intensite * (q.poids || 1) * (chapPoids[q.chapitre] || 1)
    const accord = (rep.choix > 0) === (posCandidat > 0)
    const item = { texte: q.texte, userChoix: rep.choix, candidatPos: posCandidat, weight }

    if (accord) accords.push(item)
    else desaccords.push(item)
  })

  accords.sort((a, b) => b.weight - a.weight)
  desaccords.sort((a, b) => b.weight - a.weight)

  return { accords: accords.slice(0, 4), desaccords: desaccords.slice(0, 4) }
}
