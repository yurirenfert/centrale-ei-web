import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchDatabaseMovies(search='') {
  const [movies, setMovies] = useState([]);
  const [moviesLoadingError, setMoviesLoadingError] = useState(null);
  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(28);
  useEffect(() => {
    setIsMoviesLoading(true);
    setMoviesLoadingError(null);
    setVisibleCount(28);
  

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
      .then((response) => {
        const allMovies = response.data.movies;
        const filtered = search
          ? allMovies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
          : allMovies;
        setMovies(filtered);
      })
      .catch((error) => {
        setMoviesLoadingError('Impossible de charger les films de la DB.');
        console.error(error);
      })
      .finally(() => {
        setIsMoviesLoading(false);
      });
  }, [search]);

  return { movies, moviesLoadingError, isMoviesLoading, visibleCount };
}
