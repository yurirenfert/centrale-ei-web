import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchDatabaseMovies() {
  const [movies, setMovies] = useState([]);
  const [moviesLoadingError, setMoviesLoadingError] = useState(null);
  const [isMoviesLoading, setIsMoviesLoading] = useState(true);

  useEffect(() => {
    setIsMoviesLoading(true);
    setMoviesLoadingError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
      .then((response) => {
        setMovies(response.data.movies);
      })
      .catch((error) => {
        setMoviesLoadingError('Impossible de charger les films de la DB.');
        console.error(error);
      })
      .finally(() => {
        setIsMoviesLoading(false);
      });
  }, []);

  return { movies, moviesLoadingError, isMoviesLoading };
}
