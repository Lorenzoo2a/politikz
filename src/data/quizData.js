// Données du quiz Politikz — Présidentielle 2022
// 12 candidats, 100 questions, 1200 positions

export const candidats = [
  { id: 1, nom: "Macron", prenom: "Emmanuel", parti: "La République En Marche", etiquettes: ["Centriste", "Pro-EU", "Sortant"], couleur: "#FFCC00", photo: "/candidats/macron.jpg" },
  { id: 2, nom: "Le Pen", prenom: "Marine", parti: "Rassemblement National", etiquettes: ["Droite nationale", "Souverainiste"], couleur: "#0D2159", photo: "/candidats/lepen.jpg" },
  { id: 3, nom: "Mélenchon", prenom: "Jean-Luc", parti: "La France Insoumise", etiquettes: ["Gauche radicale", "Écosocialiste"], couleur: "#CC0000", photo: "/candidats/melenchon.jpg" },
  { id: 4, nom: "Zemmour", prenom: "Éric", parti: "Reconquête", etiquettes: ["Extrême droite", "Identitaire"], couleur: "#1A1A2E", photo: "/candidats/zemmour.jpg" },
  { id: 5, nom: "Pécresse", prenom: "Valérie", parti: "Les Républicains", etiquettes: ["Droite", "Libérale"], couleur: "#0066CC", photo: "/candidats/pecresse.jpg" },
  { id: 6, nom: "Jadot", prenom: "Yannick", parti: "Europe Écologie Les Verts", etiquettes: ["Écologiste", "Pro-EU"], couleur: "#00B050", photo: "/candidats/jadot.jpg" },
  { id: 7, nom: "Lassalle", prenom: "Jean", parti: "Résistons!", etiquettes: ["Centre-droit", "Ruraliste"], couleur: "#87CEEB", photo: "/candidats/lassalle.jpg" },
  { id: 8, nom: "Roussel", prenom: "Fabien", parti: "Parti Communiste Français", etiquettes: ["Gauche", "Communiste"], couleur: "#DD0000", photo: "/candidats/roussel.jpg" },
  { id: 9, nom: "Dupont-Aignan", prenom: "Nicolas", parti: "Debout la France", etiquettes: ["Souverainiste", "Gaulliste"], couleur: "#003366", photo: "/candidats/dupontaignan.jpg" },
  { id: 10, nom: "Hidalgo", prenom: "Anne", parti: "Parti Socialiste", etiquettes: ["Gauche", "Sociale-démocrate"], couleur: "#FF69B4", photo: "/candidats/hidalgo.jpg" },
  { id: 11, nom: "Poutou", prenom: "Philippe", parti: "Nouveau Parti Anticapitaliste", etiquettes: ["Extrême gauche", "Anticapitaliste"], couleur: "#BB0000", photo: "/candidats/poutou.jpg" },
  { id: 12, nom: "Arthaud", prenom: "Nathalie", parti: "Lutte Ouvrière", etiquettes: ["Extrême gauche", "Trotskiste"], couleur: "#8B0000", photo: "/candidats/arthaud.jpg" },
]

export const chapitres = [
  { id: 1, nom: "Pouvoir d'achat", emoji: "💰", questions: [1,2,3,4,5,6,7,8,9,10] },
  { id: 2, nom: "Économie & Travail", emoji: "🏭", questions: [11,12,13,14,15,16,17,18,19,20] },
  { id: 3, nom: "Retraites & Santé", emoji: "🏥", questions: [21,22,23,24,25,26,27,28,29,30,31,32,33,34,35] },
  { id: 4, nom: "Énergie", emoji: "⚡", questions: [36,37,38,39,40,41,42,43,44,45] },
  { id: 5, nom: "Environnement", emoji: "🌍", questions: [46,47,48,49,50,51,52,53,54,55] },
  { id: 6, nom: "Sécurité & Justice", emoji: "⚖️", questions: [56,57,58,59,60,61,62,63,64,65,66,67,68,69,70] },
  { id: 7, nom: "Immigration", emoji: "🌐", questions: [71,72,73,74,75,76,77,78,79,80] },
  { id: 8, nom: "Démocratie", emoji: "🗳️", questions: [81,82,83,84,85,86,87,88,89,90] },
  { id: 9, nom: "Europe & Monde", emoji: "🇪🇺", questions: [91,92,93,94,95,96,97,98,99,100] },
]

// Chaque question a un texte et les positions des 12 candidats
// Positions : 1 = d'accord, -1 = pas d'accord, 0 = neutre
// Ordre candidats : [Macron, LePen, Mélenchon, Zemmour, Pécresse, Jadot, Lassalle, Roussel, DupontAignan, Hidalgo, Poutou, Arthaud]

export const questions = [
  // === CHAPITRE 1 : POUVOIR D'ACHAT ===
  { id: 1, texte: "Faut-il augmenter le salaire minimum à au moins 1 500€ par mois ?", chapitre: 1, positions: [-1,-1,1,-1,-1,1,1,1,-1,1,1,1] },
  { id: 2, texte: "Faut-il baisser les charges sur les petits salaires pour augmenter la paye nette ?", chapitre: 1, positions: [1,1,-1,1,1,-1,0,-1,1,-1,-1,-1] },
  { id: 3, texte: "Faut-il que les heures supplémentaires ne soient plus du tout taxées ?", chapitre: 1, positions: [1,1,-1,1,1,-1,0,-1,1,-1,-1,-1] },
  { id: 4, texte: "Faut-il bloquer les prix des produits de base (pain, pâtes, lait...) ?", chapitre: 1, positions: [-1,1,1,-1,-1,0,0,1,0,0,1,1] },
  { id: 5, texte: "Faut-il baisser la taxe sur l'essence et le diesel ?", chapitre: 1, positions: [-1,1,0,1,0,-1,1,0,1,-1,0,1] },
  { id: 6, texte: "Faut-il que les salaires augmentent automatiquement quand les prix augmentent ?", chapitre: 1, positions: [-1,1,1,0,-1,0,1,1,1,1,1,1] },
  { id: 7, texte: "Faut-il supprimer la redevance télé ?", chapitre: 1, positions: [1,1,-1,1,1,-1,0,-1,1,-1,-1,-1] },
  { id: 8, texte: "Faut-il permettre aux patrons de verser une grosse prime sans taxes à leurs salariés ?", chapitre: 1, positions: [1,-1,-1,-1,0,-1,0,-1,-1,-1,-1,-1] },
  { id: 9, texte: "Faut-il obliger les entreprises qui font des bénéfices à augmenter les salaires ?", chapitre: 1, positions: [0,0,1,0,0,1,1,1,0,1,1,1] },
  { id: 10, texte: "Faut-il plafonner les salaires des grands patrons ?", chapitre: 1, positions: [-1,-1,1,-1,-1,1,0,1,-1,1,1,1] },

  // === CHAPITRE 2 : ÉCONOMIE & TRAVAIL ===
  { id: 11, texte: "Faut-il baisser les impôts des entreprises ?", chapitre: 2, positions: [1,1,-1,1,1,-1,0,-1,1,-1,-1,-1] },
  { id: 12, texte: "Faut-il remettre l'impôt sur les grandes fortunes (ISF) ?", chapitre: 2, positions: [-1,-1,1,-1,-1,1,1,1,1,1,1,1] },
  { id: 13, texte: "Faut-il que les riches paient plus d'impôts sur leurs placements financiers ?", chapitre: 2, positions: [-1,0,1,-1,-1,1,0,1,0,1,1,1] },
  { id: 14, texte: "Faut-il que les gros héritages soient plus taxés ?", chapitre: 2, positions: [-1,-1,1,-1,-1,1,0,1,-1,1,1,1] },
  { id: 15, texte: "Faut-il que l'État reprenne le contrôle d'EDF et des entreprises d'énergie ?", chapitre: 2, positions: [-1,1,1,-1,-1,1,0,1,1,0,1,1] },
  { id: 16, texte: "Faut-il interdire les licenciements dans les entreprises qui versent des dividendes à leurs actionnaires ?", chapitre: 2, positions: [-1,-1,1,-1,-1,0,0,1,-1,0,1,1] },
  { id: 17, texte: "Faut-il réduire le nombre de fonctionnaires ?", chapitre: 2, positions: [0,1,-1,1,1,-1,-1,-1,1,-1,-1,-1] },
  { id: 18, texte: "Faut-il ramener les usines et la production en France ?", chapitre: 2, positions: [1,1,1,1,1,1,1,1,1,1,0,0] },
  { id: 19, texte: "Faut-il donner un revenu de base à tous les citoyens, même sans travail ?", chapitre: 2, positions: [-1,-1,0,-1,-1,0,0,-1,-1,0,0,0] },
  { id: 20, texte: "Faut-il obliger les entreprises aidées par l'État à garder leurs emplois en France ?", chapitre: 2, positions: [0,0,1,0,0,1,1,1,0,1,1,1] },

  // === CHAPITRE 3 : RETRAITES & SANTÉ ===
  { id: 21, texte: "Faut-il travailler jusqu'à 65 ans avant de partir à la retraite ?", chapitre: 3, positions: [1,-1,-1,1,1,-1,-1,-1,-1,-1,-1,-1] },
  { id: 22, texte: "Faut-il pouvoir partir à la retraite dès 60 ans ?", chapitre: 3, positions: [-1,-1,1,-1,-1,0,0,1,-1,0,1,1] },
  { id: 23, texte: "Faut-il garantir au moins 1 100€ de retraite par mois pour ceux qui ont travaillé toute leur vie ?", chapitre: 3, positions: [1,1,1,0,1,1,1,1,0,1,1,1] },
  { id: 24, texte: "Faut-il que tout le monde ait les mêmes règles de retraite, sans régimes spéciaux ?", chapitre: 3, positions: [1,0,-1,1,1,-1,0,-1,1,-1,-1,-1] },
  { id: 25, texte: "Faut-il que le dentiste et les lunettes soient remboursés à 100% ?", chapitre: 3, positions: [1,0,1,-1,0,1,0,1,0,1,1,1] },
  { id: 26, texte: "Faut-il embaucher massivement dans les hôpitaux publics ?", chapitre: 3, positions: [0,0,1,-1,0,1,1,1,0,1,1,1] },
  { id: 27, texte: "Faut-il autoriser les médecins à aider les malades en fin de vie à mourir dignement ?", chapitre: 3, positions: [1,-1,0,-1,0,0,0,0,-1,1,0,0] },
  { id: 28, texte: "Faut-il augmenter les aides sociales pour les personnes sans emploi ?", chapitre: 3, positions: [0,-1,1,-1,-1,1,0,1,-1,1,1,1] },
  { id: 29, texte: "Faut-il obliger les personnes au RSA à faire une activité en échange ?", chapitre: 3, positions: [1,1,-1,1,1,-1,0,-1,1,-1,-1,-1] },
  { id: 30, texte: "Faut-il augmenter les salaires des infirmiers, aides-soignants et médecins ?", chapitre: 3, positions: [1,1,1,0,1,1,1,1,1,1,1,1] },
  { id: 31, texte: "Faut-il créer 10 000 postes supplémentaires dans les maisons de retraite ?", chapitre: 3, positions: [1,0,1,0,0,1,0,1,0,1,1,0] },
  { id: 32, texte: "Faut-il allonger le congé pour les pères à la naissance d'un enfant ?", chapitre: 3, positions: [0,-1,1,-1,0,1,0,1,-1,1,1,1] },
  { id: 33, texte: "Faut-il supprimer les frais à payer de sa poche quand on va chez le médecin ?", chapitre: 3, positions: [-1,-1,1,-1,-1,1,0,1,-1,1,1,1] },
  { id: 34, texte: "Faut-il mieux prendre en compte les métiers pénibles pour la retraite ?", chapitre: 3, positions: [-1,0,1,-1,-1,1,0,1,0,1,1,1] },
  { id: 35, texte: "Faut-il supprimer les allocations familiales pour les familles très riches ?", chapitre: 3, positions: [-1,-1,0,-1,0,0,0,0,-1,0,0,0] },

  // === CHAPITRE 4 : ÉNERGIE ===
  { id: 36, texte: "Faut-il construire de nouvelles centrales nucléaires ?", chapitre: 4, positions: [1,1,-1,1,1,-1,1,1,1,-1,-1,0] },
  { id: 37, texte: "Faut-il fermer toutes les centrales nucléaires d'ici 2050 ?", chapitre: 4, positions: [-1,-1,1,-1,-1,1,0,-1,-1,0,1,0] },
  { id: 38, texte: "Faut-il installer beaucoup plus d'éoliennes en France ?", chapitre: 4, positions: [1,-1,1,-1,-1,1,-1,0,-1,1,1,0] },
  { id: 39, texte: "Faut-il au contraire démanteler les éoliennes qui existent déjà ?", chapitre: 4, positions: [-1,1,-1,1,-1,-1,1,-1,1,-1,-1,0] },
  { id: 40, texte: "Faut-il interdire la vente de voitures essence et diesel neuves d'ici 2030 ?", chapitre: 4, positions: [0,-1,1,-1,0,1,-1,0,-1,1,1,0] },
  { id: 41, texte: "Faut-il interdire l'avion quand le même trajet en train prend moins de 4 heures ?", chapitre: 4, positions: [0,-1,1,-1,-1,1,-1,1,-1,1,1,0] },
  { id: 42, texte: "Faut-il interdire les pesticides chimiques dans l'agriculture ?", chapitre: 4, positions: [0,-1,1,-1,-1,1,0,1,-1,1,1,0] },
  { id: 43, texte: "Faut-il viser 100% d'énergies renouvelables (solaire, éolien, hydraulique) ?", chapitre: 4, positions: [-1,-1,1,-1,-1,1,0,-1,-1,1,1,0] },
  { id: 44, texte: "Faut-il un grand plan pour isoler les logements mal chauffés (passoires thermiques) ?", chapitre: 4, positions: [1,0,1,0,1,1,0,1,1,1,1,0] },
  { id: 45, texte: "Faut-il que les plus gros pollueurs paient un impôt spécial pour le climat ?", chapitre: 4, positions: [-1,-1,1,-1,-1,1,0,0,-1,1,1,0] },

  // === CHAPITRE 5 : ENVIRONNEMENT ===
  { id: 46, texte: "Faut-il taxer les produits importés qui polluent beaucoup ?", chapitre: 5, positions: [1,1,1,1,1,1,0,1,1,1,0,0] },
  { id: 47, texte: "Faut-il interdire l'élevage industriel (poules en batterie, cochons en cage...) ?", chapitre: 5, positions: [-1,-1,1,-1,-1,1,-1,0,-1,0,1,0] },
  { id: 48, texte: "Faut-il que les produits bio coûtent moins cher grâce à une baisse des taxes ?", chapitre: 5, positions: [-1,-1,1,-1,-1,1,0,1,-1,0,1,0] },
  { id: 49, texte: "Faut-il que la France arrête totalement de polluer d'ici 2050 (neutralité carbone) ?", chapitre: 5, positions: [1,0,1,0,1,1,0,1,0,1,1,0] },
  { id: 50, texte: "Faut-il rouvrir les petites lignes de train et investir massivement dans le rail ?", chapitre: 5, positions: [1,0,1,0,0,1,1,1,1,1,1,0] },
  { id: 51, texte: "Faut-il punir sévèrement les entreprises qui détruisent l'environnement ?", chapitre: 5, positions: [-1,-1,1,-1,-1,1,0,0,-1,1,1,0] },
  { id: 52, texte: "Faut-il interdire les publicités pour les produits polluants (SUV, low cost...) ?", chapitre: 5, positions: [-1,-1,1,-1,-1,1,0,0,-1,0,1,0] },
  { id: 53, texte: "Faut-il arrêter d'utiliser le pétrole, le gaz et le charbon d'ici 2050 ?", chapitre: 5, positions: [1,0,1,0,1,1,0,1,0,1,1,0] },
  { id: 54, texte: "Faut-il investir dans l'hydrogène comme énergie du futur ?", chapitre: 5, positions: [1,1,0,1,1,0,0,0,1,0,0,0] },
  { id: 55, texte: "Faut-il que les cantines scolaires servent au moins 50% de bio ?", chapitre: 5, positions: [0,-1,1,-1,-1,1,0,1,-1,1,1,0] },

  // === CHAPITRE 6 : SÉCURITÉ & JUSTICE ===
  { id: 56, texte: "Faut-il recruter plus de policiers et de gendarmes ?", chapitre: 6, positions: [1,1,-1,1,1,-1,0,1,1,0,-1,-1] },
  { id: 57, texte: "Faut-il imposer des peines de prison minimum pour certains délits ?", chapitre: 6, positions: [-1,1,-1,1,1,-1,-1,-1,1,-1,-1,-1] },
  { id: 58, texte: "Faut-il construire 20 000 places de prison en plus ?", chapitre: 6, positions: [1,1,-1,1,1,-1,-1,-1,1,-1,-1,-1] },
  { id: 59, texte: "Faut-il appliquer la tolérance zéro face à la délinquance ?", chapitre: 6, positions: [0,1,-1,1,1,-1,-1,0,1,-1,-1,-1] },
  { id: 60, texte: "Faut-il remettre des policiers de quartier que les habitants connaissent ?", chapitre: 6, positions: [1,0,1,-1,-1,1,1,1,0,1,0,0] },
  { id: 61, texte: "Faut-il créer un organisme indépendant pour surveiller les comportements de la police ?", chapitre: 6, positions: [-1,-1,1,-1,-1,1,0,0,-1,1,1,1] },
  { id: 62, texte: "Faut-il légaliser le cannabis ?", chapitre: 6, positions: [-1,-1,1,-1,-1,1,1,-1,-1,0,1,0] },
  { id: 63, texte: "Faut-il donner beaucoup plus de moyens à la justice pour qu'elle aille plus vite ?", chapitre: 6, positions: [1,1,1,1,1,1,0,1,1,1,0,0] },
  { id: 64, texte: "Faut-il punir plus durement ceux qui agressent des policiers ou des pompiers ?", chapitre: 6, positions: [1,1,-1,1,1,-1,0,1,1,-1,-1,-1] },
  { id: 65, texte: "Faut-il expulser automatiquement les étrangers condamnés par la justice ?", chapitre: 6, positions: [0,1,-1,1,1,-1,-1,-1,1,-1,-1,-1] },
  { id: 66, texte: "Faut-il interdire les manifestations non déclarées à l'avance ?", chapitre: 6, positions: [-1,1,-1,1,1,-1,-1,-1,1,-1,-1,-1] },
  { id: 67, texte: "Faut-il mettre plus de caméras de surveillance dans les rues ?", chapitre: 6, positions: [1,1,-1,1,1,-1,0,0,1,-1,-1,-1] },
  { id: 68, texte: "Faut-il juger les mineurs de 16 ans comme des adultes ?", chapitre: 6, positions: [-1,1,-1,1,1,-1,-1,-1,1,-1,-1,-1] },
  { id: 69, texte: "Faut-il que la prison soit automatique pour les récidivistes ?", chapitre: 6, positions: [0,1,-1,1,1,-1,-1,-1,1,-1,-1,-1] },
  { id: 70, texte: "Faut-il interdire le voile islamique dans la rue et les lieux publics ?", chapitre: 6, positions: [-1,1,-1,1,0,-1,-1,-1,1,-1,-1,-1] },

  // === CHAPITRE 7 : IMMIGRATION ===
  { id: 71, texte: "Faut-il limiter le nombre d'étrangers qui s'installent en France chaque année ?", chapitre: 7, positions: [0,1,-1,1,1,-1,1,-1,1,-1,-1,-1] },
  { id: 72, texte: "Faut-il qu'un enfant né en France de parents étrangers ne soit plus automatiquement français ?", chapitre: 7, positions: [-1,1,-1,1,0,-1,-1,-1,1,-1,-1,-1] },
  { id: 73, texte: "Faut-il empêcher un étranger installé en France de faire venir sa famille ?", chapitre: 7, positions: [-1,1,-1,1,1,-1,-1,-1,1,-1,-1,-1] },
  { id: 74, texte: "Faut-il donner des papiers aux sans-papiers qui travaillent en France ?", chapitre: 7, positions: [-1,-1,1,-1,-1,1,0,1,-1,1,1,1] },
  { id: 75, texte: "Faut-il supprimer la couverture santé gratuite pour les sans-papiers ?", chapitre: 7, positions: [-1,1,-1,1,1,-1,-1,-1,1,-1,-1,-1] },
  { id: 76, texte: "Faut-il donner la priorité aux Français pour l'accès à l'emploi ?", chapitre: 7, positions: [-1,1,-1,1,-1,-1,0,-1,1,-1,-1,-1] },
  { id: 77, texte: "Faut-il accueillir davantage de réfugiés qui fuient la guerre ?", chapitre: 7, positions: [0,-1,1,-1,-1,1,0,0,-1,1,1,1] },
  { id: 78, texte: "Faut-il qu'un étranger attende 5 ans avant de toucher des aides sociales ?", chapitre: 7, positions: [-1,1,-1,1,1,-1,0,-1,1,-1,-1,-1] },
  { id: 79, texte: "Faut-il renforcer la police aux frontières de l'Europe ?", chapitre: 7, positions: [1,0,-1,0,1,-1,0,0,0,0,-1,-1] },
  { id: 80, texte: "Faut-il faciliter l'accès à la nationalité française ?", chapitre: 7, positions: [0,-1,1,-1,-1,1,0,0,-1,1,1,1] },

  // === CHAPITRE 8 : DÉMOCRATIE ===
  { id: 81, texte: "Faut-il changer complètement la Constitution pour une nouvelle République ?", chapitre: 8, positions: [-1,-1,1,-1,-1,0,0,0,-1,0,1,1] },
  { id: 82, texte: "Faut-il que les citoyens puissent déclencher un référendum eux-mêmes ?", chapitre: 8, positions: [-1,1,1,-1,-1,0,1,0,1,0,1,0] },
  { id: 83, texte: "Faut-il que chaque parti ait un nombre de députés proportionnel à ses votes ?", chapitre: 8, positions: [0,1,1,0,0,1,1,1,1,1,1,1] },
  { id: 84, texte: "Faut-il réduire le nombre de députés et sénateurs ?", chapitre: 8, positions: [1,1,-1,1,1,-1,0,-1,1,-1,-1,-1] },
  { id: 85, texte: "Faut-il que le vote blanc compte vraiment dans les résultats ?", chapitre: 8, positions: [0,0,1,0,0,1,1,1,0,1,1,1] },
  { id: 86, texte: "Faut-il supprimer le Sénat ?", chapitre: 8, positions: [-1,-1,1,-1,-1,0,0,0,-1,0,1,1] },
  { id: 87, texte: "Faut-il que les étrangers puissent voter aux élections locales ?", chapitre: 8, positions: [-1,-1,1,-1,-1,1,0,0,-1,1,1,1] },
  { id: 88, texte: "Faut-il supprimer le poste de Président de la République tel qu'il existe ?", chapitre: 8, positions: [-1,-1,1,-1,-1,0,0,0,-1,0,1,1] },
  { id: 89, texte: "Faut-il rendre le vote obligatoire ?", chapitre: 8, positions: [0,0,0,0,0,0,1,0,0,0,0,0] },
  { id: 90, texte: "Faut-il qu'un élu ne puisse pas faire plus de 2 mandats ?", chapitre: 8, positions: [1,0,1,0,0,1,0,1,0,1,1,1] },

  // === CHAPITRE 9 : EUROPE & MONDE ===
  { id: 91, texte: "Faut-il donner plus de pouvoir à l'Union européenne ?", chapitre: 9, positions: [1,-1,-1,-1,0,1,-1,-1,-1,1,-1,-1] },
  { id: 92, texte: "Faut-il que la France quitte le commandement militaire de l'OTAN ?", chapitre: 9, positions: [-1,1,1,1,-1,-1,1,1,1,-1,1,0] },
  { id: 93, texte: "Faut-il renégocier les règles de l'Union européenne ?", chapitre: 9, positions: [-1,1,1,1,0,-1,1,1,1,0,1,1] },
  { id: 94, texte: "Faut-il créer une armée commune européenne ?", chapitre: 9, positions: [1,-1,-1,-1,1,1,-1,-1,-1,1,-1,-1] },
  { id: 95, texte: "Faut-il supprimer la règle qui interdit aux pays européens d'avoir trop de dettes ?", chapitre: 9, positions: [-1,1,1,1,-1,-1,0,1,1,0,1,1] },
  { id: 96, texte: "Faut-il empêcher de nouveaux pays de rejoindre l'Union européenne ?", chapitre: 9, positions: [0,1,-1,1,1,-1,1,-1,1,-1,-1,-1] },
  { id: 97, texte: "Faut-il remettre des contrôles aux frontières entre les pays européens ?", chapitre: 9, positions: [-1,1,-1,1,0,-1,0,-1,1,-1,-1,-1] },
  { id: 98, texte: "Faut-il augmenter le budget de l'armée française ?", chapitre: 9, positions: [1,1,-1,1,1,-1,0,-1,1,-1,-1,-1] },
  { id: 99, texte: "Faut-il refuser les grands accords de commerce international (CETA, Mercosur...) ?", chapitre: 9, positions: [-1,1,1,1,-1,1,1,1,1,0,1,1] },
  { id: 100, texte: "Faut-il maintenir les sanctions économiques contre la Russie ?", chapitre: 9, positions: [1,-1,1,-1,1,1,0,1,-1,1,1,0] },
]
