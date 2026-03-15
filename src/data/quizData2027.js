// Données Politikz — Présidentielle 2027 (projection)
// 12 candidats pressentis, pool de 124 questions, positions issues de déclarations publiques
// ⚠️ Ces positions sont des projections établies à partir des prises de position publiques connues.
//
// Champs :
//   poids (chapitre)  : 1=standard, 2=important, 3=structurant — multiplie le score dans l'algo
//   structurante      : true = incluse en priorité dans le tirage aléatoire du quiz
//   poids (question)  : 2 sur les questions structurantes (compte double dans le score)

export const candidats = [
  { id: 1, nom: "Bardella",    prenom: "Jordan",    parti: "Rassemblement National",       etiquettes: ["Droite nationale", "Souverainiste"],     couleur: "#3B82F6", photo: "/candidats/bardella.jpg"    },
  { id: 2, nom: "Le Pen",      prenom: "Marine",    parti: "Rassemblement National",       etiquettes: ["Droite nationale", "Populiste"],         couleur: "#2563EB", photo: "/candidats/lepen.jpg"       },
  { id: 3, nom: "Retailleau",  prenom: "Bruno",     parti: "Les Républicains",             etiquettes: ["Droite", "Conservateur", "Sécuritaire"], couleur: "#0F766E", photo: "/candidats/retailleau.jpg"  },
  { id: 4, nom: "Wauquiez",    prenom: "Laurent",   parti: "Les Républicains",             etiquettes: ["Droite", "Gaulliste"],                   couleur: "#059669", photo: "/candidats/wauquiez.jpg"    },
  { id: 5, nom: "Zemmour",     prenom: "Éric",      parti: "Reconquête",                   etiquettes: ["Extrême droite", "Identitaire"],         couleur: "#7C3AED", photo: "/candidats/zemmour.jpg"     },
  { id: 6, nom: "Philippe",    prenom: "Édouard",   parti: "Horizons",                     etiquettes: ["Centre-droit", "Libéral"],               couleur: "#0EA5E9", photo: "/candidats/philippe.jpg"    },
  { id: 7, nom: "Attal",       prenom: "Gabriel",   parti: "Renaissance",                  etiquettes: ["Centre", "Pro-EU"],                     couleur: "#6366F1", photo: "/candidats/attal.jpg"       },
  { id: 8, nom: "Lecornu",     prenom: "Sébastien", parti: "Renaissance",                  etiquettes: ["Centre", "Défense"],                    couleur: "#8B5CF6", photo: "/candidats/lecornu.jpg"     },
  { id: 9, nom: "Glucksmann",  prenom: "Raphaël",   parti: "Place Publique / PS",          etiquettes: ["Centre-gauche", "Social-démocrate"],    couleur: "#EC4899", photo: "/candidats/glucksmann.jpg"  },
  { id: 10, nom: "Mélenchon",  prenom: "Jean-Luc",  parti: "La France Insoumise",          etiquettes: ["Gauche radicale", "Écosocialiste"],     couleur: "#EF4444", photo: "/candidats/melenchon.jpg"   },
  { id: 11, nom: "Ruffin",     prenom: "François",  parti: "Gauche populaire",             etiquettes: ["Gauche", "Populiste de gauche"],        couleur: "#F97316", photo: "/candidats/ruffin.jpg"      },
  { id: 12, nom: "Roussel",    prenom: "Fabien",    parti: "Parti Communiste Français",    etiquettes: ["Gauche", "Communiste"],                 couleur: "#F59E0B", photo: "/candidats/roussel.jpg"     },
]

// poids = importance thématique dans le score final
export const chapitres = [
  { id: 1, nom: "Pouvoir d'achat",    emoji: "💰", poids: 2, questions: [1,2,3,4,5,6,7,8,9,10,101,102,103,125,126] },
  { id: 2, nom: "Économie & Travail", emoji: "🏭", poids: 3, questions: [11,12,13,14,15,16,17,18,19,20,104,105,106,127,128,129] },
  { id: 3, nom: "Retraites & Santé",  emoji: "🏥", poids: 3, questions: [21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,107,108,109,130] },
  { id: 4, nom: "Énergie",            emoji: "⚡", poids: 2, questions: [36,37,38,39,40,41,42,43,44,45,110,111] },
  { id: 5, nom: "Environnement",      emoji: "🌍", poids: 2, questions: [46,47,48,49,50,51,52,53,54,55,112,113,131] },
  { id: 6, nom: "Sécurité & Justice", emoji: "⚖️", poids: 2, questions: [56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,114,115,116] },
  { id: 7, nom: "Immigration",        emoji: "🌐", poids: 3, questions: [71,72,73,74,75,76,77,78,79,80,117,118,132] },
  { id: 8, nom: "Démocratie",         emoji: "🗳️", poids: 1, questions: [81,82,83,84,85,86,87,88,89,90,119,120,121,133,134] },
  { id: 9, nom: "Europe & Monde",     emoji: "🇪🇺", poids: 2, questions: [91,92,93,94,95,96,97,98,99,100,122,123,124,135,136] },
]

// Positions : [Bardella, LePen, Retailleau, Wauquiez, Zemmour, Philippe, Attal, Lecornu, Glucksmann, Mélenchon, Ruffin, Roussel]
// 1=Pour, -1=Contre, 0=Neutre/NP
// structurante: true  = incluse en priorité dans le tirage aléatoire
// poids: 2            = compte double dans l'algorithme de score

export const questions = [
  // === CHAPITRE 1 : POUVOIR D'ACHAT ===
  { id: 1,   texte: "Faut-il augmenter le salaire minimum à au moins 1 500€ par mois ?",                                              chapitre: 1, structurante: true, poids: 2, positions: [1,1,-1,-1,-1,-1,-1,-1,1,1,1,1],
    sousQuestions: [
      { id: 201, condition: 1,  texte: "Cette hausse du SMIC doit-elle s'accompagner d'une baisse des charges patronales pour compenser le coût pour les entreprises ?", positions: [1,1,1,1,1,1,1,1,-1,-1,-1,-1] },
    ] },
  { id: 2,   texte: "Faut-il baisser les charges sur les petits salaires pour augmenter la paye nette ?",                            chapitre: 1, positions: [1,1,1,1,1,1,1,1,-1,-1,-1,-1] },
  { id: 3,   texte: "Faut-il que les heures supplémentaires ne soient plus du tout taxées ?",                                        chapitre: 1, positions: [1,1,1,1,1,1,1,1,0,-1,-1,-1] },
  { id: 4,   texte: "Faut-il bloquer les prix des produits de base (pain, pâtes, lait...) ?",                                        chapitre: 1, positions: [1,1,-1,-1,-1,0,0,0,1,1,1,1] },
  { id: 5,   texte: "Faut-il baisser la taxe sur l'essence et le diesel ?",                                                          chapitre: 1, positions: [1,1,1,1,1,0,0,0,-1,-1,0,0] },
  { id: 6,   texte: "Faut-il que les salaires augmentent automatiquement quand les prix augmentent ?",                               chapitre: 1, positions: [1,1,-1,-1,0,-1,-1,-1,1,1,1,1] },
  { id: 7,   texte: "Faut-il supprimer la TVA sur les produits alimentaires de base pour réduire les courses ?",                     chapitre: 1, positions: [1,1,0,0,1,-1,-1,-1,1,1,1,1] },
  { id: 8,   texte: "Faut-il permettre aux patrons de verser une grosse prime sans taxes à leurs salariés ?",                        chapitre: 1, positions: [1,1,1,1,1,1,1,1,-1,-1,-1,-1] },
  { id: 9,   texte: "Faut-il encadrer les loyers dans les villes où se loger est devenu trop cher ?",                                chapitre: 1, positions: [1,1,-1,-1,-1,1,1,1,1,1,1,1] },
  { id: 10,  texte: "Faut-il construire massivement des logements sociaux pour résoudre la crise du logement ?",                     chapitre: 1, structurante: true, poids: 2, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,1] },
  // Nouvelles questions ch.1
  { id: 101, texte: "Faut-il rendre les transports en commun gratuits pour les moins de 26 ans ?",                                   chapitre: 1, positions: [1,1,-1,-1,-1,0,0,0,1,1,1,1] },
  { id: 102, texte: "Faut-il réduire la durée légale du travail à 32 heures par semaine ?",                                          chapitre: 1, positions: [-1,-1,-1,-1,-1,-1,-1,-1,0,1,1,1] },
  { id: 103, texte: "Faut-il instaurer un chèque-alimentation pour aider les familles les plus modestes ?",                          chapitre: 1, positions: [1,1,0,0,0,0,0,0,1,1,1,1] },

  // === CHAPITRE 2 : ÉCONOMIE & TRAVAIL ===
  { id: 11,  texte: "Faut-il baisser les impôts des entreprises ?",                                                                  chapitre: 2, positions: [1,0,1,1,1,1,1,1,-1,-1,-1,-1] },
  { id: 12,  texte: "Faut-il remettre l'impôt sur les grandes fortunes (ISF) ?",                                                     chapitre: 2, structurante: true, poids: 2, positions: [1,1,-1,-1,-1,-1,-1,-1,1,1,1,1] },
  { id: 13,  texte: "Faut-il que les riches paient plus d'impôts sur leurs placements financiers ?",                                 chapitre: 2, positions: [1,1,-1,-1,-1,-1,-1,-1,1,1,1,1] },
  { id: 14,  texte: "Faut-il que les gros héritages soient plus taxés ?",                                                            chapitre: 2, positions: [0,0,-1,-1,-1,-1,-1,-1,1,1,1,1] },
  { id: 15,  texte: "Faut-il que l'État reprenne le contrôle d'EDF et des entreprises d'énergie ?",                                  chapitre: 2, structurante: true, poids: 2, positions: [1,1,0,0,1,1,1,1,1,1,1,1] },
  { id: 16,  texte: "Faut-il interdire les licenciements dans les entreprises qui versent des dividendes à leurs actionnaires ?",    chapitre: 2, positions: [1,1,-1,-1,-1,-1,-1,-1,1,1,1,1] },
  { id: 17,  texte: "Faut-il réduire le nombre de fonctionnaires ?",                                                                 chapitre: 2, positions: [0,0,1,1,1,0,0,0,-1,-1,-1,-1] },
  { id: 18,  texte: "Faut-il ramener les usines et la production en France ?",                                                       chapitre: 2, positions: [1,1,1,1,1,1,1,1,1,1,1,1] },
  { id: 19,  texte: "Faut-il réduire en priorité le déficit budgétaire, même si cela nécessite des coupes dans les dépenses ?",      chapitre: 2, positions: [-1,-1,1,1,0,1,1,1,-1,-1,-1,-1] },
  { id: 20,  texte: "Faut-il obliger les entreprises aidées par l'État à garder leurs emplois en France ?",                          chapitre: 2, positions: [1,1,1,1,1,1,1,1,1,1,1,1] },
  // Nouvelles questions ch.2
  { id: 104, texte: "Faut-il interdire aux entreprises de verser des dividendes quand elles reçoivent des aides publiques ?",        chapitre: 2, positions: [1,1,-1,-1,0,-1,-1,-1,1,1,1,1] },
  { id: 105, texte: "Faut-il encadrer strictement la rémunération des dirigeants d'entreprise par rapport aux salaires de leurs employés ?", chapitre: 2, positions: [1,1,-1,-1,0,-1,-1,-1,1,1,1,1] },
  { id: 106, texte: "Faut-il que la France soutienne un impôt minimum mondial plus élevé sur les bénéfices des multinationales ?",  chapitre: 2, positions: [0,0,-1,-1,-1,0,0,0,1,1,1,1] },

  // === CHAPITRE 3 : RETRAITES & SANTÉ ===
  { id: 21,  texte: "Faut-il annuler la réforme des retraites de 2023 et revenir à l'âge légal de départ à 62 ans ?",                chapitre: 3, structurante: true, poids: 2, positions: [1,1,-1,-1,-1,-1,-1,-1,1,1,1,1],
    sousQuestions: [
      { id: 202, condition: 1,  texte: "Faut-il augmenter les cotisations retraite pour financer ce retour à 62 ans ?", positions: [-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1] },
    ] },
  { id: 22,  texte: "Faut-il aller encore plus loin et permettre la retraite dès 60 ans pour les longues carrières ?",               chapitre: 3, positions: [1,1,-1,-1,-1,-1,-1,-1,0,1,1,1] },
  { id: 23,  texte: "Faut-il garantir au moins 1 100€ de retraite par mois pour ceux qui ont travaillé toute leur vie ?",            chapitre: 3, positions: [1,1,1,1,0,1,1,1,1,1,1,1] },
  { id: 24,  texte: "Faut-il instaurer un régime de retraite universel par points, identique pour tous les Français ?",               chapitre: 3, positions: [0,0,1,1,0,1,1,1,-1,-1,-1,-1] },
  { id: 25,  texte: "Faut-il que les soins psychologiques et psychiatriques soient intégralement remboursés par la Sécurité sociale ?", chapitre: 3, positions: [1,1,0,0,0,1,1,1,1,1,1,1] },
  { id: 26,  texte: "Faut-il embaucher massivement dans les hôpitaux publics ?",                                                     chapitre: 3, positions: [1,1,0,0,0,1,1,1,1,1,1,1] },
  { id: 27,  texte: "Faut-il autoriser les médecins à aider les malades en fin de vie à mourir dignement ?",                         chapitre: 3, structurante: true, poids: 2, positions: [-1,-1,-1,-1,-1,1,1,0,1,0,1,0] },
  { id: 28,  texte: "Faut-il augmenter les aides sociales pour les personnes sans emploi ?",                                         chapitre: 3, positions: [0,0,-1,-1,-1,0,-1,0,1,1,1,1] },
  { id: 29,  texte: "Faut-il obliger les personnes au RSA à faire une activité en échange ?",                                        chapitre: 3, structurante: true, poids: 2, positions: [1,1,1,1,1,1,1,1,0,-1,-1,-1] },
  { id: 30,  texte: "Faut-il augmenter les salaires des infirmiers, aides-soignants et médecins ?",                                  chapitre: 3, positions: [1,1,1,1,1,1,1,1,1,1,1,1] },
  { id: 31,  texte: "Faut-il créer 10 000 postes supplémentaires dans les maisons de retraite ?",                                    chapitre: 3, positions: [1,1,0,0,0,1,1,1,1,1,1,1] },
  { id: 32,  texte: "Faut-il allonger le congé pour les pères à la naissance d'un enfant ?",                                         chapitre: 3, positions: [0,0,-1,0,-1,1,1,1,1,1,1,1] },
  { id: 33,  texte: "Faut-il supprimer les frais à payer de sa poche quand on va chez le médecin ?",                                 chapitre: 3, positions: [1,1,-1,-1,-1,-1,-1,-1,1,1,1,1] },
  { id: 34,  texte: "Faut-il mieux prendre en compte les métiers pénibles pour la retraite ?",                                       chapitre: 3, positions: [1,1,0,0,0,0,0,0,1,1,1,1] },
  { id: 35,  texte: "Faut-il supprimer les allocations familiales pour les familles très riches ?",                                   chapitre: 3, positions: [-1,-1,-1,-1,-1,0,0,0,0,0,0,0] },
  // Nouvelles questions ch.3
  { id: 107, texte: "Faut-il créer des centres de santé publics dans les déserts médicaux pour améliorer l'accès aux soins ?",       chapitre: 3, positions: [1,1,1,1,0,1,1,1,1,1,1,1] },
  { id: 108, texte: "Faut-il que la PMA (Procréation Médicalement Assistée) soit remboursée pour toutes les femmes ?",               chapitre: 3, structurante: true, poids: 2, positions: [0,0,-1,-1,-1,1,1,1,1,1,1,1] },
  { id: 109, texte: "Faut-il instaurer un congé menstruel rémunéré pour les femmes souffrant de règles douloureuses ?",              chapitre: 3, positions: [-1,-1,-1,-1,-1,-1,0,0,1,1,1,1] },

  // === CHAPITRE 4 : ÉNERGIE ===
  { id: 36,  texte: "Faut-il construire de nouvelles centrales nucléaires ?",                                                        chapitre: 4, structurante: true, poids: 2, positions: [1,1,1,1,1,1,1,1,1,-1,0,1],
    sousQuestions: [
      { id: 203, condition: 1,  texte: "Faut-il accélérer le programme EPR2 pour que les premiers réacteurs soient opérationnels avant 2040 ?", positions: [1,1,1,1,1,1,1,1,0,-1,-1,1] },
    ] },
  { id: 37,  texte: "Faut-il fermer toutes les centrales nucléaires d'ici 2050 ?",                                                    chapitre: 4, positions: [-1,-1,-1,-1,-1,-1,-1,-1,-1,1,0,-1] },
  { id: 38,  texte: "Faut-il installer beaucoup plus d'éoliennes en France ?",                                                       chapitre: 4, positions: [-1,-1,-1,-1,-1,1,1,1,1,1,1,0] },
  { id: 39,  texte: "Faut-il au contraire démanteler les éoliennes qui existent déjà ?",                                              chapitre: 4, positions: [1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1] },
  { id: 40,  texte: "Faut-il interdire la vente de voitures essence et diesel neuves d'ici 2030 ?",                                   chapitre: 4, positions: [-1,-1,-1,-1,-1,0,0,0,0,1,0,0] },
  { id: 41,  texte: "Faut-il interdire l'avion quand le même trajet en train prend moins de 4 heures ?",                             chapitre: 4, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,0,0] },
  { id: 42,  texte: "Faut-il interdire les pesticides chimiques dans l'agriculture ?",                                                chapitre: 4, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,0] },
  { id: 43,  texte: "Faut-il viser 100% d'énergies renouvelables (solaire, éolien, hydraulique) ?",                                  chapitre: 4, positions: [-1,-1,-1,-1,-1,0,0,0,0,1,0,0] },
  { id: 44,  texte: "Faut-il un grand plan pour isoler les logements mal chauffés (passoires thermiques) ?",                         chapitre: 4, structurante: true, poids: 2, positions: [1,1,0,0,0,1,1,1,1,1,1,1] },
  { id: 45,  texte: "Faut-il que les plus gros pollueurs paient un impôt spécial pour le climat ?",                                   chapitre: 4, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,1] },
  // Nouvelles questions ch.4
  { id: 110, texte: "Faut-il interdire le chauffage au fioul dans les logements neufs et lors des rénovations ?",                    chapitre: 4, positions: [-1,-1,-1,-1,-1,0,1,1,1,1,1,1] },
  { id: 111, texte: "Faut-il développer massivement le solaire en équipant les bâtiments publics et parkings de panneaux photovoltaïques ?", chapitre: 4, positions: [0,0,0,0,-1,1,1,1,1,1,1,1] },

  // === CHAPITRE 5 : ENVIRONNEMENT ===
  { id: 46,  texte: "Faut-il taxer les produits importés qui polluent beaucoup ?",                                                   chapitre: 5, positions: [1,1,1,1,1,1,1,1,1,1,1,1] },
  { id: 47,  texte: "Faut-il interdire l'élevage industriel (poules en batterie, cochons en cage...) ?",                             chapitre: 5, positions: [-1,-1,-1,-1,-1,0,0,0,0,0,0,0] },
  { id: 48,  texte: "Faut-il que les produits bio coûtent moins cher grâce à une baisse des taxes ?",                                chapitre: 5, positions: [1,1,0,0,0,0,0,0,1,1,1,1] },
  { id: 49,  texte: "Faut-il que la France atteigne la neutralité carbone d'ici 2050 ?",                                             chapitre: 5, structurante: true, poids: 2, positions: [0,0,0,0,-1,1,1,1,1,1,1,1] },
  { id: 50,  texte: "Faut-il rouvrir les petites lignes de train et investir massivement dans le rail ?",                            chapitre: 5, positions: [1,1,0,0,1,1,1,1,1,1,1,1] },
  { id: 51,  texte: "Faut-il punir sévèrement les entreprises qui détruisent l'environnement ?",                                     chapitre: 5, positions: [0,0,0,0,-1,0,0,0,1,1,1,1] },
  { id: 52,  texte: "Faut-il interdire les publicités pour les produits polluants (SUV, low cost...) ?",                             chapitre: 5, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,0,0] },
  { id: 53,  texte: "Faut-il arrêter d'utiliser le pétrole, le gaz et le charbon d'ici 2050 ?",                                     chapitre: 5, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,0,0] },
  { id: 54,  texte: "Faut-il investir dans l'hydrogène comme énergie du futur ?",                                                    chapitre: 5, positions: [1,1,1,1,1,1,1,1,1,0,1,0] },
  { id: 55,  texte: "Faut-il que les cantines scolaires servent au moins 50% de bio ?",                                              chapitre: 5, positions: [0,0,0,0,-1,1,1,1,1,1,1,1] },
  // Nouvelles questions ch.5
  { id: 112, texte: "Faut-il taxer davantage les vols en avion pour financer des alternatives ferroviaires ?",                       chapitre: 5, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,1] },
  { id: 113, texte: "Faut-il instaurer un malus renforcé sur les gros véhicules polluants comme les SUV ?",                          chapitre: 5, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,0] },

  // === CHAPITRE 6 : SÉCURITÉ & JUSTICE ===
  { id: 56,  texte: "Faut-il recruter plus de policiers et de gendarmes ?",                                                          chapitre: 6, positions: [1,1,1,1,1,1,1,1,0,-1,0,0] },
  { id: 57,  texte: "Faut-il imposer des peines de prison minimum pour certains délits ?",                                           chapitre: 6, positions: [1,1,1,1,1,0,-1,0,-1,-1,-1,-1] },
  { id: 58,  texte: "Faut-il construire 20 000 places de prison en plus ?",                                                          chapitre: 6, positions: [1,1,1,1,1,1,0,1,0,-1,-1,-1] },
  { id: 59,  texte: "Faut-il appliquer la tolérance zéro face à la délinquance ?",                                                   chapitre: 6, positions: [1,1,1,1,1,1,1,1,0,-1,-1,-1] },
  { id: 60,  texte: "Faut-il remettre des policiers de quartier que les habitants connaissent ?",                                    chapitre: 6, positions: [1,1,1,1,1,1,1,1,1,1,1,1] },
  { id: 61,  texte: "Faut-il créer un organisme indépendant pour surveiller les comportements de la police ?",                      chapitre: 6, positions: [-1,-1,-1,-1,-1,0,-1,0,1,1,1,1] },
  { id: 62,  texte: "Faut-il légaliser le cannabis ?",                                                                               chapitre: 6, structurante: true, poids: 2, positions: [-1,-1,-1,-1,-1,-1,0,0,1,1,1,-1] },
  { id: 63,  texte: "Faut-il donner beaucoup plus de moyens à la justice pour qu'elle aille plus vite ?",                           chapitre: 6, positions: [1,1,1,1,1,1,1,1,1,1,1,1] },
  { id: 64,  texte: "Faut-il punir plus durement ceux qui agressent des policiers ou des pompiers ?",                               chapitre: 6, positions: [1,1,1,1,1,1,1,1,0,-1,0,0] },
  { id: 65,  texte: "Faut-il expulser automatiquement les étrangers condamnés par la justice ?",                                     chapitre: 6, structurante: true, poids: 2, positions: [1,1,1,1,1,1,0,1,0,-1,-1,-1] },
  { id: 66,  texte: "Faut-il interdire les manifestations non déclarées à l'avance ?",                                               chapitre: 6, positions: [0,0,1,1,1,0,0,0,-1,-1,-1,-1] },
  { id: 67,  texte: "Faut-il mettre plus de caméras de surveillance dans les rues ?",                                                chapitre: 6, positions: [1,1,1,1,1,1,1,1,0,-1,-1,-1] },
  { id: 68,  texte: "Faut-il juger les mineurs de 16 ans comme des adultes ?",                                                       chapitre: 6, positions: [1,1,1,1,1,0,0,0,-1,-1,-1,-1] },
  { id: 69,  texte: "Faut-il que la prison soit automatique pour les récidivistes ?",                                                chapitre: 6, positions: [1,1,1,1,1,0,0,0,-1,-1,-1,-1] },
  { id: 70,  texte: "Faut-il interdire le voile islamique dans la rue et les lieux publics ?",                                       chapitre: 6, structurante: true, poids: 2, positions: [1,1,1,0,1,-1,-1,-1,-1,-1,-1,-1] },
  // Nouvelles questions ch.6
  { id: 114, texte: "Faut-il rétablir les peines planchers automatiques pour les récidivistes violents ?",                           chapitre: 6, structurante: true, poids: 2, positions: [1,1,1,1,1,1,1,1,-1,-1,-1,-1] },
  { id: 115, texte: "Faut-il autoriser la reconnaissance faciale en temps réel dans les espaces publics ?",                          chapitre: 6, positions: [1,1,1,1,1,0,0,0,-1,-1,-1,-1] },
  { id: 116, texte: "Faut-il créer davantage de centres éducatifs fermés pour les mineurs délinquants ?",                            chapitre: 6, positions: [1,1,1,1,1,1,1,1,-1,-1,-1,-1] },

  // === CHAPITRE 7 : IMMIGRATION ===
  { id: 71,  texte: "Faut-il limiter le nombre d'étrangers qui s'installent en France chaque année ?",                               chapitre: 7, structurante: true, poids: 2, positions: [1,1,1,1,1,1,0,1,-1,-1,-1,-1],
    sousQuestions: [
      { id: 204, condition: 1,  texte: "Faut-il sortir de l'espace Schengen pour reprendre le contrôle total des frontières ?", positions: [1,1,-1,-1,1,-1,-1,-1,-1,-1,-1,-1] },
    ] },
  { id: 72,  texte: "Faut-il qu'un enfant né en France de parents étrangers ne soit plus automatiquement français ?",                chapitre: 7, positions: [1,1,1,1,1,0,-1,0,-1,-1,-1,-1] },
  { id: 73,  texte: "Faut-il empêcher un étranger installé en France de faire venir sa famille ?",                                   chapitre: 7, positions: [1,1,1,1,1,1,-1,1,-1,-1,-1,-1] },
  { id: 74,  texte: "Faut-il donner des papiers aux sans-papiers qui travaillent en France ?",                                       chapitre: 7, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,1] },
  { id: 75,  texte: "Faut-il supprimer la couverture santé gratuite pour les sans-papiers ?",                                        chapitre: 7, structurante: true, poids: 2, positions: [1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1] },
  { id: 76,  texte: "Faut-il donner la priorité aux Français pour l'accès à l'emploi ?",                                            chapitre: 7, structurante: true, poids: 2, positions: [1,1,1,0,1,-1,-1,-1,-1,-1,-1,-1] },
  { id: 77,  texte: "Faut-il accueillir davantage de réfugiés qui fuient la guerre ?",                                               chapitre: 7, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,0,1] },
  { id: 78,  texte: "Faut-il qu'un étranger attende 5 ans avant de toucher des aides sociales ?",                                    chapitre: 7, positions: [1,1,1,1,1,1,0,1,-1,-1,-1,-1] },
  { id: 79,  texte: "Faut-il renforcer la police aux frontières de l'Europe ?",                                                      chapitre: 7, positions: [1,1,1,1,1,1,1,1,1,-1,0,-1] },
  { id: 80,  texte: "Faut-il faciliter l'accès à la nationalité française ?",                                                        chapitre: 7, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,1] },
  // Nouvelles questions ch.7
  { id: 117, texte: "Faut-il instaurer des quotas annuels d'immigration légale votés chaque année par le Parlement ?",               chapitre: 7, structurante: true, poids: 2, positions: [1,1,1,1,1,1,0,0,-1,-1,-1,-1] },
  { id: 118, texte: "Faut-il que la France puisse déroger à la Convention européenne des droits de l'homme pour expulser des étrangers délinquants ?", chapitre: 7, structurante: true, poids: 2, positions: [1,1,1,0,1,-1,-1,-1,-1,-1,-1,-1] },

  // === CHAPITRE 8 : DÉMOCRATIE ===
  { id: 81,  texte: "Faut-il changer complètement la Constitution pour une nouvelle République ?",                                    chapitre: 8, positions: [0,0,-1,-1,0,-1,-1,-1,0,1,1,0] },
  { id: 82,  texte: "Faut-il que les citoyens puissent déclencher un référendum eux-mêmes ?",                                        chapitre: 8, positions: [1,1,0,0,1,-1,-1,-1,0,1,1,1] },
  { id: 83,  texte: "Faut-il que chaque parti ait un nombre de députés proportionnel à ses votes ?",                                 chapitre: 8, structurante: true, poids: 2, positions: [1,1,0,0,0,0,0,0,1,1,1,1] },
  { id: 84,  texte: "Faut-il réduire le nombre de députés et sénateurs ?",                                                           chapitre: 8, positions: [1,1,0,0,1,1,1,1,0,-1,-1,-1] },
  { id: 85,  texte: "Faut-il que le vote blanc compte vraiment dans les résultats ?",                                                 chapitre: 8, positions: [1,1,0,0,1,0,0,0,1,1,1,1] },
  { id: 86,  texte: "Faut-il supprimer le Sénat ?",                                                                                  chapitre: 8, positions: [0,0,-1,-1,0,-1,-1,-1,0,1,1,1] },
  { id: 87,  texte: "Faut-il imposer des règles strictes aux réseaux sociaux (TikTok, X...) pour lutter contre la désinformation ?", chapitre: 8, positions: [0,0,1,1,-1,1,1,1,1,0,1,1] },
  { id: 88,  texte: "Faut-il supprimer le poste de Président de la République tel qu'il existe ?",                                   chapitre: 8, positions: [-1,-1,-1,-1,-1,-1,-1,-1,0,1,0,0] },
  { id: 89,  texte: "Faut-il encadrer strictement l'intelligence artificielle pour protéger l'emploi et les données personnelles ?", chapitre: 8, positions: [0,0,0,0,-1,1,1,1,1,1,1,1] },
  { id: 90,  texte: "Faut-il qu'un élu ne puisse pas faire plus de 2 mandats ?",                                                     chapitre: 8, positions: [1,1,0,0,1,0,0,0,1,1,1,1] },
  // Nouvelles questions ch.8
  { id: 119, texte: "Faut-il instaurer le vote à 16 ans pour les élections nationales ?",                                             chapitre: 8, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,1] },
  { id: 120, texte: "Faut-il que les grandes décisions nationales (immigration, retraites) soient soumises à référendum populaire ?", chapitre: 8, positions: [1,1,0,1,1,-1,-1,-1,0,1,1,0] },
  { id: 121, texte: "Faut-il que des citoyens tirés au sort participent directement à l'élaboration des lois ?",                     chapitre: 8, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,0] },

  // === CHAPITRE 9 : EUROPE & MONDE ===
  { id: 91,  texte: "Faut-il continuer à envoyer des armes et du matériel militaire à l'Ukraine ?",                                  chapitre: 9, structurante: true, poids: 2, positions: [-1,-1,1,1,-1,1,1,1,1,-1,0,0] },
  { id: 92,  texte: "Faut-il porter le budget de la défense française à au moins 3% du PIB ?",                                       chapitre: 9, positions: [1,1,1,1,1,1,1,1,1,-1,-1,-1] },
  { id: 93,  texte: "Faut-il que la France reconnaisse officiellement l'État palestinien ?",                                         chapitre: 9, positions: [-1,-1,-1,-1,-1,0,0,-1,1,1,1,1] },
  { id: 94,  texte: "Faut-il bâtir une défense européenne autonome, indépendante des États-Unis ?",                                  chapitre: 9, positions: [0,0,1,1,1,1,1,1,1,0,0,-1] },
  { id: 95,  texte: "Faut-il que la France quitte le commandement militaire intégré de l'OTAN ?",                                    chapitre: 9, structurante: true, poids: 2, positions: [1,1,-1,-1,1,-1,-1,-1,-1,1,1,1] },
  { id: 96,  texte: "Faut-il refuser l'accord de libre-échange entre l'Europe et le Mercosur ?",                                     chapitre: 9, positions: [1,1,1,1,1,-1,0,0,1,1,1,1] },
  { id: 97,  texte: "Faut-il maintenir les sanctions économiques de l'Europe contre la Russie ?",                                    chapitre: 9, positions: [-1,-1,1,1,-1,1,1,1,1,-1,0,0] },
  { id: 98,  texte: "Faut-il que la France reste un allié proche des États-Unis même sous Donald Trump ?",                           chapitre: 9, positions: [1,1,1,1,1,0,0,0,-1,-1,-1,-1] },
  { id: 99,  texte: "Faut-il envoyer des soldats français en Ukraine si l'Europe l'exige pour sa défense ?",                         chapitre: 9, positions: [-1,-1,1,0,-1,1,1,1,1,-1,-1,-1] },
  { id: 100, texte: "Faut-il partager le parapluie nucléaire français avec nos partenaires européens ?",                             chapitre: 9, positions: [-1,-1,0,0,-1,1,1,1,1,-1,-1,-1] },
  // Nouvelles questions ch.9
  { id: 122, texte: "Faut-il que la France soutienne l'élargissement de l'Union européenne à l'Ukraine et aux Balkans ?",            chapitre: 9, positions: [-1,-1,0,0,-1,1,1,1,1,-1,-1,-1] },
  { id: 123, texte: "Faut-il que la France rejoigne l'initiative pour une taxe européenne sur les transactions financières ?",        chapitre: 9, positions: [0,0,-1,-1,-1,0,0,0,1,1,1,1] },
  { id: 124, texte: "Faut-il que la France augmente significativement son aide au développement pour les pays du Sud ?",              chapitre: 9, positions: [-1,-1,-1,-1,-1,0,0,0,1,1,1,1] },

  // === NOUVELLES QUESTIONS ch.1 : POUVOIR D'ACHAT ===
  { id: 125, texte: "Faut-il augmenter les bourses et les APL pour les étudiants et les jeunes précaires ?",                          chapitre: 1, positions: [1,1,-1,-1,-1,0,0,0,1,1,1,1] },
  { id: 126, texte: "Faut-il instaurer une allocation d'autonomie versée à tous les jeunes de 18 à 25 ans sans condition ?",          chapitre: 1, positions: [-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1] },

  // === NOUVELLES QUESTIONS ch.2 : ÉCONOMIE & TRAVAIL ===
  { id: 127, texte: "Faut-il instaurer un impôt exceptionnel sur les superprofits des grandes entreprises ?",                         chapitre: 2, structurante: true, poids: 2, positions: [1,1,-1,-1,0,-1,-1,-1,1,1,1,1] },
  { id: 128, texte: "Faut-il rendre le service national universel (SNU) obligatoire pour tous les jeunes de 16 ans ?",                chapitre: 2, positions: [1,1,1,1,1,1,1,1,-1,-1,0,-1] },
  { id: 129, texte: "Faut-il augmenter significativement le budget de l'Éducation nationale ?",                                       chapitre: 2, positions: [1,1,0,0,0,1,1,1,1,1,1,1] },

  // === NOUVELLES QUESTIONS ch.3 : RETRAITES & SANTÉ ===
  { id: 130, texte: "Faut-il créer une couverture dentaire et optique à 100% remboursée par la Sécurité sociale ?",                   chapitre: 3, positions: [1,1,-1,-1,0,1,1,1,1,1,1,1] },

  // === NOUVELLES QUESTIONS ch.5 : ENVIRONNEMENT ===
  { id: 131, texte: "Faut-il interdire les emballages en plastique à usage unique dans la grande distribution ?",                      chapitre: 5, positions: [0,0,-1,-1,-1,1,1,1,1,1,1,1] },

  // === NOUVELLES QUESTIONS ch.7 : IMMIGRATION ===
  { id: 132, texte: "Faut-il créer un délit de séjour irrégulier assorti d'une expulsion sous 3 mois ?",                             chapitre: 7, structurante: true, poids: 2, positions: [1,1,1,1,1,1,0,1,-1,-1,-1,-1] },

  // === NOUVELLES QUESTIONS ch.8 : DÉMOCRATIE ===
  { id: 133, texte: "Faut-il supprimer tout cumul de mandats pour les élus (local + national) ?",                                     chapitre: 8, positions: [1,1,0,0,1,0,0,0,1,1,1,1] },
  { id: 134, texte: "Faut-il que les grands médias d'information soient détenus uniquement par des acteurs sans intérêts industriels ?", chapitre: 8, positions: [1,1,-1,-1,-1,0,0,0,1,1,1,1] },

  // === NOUVELLES QUESTIONS ch.9 : EUROPE & MONDE ===
  { id: 135, texte: "Faut-il que la France sorte de l'Union européenne (Frexit) ?",                                                   chapitre: 9, structurante: true, poids: 2, positions: [0,0,-1,-1,1,-1,-1,-1,-1,0,0,0] },
  { id: 136, texte: "Faut-il créer une armée européenne commune, intégrée et commandée au niveau européen ?",                         chapitre: 9, positions: [-1,-1,1,0,-1,1,1,1,1,-1,-1,-1] },
]
