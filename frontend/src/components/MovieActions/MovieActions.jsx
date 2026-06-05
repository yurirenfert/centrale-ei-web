import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieActions.css';

function MovieActions({ className = '', movieId }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    if (!currentUser || !movieId) {
      return;
    }

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/ratings/${
          currentUser.id
        }/${movieId}`
      )
      .then((response) => {
        if (response.data.rating) {
          setSelectedRating(response.data.rating.rating_value);
        }
      })
      .catch((error) => {
        console.error('Error while fetching rating:', error);
      });
  }, [movieId]);

  const sendRating = (ratingValue) => {
    if (!currentUser) {
      alert('Connecte-toi pour noter ce film.');

      return;
    }
    console.log('Sending rating:', {
      user_id: currentUser.id,
      movie_id: movieId,
      rating_value: ratingValue,
    });

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/ratings/new`, {
  user_id: currentUser.id,
  movie_id: movieId,
  rating_value: ratingValue,
})
.then((response) => {
  console.log('Rating saved:', response.data);
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
    </div>)
}

export default MovieActions;
