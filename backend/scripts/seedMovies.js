import { appDataSource } from '../datasource.js';
import Genre from '../entities/genre.js';
import Movie from '../entities/movies.js';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_LANGUAGE = 'fr-FR';
const DEFAULT_PAGES_COUNT = 10;

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

async function fetchMovieGenres({ token }) {
  const url = new URL(`${TMDB_API_BASE_URL}/genre/movie/list`);

  url.searchParams.set(
    'language',
    process.env.TMDB_LANGUAGE || DEFAULT_LANGUAGE
  );

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB genres request failed with status ${response.status}.`
    );
  }

  return response.json();
}

function normalizeMovie(tmdbMovie, genreByTmdbId) {
  return {
    movie: {
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      release_date: tmdbMovie.release_date || null,
      poster_path: tmdbMovie.poster_path || null,
      language: tmdbMovie.original_language || null,
      overview: tmdbMovie.overview || null,
      background_path: tmdbMovie.backdrop_path || null,
      popularity:
        typeof tmdbMovie.popularity === 'number'
          ? tmdbMovie.popularity
          : null,
    },
    genres: (tmdbMovie.genre_ids || [])
      .map((genreId) => genreByTmdbId.get(genreId))
      .filter((genre) => genre !== undefined),
  };
}

async function seedMovies() {
  const token = getRequiredTmdbToken();
  const pagesCount = Number(
    process.env.TMDB_MOVIES_PAGES || DEFAULT_PAGES_COUNT
  );
  const movieRepository = appDataSource.getRepository(Movie);
  const genreRepository = appDataSource.getRepository(Genre);
  const genresData = await fetchMovieGenres({ token });
  const genreByTmdbId = new Map();
  let seededMoviesCount = 0;

  for (const tmdbGenre of genresData.genres) {
    let genre = await genreRepository.findOneBy({ name: tmdbGenre.name });

    if (genre === null) {
      genre = await genreRepository.save(
        genreRepository.create({ name: tmdbGenre.name })
      );
    }

    genreByTmdbId.set(tmdbGenre.id, genre);
  }

  for (let page = 1; page <= pagesCount; page += 1) {
    const data = await fetchPopularMoviesPage({ page, token });

    for (const tmdbMovie of data.results) {
      const normalizedMovie = normalizeMovie(tmdbMovie, genreByTmdbId);
      const existingMovie = await movieRepository.findOne({
        where: { tmdbId: normalizedMovie.movie.tmdbId },
        relations: { genres: true },
      });

      const movie = movieRepository.create({
        ...(existingMovie || {}),
        ...normalizedMovie.movie,
        genres: normalizedMovie.genres,
      });

      await movieRepository.save(movie);
      seededMoviesCount += 1;
    }
  }

  console.log(`${seededMoviesCount} movies seeded successfully.`);
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
