import axios from 'axios';
import './MovieActions.css';

function MovieActions({ className = '', movieId }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const sendRating = (ratingValue) => {
    if (!currentUser) {
      alert('Connecte-toi pour noter ce film.');

      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/ratings/new`, {
        user_id: currentUser.id,
        movie_id: movieId,
        rating_value: ratingValue,
      })
      .then((response) => {
        console.log('Rating saved:', response.data);
      })
      .catch((error) => {
        console.error('Error while saving rating:', error);
      });
  };

  return (
    <div className={`movie-actions ${className}`.trim()}>
      <button
        className="movie-action"
        type="button"
        onClick={() => sendRating(1)}
        aria-label="Like"
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
        className="movie-action"
        type="button"
        onClick={() => sendRating(-1)}
        aria-label="Dislike"
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
    </div>
  );
}

export default MovieActions;
