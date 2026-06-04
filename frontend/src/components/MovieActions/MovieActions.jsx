import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieActions.css';

function MovieActions({ className = '', movieId }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [selectedRating, setSelectedRating] = useState(null);

  const sendRating = (ratingValue) => {
    if (!currentUser) {
      navigate('/login');

      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/ratings/new`, {
        user_id: currentUser.id,
        movie_id: movieId,
        rating_value: ratingValue,
      })
      .then(() => {
        setSelectedRating(ratingValue);
      })
      .catch((error) => {
        console.error('Error while saving rating:', error);
      });
  };

  return (
    <div className={`movie-actions ${className}`.trim()}>
      <button
        className={`movie-action ${
          selectedRating === 1
            ? 'movie-action-selected'
            : selectedRating === -1
            ? 'movie-action-unselected'
            : ''
        }`}
        onClick={() => sendRating(1)}
      >
        👍
      </button>

      <button
        className={`movie-action ${
          selectedRating === -1
            ? 'movie-action-selected'
            : selectedRating === 1
            ? 'movie-action-unselected'
            : ''
        }`}
        onClick={() => sendRating(-1)}
      >
        👎
      </button>
    </div>
  );
}

export default MovieActions;
