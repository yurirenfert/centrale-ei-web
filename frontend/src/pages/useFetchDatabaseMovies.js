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
      if (userId) {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/recommendations/${userId}`)
    .then((response) => {
      const recommendedMovies = response.data.recommandations.map(r => r.movie);
      setMovies(recommendedMovies);
    })
    .catch(() => {

      axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
        .then((response) => setMovies(response.data.movies))
        .finally(() => setIsMoviesLoading(false));
    })
    .finally(() => setIsMoviesLoading(false));
} else {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
    .then((response) => {
      const allMovies = response.data.movies;
      const cleanSearch = search.trim().toLowerCase();
      const filtered = cleanSearch
        ? allMovies.filter(m => m.title.toLowerCase().includes(cleanSearch))
        : allMovies;
      setMovies(filtered);
    })
    .catch((error) => {
      setMoviesLoadingError('Impossible de charger les films.');
      console.error(error);
    })
    .finally(() => setIsMoviesLoading(false));
}
}, 300);

return () => clearTimeout(timeoutId);
}, [search, userId]);
  return { movies, moviesLoadingError, isMoviesLoading, visibleCount };
}
