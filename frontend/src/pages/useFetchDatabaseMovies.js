import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchDatabaseMovies(search = '', userId = null) {
  const [movies, setMovies] = useState([]);
  const [moviesLoadingError, setMoviesLoadingError] = useState(null);
  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(28);

  useEffect(() => {
    setIsMoviesLoading(true);
    setMoviesLoadingError(null);
    setVisibleCount(28);

    const timeoutId = setTimeout(() => {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
        .then((response) => {
          const allMovies = response.data.movies;
          const cleanSearch = search.trim().toLowerCase();

          const filtered = cleanSearch
            ? allMovies.filter((m) =>
                m.title.toLowerCase().includes(cleanSearch)
              )
            : allMovies;

          if (currentUser) {
            filtered.sort((a, b) => b.popularity - a.popularity);
          }

          setMovies(filtered);
        })
        .catch((error) => {
          setMoviesLoadingError('Impossible de charger les films de la DB.');
          console.error(error);
        })
        .finally(() => {
          setIsMoviesLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, currentUser]);

  return { movies, moviesLoadingError, isMoviesLoading, visibleCount };
}
