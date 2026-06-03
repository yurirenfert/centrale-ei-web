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
      .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
        },
        params: {
          language: 'fr-FR',
        },
      })
      .then((response) => {
        const tmdbMovie = response.data;

        return axios
          .get(`${import.meta.env.VITE_BACKEND_URL}/movies/tmdb/${tmdbMovie.id}`)
          .then((databaseResponse) => {
            setMovie({
              ...tmdbMovie,
              databaseId: databaseResponse.data.movie.id,
            });
          })
          .catch(() => {
            setMovie(tmdbMovie);
          });
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
