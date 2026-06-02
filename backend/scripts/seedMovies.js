import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_LANGUAGE = 'fr-FR';
const DEFAULT_PAGES_COUNT = 1;

function getRequiredTmdbToken() {
  const token = process.env.TMDB_API_TOKEN;

  if (token === undefined || token.trim() === '') {
    throw new Error('TMDB_API_TOKEN is required to seed movies.');
  }

  return token;
}

async function fetchPopularMoviesPage({ page, token }) {
  const url = new URL(`${TMDB_API_BASE_URL}/movie/popular`);

  url.searchParams.set(
    'language',
    process.env.TMDB_LANGUAGE || DEFAULT_LANGUAGE
  );
  url.searchParams.set('page', page);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  return response.json();
}

function normalizeMovie(tmdbMovie) {
  return {
    tmdbId: tmdbMovie.id,
    title: tmdbMovie.title,
    release_date: tmdbMovie.release_date || null,
    poster_path: tmdbMovie.poster_path,
    overview: tmdbMovie.overview || null,
  };
}

async function seedMovies() {
  const token = getRequiredTmdbToken();
  const pagesCount = Number(
    process.env.TMDB_MOVIES_PAGES || DEFAULT_PAGES_COUNT
  );
  const movieRepository = appDataSource.getRepository(Movie);
  const movies = [];

  for (let page = 1; page <= pagesCount; page += 1) {
    const data = await fetchPopularMoviesPage({ page, token });

    movies.push(...data.results.map(normalizeMovie));
  }

  await movieRepository.upsert(movies, ['tmdbId']);

  console.log(`${movies.length} movies seeded successfully.`);
}

appDataSource
  .initialize()
  .then(seedMovies)
  .then(() => appDataSource.destroy())
  .catch(async (error) => {
    console.error(error);

    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
    }

    process.exit(1);
  });
