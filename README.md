# Politikz — Quiz politique Présidentielle 2022

## Installation sur ton Mac

### 1. Télécharge le projet
Copie le dossier `politikz` sur ton Bureau (ou où tu veux).

### 2. Ouvre le Terminal
Cmd+Espace → tape "Terminal" → Entrée

### 3. Va dans le dossier du projet
```bash
cd ~/Bureau/politikz
```
(adapte le chemin si tu l'as mis ailleurs)

### 4. Installe les dépendances
```bash
npm install
```
Ça va télécharger tout ce dont le projet a besoin (React, Next.js, Tailwind...). 
Attends que ça finisse (1-2 minutes).

### 5. Lance le site en local
```bash
npm run dev
```

### 6. Ouvre le site
Va sur **http://localhost:3000** dans ton navigateur.
Tu devrais voir la page d'accueil de Politikz !

### Pour arrêter le site
Dans le Terminal, appuie sur Ctrl+C.

### Pour relancer le site
```bash
npm run dev
```

## Structure du projet
```
politikz/
├── src/
│   ├── app/           ← Les pages du site
│   │   ├── page.js         ← Page d'accueil
│   │   ├── layout.js       ← Structure commune
│   │   ├── globals.css     ← Styles globaux
│   │   ├── quiz/
│   │   │   └── page.js     ← Page du quiz
│   │   └── resultats/
│   │       └── [id]/
│   │           └── page.js ← Page des résultats
│   ├── components/    ← Morceaux réutilisables
│   ├── data/
│   │   └── quizData.js     ← Questions et positions (le fichier à modifier !)
│   └── lib/
│       ├── matching.js     ← Algorithme de calcul du match
│       └── supabase.js     ← Connexion base de données
├── .env.local         ← Clés Supabase (NE PAS PARTAGER)
├── package.json       ← Liste des outils utilisés
└── README.md          ← Ce fichier
```
