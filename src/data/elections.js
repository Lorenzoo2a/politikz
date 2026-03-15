import { candidats as c2022, chapitres as ch2022, questions as q2022 } from '@/data/quizData'
import { candidats as c2027, chapitres as ch2027, questions as q2027 } from '@/data/quizData2027'

export const ELECTIONS = {
  '2022': {
    id: '2022',
    label: 'Présidentielle 2022',
    badge: 'Archive',
    description: '12 candidats — données issues des programmes officiels',
    candidats: c2022,
    chapitres: ch2022,
    questions: q2022,
  },
  '2027': {
    id: '2027',
    label: 'Présidentielle 2027',
    badge: 'Projection',
    description: '12 candidats pressentis — positions issues de déclarations publiques',
    candidats: c2027,
    chapitres: ch2027,
    questions: q2027,
  },
}

export const DEFAULT_ELECTION = '2027'

export function getElectionData(electionId) {
  return ELECTIONS[electionId] || ELECTIONS[DEFAULT_ELECTION]
}
