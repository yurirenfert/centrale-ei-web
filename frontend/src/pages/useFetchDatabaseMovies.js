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
        .get(
          userId
            ? `${import.meta.env.VITE_BACKEND_URL}/recommandation/${userId}`
            : `${import.meta.env.VITE_BACKEND_URL}/movies`
        )
        .then((response) => {
          let moviesToDisplay = [];

          if (userId) {
            const recommandations =
              response.data.recommandations ||
              response.data.recommandation ||
              [];

            moviesToDisplay = recommandations
              .map((r) => r.movie)
              .filter(Boolean);
          } else {
            moviesToDisplay = response.data.movies || [];
          }

          if (moviesToDisplay.length === 0) {
            return axios
              .get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
              .then((moviesResponse) => {
                const allMovies = moviesResponse.data.movies || [];
                setMovies(allMovies);
              });
          }

          setMovies(moviesToDisplay);
        })
        .catch((error) => {
          console.error(error);
          setMoviesLoadingError('Impossible de charger les films.');
        })
        .finally(() => {
          setIsMoviesLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, userId]);

  return { movies, moviesLoadingError, isMoviesLoading, visibleCount };
}
