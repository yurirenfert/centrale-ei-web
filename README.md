# centrale-ei-web

## Backend

### Project setup

```
cd backend
npm install
cp .env.example .env
```

### Run database migrations

```
npm run migration:run
```

### Seed movies from TMDB

This project can populate the `movie` table with popular movies from [TMDB](https://www.themoviedb.org/).

First, create or update `backend/.env` with a TMDB API token:

```
TMDB_API_TOKEN=your_tmdb_token
```

Then run the migrations so the movie table has the expected TMDB fields:

```
npm run migration:run
```

Finally, run the seed script:

```
npm run seed:movies
```

By default, the script imports the first page of popular movies in French. You
can import more pages by adding `TMDB_MOVIES_PAGES` to `backend/.env`:

```
TMDB_MOVIES_PAGES=3
```

The script uses `tmdbId` to update existing movies instead of creating
duplicates, so it can be run multiple times.

### Start and auto-reload for development

```
npm run dev
```

### Start for production

```
npm run start
```

### Lint and fix files

```
npm run lint
```

## Frontend

### Project setup

```
cd frontend
npm install
```

### Compile and hot-reload for development

```
npm run dev
```

### Compile and minifiy for production

```
npm run build
```

### Lint and fix files

```
npm run lint
```
