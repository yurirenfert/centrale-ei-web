import 'dotenv/config';
import axios from 'axios';
import { appDataSource } from './datasource.js';
import Movie from './entities/movies.js';
import Genre from './entities/genre.js';

const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNmVkODZiZjA1NWYyNmZkODA1ZWQxNGU3YzkyMmFmOSIsIm5iZiI6MTc4MDI5ODM1OC42ODUsInN1YiI6IjZhMWQzMjc2M2QzN2QwMjcwNzRhZDI3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.npkAf_dfZ5c7bSxR03AB2mmceL9_HGvomcWt1iEaCj0";

async function fetchGenres() {
    const res = await axios.get("https://api.themoviedb.org/3/genre/movie/list", {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
    });
    return res.data.genres;
}

async function fetchMovies(pages = 10) {
    const allMovies = [];
    for (let page = 1; page <= pages; page++) {
        const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            params: { page }
        });
        allMovies.push(...response.data.results);
        console.log(`Page ${page} récupérée`);
    }
    return allMovies;
}

async function seed() {
    await appDataSource.initialize();
    console.log("Base de données co");

    const movies = await fetchMovies(10);
    const allGenres = await fetchGenres();

    const movieRepository = appDataSource.getRepository(Movie);
    const genreRepository = appDataSource.getRepository(Genre);


    const genreMap = {};
    for (const g of allGenres) {
        let genre = await genreRepository.findOneBy({ name: g.name });
        if (!genre) {
            genre = genreRepository.create({ name: g.name });
            await genreRepository.save(genre);
        }
        genreMap[g.id] = genre;
    }


    for (const film of movies) {
        const existing = await movieRepository.findOneBy({ tmdbId: film.id });
        if (existing) continue; 
        const genres = film.genre_ids.map(id => genreMap[id]).filter(Boolean);
        
        const newMovie = movieRepository.create({
            title: film.title,
            tmdbId: film.id,
            release_date: film.release_date,
            language: film.original_language,
            overview: film.overview,
            poster_path: "https://image.tmdb.org/t/p/w500/" + film.poster_path,
            background_path: "https://image.tmdb.org/t/p/w500/" + film.backdrop_path,
            popularity: film.popularity,
            genres: genres
        });

        await movieRepository.save(newMovie);
        console.log(`Film sauvegardé : ${film.title}`);
    }

    console.log("Terminé !");
    process.exit(0); // on ferme le script proprement
}

seed();