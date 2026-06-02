import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchMovies(movieSearch) {
  const [movies, setMovies] = useState([]);
  const [moviesLoadingError, setMoviesLoadingError] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const cleanMovieSearch = movieSearch.trim();
      const isSearchingMovie = cleanMovieSearch !== '';
      const url = isSearchingMovie
        ? 'https://api.themoviedb.org/3/search/movie'
        : 'https://api.themoviedb.org/3/movie/popular';
      const params = {
        language: 'fr-FR',
        page: 1,
      };

      if (isSearchingMovie) {
        params.query = cleanMovieSearch;
      }

      setMoviesLoadingError(null);

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
          },
          params,
        })
        .then((response) => {
          setMovies(response.data.results.slice(0, 10));
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
