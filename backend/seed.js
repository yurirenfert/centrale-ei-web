/* eslint-disable import/no-extraneous-dependencies */
import 'dotenv/config';
import axios from 'axios';
import { appDataSource } from './datasource.js';
import Movie from './entities/movies.js';
import Genre from './entities/genre.js';
import User from './entities/user.js';
import Rating from './entities/ratings.js';

const API_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNmVkODZiZjA1NWYyNmZkODA1ZWQxNGU3YzkyMmFmOSIsIm5iZiI6MTc4MDI5ODM1OC42ODUsInN1YiI6IjZhMWQzMjc2M2QzN2QwMjcwNzRhZDI3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.npkAf_dfZ5c7bSxR03AB2mmceL9_HGvomcWt1iEaCj0';

async function fetchGenres() {
  const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });

  return res.data.genres;
}

async function fetchMovies(pages = 25) {
  const allMovies = [];
  for (let page = 1; page <= pages; page++) {
    const response = await axios.get(
      'https://api.themoviedb.org/3/movie/popular',
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
        params: { page },
      }
    );
    allMovies.push(...response.data.results);
    console.log(`Page ${page} récupérée`);
  }

  return allMovies;
}

async function seedUsers(userRepository, n) {
  const usersToCreate = [];
  const existing = await userRepository.find();
  const existingEmails = new Set(existing.map((u) => u.email));

  let i = 0;
  while (usersToCreate.length < n) {
    const email = `user${i}@test.com`;
    if (!existingEmails.has(email)) {
      usersToCreate.push(
        userRepository.create({
          email,
          nickname: `user_${i}`,
        })
      );
      existingEmails.add(email);
    }
    i++;
  }

  if (usersToCreate.length) {
    await userRepository.save(usersToCreate);
  }

  return await userRepository.find();
}

function randn(mean, std) {
  let u = 0,
    v = 0;
  while (u === 0) {
    u = Math.random();
  }
  while (v === 0) {
    v = Math.random();
  }

  return (
    mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  );
}

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

function sampleRating() {
  const r = Math.random();

  if (r < 0.2) {
    return -1;
  }
  if (r < 0.7) {
    return 0;
  }

  return 1;
}

async function seedRatings(
  userRepository,
  movieRepository,
  ratingRepository,
  users
) {
  const dbMovies = await movieRepository.find();
  const movieDbIds = dbMovies.map((m) => m.id);

  if (movieDbIds.length === 0) {
    console.warn(
      'No movies found in DB to seed ratings for. Aborting seedRatings.'
    );

    return;
  }

  // build plain objects for insertion
  const rows = [];
  for (const user of users) {
    let n = Math.round(randn(25, 5));
    n = clamp(n, 5, 30);

    const selected = new Set();
    while (selected.size < n) {
      const movieId = movieDbIds[Math.floor(Math.random() * movieDbIds.length)];
      selected.add(movieId);
    }

    for (const movieId of selected) {
      rows.push({
        user_id: user.id,
        movie_id: movieId,
        rating_value: sampleRating(),
      });
    }
  }
  // insert in batches to avoid huge queries
  const BATCH = 100; // adapter si besoin
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    try {
      await appDataSource
        .createQueryBuilder()
        .insert()
        .into(Rating)
        .values(chunk)
        .execute();
    } catch (err) {
      console.error(
        'Batch insert failed, falling back to repository.save for chunk',
        err
      );
      // fallback safe save per-entity to avoid stopping the whole seeding
      for (const r of chunk) {
        try {
          await ratingRepository.save(r);
        } catch (e) {
          // ignore duplicate / constraint errors during seeding
        }
      }
    }
  }
}

async function seed() {
  await appDataSource.initialize();
  console.log('Base de données co');

  const movies = await fetchMovies(20);
  const allGenres = await fetchGenres();

  const movieRepository = appDataSource.getRepository(Movie);
  const genreRepository = appDataSource.getRepository(Genre);
  const userRepository = appDataSource.getRepository(User);
  const ratingRepository = appDataSource.getRepository(Rating);

  const genreMap = {};
  for (const g of allGenres) {
    let genre = await genreRepository.findOneBy({ name: g.name });
    if (!genre) {
      genre = genreRepository.create({ name: g.name });
      await genreRepository.save(genre);
    }
    genreMap[g.id] = genre;
  }

  const users = await seedUsers(userRepository, 750);

  for (const film of movies) {
    const existing = await movieRepository.findOneBy({ tmdbId: film.id });
    if (existing) {
      continue;
    }
    const genres = film.genre_ids.map((id) => genreMap[id]).filter(Boolean);

    const newMovie = movieRepository.create({
      title: film.title,
      tmdbId: film.id,
      release_date: film.release_date,
      language: film.original_language,
      overview: film.overview,
      poster_path: 'https://image.tmdb.org/t/p/w500/' + film.poster_path,
      background_path: 'https://image.tmdb.org/t/p/w500/' + film.backdrop_path,
      popularity: film.popularity,
      genres: genres,
    });

    await movieRepository.save(newMovie);
  }

  // seed ratings once, after movies exist in DB
  await seedRatings(userRepository, movieRepository, ratingRepository, users);

  console.log('Terminé !');
  process.exit(0); // on ferme le script proprement
}

seed();
