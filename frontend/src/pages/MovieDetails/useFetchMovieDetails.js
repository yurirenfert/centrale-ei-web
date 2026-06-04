import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchMovieDetails(movieId) {
  const [movie, setMovie] = useState(null);
  const [movieLoadingError, setMovieLoadingError] = useState(null);
  const [isMovieLoading, setIsMovieLoading] = useState(true);

  useEffect(() => {
    setIsMovieLoading(true);
    setMovieLoadingError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/${movieId}`)
      .then((response) => {
        setMovie(response.data.movie || response.data);
      })
      .catch((error) => {
        setMovieLoadingError('Impossible de charger les details du film.');
        console.error(error);
      })
      .finally(() => {
        setIsMovieLoading(false);
      });
  }, [movieId]);

  return { movie, movieLoadingError, isMovieLoading };
}
