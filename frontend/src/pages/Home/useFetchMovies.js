import { useEffect, useState } from 'react';
import axios from 'axios';

const MAX_MOVIES_RESULTS = 10;

export function useFetchMovies(movieSearch) {
  const [movies, setMovies] = useState([]);
  const [moviesLoadingError, setMoviesLoadingError] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const cleanMovieSearch = movieSearch.trim();
      const lowerCaseMovieSearch = cleanMovieSearch.toLowerCase();

      setMoviesLoadingError(null);

      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
        .then((response) => {
          const databaseMovies = response.data.movies;
          const filteredMovies =
            lowerCaseMovieSearch === ''
              ? databaseMovies
              : databaseMovies.filter((movie) =>
                  movie.title.toLowerCase().includes(lowerCaseMovieSearch)
                );
          const sortedMovies = [...filteredMovies].sort(
            (firstMovie, secondMovie) =>
              (secondMovie.popularity || 0) - (firstMovie.popularity || 0)
          );

          setMovies(sortedMovies.slice(0, MAX_MOVIES_RESULTS));
        })
        .catch((error) => {
          setMoviesLoadingError('An error occured while fetching movies.');
          console.error(error);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [movieSearch]);

  return { movies, moviesLoadingError };
}
