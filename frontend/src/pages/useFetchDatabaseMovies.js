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
          if (userId) {
            const recommandations =
              response.data.recommandations ||
              response.data.recommandation ||
              [];
            const moviesToDisplay = recommandations.map((r) => r.movie).filter(Boolean);

            if (moviesToDisplay.length === 0) {
              return axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
                .then((moviesResponse) => {
                  setMovies(moviesResponse.data.movies || []);
                });
            }
            setMovies(moviesToDisplay);

          } else {
            // ✅ filtre par search ici
            const allMovies = response.data.movies || [];
            const cleanSearch = search.trim().toLowerCase();
            const filtered = cleanSearch
              ? allMovies.filter(m => m.title.toLowerCase().includes(cleanSearch))
              : allMovies;
            setMovies(filtered);
          }
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