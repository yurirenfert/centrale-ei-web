# FlouFlix 🎬

Un site de recommandation de films personnalisée. L'algorithme suggère des films basés sur vos préférences en tenant compte des genres, de la popularité et des notes des autres utilisateurs.

## Prérequis

- Node.js (version 14 ou supérieure)
- Python (version 3.7 ou supérieure)
- npm (inclus avec Node.js)
- Un compte [TMDB](https://www.themoviedb.org/) pour obtenir une clé API

---

## Configuration des variables d'environnement

Copie le fichier `.env.example` et remplis les valeurs :

```bash
cd backend
cp .env.example .env
```

Contenu du `.env` :

```
DATABASE_NAME=database.sqlite3
API_KEY=ta_clé_tmdb
VITE_BACKEND_URL=http://localhost:8000
```

---

## Backend

### Installation

```bash
cd backend
npm install
pip install -r requirements.txt
```

### Migrations (création de la base de données)

```bash
npm run migration:run
```

### Peuplement de la base de données avec les films TMDB

```bash
node seed.js
```

Par défaut le script importe 25 pages (400 films). Pour modifier ce nombre, change la valeur dans `seed.js` :

```javascript
const movies = await fetchMovies(10); 
```

Le script utilise `tmdbId` pour éviter les doublons, il peut être relancé plusieurs fois sans problème.

### Génération des recommandations

Une fois la base peuplée et les utilisateurs créés, le script Python se lance au lancement du serveur puis met à jour les recommandations toutes les heures.
Le script génère les recommandations personnalisées pour chaque utilisateur en utilisant un algorithme de filtrage collaboratif combiné à une similarité par genre.

### Lancer le serveur en développement

```bash
npm run dev
```

Le backend tourne sur `http://localhost:8000`

### Lancer le serveur en production

```bash
npm run start
```

### Lint

```bash
npm run lint
```

---

## Frontend

### Installation

```bash
cd frontend
npm install
```

### Lancer en développement

```bash
npm run dev
```

Le frontend tourne sur `http://localhost:3000` (ou similaire, vérifier la console)

### Build pour la production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

---

## Lancer l'application complète

1. **Lancer le backend** dans un terminal :
```bash
cd backend
npm run dev
```

2. **Lancer le frontend** dans un autre terminal :
```bash
cd frontend
npm run dev
```

3. Ouvrir le navigateur sur l'URL affichée dans la console frontend.

---

## Mettre à jour après un pull

```bash
# Backend
cd backend
npm install
pip install -r requirements.txt
rm database.sqlite3
npm run migration:run
node seed.js
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

> ⚠️ Ne pas oublier de créer le fichier `.env` dans le dossier `backend` si ce n'est pas déjà fait.

---

## Structure du projet

```
├── backend/
│   ├── entities/            # Schémas TypeORM (Movie, Genre, User, Rating, Recommandation)
│   ├── jobs/                # Tâches planifiées
│   ├── migrations/          # Migrations de la base de données
│   ├── public/              # Assets statiques backend
│   ├── routes/              # Routes Express (movies, users, ratings, recommendations)
│   ├── services/            # Services utilitaires
│   ├── .env                 # Variables d'environnement (à créer depuis .env.example)
│   ├── database.sqlite3     # Base de données SQLite (générée automatiquement)
│   ├── datasource.js        # Configuration TypeORM
│   ├── postmigration.sh     # Script post-migration
│   ├── recommandation.py    # Script Python de recommandation
│   ├── requirements.txt     # Dépendances Python
│   ├── seed.js              # Script de peuplement TMDB
│   └── server.js            # Point d'entrée du serveur
├── frontend/
│   ├── public/              # Assets statiques (logo, favicon...)
│   ├── src/
│   │   ├── components/      # Composants réutilisables (Movie, Header, Footer...)
│   │   ├── constants/       # Constantes (URLs TMDB, etc.)
│   │   ├── pages/           # Pages (Home, Discover, Search, MovieDetails...)
│   │   ├── services/        # Services frontend
│   │   ├── App.jsx          # Composant racine avec les routes
│   │   ├── index.css        # Styles globaux
│   │   └── index.jsx        # Point d'entrée React
│   ├── .env                 # Variables d'environnement frontend
│   ├── index.html           # HTML principal
│   └── vite.config.js       # Configuration Vite
├── requirements.txt         # Dépendances Python (racine)
└── README.md
```

---

## Fonctionnalités

- Catalogue de films récupérés depuis TMDB
- Recherche de films par titre
- Filtrage par langue et genre
- Système de like/dislike
- Recommandations personnalisées par algorithme de filtrage collaboratif
- Authentification (inscription/connexion)
- Mise en avant du film le plus populaire sur la page d'accueil
