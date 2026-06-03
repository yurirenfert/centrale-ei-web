import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './MovieActions.css';

function MovieActions({ className = '', movie = null }) {
  const { currentUser, ratingsByMovieId, setMovieRating } = useAuth();
  const [ratingError, setRatingError] = useState(null);
  const canRate = currentUser !== null && movie?.tmdbId !== undefined;
  const selectedRating =
    movie !== null ? ratingsByMovieId[movie.id] || null : null;

  const saveRating = (event, ratingValue) => {
    event.preventDefault();
    event.stopPropagation();

    if (!canRate) {
      return;
    }

    setRatingError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/ratings`, {
        user_id: currentUser.userId,
        movie_id: movie.id,
        rating_value: ratingValue,
      })
      .then(() => {
        setMovieRating({
          movieId: movie.id,
          ratingValue: ratingValue,
        });
      })
      .catch((error) => {
        setRatingError('Impossible d’enregistrer cet avis.');
        console.error(error);
      });
  };

  const stopLinkNavigation = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className={`movie-actions ${className}`.trim()}>
      <button
        className={
          selectedRating === 1
            ? 'movie-action movie-action-selected'
            : 'movie-action'
        }
        disabled={!canRate}
        title={
          canRate
            ? 'J’aime ce film'
            : 'Connecte-toi pour donner ton avis'
        }
        type="button"
        onClick={(event) => saveRating(event, 1)}
        onMouseDown={stopLinkNavigation}
      >
        <svg
          className="movie-action-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10v12" />
          <path d="M15 5.9 14 10h5.8a2 2 0 0 1 2 2.3l-1.4 7.2A3 3 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3l3.4-6.8a2 2 0 0 1 3.6 1.7Z" />
        </svg>
      </button>
      <button
        className={
          selectedRating === -1
            ? 'movie-action movie-action-selected'
            : 'movie-action'
        }
        disabled={!canRate}
        title={
          canRate
            ? 'Je n’aime pas ce film'
            : 'Connecte-toi pour donner ton avis'
        }
        type="button"
        onClick={(event) => saveRating(event, -1)}
        onMouseDown={stopLinkNavigation}
      >
        <svg
          className="movie-action-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 14V2" />
          <path d="M9 18.1 10 14H4.2a2 2 0 0 1-2-2.3l1.4-7.2A3 3 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3l-3.4 6.8a2 2 0 0 1-3.6-1.7Z" />
        </svg>
      </button>
      {ratingError !== null && (
        <span className="movie-action-error">{ratingError}</span>
      )}
    </div>
  );
}

export default MovieActions;
